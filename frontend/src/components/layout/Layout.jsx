import { Outlet, Link } from "react-router-dom";
import UserMenu from '../UserMenu'; 

export const MainLayout = () => {
  const parsedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="font-bold text-xl text-white no-underline font-sans"
            >
              FormsApp
            </Link>
            {parsedUser && (
              <Link 
                to="/forms" 
                className="text-white no-underline font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
              >
                Forms
              </Link>
            )}
          </div>
          <div className="flex items-center gap-6">
            {!parsedUser ? (
              <>
                <Link 
                  to="/login" 
                  className="text-white no-underline px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-white no-underline px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <UserMenu user={parsedUser} />
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="max-w-3xl w-full px-2 py-4">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full">
        <div className="py-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-center text-white font-medium">
          © 2025 FormsApp - All rights reserved
        </div>
      </footer>
    </div>
  );  
};