import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import Mustache from 'mustache';
import deedyTemplate from '../../../templates/deedyTemplate';
import type { DeedyResumeData } from '../../../types/deedyResume';

const execAsync = promisify(exec);
const TEMP_DIR = path.join(process.cwd(), 'tmp');

async function ensureTempDir() {
    try {
        await fs.access(TEMP_DIR);
    } catch {
        await fs.mkdir(TEMP_DIR, { recursive: true });
    }
}

function escapeLatex(data: any): any {
    if (typeof data === 'string') {
        return data.replace(/[&%$#_{}~^\\]/g, '\\$&');
    } else if (Array.isArray(data)) {
        return data.map(item => escapeLatex(item));
    } else if (typeof data === 'object' && data !== null) {
        const escaped: any = {};
        for (const [key, value] of Object.entries(data)) {
            escaped[key] = escapeLatex(value);
        }
        return escaped;
    }
    return data;
}

export async function POST(request: NextRequest) {
    try {
        const data: DeedyResumeData = await request.json();

        // Escape LaTeX special characters in the data
        const escapedData = escapeLatex(data);

        // Add helper properties for Mustache
        escapedData.skills.overFiveThousand = escapedData.skills.overFiveThousand.map(
            (skill: string, index: number, array: string[]) => ({
                skill,
                last: index === array.length - 1
            })
        );

        await ensureTempDir();
        const jobId = uuidv4();
        const tempDir = path.join(TEMP_DIR, jobId);
        await fs.mkdir(tempDir);

        // Generate LaTeX content using Mustache template
        const latexContent = Mustache.render(deedyTemplate, escapedData);

        const texFile = path.join(tempDir, 'resume.tex');
        await fs.writeFile(texFile, latexContent);

        // Copy the cls file
        const clsSource = path.join(process.cwd(), 'src', 'latex', 'deedy-resume-openfont.cls');
        const clsDest = path.join(tempDir, 'deedy-resume-openfont.cls');
        await fs.copyFile(clsSource, clsDest);

        // Compile with XeLaTeX
        await execAsync(`xelatex -output-directory=${tempDir} ${texFile}`);

        const pdfPath = path.join(tempDir, 'resume.pdf');
        const pdfContent = await fs.readFile(pdfPath);

        // Clean up
        await fs.rm(tempDir, { recursive: true });

        return new NextResponse(pdfContent, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="deedy-resume.pdf"'
            }
        });
    } catch (error) {
        console.error('Error generating Deedy PDF:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
} 