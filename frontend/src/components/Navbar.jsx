import { Code2, LayoutDashboard, FileCode } from 'lucide-react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Brand */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg shadow-lg">
                <Code2 className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Interveasy</h1>
                <p className="text-xs text-emerald-400 font-medium">Ace your technical interviews</p>
              </div>
            </NavLink>
          </div>

          {/* Center - Navigation Links */}
          <div className="flex items-center gap-4">
            <NavLink
              to="/problems"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <FileCode className="w-4 h-4" />
              Problems
            </NavLink>
            
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </NavLink>
          </div>

          {/* Right side - Authentication */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-gray-300">
                  <span className="text-sm">Welcome back!</span>
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonAvatarBox: "w-10 h-10",
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            ) : (
              <NavLink
                to="/sign-in"
                className={({ isActive }) =>
                  `px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
                  }`
                }
              >
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;