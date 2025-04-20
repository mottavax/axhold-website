import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Holdings from './pages/Holdings';
import Footer from './components/Footer';

function App() {
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
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <header className="bg-white dark:bg-gray-900 shadow">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={darkMode ? '/axhold-logo-white.png' : '/axhold-logo.png'} 
                alt="Axhold Logo" 
                className="h-8"
              />
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

        <main className="flex-grow container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/holdings" element={<Holdings />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;