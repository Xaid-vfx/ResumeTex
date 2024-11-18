'use client';

import Templates from '@/components/Templates';
import { FiArrowRight, FiDownload, FiEdit, FiLayout } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/templates/jake'); // or wherever you want the "Get Started" button to go
    };

    const scrollToTemplates = () => {
        document.querySelector('#templates')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <main className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-24 space-y-8">
                    <div className="inline-block animate-bounce-slow">
                        <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm font-medium">
                            ✨ Create Professional Resumes with LaTeX
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                        LaTeX Resume Builder
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Transform your career story into a professionally crafted LaTeX resume.
                        Choose from our expertly designed templates and customize them to perfection.
                    </p>

                    <div className="flex justify-center gap-4 pt-4">
                        <button
                            onClick={handleGetStarted}
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            Get Started <FiArrowRight />
                        </button>
                        <button
                            onClick={scrollToTemplates}
                            className="px-8 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-all"
                        >
                            View Examples
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {[
                        {
                            icon: <FiLayout className="w-8 h-8" />,
                            title: 'Professional Templates',
                            description: 'Choose from our collection of carefully crafted LaTeX templates designed for maximum impact'
                        },
                        {
                            icon: <FiEdit className="w-8 h-8" />,
                            title: 'Easy Customization',
                            description: 'Intuitive form-based editing with real-time preview. No LaTeX knowledge required'
                        },
                        {
                            icon: <FiDownload className="w-8 h-8" />,
                            title: 'Instant PDF Export',
                            description: 'Generate perfectly formatted PDF resumes with a single click'
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="text-blue-600 dark:text-blue-400 mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Templates Section */}
                <section id="templates" className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Template</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Select from our growing collection of professional LaTeX templates,
                            each designed for specific industries and career levels.
                        </p>
                    </div>
                    <Templates />
                </section>

                {/* CTA Section */}
                <section className="mb-24 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Create Your Professional Resume?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of professionals who've advanced their careers with our LaTeX templates.
                    </p>
                    <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-all transform hover:scale-105">
                        Get Started Now
                    </button>
                </section>

                {/* Footer */}
                <footer className="text-center text-gray-500 dark:text-gray-400 space-y-4">
                    <div className="flex justify-center gap-6">
                        <a href="#" className="hover:text-gray-800 dark:hover:text-gray-200">About</a>
                        <a href="#" className="hover:text-gray-800 dark:hover:text-gray-200">Templates</a>
                        <a href="#" className="hover:text-gray-800 dark:hover:text-gray-200">Contact</a>
                        <a href="#" className="hover:text-gray-800 dark:hover:text-gray-200">Privacy</a>
                    </div>
                    <p>
                        Built with{" "}
                        <a
                            href="https://nextjs.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            Next.js
                        </a>
                        {" "}and LaTeX
                    </p>
                </footer>
            </main>
        </div>
    );
}
