'use client';

import { useRouter } from 'next/navigation';
import ResumeForm from '../components/ResumeForm';
import DeedyResumeForm from '../components/DeedyResumeForm';

export default function TemplateEditor({ templateId }: { templateId: string }) {
    const router = useRouter();

    const getTemplateTitle = (id: string) => {
        switch (id) {
            case 'jake':
                return "Jake's Resume Template";
            case 'deedy':
                return "Deedy CV Template";
            default:
                return 'Template Not Found';
        }
    };

    const renderForm = () => {
        switch (templateId) {
            case 'jake':
                return <ResumeForm />;
            case 'deedy':
                return <DeedyResumeForm />;
            default:
                return <div>Template not found</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="container mx-auto">
                <button
                    onClick={() => router.push('/')}
                    className="mb-8 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back to Templates
                </button>

                <h1 className="text-3xl font-bold mb-8 text-center">
                    {getTemplateTitle(templateId)}
                </h1>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    {renderForm()}
                </div>
            </div>
        </div>
    );
}