'use client';

import { useParams } from 'next/navigation';
import ResumeForm from '../../../components/ResumeForm';
import DeedyResumeForm from '../../../components/DeedyResumeForm';
import Link from 'next/link';
import { useState, useRef } from 'react';
import type { ResumeData } from '../../../types/resume';
import { Metadata } from 'next';

// Move SAMPLE_DATA here
const SAMPLE_DATA: ResumeData = {
    personalInfo: {
        name: 'John Doe',
        phone: '(123) 456-7890',
        email: 'john.doe@example.com',
        githubUrl: 'johndoe',
        linkedinUrl: 'johndoe',
        githubProfile: 'johndoe',
        linkedinProfile: 'johndoe'
    },
    education: [{
        school: 'University of Technology',
        location: 'New York, NY',
        degree: 'Bachelor of Science in Computer Science',
        date: '2018 - 2022'
    }],
    experience: [{
        title: 'Software Engineer',
        company: 'Tech Solutions Inc.',
        location: 'San Francisco, CA',
        date: '2022 - Present',
        highlights: [
            'Developed full-stack web applications using React and Node.js, serving 100k+ users',
            'Optimized database queries resulting in 40\\% reduction in response time',
            'Led migration from monolithic to microservices architecture'
        ]
    }],
    projects: [{
        name: 'E-commerce Platform',
        technologies: 'React, Node.js, MongoDB',
        date: '2023',
        highlights: [
            'Built a scalable marketplace platform handling 10k+ daily transactions',
            'Implemented secure payment gateway integration with Stripe',
            'Designed responsive UI components using Material-UI'
        ]
    }],
    technicalSkills: {
        languages: 'Java, Python, JavaScript, TypeScript',
        frameworks: 'Spring Boot, Django, React, Node.js',
        developerTools: 'Git, Docker, Jenkins, AWS',
        libraries: 'Redux, Material-UI, NumPy, Pandas'
    },
    hasEducation: true,
    hasExperience: true,
    hasProjects: true,
    hasSkills: true,
    hasContactInfo: true
};

export default function TemplatePage() {
    const params = useParams();
    const templateId = params.id as string;
    const [isCompiling, setIsCompiling] = useState(false);
    const formRef = useRef<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLoadSample = () => {
        if (formRef.current?.methods) {
            formRef.current.methods.reset(SAMPLE_DATA);
        }
    };

    const handleCompile = async () => {
        if (formRef.current?.methods) {
            const data = formRef.current.methods.getValues();
            try {
                setIsCompiling(true);
                // Use the existing compilePDF logic from ResumeForm
                const response = await fetch('/api/generate-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error('Failed to compile PDF');
                }

                const pdfBlob = await response.blob();
                const url = URL.createObjectURL(pdfBlob);
                if (formRef.current?.setPdfUrl) {
                    formRef.current.setPdfUrl(url);
                }
            } catch (error) {
                console.error('Compilation error:', error);
                alert('Failed to compile PDF. Please try again.');
            } finally {
                setIsCompiling(false);
            }
        }
    };

    const renderTemplate = () => {
        return <DeedyResumeForm />;
    };

    return (
        <div className="template-page bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex-shrink-0">
                            <Link href='/' className="flex items-center space-x-2 group">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                                    ResumeTex
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        {templateId === 'jake' && (
                            <div className="hidden md:flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={handleLoadSample}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                    </svg>
                                    <span>Load Sample</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCompile}
                                    disabled={isCompiling}
                                    className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                                        text-white rounded-lg transition-all duration-200 flex items-center space-x-2 
                                        ${isCompiling ? 'opacity-75 cursor-not-allowed' : ''} shadow-md hover:shadow-lg`}
                                >
                                    {isCompiling ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Compiling...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                            </svg>
                                            <span>Compile PDF</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        {templateId === 'jake' && (
                            <div className="md:hidden">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                                >
                                    <span className="sr-only">Open menu</span>
                                    {!isMobileMenuOpen ? (
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    ) : (
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu */}
                    {templateId === 'jake' && (
                        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <button
                                    type="button"
                                    onClick={handleLoadSample}
                                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                    </svg>
                                    <span>Load Sample</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCompile}
                                    disabled={isCompiling}
                                    className={`w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                                        text-white rounded-lg transition-all duration-200 flex items-center space-x-2 
                                        ${isCompiling ? 'opacity-75 cursor-not-allowed' : ''} shadow-md hover:shadow-lg`}
                                >
                                    {isCompiling ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Compiling...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                            </svg>
                                            <span>Compile PDF</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main content */}
            <div className="template-page-content">
                {templateId === 'jake' ? (
                    <ResumeForm
                        ref={formRef}
                        onLoadSample={handleLoadSample}
                        onCompile={handleCompile}
                        isCompiling={isCompiling}
                    />
                ) : renderTemplate()}
            </div>
        </div>
    );
} 