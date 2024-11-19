export interface DeedyResumeData {
    personalInfo: {
        firstName: string;
        lastName: string;
        website: string;
        facebook: string;
        email: string;
        phone: string;
        alternateEmail: string;
    };
    education: Array<{
        institution: string;
        degree: string;
        date: string;
        location: string;
        gpa?: string;
        majorGpa?: string;
        honors?: string[];
    }>;
    links: {
        facebook?: string;
        github?: string;
        linkedin?: string;
        youtube?: string;
        twitter?: string;
        quora?: string;
    };
    coursework: {
        graduate: string[];
        undergraduate: string[];
    };
    skills: {
        overFiveThousand: string[];
        overThousand: string[];
        familiar: string[];
    };
    experience: Array<{
        company: string;
        role: string;
        location: string;
        date: string;
        highlights: string[];
    }>;
    research: Array<{
        institution: string;
        role: string;
        location: string;
        date: string;
        description: string;
    }>;
    awards: Array<{
        year: string;
        rank: string;
        competition: string;
    }>;
} 