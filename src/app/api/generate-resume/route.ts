import { NextResponse } from 'next/server';
import { resumeTemplate } from '@/templates/resumeTemplate';
import Mustache from 'mustache';
import type { ResumeData } from '@/types/resume';

export async function POST(request: Request) {
    try {
        // Validate request body
        const resumeData = await request.json().catch(() => {
            throw new Error('Invalid JSON payload');
        });

        if (!resumeData || typeof resumeData !== 'object') {
            return NextResponse.json(
                { error: 'Invalid resume data format' },
                { status: 400 }
            );
        }

        // Filter out empty entries from arrays
        const filteredEducation = resumeData.education?.filter(edu =>
            edu.school || edu.location || edu.degree || edu.date
        ) || [];

        const filteredExperience = resumeData.experience?.filter(exp => {
            exp.highlights = exp.highlights?.filter(h => h?.trim()) || [];
            return exp.title || exp.company || exp.location || exp.date || exp.highlights.length > 0;
        }) || [];

        const filteredProjects = resumeData.projects?.filter(proj => {
            proj.highlights = proj.highlights?.filter(h => h?.trim()) || [];
            return proj.name || proj.technologies || proj.date || proj.highlights.length > 0;
        }) || [];

        const templateData = {
            name: resumeData.personalInfo?.name || 'Your Name',
            phone: resumeData.personalInfo?.phone || '',
            email: resumeData.personalInfo?.email || '',
            linkedinUrl: resumeData.personalInfo?.linkedinUrl || '',
            githubUrl: resumeData.personalInfo?.githubUrl || '',
            linkedinProfile: resumeData.personalInfo?.linkedinUrl?.split('/').pop() || '',
            githubProfile: resumeData.personalInfo?.githubUrl?.split('/').pop() || '',
            hasContactInfo: !!(resumeData.personalInfo?.phone ||
                resumeData.personalInfo?.email ||
                resumeData.personalInfo?.linkedinUrl ||
                resumeData.personalInfo?.githubUrl),
            education: filteredEducation,
            experience: filteredExperience,
            projects: filteredProjects,
            languages: resumeData.technicalSkills?.languages || '',
            frameworks: resumeData.technicalSkills?.frameworks || '',
            developerTools: resumeData.technicalSkills?.developerTools || '',
            libraries: resumeData.technicalSkills?.libraries || '',
            hasEducation: filteredEducation.length > 0,
            hasExperience: filteredExperience.length > 0,
            hasProjects: filteredProjects.length > 0,
            hasSkills: !!(resumeData.technicalSkills?.languages ||
                resumeData.technicalSkills?.frameworks ||
                resumeData.technicalSkills?.developerTools ||
                resumeData.technicalSkills?.libraries)
        };

        const latexContent = Mustache.render(resumeTemplate, templateData);

        return new NextResponse(latexContent, {
            headers: {
                'Content-Type': 'application/x-latex',
                'Content-Disposition': 'attachment; filename=resume.tex',
            },
        });
    } catch (error) {
        console.error('Error generating resume:', error);
        return NextResponse.json(
            { error: 'Failed to generate resume' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { message: 'This endpoint requires a POST request with resume data' },
        { status: 200 }
    );
}