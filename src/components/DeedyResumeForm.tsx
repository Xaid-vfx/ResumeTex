'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import DynamicList from './DynamicList';

interface DeedyResumeData {
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

export default function DeedyResumeForm() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm<DeedyResumeData>({
        defaultValues: {
            personalInfo: {
                firstName: '',
                lastName: '',
                website: '',
                facebook: '',
                email: '',
                phone: '',
                alternateEmail: ''
            },
            education: [{
                institution: '',
                degree: '',
                date: '',
                location: '',
                gpa: '',
                majorGpa: '',
                honors: []
            }],
            links: {
                facebook: '',
                github: '',
                linkedin: '',
                youtube: '',
                twitter: '',
                quora: ''
            },
            coursework: {
                graduate: [],
                undergraduate: []
            },
            skills: {
                overFiveThousand: [],
                overThousand: [],
                familiar: []
            },
            experience: [{
                company: '',
                role: '',
                location: '',
                date: '',
                highlights: []
            }],
            research: [{
                institution: '',
                role: '',
                location: '',
                date: '',
                description: ''
            }],
            awards: [{
                year: '',
                rank: '',
                competition: ''
            }]
        }
    });

    const { fields: educationFields, append: appendEducation, remove: removeEducation } =
        useFieldArray({ control, name: "education" });

    const { fields: experienceFields, append: appendExperience, remove: removeExperience } =
        useFieldArray({ control, name: "experience" });

    const { fields: researchFields, append: appendResearch, remove: removeResearch } =
        useFieldArray({ control, name: "research" });

    const { fields: awardsFields, append: appendAward, remove: removeAward } =
        useFieldArray({ control, name: "awards" });

    const onSubmit = async (data: DeedyResumeData) => {
        try {
            await generateResume(data);
        } catch (error) {
            console.error('Error in form submission:', error);
        }
    };

    const generateResume = async (data: DeedyResumeData) => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-deedy-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate PDF');
            }

            const pdfBlob = await response.blob();
            const pdfUrl = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'deedy-resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(pdfUrl);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate resume. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const steps = [
        {
            title: "Personal Information",
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                First Name
                            </label>
                            <input
                                {...register("personalInfo.firstName")}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Last Name
                            </label>
                            <input
                                {...register("personalInfo.lastName")}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                {...register("personalInfo.email")}
                                type="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Phone
                            </label>
                            <input
                                {...register("personalInfo.phone")}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Website
                        </label>
                        <input
                            {...register("personalInfo.website")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )
        },
        {
            title: "Education",
            content: (
                <div className="space-y-6">
                    {educationFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeEducation(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Institution</label>
                                    <input
                                        {...register(`education.${index}.institution`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Degree</label>
                                    <input
                                        {...register(`education.${index}.degree`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Date</label>
                                    <input
                                        {...register(`education.${index}.date`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Location</label>
                                    <input
                                        {...register(`education.${index}.location`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">GPA</label>
                                    <input
                                        {...register(`education.${index}.gpa`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Major GPA</label>
                                    <input
                                        {...register(`education.${index}.majorGpa`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Honors</label>
                                <Controller
                                    name={`education.${index}.honors`}
                                    control={control}
                                    render={({ field }) => (
                                        <DynamicList
                                            items={field.value || []}
                                            onChange={field.onChange}
                                            placeholder="Add honor or achievement"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendEducation({
                            institution: '',
                            degree: '',
                            date: '',
                            location: '',
                            gpa: '',
                            majorGpa: '',
                            honors: []
                        })}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Education
                    </button>
                </div>
            )
        },
        {
            title: "Links",
            content: (
                <div className="space-y-4">
                    {Object.keys(watch("links")).map((platform) => (
                        <div key={platform}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {platform}
                            </label>
                            <input
                                {...register(`links.${platform}`)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: "Coursework",
            content: (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Graduate Courses</label>
                        <Controller
                            name="coursework.graduate"
                            control={control}
                            render={({ field }) => (
                                <DynamicList
                                    items={field.value}
                                    onChange={field.onChange}
                                    placeholder="Add graduate course"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Undergraduate Courses</label>
                        <Controller
                            name="coursework.undergraduate"
                            control={control}
                            render={({ field }) => (
                                <DynamicList
                                    items={field.value}
                                    onChange={field.onChange}
                                    placeholder="Add undergraduate course"
                                />
                            )}
                        />
                    </div>
                </div>
            )
        },
        {
            title: "Skills",
            content: (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Over 5000 lines of code</label>
                        <Controller
                            name="skills.overFiveThousand"
                            control={control}
                            render={({ field }) => (
                                <DynamicList
                                    items={field.value}
                                    onChange={field.onChange}
                                    placeholder="Add programming language"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Over 1000 lines of code</label>
                        <Controller
                            name="skills.overThousand"
                            control={control}
                            render={({ field }) => (
                                <DynamicList
                                    items={field.value}
                                    onChange={field.onChange}
                                    placeholder="Add programming language"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Familiar with</label>
                        <Controller
                            name="skills.familiar"
                            control={control}
                            render={({ field }) => (
                                <DynamicList
                                    items={field.value}
                                    onChange={field.onChange}
                                    placeholder="Add programming language"
                                />
                            )}
                        />
                    </div>
                </div>
            )
        },
        {
            title: "Experience",
            content: (
                <div className="space-y-6">
                    {experienceFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeExperience(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Company</label>
                                    <input
                                        {...register(`experience.${index}.company`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Role</label>
                                    <input
                                        {...register(`experience.${index}.role`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Location</label>
                                    <input
                                        {...register(`experience.${index}.location`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Date</label>
                                    <input
                                        {...register(`experience.${index}.date`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Highlights</label>
                                <Controller
                                    name={`experience.${index}.highlights`}
                                    control={control}
                                    render={({ field }) => (
                                        <DynamicList
                                            items={field.value}
                                            onChange={field.onChange}
                                            placeholder="Add highlight"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendExperience({
                            company: '',
                            role: '',
                            location: '',
                            date: '',
                            highlights: []
                        })}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Experience
                    </button>
                </div>
            )
        },
        {
            title: "Research",
            content: (
                <div className="space-y-6">
                    {researchFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Research #{index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeResearch(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Institution</label>
                                    <input
                                        {...register(`research.${index}.institution`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Role</label>
                                    <input
                                        {...register(`research.${index}.role`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Location</label>
                                    <input
                                        {...register(`research.${index}.location`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Date</label>
                                    <input
                                        {...register(`research.${index}.date`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea
                                    {...register(`research.${index}.description`)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendResearch({
                            institution: '',
                            role: '',
                            location: '',
                            date: '',
                            description: ''
                        })}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Research
                    </button>
                </div>
            )
        },
        {
            title: "Awards",
            content: (
                <div className="space-y-6">
                    {awardsFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Award #{index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeAward(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Year</label>
                                    <input
                                        {...register(`awards.${index}.year`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Rank</label>
                                    <input
                                        {...register(`awards.${index}.rank`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Competition</label>
                                    <input
                                        {...register(`awards.${index}.competition`)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendAward({
                            year: '',
                            rank: '',
                            competition: ''
                        })}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Award
                    </button>
                </div>
            )
        }
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={currentStep === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-500">
                    Step {currentStep} of {steps.length}
                </span>
                {currentStep === steps.length ? (
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isGenerating ? 'Generating...' : 'Generate PDF'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Next
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">{steps[currentStep - 1].title}</h2>
                {steps[currentStep - 1].content}
            </div>
        </form>
    );
}