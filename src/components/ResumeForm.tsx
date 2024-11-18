/* eslint-disable */
'use client';

import { useState, memo } from 'react';
import type { ResumeData } from '@/types/resume';
import { useForm, useFieldArray, Controller, Control } from 'react-hook-form';
import DynamicList from './DynamicList';

type FileFormat = 'pdf' | 'latex' | 'both';

export default function ResumeForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState<FileFormat>('both');

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
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600">{description}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                    transition-all duration-200 text-black resize-y"
                                placeholder={placeholder}
                            />
                        ) : (
                            <input
                                {...field}
                                type={type}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                    transition-all duration-200 text-black"
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
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg
                     text-gray-600 hover:text-gray-800 hover:border-gray-400
                     transition-colors duration-200 flex items-center justify-center"
        >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {text}
        </button>
    );

    // Navigation Components
    const StepIndicator = () => (
        <div className="mb-8">
            <div className="flex justify-between items-center">
                {[...Array(TOTAL_STEPS)].map((_, index) => (
                    <div key={index} className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center 
                                ${currentStep === index + 1 ? 'bg-blue-600 text-white' :
                                    currentStep > index + 1 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        >
                            {currentStep > index + 1 ? '✓' : index + 1}
                        </div>
                        {index < TOTAL_STEPS - 1 && (
                            <div className={`h-1 w-16 mx-2 
                                ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`}
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
                {STEP_TITLES.map((title, index) => (
                    <span key={index} className="text-center flex-1">{title}</span>
                ))}
            </div>
        </div>
    );

    // Update Navigation Buttons
    const NavigationButtons = () => (
        <div className="flex justify-between mt-6 pt-4 border-t">
            {currentStep > 1 && (
                <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    Back
                </button>
            )}

            {currentStep < TOTAL_STEPS ? (
                <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Next
                </button>
            ) : (
                <div className="ml-auto flex items-center gap-4">
                    <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value as FileFormat)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                                 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    >
                        <option value="both">PDF & LaTeX</option>
                        <option value="pdf">PDF Only</option>
                        <option value="latex">LaTeX Only</option>
                    </select>
                    <button
                        type="button"
                        onClick={handleSubmit(generateResume)}
                        disabled={isGenerating}
                        className={`px-4 py-2 bg-green-600 text-white rounded 
                                 hover:bg-green-700 flex items-center space-x-2
                                 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <span>Generate Resume</span>
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            )}
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
                    <div key={field.id} className="mb-8 relative p-6 border border-gray-200 rounded-lg">
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute right-4 top-4 text-red-500 hover:text-red-700"
                            >
                                Remove
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
                    <div key={field.id} className="mb-8 relative p-6 border border-gray-200 rounded-lg">
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute right-4 top-4 text-red-500 hover:text-red-700"
                            >
                                Remove
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <div key={field.id} className="mb-8 relative p-6 border border-gray-200 rounded-lg">
                        {fields.length > 1 && (
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="absolute right-4 top-4 text-red-500 hover:text-red-700"
                            >
                                Remove
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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

    // Add this function inside your ResumeForm component
    const loadSampleData = () => {
        methods.reset(SAMPLE_DATA);
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <StepIndicator />
                    <button
                        type="button"
                        onClick={loadSampleData}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Load Sample
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit(generateResume)}
                    className="bg-white shadow-md rounded-lg p-6"
                >
                    {renderCurrentStep()}
                    <NavigationButtons />
                </form>
            </div>
        </div>
    );
}

