import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src={darkMode ? '/axhold-logo-white.png' : '/axhold-logo.png'} 
            alt="Axhold Logo" 
            className="h-8"
          />
          {/* If you want text, you can add it here */}
        </Link>
        <nav className="flex space-x-4">
          <Link to="/" className="text-gray-800 dark:text-white hover:underline">Home</Link>
          <Link to="/holdings" className="text-gray-800 dark:text-white hover:underline">Holdings 💎</Link>
          <button
            onClick={toggleDarkMode}
            className="text-gray-800 dark:text-white focus:outline-none"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </nav>
      </div>
    </header>
  );
}