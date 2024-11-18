import ResumeForm from '@/components/ResumeForm';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto">
        {/* Static Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">LaTeX Resume Generator</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Fill in your details to generate a professional LaTeX resume
          </p>
        </div>

        {/* Client-side Form Component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-1/2">
          <ResumeForm />
        </div>

        {/* Static Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
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
