'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import jakePreview from '../assets/images/jakesresumeimage.jpeg';
import deedyPreview from '../assets/images/DeedyPreview.jpeg';

interface Template {
    id: string;
    name: string;
    description: string;
    isComingSoon?: boolean;
}

const templates: Template[] = [
    {
        id: 'jake',
        name: "Jake's Resume",
        description: 'A clean and professional resume template with sections for education, experience, projects, and skills.'
    },
    {
        id: 'deedy',
        name: "Deedy CV (Coming Soon)",
        description: 'A two-column academic CV template perfect for researchers and graduate students.',
        isComingSoon: true
    }
];

export default function Templates() {
    const router = useRouter();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {templates.map((template) => (
                <div
                    key={template.id}
                    className={`bg-white border w-[300px] dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col
                        ${template.isComingSoon
                            ? 'opacity-60 cursor-not-allowed'
                            : 'hover:shadow-lg transition-shadow duration-300 cursor-pointer'
                        }`}
                    onClick={() => !template.isComingSoon && router.push(`/templates/${template.id}`)}
                >
                    <div className="relative w-fit">
                        <Image
                            src={template.id === 'jake' ? jakePreview : deedyPreview}
                            alt={template.name}
                            className={template.isComingSoon ? 'filter grayscale' : ''}
                            width={300}
                        />
                        {template.isComingSoon && (
                            <div className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                                Coming Soon
                            </div>
                        )}
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