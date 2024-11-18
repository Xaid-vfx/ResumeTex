export interface ResumeData {
    personalInfo: {
        name: string;
        phone: string;
        email: string;
        linkedinUrl: string;
        githubUrl: string;
    };

    education: Array<{
        school: string;
        location: string;
        degree: string;
        date: string;
    }>;

    experience: Array<{
        title: string;
        date: string;
        company: string;
        location: string;
        highlights: string[];
    }>;

    projects: Array<{
        name: string;
        technologies: string;
        date: string;
        highlights: string[];
    }>;

    technicalSkills: {
        languages: string;
        frameworks: string;
        developerTools: string;
        libraries: string;
    };
} 