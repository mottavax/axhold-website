export default function Footer() {
  return (
    <footer className="bg-gray-200 dark:bg-gray-700 py-6 text-center text-sm text-gray-600 dark:text-gray-300">
      © {new Date().getFullYear()} Axhold. All rights reserved.
    </footer>
  );
}