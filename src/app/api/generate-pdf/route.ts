import { NextResponse } from 'next/server';
import { resumeTemplate } from '@/templates/resumeTemplate';
import Mustache from 'mustache';
import type { ResumeData } from '@/types/resume';
import { exec } from 'child_process';
import { writeFile, mkdir, readFile, unlink, readdir, rmdir } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);
const TEMP_DIR = '/tmp/latex-temp'; // Docker container temp directory

function escapeLatexSpecialChars(text: string): string {
    return text
        .replace(/&/g, '\\&')
        .replace(/#/g, '\\#')
        .replace(/\$/g, '\\$')
        .replace(/%/g, '\\%')
        .replace(/_/g, '\\_')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/\//g, '\\slash{}');
}

async function cleanupTempFiles(dir: string) {
    try {
        const files = await readdir(dir);
        await Promise.all(
            files.map(file => unlink(join(dir, file)).catch(console.error))
        );
        await rmdir(dir).catch(console.error);
    } catch (error) {
        console.error('Cleanup error:', error);
    }
}

export async function POST(request: Request) {
    const jobId = uuidv4();
    const jobDir = join(TEMP_DIR, jobId);

    try {
        // Create job-specific directory
        await mkdir(jobDir, { recursive: true });

        const resumeData: ResumeData = await request.json();

        // Process template data
        const templateData = {
            name: resumeData.personalInfo?.name || '',
            phone: resumeData.personalInfo?.phone || '',
            email: resumeData.personalInfo?.email || '',
            githubUrl: resumeData.personalInfo?.githubUrl || '',
            linkedinUrl: resumeData.personalInfo?.linkedinUrl || '',
            githubProfile: resumeData.personalInfo?.githubProfile || '',
            linkedinProfile: resumeData.personalInfo?.linkedinProfile || '',
            hasContactInfo: !!(resumeData.personalInfo?.phone ||
                resumeData.personalInfo?.email ||
                resumeData.personalInfo?.githubUrl ||
                resumeData.personalInfo?.linkedinUrl),

            education: (resumeData.education || []).filter(edu =>
                edu.school || edu.location || edu.degree || edu.date
            ),
            hasEducation: (resumeData.education || []).some(edu =>
                edu.school || edu.location || edu.degree || edu.date
            ),

            experience: (resumeData.experience || []).filter(exp => {
                const hasContent = exp.title || exp.company || exp.location || exp.date;
                const highlights = (exp.highlights || []).filter(h => h?.trim());
                return hasContent || highlights.length > 0;
            }),
            hasExperience: (resumeData.experience || []).some(exp =>
                exp.title || exp.company || exp.location || exp.date ||
                (exp.highlights || []).some(h => h?.trim())
            ),

            projects: resumeData.projects?.map(proj => ({
                name: proj.name || '',
                technologies: proj.technologies || '',
                date: proj.date || '',
                highlights: Array.isArray(proj.highlights) ?
                    proj.highlights.filter(h => h?.trim()) : [],
                hasHighlights: Array.isArray(proj.highlights) &&
                    proj.highlights.some(h => h?.trim())
            })) || [],
            hasProjects: !!(resumeData.projects?.length && resumeData.projects.some(proj =>
                proj.name || proj.technologies || proj.date ||
                (Array.isArray(proj.highlights) && proj.highlights.some(h => h?.trim()))
            )),

            languages: escapeLatexSpecialChars(resumeData.technicalSkills?.languages || ''),
            frameworks: escapeLatexSpecialChars(resumeData.technicalSkills?.frameworks || ''),
            developerTools: escapeLatexSpecialChars(resumeData.technicalSkills?.developerTools || ''),
            libraries: escapeLatexSpecialChars(resumeData.technicalSkills?.libraries || ''),
            hasSkills: !!(resumeData.technicalSkills?.languages ||
                resumeData.technicalSkills?.frameworks ||
                resumeData.technicalSkills?.developerTools ||
                resumeData.technicalSkills?.libraries)
        };

        const latexContent = Mustache.render(resumeTemplate, templateData);

        if (!latexContent || latexContent.trim() === '') {
            throw new Error('Generated LaTeX content is empty');
        }

        // Write LaTeX file
        const texFile = join(jobDir, 'resume.tex');
        await writeFile(texFile, latexContent, 'utf8');

        try {
            // Run pdflatex with timeout
            const pdflatexCmd = `pdflatex -interaction=nonstopmode -output-directory=${jobDir} ${texFile}`;

            // First run
            await execAsync(pdflatexCmd, {
                timeout: 30000, // 30 second timeout
                env: {
                    ...process.env,
                    PATH: `${process.env.PATH}:/usr/local/texlive/bin/x86_64-linux`
                }
            });

            // Second run for references
            await execAsync(pdflatexCmd, {
                timeout: 30000,
                env: {
                    ...process.env,
                    PATH: `${process.env.PATH}:/usr/local/texlive/bin/x86_64-linux`
                }
            });

            // Read the generated PDF
            const pdfPath = join(jobDir, 'resume.pdf');
            const pdfContent = await readFile(pdfPath);

            // Clean up temporary files
            await cleanupTempFiles(jobDir);

            return new NextResponse(pdfContent, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'inline',
                    'Cache-Control': 'no-store',
                    'X-Frame-Options': 'SAMEORIGIN'
                }
            });

        } catch (error) {
            // Read log file for better error reporting
            const logFile = join(jobDir, 'resume.log');
            let logContent = '';
            try {
                logContent = await readFile(logFile, 'utf8');
            } catch (e) {
                console.error('Could not read log file:', e);
            }

            throw new Error(`LaTeX compilation failed: ${error.message}\nLog: ${logContent}`);
        }

    } catch (error) {
        // Clean up on error
        await cleanupTempFiles(jobDir);

        console.error('PDF Generation Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate PDF',
                details: error.message,
                jobId
            },
            { status: 500 }
        );
    }
}

// Cleanup old temp files periodically
if (typeof setInterval !== 'undefined') {
    setInterval(async () => {
        try {
            const dirs = await readdir(TEMP_DIR);
            const now = Date.now();

            for (const dir of dirs) {
                try {
                    const dirPath = join(TEMP_DIR, dir);
                    const stats = await stat(dirPath);

                    // Remove directories older than 1 hour
                    if (now - stats.mtimeMs > 3600000) {
                        await cleanupTempFiles(dirPath);
                    }
                } catch (error) {
                    console.error(`Error cleaning up directory ${dir}:`, error);
                }
            }
        } catch (error) {
            console.error('Error in cleanup interval:', error);
        }
    }, 3600000); // Run every hour
} 