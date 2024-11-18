import Mustache from 'mustache';
import resumeTemplate from '@/templates/resumeTemplate';
import type { ResumeData } from '@/types/resume';

export function renderResume(data: ResumeData): string {
    const templateData = {
        ...data.personalInfo,
        linkedinProfile: data.personalInfo.linkedinUrl.replace('https://linkedin.com/in/', ''),
        githubProfile: data.personalInfo.githubUrl.replace('https://github.com/', ''),
        education: data.education,
        experience: data.experience,
        projects: data.projects,
        ...data.technicalSkills,
    };

    // Escape LaTeX special characters
    const escapedData = escapeLatexCharacters(templateData);

    return Mustache.render(resumeTemplate, escapedData);
}

function escapeLatexCharacters(data: any): any {
    if (typeof data === 'string') {
        return data
            .replace(/&/g, '\\&')
            .replace(/%/g, '\\%')
            .replace(/\$/g, '\\$')
            .replace(/#/g, '\\#')
            .replace(/_/g, '\\_')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}')
            .replace(/~/g, '\\textasciitilde{}')
            .replace(/\^/g, '\\textasciicircum{}');
    }

    if (Array.isArray(data)) {
        return data.map(item => escapeLatexCharacters(item));
    }

    if (typeof data === 'object' && data !== null) {
        const escaped: any = {};
        for (const [key, value] of Object.entries(data)) {
            escaped[key] = escapeLatexCharacters(value);
        }
        return escaped;
    }

    return data;
} 