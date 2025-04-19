import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/axhold-logo.png" alt="Axhold Logo" className="h-10" />
          <span className="text-2xl font-bold">Axhold</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-blue-600 capitalize">Home</Link>
          <Link to="/holdings" className="hover:text-blue-600 capitalize">Holdings</Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}