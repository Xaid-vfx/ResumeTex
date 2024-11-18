import { NextResponse } from 'next/server';
import { resumeTemplate } from '@/templates/resumeTemplate';
import Mustache from 'mustache';
import type { ResumeData } from '@/types/resume';
import { exec } from 'child_process';
import { writeFile, mkdir, readFile, unlink, stat } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function readLogFile(logFile: string): Promise<string> {
    try {
        return await readFile(logFile, 'utf-8');
    } catch (error) {
        return `Could not read log file: ${error.message}`;
    }
}

export async function POST(request: Request) {
    try {
        const resumeData: ResumeData = await request.json();

        // Debug log the incoming data
        console.log('Incoming Resume Data:', JSON.stringify(resumeData, null, 2));

        const githubProfile = resumeData.personalInfo?.githubProfile || '';
        const linkedinProfile = resumeData.personalInfo?.linkedinProfile || '';

        const templateData = {
            name: resumeData.personalInfo?.name || '',
            phone: resumeData.personalInfo?.phone || '',
            email: resumeData.personalInfo?.email || '',
            githubUrl: resumeData.personalInfo?.githubUrl || '',
            linkedinUrl: resumeData.personalInfo?.linkedinUrl || '',
            githubProfile,
            linkedinProfile,
            hasContactInfo: !!(resumeData.personalInfo?.phone ||
                resumeData.personalInfo?.email ||
                resumeData.personalInfo?.githubUrl ||
                resumeData.personalInfo?.linkedinUrl),

            // Education section
            education: (resumeData.education || []).filter(edu =>
                edu.school || edu.location || edu.degree || edu.date
            ),
            hasEducation: (resumeData.education || []).some(edu =>
                edu.school || edu.location || edu.degree || edu.date
            ),

            // Experience section
            experience: (resumeData.experience || []).filter(exp => {
                const hasContent = exp.title || exp.company || exp.location || exp.date;
                const highlights = (exp.highlights || []).filter(h => h?.trim());
                return hasContent || highlights.length > 0;
            }),
            hasExperience: (resumeData.experience || []).some(exp =>
                exp.title || exp.company || exp.location || exp.date || (exp.highlights || []).some(h => h?.trim())
            ),

            // Projects section
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

            // Technical skills section
            languages: resumeData.technicalSkills?.languages || '',
            frameworks: resumeData.technicalSkills?.frameworks || '',
            developerTools: resumeData.technicalSkills?.developerTools || '',
            libraries: resumeData.technicalSkills?.libraries || '',
            hasSkills: !!(resumeData.technicalSkills?.languages ||
                resumeData.technicalSkills?.frameworks ||
                resumeData.technicalSkills?.developerTools ||
                resumeData.technicalSkills?.libraries)
        };

        // Debug log the template data
        console.log('Template Data:', JSON.stringify(templateData, null, 2));

        const latexContent = Mustache.render(resumeTemplate, templateData);

        // Debug log the generated LaTeX
        console.log('Generated LaTeX:', latexContent);

        // Validate LaTeX content before writing to file
        if (!latexContent || latexContent.trim() === '') {
            throw new Error('Generated LaTeX content is empty');
        }

        // Create temp directory with error handling
        const tempDir = join(process.cwd(), 'temp');
        try {
            await mkdir(tempDir, { recursive: true });
        } catch (error) {
            throw new Error(`Failed to create temp directory: ${error.message}`);
        }

        const timestamp = Date.now();
        const texFile = join(tempDir, `resume_${timestamp}.tex`);
        await writeFile(texFile, latexContent, 'utf8');

        try {
            // Run pdflatex
            await execAsync(`pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texFile}`);
            await execAsync(`pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texFile}`);

            const pdfPath = texFile.replace('.tex', '.pdf');
            const pdfContent = await readFile(pdfPath);

            // Clean up temporary files
            const cleanupFiles = [
                texFile,
                pdfPath,
                texFile.replace('.tex', '.aux'),
                texFile.replace('.tex', '.log'),
                texFile.replace('.tex', '.out')
            ];

            await Promise.all(
                cleanupFiles.map(file => unlink(file).catch(() => { }))
            );

            return new NextResponse(pdfContent, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="resume.pdf"'
                }
            });

        } catch (error) {
            console.error('LaTeX Error:', error);
            throw new Error(`LaTeX compilation failed: ${error.message}`);
        }

    } catch (error) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF', details: error.message },
            { status: 500 }
        );
    }
} 