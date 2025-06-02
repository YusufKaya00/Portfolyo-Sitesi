'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Portfolio() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-10" />
      </div>

      <section className="relative z-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-white mb-12"
          >
            Projelerim
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Proje Takip ve Gantt Diyagramı */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm hover:bg-gray-800/40 transition-colors duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="w-full h-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Proje Takip ve Gantt</h3>
                <p className="text-gray-300 mb-4">
                  Proje ve görev yönetimi için kullanıcı dostu arayüz, ekip atama ve Gantt görselleştirme.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    React
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    TypeScript
                  </span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                    Framer Motion
                  </span>
                </div>
                <Link 
                  href="/project-tracker" 
                  className="inline-flex items-center text-purple-500 hover:text-purple-400"
                >
                  Uygulamayı Kullan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* CV Generator Projesi */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm hover:bg-gray-800/40 transition-colors duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="w-full h-full bg-gradient-to-br from-teal-500/30 to-blue-600/30 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">CV Oluşturucu</h3>
                <p className="text-gray-300 mb-4">
                  Metin tabanlı CV oluşturma aracı, Gemini AI entegrasyonu ile otomatik CV oluşturabilir.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    React
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    Next.js
                  </span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                    Gemini AI
                  </span>
                </div>
                <Link 
                  href="/cv-generator" 
                  className="inline-flex items-center text-blue-500 hover:text-blue-400"
                >
                  Uygulamayı Kullan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* PDF to Word Converter */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="group relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm hover:bg-gray-800/40 transition-colors duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="w-full h-full bg-gradient-to-br from-blue-500/30 to-indigo-600/30 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">PDF to Word Converter</h3>
                <p className="text-gray-300 mb-4">
                  Bulut tabanlı PDF dosyalarını kolayca Word formatına dönüştüren modern bir web uygulaması.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    Next.js
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    TypeScript
                  </span>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
                    Cloud API
                  </span>
                </div>
                <Link 
                  href="/converter" 
                  className="inline-flex items-center text-blue-500 hover:text-blue-400"
                >
                  Dönüştürücüyü Kullan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Fırat Convert - Excel/CSV Raporlama */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="group relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm hover:bg-gray-800/40 transition-colors duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="w-full h-full bg-gradient-to-br from-green-500/30 to-teal-600/30 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Fırat Convert</h3>
                <p className="text-gray-300 mb-4">
                  Excel/CSV dosyalarından otomatik raporlama ve veri görselleştirme sistemi.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    React
                  </span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                    Chart.js
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                    jsPDF
                  </span>
                </div>
                <Link 
                  href="/convert" 
                  className="inline-flex items-center text-teal-500 hover:text-teal-400"
                >
                  Veri Dönüştürücüyü Kullan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Kod Analiz Aracı */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="group relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm hover:bg-gray-800/40 transition-colors duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="w-full h-full bg-gradient-to-br from-indigo-500/30 to-purple-600/30 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Kod Analiz Aracı</h3>
                <p className="text-gray-300 mb-4">
                  Yapay zeka destekli kod analizi, güvenlik açığı tespiti ve iyileştirme önerileri sunan araç.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    React
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                    AI Analysis
                  </span>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
                    Syntax Highlight
                  </span>
                </div>
                <Link 
                  href="/code-review" 
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300"
                >
                  Kodu Analiz Et
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Fotoğraf Paylaşım ve Etiketleme Uygulaması */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="group relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm hover:bg-gray-800/40 transition-colors duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="w-full h-full bg-gradient-to-br from-pink-500/30 to-orange-600/30 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Fotoğraf Paylaşım Uygulaması</h3>
                <p className="text-gray-300 mb-4">
                  Kullanıcıların fotoğraf yükleyip etiketleyebileceği, yorum yapıp beğenebileceği sosyal medya tarzı uygulama. 
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    React
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                    NextJS
                  </span>
                  <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">
                    Tailwind CSS
                  </span>
                </div>
                <Link 
                  href="/photo-sharing" 
                  className="inline-flex items-center text-pink-500 hover:text-pink-400"
                >
                  Uygulamayı Kullan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Çevrimiçi Anket ve Form Hazırlama Sistemi */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="group relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm hover:bg-gray-800/40 transition-colors duration-300"
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-blue-600/30 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Anket ve Form Sistemi</h3>
                <p className="text-gray-300 mb-4">
                  Anket oluşturma, katılım sağlama ve sonuçları grafiklerle görselleştirme imkanı sunan interaktif uygulama.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                    React
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                    Chart.js
                  </span>
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
                    Tailwind CSS
                  </span>
                </div>
                <Link 
                  href="/survey-system" 
                  className="inline-flex items-center text-purple-500 hover:text-purple-400"
                >
                  Uygulamayı Kullan
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 