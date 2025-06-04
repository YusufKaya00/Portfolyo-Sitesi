'use client';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

function SearchParamsHandler({ setLayoutKeyCallback }: { setLayoutKeyCallback: (key: string) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Update the key when hash changes
    const handleHashChange = () => {
      setLayoutKeyCallback(`${pathname}${window.location.hash}`);
    };
    
    // Set initial key
    setLayoutKeyCallback(`${pathname}${window.location.hash}`);
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname, searchParams, setLayoutKeyCallback]);
  
  return null;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [layoutKey, setLayoutKey] = useState<string>('');

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler setLayoutKeyCallback={setLayoutKey} />
      </Suspense>
      
      <nav className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur-lg shadow-lg fixed w-full z-50 border-b border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-white hover:text-indigo-400 transition-colors">
                Y.K.
              </Link>
            </div>
            <div className="flex space-x-8">
              <Link 
                href="/portfolio" 
                className={`flex items-center px-3 py-2 text-gray-300 hover:text-indigo-400 transition-colors ${
                  pathname === '/portfolio' ? 'text-indigo-400' : ''
                }`}
              >
                PORTFOLYO
              </Link>
              <Link 
                href="/blog" 
                className={`flex items-center px-3 py-2 text-gray-300 hover:text-indigo-400 transition-colors ${
                  pathname === '/blog' ? 'text-indigo-400' : ''
                }`}
              >
                BLOG
              </Link>
              <Link 
                href={pathname === '/' ? '#about' : '/'}
                className={`flex items-center px-3 py-2 text-gray-300 hover:text-indigo-400 transition-colors`}
                onClick={() => {
                  if (pathname !== '/') {
                    localStorage.setItem('scrollTo', 'about');
                  }
                }}
              >
                HAKKIMDA
              </Link>
              <Link 
                href={pathname === '/' ? '#contact' : '/'}
                className={`flex items-center px-3 py-2 text-gray-300 hover:text-indigo-400 transition-colors`}
                onClick={() => {
                  if (pathname !== '/') {
                    localStorage.setItem('scrollTo', 'contact');
                  }
                }}
              >
                İLETİŞİM
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <AnimatePresence mode="wait">
        <motion.div
          key={layoutKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="pt-16"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
} 