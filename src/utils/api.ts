import { ResumeData } from "@/types/resume";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const generatePDF = async (data: ResumeData) => {
    const response = await fetch(`${API_URL}/api/generate-pdf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response;
}; 