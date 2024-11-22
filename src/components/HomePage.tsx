'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';
import jakePreview from '../../public/images/jakesresumeimage.jpeg';
import deedyPreview from '../../public/images/DeedyPreview.jpeg';

export default function HomePage() {
    const router = useRouter();

    const handleGetStarted = () => {
        document.getElementById('templates-section')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
            {/* Hero Section */}
            <div className="relative">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />

                <div className="relative container mx-auto px-4 pt-24 pb-32">
                    {/* Floating Elements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="absolute top-20 left-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"
                    />
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="absolute top-40 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
                    />

                    {/* Main Content */}
                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-6"
                        >
                            <span className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium inline-block backdrop-blur-sm">
                                ✨ The Future of Resume Creation
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-6xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                        >
                            ResumeTeX
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
                        >
                            Create ATS-friendly LaTeX resumes without writing a single line of code.
                        </motion.p>

                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            onClick={handleGetStarted}
                            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium 
                                transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25
                                flex items-center gap-2 mx-auto"
                        >
                            Get Started <FiArrowRight className="animate-bounce-x" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-900 py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                title: "No LaTeX Knowledge Required",
                                description: "Say goodbye to complex LaTeX code. Our intuitive interface makes resume creation as simple as filling out a form.",
                                gradient: "from-blue-500 to-cyan-500",
                                delay: 0
                            },
                            {
                                title: "ATS-Friendly Templates",
                                description: "Get past automated screenings with our optimized templates that ensure maximum compatibility with ATS systems.",
                                gradient: "from-purple-500 to-pink-500",
                                delay: 0.1
                            },
                            {
                                title: "Live Preview",
                                description: "See your changes in real-time with our instant preview feature. What you see is exactly what you'll get.",
                                gradient: "from-orange-500 to-red-500",
                                delay: 0.2
                            },
                            {
                                title: "Instant Export",
                                description: "Generate professional PDFs with one click. Get both PDF and LaTeX source files instantly.",
                                gradient: "from-green-500 to-emerald-500",
                                delay: 0.3
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: feature.delay }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                                    style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                                <div className={`relative p-8 rounded-2xl bg-gray-800 border border-gray-700
                                    hover:border-transparent transition-all duration-300
                                    hover:bg-gradient-to-r ${feature.gradient}`}
                                >
                                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Templates Section */}
            <div id="templates-section" className="bg-gray-800/50 py-24 relative scroll-mt-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Professional Templates
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Choose from our collection of ATS-optimized LaTeX templates
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                name: "Jake's Resume",
                                image: jakePreview,
                                description: "Clean and professional design suitable for all industries",
                                gradient: "from-blue-500 to-cyan-500",
                                isActive: true,
                                delay: 0,
                                url: '/jake'
                            },
                            {
                                name: "Deedy CV",
                                image: deedyPreview,
                                description: "Modern two-column layout perfect for tech professionals",
                                gradient: "from-purple-500 to-pink-500",
                                isActive: false,
                                delay: 0.1,
                                url: '/deedy'
                            }
                        ].map((template, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: template.delay }}
                                className="group relative"
                            >
                                {/* Template Card */}
                                <div className="relative rounded-2xl overflow-hidden bg-gray-800 border border-gray-700
                                    transition-all duration-300 hover:border-transparent hover:shadow-lg hover:shadow-blue-500/25">
                                    {/* Template Preview */}
                                    <div className="aspect-[3/4] relative overflow-hidden">
                                        <Image
                                            src={template.image}
                                            alt={template.name}
                                            placeholder="blur"
                                            className={`object-cover transition-transform duration-300
                                                ${template.isActive ? 'group-hover:scale-105' : 'grayscale opacity-50'}`}
                                        />
                                        {/* Gradient Overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50`} />

                                        {/* Coming Soon Badge */}
                                        {!template.isActive && (
                                            <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full
                                                text-sm font-medium transform rotate-12">
                                                Coming Soon
                                            </div>
                                        )}
                                    </div>

                                    {/* Template Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-900">
                                        <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                                        <p className="text-gray-300 mb-4">{template.description}</p>
                                        {template.isActive ? (
                                            <button
                                                onClick={() => router.push(`/templates/${template.url.toLowerCase()}`)}
                                                className={`px-4 py-2 rounded-lg bg-gradient-to-r ${template.gradient} 
                                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                                    font-medium flex items-center gap-2`}
                                            >
                                                Use Template <FiArrowRight />
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-sm">
                                                Available soon
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 text-center text-gray-400">
                <p>
                    Built by <a href="https://x.com/okzaid" className="text-white hover:text-blue-400 transition-colors">Zaid 👨‍💻</a>
                </p>
            </footer>
        </div>
    );
}
