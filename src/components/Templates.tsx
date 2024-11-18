'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Template {
    id: string;
    name: string;
    description: string;
    preview: string;
}

const templates: Template[] = [
    {
        id: 'jake',
        name: "Jake's Resume",
        description: 'A clean and professional resume template with sections for education, experience, projects, and skills.',
        preview: '/templates/jake-preview.png'
    },
];

export default function Templates() {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
                <div
                    key={template.id}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    onClick={() => router.push(`/templates/${template.id}`)}
                >
                    <div className="relative h-48 w-full">
                        <Image
                            src={template.preview}
                            alt={template.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {template.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
} 