import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="fixed inset-0 z-0 home-animated-bg" />
      <div className="relative z-10 flex min-h-screen items-center justify-center font-sans">
        <div className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-10 w-full max-w-3xl text-center backdrop-blur-md animate-fade-in-up">
          <h2 className="text-5xl font-bold mb-8 leading-tight text-purple-700 dark:text-purple-400">
            Welcome to <span className="block">FormsApp</span>
          </h2>
          <p className="text-gray-700 dark:text-gray-200 text-xl mb-10 leading-relaxed">
            The perfect platform to create and manage
            <br />
            online forms easily and efficiently.
          </p>
          <div className="flex justify-center">
            <Link
              to="/forms"
              className="px-10 py-4 rounded-lg font-semibold bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md hover:from-purple-800 hover:to-indigo-900 transition-all duration-200 text-lg"
            >
              Go to Forms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}