'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function About() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/90 z-10" />
      </div>

      <section className="relative z-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="prose prose-invert"
            >
              <h1 className="text-4xl font-bold text-white mb-8">
                Hakkımda
              </h1>
              
              <p className="text-gray-300 text-lg">
                
              </p>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Yetenekler</h2>
              <ul className="text-gray-300">
                <li>Frontend Development</li>
                <li>Backend Development</li>
                <li>Database Management</li>
                <li>Web Technologies</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Eğitim</h2>
              <p className="text-gray-300">
                [Eğitim bilgilerinizi buraya ekleyebilirsiniz]
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="sticky top-32">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src="/car5.jpg"
                    alt="Profil Fotoğrafı"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 