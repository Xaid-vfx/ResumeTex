import type { NextApiRequest, NextApiResponse } from 'next';
import { resumeTemplate } from '@/templates/resumeTemplate';
import Mustache from 'mustache';
import { ResumeData } from '@/types/resume';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const resumeData: ResumeData = req.body;

        const templateData = {
            name: resumeData.personalInfo.name,
            phone: resumeData.personalInfo.phone,
            email: resumeData.personalInfo.email,
            linkedin: resumeData.personalInfo.linkedinUrl,
            github: resumeData.personalInfo.githubUrl,
            education: resumeData.education,
            experience: resumeData.experience,
            projects: resumeData.projects,
            skills: resumeData.technicalSkills,
        };

        const latexContent = Mustache.render(resumeTemplate, templateData);

        res.setHeader('Content-Type', 'application/x-latex');
        res.setHeader('Content-Disposition', 'attachment; filename=resume.tex');
        return res.status(200).send(latexContent);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error generating resume' });
    }
}