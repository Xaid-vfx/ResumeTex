/* eslint-disable */
'use client';

import { useState, memo, useCallback, useEffect, forwardRef } from 'react';
import type { ResumeData } from '@/types/resume';
import { useForm, useFieldArray, Controller, Control } from 'react-hook-form';
import DynamicList from './DynamicList';

type FileFormat = 'pdf' | 'latex' | 'both';

// Add these props to the ResumeForm component
interface ResumeFormProps {
    onLoadSample?: () => void;
    onCompile?: (data: ResumeData) => void;
    isCompiling?: boolean;
}

const ResumeForm = forwardRef((props: ResumeFormProps, ref) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState<FileFormat>('both');
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    // Initialize React Hook Form
    const methods = useForm<ResumeData>({
        defaultValues: {
            personalInfo: {
                name: '', phone: '', email: '', linkedinUrl: '', githubUrl: '',
            },
            education: [{ school: '', location: '', degree: '', date: '' }],
            experience: [{ title: '', date: '', company: '', location: '', highlights: [] }],
            projects: [{ name: '', technologies: '', date: '', highlights: [] }],
            technicalSkills: {
                languages: '', frameworks: '', developerTools: '', libraries: '',
            },
            hasEducation: false,
            hasExperience: false,
            hasProjects: false,
            hasSkills: false,
            hasContactInfo: false,
            linkedinProfile: '',
            githubProfile: ''
        }
    });

    // Expose methods and setPdfUrl through ref
    useEffect(() => {
        if (ref) {
            (ref as any).current = {
                methods,
                setPdfUrl
            };
        }
    }, [ref, methods]);

    const { control, handleSubmit } = methods;

    // Constants
    const STEPS = {
        PERSONAL: 1,
        EDUCATION: 2,
        EXPERIENCE: 3,
        PROJECTS: 4,
        SKILLS: 5,
    };
    const TOTAL_STEPS = Object.keys(STEPS).length;
    const STEP_TITLES = ['Personal Info', 'Education', 'Experience', 'Projects', 'Skills'];

    const cleanGitHubUrl = (url: string): string => {
        if (!url) return '';

        // If it's already in the correct format, return as is
        if (url.match(/^[a-zA-Z0-9-]+$/)) return url;

        // Otherwise, try to extract the username
        const cleaned = url
            .replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\/?/i, '')
            .replace(/\/+$/, '')
            .split('/')
            .filter(Boolean)[0] || '';  // Take the first non-empty part after splitting

        return cleaned;
    };

    const cleanLinkedInUrl = (url: string): string => {
        if (!url) return '';
        return url
            .replace(/^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/?/i, '')
            .replace(/\/+$/, '')
            .split('/')
            .filter(Boolean)[0] || '';
    };

    // Update generate resume handler
    const generateResume = async (data: ResumeData) => {
        try {
            setIsGenerating(true);

            // Clean both URLs and extract usernames
            const githubUsername = cleanGitHubUrl(data.personalInfo?.githubUrl || '');
            const linkedinUsername = cleanLinkedInUrl(data.personalInfo?.linkedinUrl || '');

            const cleanedData = {
                ...data,
                // Set section flags based on content
                hasEducation: data.education?.some(edu =>
                    edu.school || edu.location || edu.degree || edu.date
                ),
                hasExperience: data.experience?.some(exp =>
                    exp.title || exp.company || exp.location || exp.date || exp.highlights?.length
                ),
                hasProjects: data.projects?.some(proj =>
                    proj.name || proj.technologies || proj.date || proj.highlights?.length
                ),
                hasSkills: !!(
                    data.technicalSkills?.languages ||
                    data.technicalSkills?.frameworks ||
                    data.technicalSkills?.developerTools ||
                    data.technicalSkills?.libraries
                ),
                personalInfo: {
                    ...data.personalInfo,
                    githubUrl: githubUsername,
                    linkedinUrl: linkedinUsername,
                    githubProfile: githubUsername,
                    linkedinProfile: linkedinUsername
                }
            };

            // Generate PDF with cleaned data
            const pdfResponse = await fetch('/api/generate-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedData),
            });

            // Log the PDF response
            console.log('PDF Response Status:', pdfResponse.status);

            if (!pdfResponse.ok) {
                const errorData = await pdfResponse.json();
                throw new Error(errorData.error || 'Failed to generate PDF');
            }

            // Download PDF
            const pdfBlob = await pdfResponse.blob();
            const pdfUrl = window.URL.createObjectURL(pdfBlob);
            const pdfLink = document.createElement('a');
            pdfLink.href = pdfUrl;
            pdfLink.download = 'resume.pdf';
            document.body.appendChild(pdfLink);
            pdfLink.click();
            document.body.removeChild(pdfLink);
            window.URL.revokeObjectURL(pdfUrl);

            // Generate LaTeX
            const latexResponse = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedData),
            });

            if (latexResponse.ok) {
                const latexContent = await latexResponse.text();
                const texBlob = new Blob([latexContent], { type: 'application/x-latex' });
                const texUrl = window.URL.createObjectURL(texBlob);
                const texLink = document.createElement('a');
                texLink.href = texUrl;
                texLink.download = 'resume.tex';
                document.body.appendChild(texLink);
                texLink.click();
                document.body.removeChild(texLink);
                window.URL.revokeObjectURL(texUrl);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate resume. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Common Components
    const SectionWrapper = ({ title, description, children }: {
        title: string;
        description: string;
        children: React.ReactNode;
    }) => (
        <div key={title} className="animate-fadeIn">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-100 mb-2">{title}</h2>
                <p className="text-gray-400">{description}</p>
            </div>
            <div className="form-section-content">
                {children}
            </div>
        </div>
    );

    const FormInput = ({
        label,
        control,
        name,
        placeholder,
        type = 'text',
        multiline = false,
    }: {
        label: string;
        control: any;
        name: string;
        placeholder: string;
        type?: string;
        multiline?: boolean;
    }) => (
        <div className="relative w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        multiline ? (
                            <textarea
                                {...field}
                                rows={5}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg
                                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                    transition-all duration-200 text-gray-100 placeholder-gray-400 resize-y"
                                placeholder={placeholder}
                            />
                        ) : (
                            <input
                                {...field}
                                type={type}
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg
                                    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                    transition-all duration-200 text-gray-100 placeholder-gray-400"
                                placeholder={placeholder}
                            />
                        )
                    )}
                />
            </div>
        </div>
    );

    // Memoize the FormInput component
    const MemoizedFormInput = memo(FormInput);

    const AddButton = ({ onClick, text }: { onClick: () => void; text: string }) => (
        <button
            type="button"
            onClick={onClick}
            className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg
                     text-gray-400 hover:text-gray-200 hover:border-gray-500 hover:bg-gray-700/50
                     transition-colors duration-200 flex items-center justify-center"
        >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {text}
        </button>
    );

    // Update the StepIcon component
    const StepIcon = ({ step, currentStep, index }: { step: number; currentStep: number; index: number }) => {
        const isActive = currentStep === step;
        const isCompleted = currentStep > step;

        const icons = {
            1: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            2: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            3: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            4: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            5: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
        };

        return (
            <div className={`relative flex items-center justify-center
                ${isActive ? 'scale-105 transform transition-all duration-200' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 ease-in-out
                    ${isActive
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-200 dark:ring-indigo-800'
                        : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-400 dark:bg-gray-800'}`}>
                    {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        icons[step as keyof typeof icons]
                    )}
                </div>
                <div className={`absolute -bottom-5 w-max text-center transition-all duration-300 text-xs
                    ${isActive ? 'text-indigo-600 font-medium scale-105' : 'text-gray-500'}`}>
                    {STEP_TITLES[index]}
                </div>
            </div>
        );
    };

    // Update the StepIndicator component
    const StepIndicator = () => (
        <div className="w-full mb-10"> {/* Remove padding here */}
            <div className="max-w-2xl mx-auto px-4"> {/* Add max-width, center with margin, and padding */}
                <div className="relative flex justify-between items-center">
                    {[...Array(TOTAL_STEPS)].map((_, index) => (
                        <div key={index} className="flex items-center justify-center">
                            <StepIcon step={index + 1} currentStep={currentStep} index={index} />
                            {index < TOTAL_STEPS - 1 && (
                                <div className="flex-1 mx-2">
                                    <div className="relative">
                                        <div className={`h-0.5 rounded-full transition-all duration-500 ease-in-out
                                            ${currentStep > index + 1
                                                ? 'bg-emerald-500'
                                                : 'bg-gray-200 dark:bg-gray-800'}`}>
                                            <div className={`absolute top-0 left-0 h-full rounded-full
                                                transition-all duration-500 ease-in-out
                                                ${currentStep === index + 2
                                                    ? 'bg-indigo-600 animate-progress w-full'
                                                    : 'w-0'}`} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Section Components
    const PersonalInfoSection = ({ control }: { control: Control<ResumeData> }) => {
        return (
            <SectionWrapper
                title="Personal Information"
                description="Enter your contact and basic information."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Full Name"
                        control={control}
                        name="personalInfo.name"
                        placeholder="John Doe"
                    />
                    <FormInput
                        label="Phone"
                        control={control}
                        name="personalInfo.phone"
                        placeholder="+1 (555) 123-4567"
                    />
                    <FormInput
                        label="Email"
                        control={control}
                        name="personalInfo.email"
                        placeholder="john@example.com"
                        type="email"
                    />
                    <FormInput
                        label="LinkedIn URL"
                        control={control}
                        name="personalInfo.linkedinUrl"
                        placeholder="linkedin.com/in/johndoe"
                    />
                    <FormInput
                        label="GitHub URL"
                        control={control}
                        name="personalInfo.githubUrl"
                        placeholder="github.com/johndoe"
                    />
                </div>
            </SectionWrapper>
        );
    };

    const EducationSection = ({ control }: { control: Control<ResumeData> }) => {
        const { fields, append, remove } = useFieldArray({
            control,
            name: "education"
        });

        return (
            <SectionWrapper
                title="Education"
                description="Add your educational background, starting with the most recent."
            >
                {fields.map((field, index) => (
                    <div key={field.id} className="mb-8 relative p-6 bg-gray-750 border border-gray-600 rounded-lg">
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-red-400 
                                    transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="School"
                                control={control}
                                name={`education.${index}.school`}
                                placeholder="University Name"
                            />
                            <FormInput
                                label="Location"
                                control={control}
                                name={`education.${index}.location`}
                                placeholder="City, State"
                            />
                            <FormInput
                                label="Degree"
                                control={control}
                                name={`education.${index}.degree`}
                                placeholder="Bachelor of Science in Computer Science"
                            />
                            <FormInput
                                label="Date"
                                control={control}
                                name={`education.${index}.date`}
                                placeholder="May 2020 - Present"
                            />
                        </div>
                    </div>
                ))}
                <AddButton
                    onClick={() => append({
                        school: '',
                        location: '',
                        degree: '',
                        date: ''
                    })}
                    text="Add Education"
                />
            </SectionWrapper>
        );
    };

    const ExperienceSection = ({ control }: { control: Control<ResumeData> }) => {
        const { fields, append, remove } = useFieldArray({
            control,
            name: "experience"
        });

        return (
            <SectionWrapper
                title="Experience"
                description="Add your work experience, starting with the most recent."
            >
                {fields.map((field, index) => (
                    <div key={field.id} className="mb-8 relative p-6 bg-gray-750 border border-gray-600 rounded-lg">
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-red-400 
                                    transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Job Title"
                                control={control}
                                name={`experience.${index}.title`}
                                placeholder="Software Engineer"
                            />
                            <FormInput
                                label="Company"
                                control={control}
                                name={`experience.${index}.company`}
                                placeholder="Company Name"
                            />
                            <FormInput
                                label="Location"
                                control={control}
                                name={`experience.${index}.location`}
                                placeholder="City, State"
                            />
                            <FormInput
                                label="Date"
                                control={control}
                                name={`experience.${index}.date`}
                                placeholder="Jan 2020 - Present"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Highlights/Achievements
                            </label>
                            <Controller
                                name={`experience.${index}.highlights`}
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => (
                                    <DynamicList
                                        items={field.value || []}
                                        onChange={(newItems) => field.onChange(newItems)}
                                        placeholder="Add key achievements or responsibilities"
                                    />
                                )}
                            />
                        </div>
                    </div>
                ))}
                <AddButton
                    onClick={() => append({
                        title: '',
                        company: '',
                        location: '',
                        date: '',
                        highlights: []
                    })}
                    text="Add Experience"
                />
            </SectionWrapper>
        );
    };

    const ProjectsSection = ({ control }: { control: Control<ResumeData> }) => {
        const { fields, append, remove } = useFieldArray({
            control,
            name: "projects"
        });

        return (
            <SectionWrapper
                title="Projects"
                description="Add your notable projects and their key achievements."
            >
                {fields.map((field, index) => (
                    <div key={field.id} className="mb-8 relative p-6 bg-gray-750 border border-gray-600 rounded-lg">
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute right-4 top-4 text-gray-400 hover:text-red-400 
                                    transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Project Name"
                                control={control}
                                name={`projects.${index}.name`}
                                placeholder="Project Name"
                            />
                            <FormInput
                                label="Technologies Used"
                                control={control}
                                name={`projects.${index}.technologies`}
                                placeholder="React, Node.js, MongoDB"
                            />
                            <FormInput
                                label="Date"
                                control={control}
                                name={`projects.${index}.date`}
                                placeholder="Jan 2023 - Present"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Highlights/Key Features
                            </label>
                            <Controller
                                name={`projects.${index}.highlights`}
                                control={control}
                                defaultValue={[]}
                                render={({ field }) => (
                                    <DynamicList
                                        items={field.value || []}
                                        onChange={(newItems) => field.onChange(newItems)}
                                        placeholder="Add key features or achievements"
                                        inputClassName="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg
                                            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                            transition-all duration-200 text-gray-100 placeholder-gray-400"
                                        addButtonClassName="mt-2 w-full py-2 border-2 border-dashed border-gray-600 rounded-lg
                                            text-gray-400 hover:text-gray-200 hover:border-gray-500 hover:bg-gray-700/50
                                            transition-colors duration-200 flex items-center justify-center"
                                    />
                                )}
                            />
                        </div>
                    </div>
                ))}
                <AddButton
                    onClick={() => append({
                        name: '',
                        technologies: '',
                        date: '',
                        highlights: []
                    })}
                    text="Add Project"
                />
            </SectionWrapper>
        );
    };

    const SkillsSection = ({ control }: { control: Control<ResumeData> }) => {
        return (
            <SectionWrapper
                title="Technical Skills"
                description="List your technical skills by category."
            >
                <div className="space-y-6">
                    <FormInput
                        label="Programming Languages"
                        control={control}
                        name="technicalSkills.languages"
                        placeholder="Python, JavaScript, Java, C++"
                    />
                    <FormInput
                        label="Frameworks"
                        control={control}
                        name="technicalSkills.frameworks"
                        placeholder="React, Django, Express.js"
                    />
                    <FormInput
                        label="Developer Tools"
                        control={control}
                        name="technicalSkills.developerTools"
                        placeholder="Git, Docker, AWS, VS Code"
                    />
                    <FormInput
                        label="Libraries"
                        control={control}
                        name="technicalSkills.libraries"
                        placeholder="Redux, NumPy, Pandas"
                    />
                </div>
            </SectionWrapper>
        );
    };

    // Add this sample data object near your other constants
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

    // Form Sections Renderer
    const renderCurrentStep = () => {
        switch (currentStep) {
            case STEPS.PERSONAL:
                return <PersonalInfoSection control={control} />;
            case STEPS.EDUCATION:
                return <EducationSection control={control} />;
            case STEPS.EXPERIENCE:
                return <ExperienceSection control={control} />;
            case STEPS.PROJECTS:
                return <ProjectsSection control={control} />;
            case STEPS.SKILLS:
                return <SkillsSection control={control} />;
            default:
                return null;
        }
    };

    // Main Render
    return (
        <div className="min-h-screen w-full bg-gray-900 py-2 sm:py-4">
            <div className="w-full px-2 sm:px-4">
                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Form Section - Full width on mobile, half on desktop */}
                    <div className="w-full lg:w-1/2 lg:h-[90vh] lg:overflow-y-auto">
                        <form onSubmit={handleSubmit(generateResume)}
                            className="bg-gray-800 shadow-xl rounded-xl p-4 sm:p-6 border border-gray-700">
                            {/* Mobile Progress Indicator */}
                            <div className="lg:hidden mb-4 flex items-center justify-between text-gray-400">
                                <span>Step {currentStep} of {TOTAL_STEPS}</span>
                                <span className="text-indigo-400 font-medium">{STEP_TITLES[currentStep - 1]}</span>
                            </div>

                            {/* Desktop Step Indicator - Hidden on mobile */}
                            <div className="hidden w-full justify-center lg:flex">
                                <StepIndicator />
                            </div>

                            {/* Form Content */}
                            <div className="space-y-6">
                                {renderCurrentStep()}
                            </div>

                            {/* Navigation Buttons - Optimized for mobile */}
                            <div className="flex justify-between mt-6 gap-3">
                                <div className="flex gap-3 w-full">
                                    {currentStep > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(currentStep - 1)}
                                            className="px-4 sm:px-6 py-2.5 text-gray-300 bg-gray-800 rounded-lg 
                                                hover:bg-gray-700 transition-all duration-200 flex items-center gap-2 
                                                group flex-1 justify-center sm:flex-none"
                                        >
                                            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            <span className="hidden sm:inline">Back</span>
                                        </button>
                                    )}
                                    {currentStep < TOTAL_STEPS ? (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(currentStep + 1)}
                                            className="px-4 sm:px-6 py-2.5 bg-indigo-600 text-white rounded-lg 
                                                hover:bg-indigo-700 transition-all duration-200 flex items-center 
                                                gap-2 group flex-1 justify-center sm:flex-none"
                                        >
                                            <span className="hidden sm:inline">Next</span>
                                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row w-full gap-3">
                                            <select
                                                value={selectedFormat}
                                                onChange={(e) => setSelectedFormat(e.target.value as FileFormat)}
                                                className="px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg border 
                                                    border-gray-700 focus:ring-2 focus:ring-indigo-500 
                                                    focus:border-indigo-500 transition-all duration-200"
                                            >
                                                <option value="both">PDF & LaTeX</option>
                                                <option value="pdf">PDF Only</option>
                                                <option value="latex">LaTeX Only</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={handleSubmit(generateResume)}
                                                disabled={isGenerating}
                                                className={`px-4 py-2.5 bg-emerald-600 text-white rounded-lg
                                                    hover:bg-emerald-700 transition-all duration-200 flex items-center 
                                                    justify-center gap-2 flex-1 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        <span className="hidden sm:inline">Generating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        Generate
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Preview Section - Floating button on mobile */}
                    <div className="w-full lg:w-1/2 lg:h-[calc(100vh-2rem)]">
                        {/* Mobile Preview Toggle Button */}
                        <div className="fixed bottom-4 right-4 lg:hidden z-50">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="bg-indigo-600 text-white p-4 rounded-full shadow-lg 
                                    hover:bg-indigo-700 transition-all duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>

                        {/* Preview Content */}
                        <div className={`fixed inset-0 z-40 bg-gray-900 lg:relative lg:block transition-all duration-300 ease-in-out overflow-y-auto
                            ${showPreview ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}`}>
                            <div className="h-full lg:h-[85vh] overflow-y-auto">
                                {/* Mobile Preview Header */}
                                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-100">Preview</h2>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="text-gray-400 hover:text-gray-200"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Preview Content */}
                                {pdfUrl ? (
                                    <iframe
                                        src={pdfUrl}
                                        className="w-full h-full"
                                        title="Resume Preview"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center 
                                        text-gray-400 border-2 border-dashed border-gray-700 bg-gray-800">
                                        <div className="text-center p-4">
                                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-lg">Generate your resume to see preview</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ResumeForm;

