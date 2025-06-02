'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  // Dönen fotoğraflar için state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');
  const [displayImage, setDisplayImage] = useState('/car.jpg');
  const [nextImage, setNextImage] = useState('/car3.jpg');
  
  // Fotoğraf listesi
  const backgroundImages = [
    '/car.jpg',
    '/car3.jpg',
    '/car4.jpg',
    '/car5.jpg',
    '/car6.jpg',
    '/car7.jpg',
    '/car8.jpg',
    '/car9.jpg',
    '/car10.jpg',
    '/car11.jpg',
    '/car12.jpg',
  ];

  // Fotoğraf değiştirme fonksiyonu
  const changeImage = () => {
    // Önce fade-out başlat
    setFadeState('fade-out');
    
    // 500ms sonra resmi değiştir ve fade-in başlat
    setTimeout(() => {
      const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
      setCurrentImageIndex(nextIndex);
      setDisplayImage(backgroundImages[nextIndex]);
      setNextImage(backgroundImages[(nextIndex + 1) % backgroundImages.length]);
      setFadeState('fade-in');
    }, 500); 
  }
  
  // Fotoğraflar arasında otomatik geçiş
  useEffect(() => {
    const interval = setInterval(() => {
      changeImage();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  // Sayfa yüklendiğinde localStorage'dan scroll hedefini kontrol et
  useEffect(() => {
    const scrollTarget = localStorage.getItem('scrollTo');
    if (scrollTarget) {
      const element = document.getElementById(scrollTarget);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          localStorage.removeItem('scrollTo');
        }, 100);
      }
    }
  }, []);

  // Sadece görünür resimleri yükle (lazy loading için)
  const [loadedImages, setLoadedImages] = useState([0]);
  
  // Fotoğraflar arasında otomatik geçiş - optimize edildi
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = currentImageIndex === backgroundImages.length - 1 ? 0 : currentImageIndex + 1;
      
      // Sonraki resmi önceden yükle
      if (!loadedImages.includes(nextIndex)) {
        setLoadedImages(prev => [...prev, nextIndex]);
      }
      
      setCurrentImageIndex(nextIndex);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentImageIndex, backgroundImages.length, loadedImages]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      setFormStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: error instanceof Error ? error.message : 'Bir hata oluştu'
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-screen">
      {/* Arka plan fotoğrafları */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div 
          className={`absolute inset-0 w-full h-full z-5 transition-opacity duration-1000 ${fadeState === 'fade-in' ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={displayImage}
            alt="Background"
            fill
            quality={80}
            priority={true}
            className="object-cover object-center"
          />
        </div>
        
        {/* Bir sonraki resmi önceden yükle */}
        <div className="hidden">
          <Image 
            src={nextImage}
            alt="Preload"
            width={1}
            height={1}
            priority={false}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative z-20 min-h-screen flex items-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center"
        >
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            YUSUF KAYA
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12"
          >
            Software Developer
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a 
              href="#projects"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(to right, #9333ea, #4f46e5)',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.375rem',
                fontSize: '1.125rem',
                fontWeight: '500',
                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.background = 'linear-gradient(to right, #7e22ce, #4338ca)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'linear-gradient(to right, #9333ea, #4f46e5)';
              }}
            >
              Projelerimi Gör
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Projeler Section */}
      <section id="projects" className="relative z-20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            className="text-4xl font-bold text-white mb-16 text-center"
          >
            Projelerim
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* IDA - Akıllı Veri Analiz Arayüzü */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false }}
              className="group relative overflow-hidden rounded-xl shadow-2xl border border-gray-700"
            >
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src="/ida.jpg"
                  alt="IDA Interface"
                  width={800}
                  height={450}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">IDA - Interface</h3>
                <p className="text-gray-300 mb-4">Yer kontrol istasyonu</p>
                <Link 
                  href="/projects/ida-interface"
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Detayları Gör
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* IHA Interface */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden rounded-xl shadow-2xl border border-gray-700"
            >
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src="/projects/iha-interface/ihainter2.png"
                  alt="IHA Interface"
                  width={800}
                  height={450}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">IHA Interface</h3>
                <p className="text-gray-300 mb-4">İnsansız Hava Aracı Otomasyonu</p>
                <Link 
                  href="/projects/iha-interface"
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Detayları Gör
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Air Defence Interface */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-xl shadow-2xl border border-gray-700"
            >
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src="/air-defence.png"
                  alt="Air Defence Interface"
                  width={800}
                  height={450}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Air Defence Interface</h3>
                <p className="text-gray-300 mb-4">Arayüz Geliştirici</p>
                <Link 
                  href="/projects/air-defence"
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Detayları Gör
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* IHA Simulation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4 }}
              className="group relative overflow-hidden rounded-xl shadow-2xl border border-gray-700"
            >
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src="/iha1.jpg"
                  alt="IHA Simulation"
                  width={800}
                  height={450}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">IHA Simulation</h3>
                <p className="text-gray-300 mb-4">Simülasyon Geliştirici</p>
                <Link 
                  href="/projects/iha-simulation"
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Detayları Gör
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Cloud Photo Resize */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.5 }}
              className="group relative overflow-hidden rounded-xl shadow-2xl border border-gray-700"
            >
              <div className="aspect-w-16 aspect-h-9">
                <Image
                  src="/projects/cloud/cloud-resize.png"
                  alt="Cloud Photo Resize"
                  width={800}
                  height={450}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Cloud Photo Resize</h3>
                <p className="text-gray-300 mb-4">AWS Bulut Uygulaması</p>
                <Link 
                  href="/projects/cloud-resize"
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Detayları Gör
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Link 
              href="/portfolio"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
            >
              Tüm Projeleri Gör
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Hakkımda Section */}
      <section id="about" className="relative z-20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white mb-16 text-center"
          >
            Hakkımda
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="relative h-96 rounded-xl overflow-hidden shadow-2xl border border-gray-700"
        >
          <Image
                src="/info.jpg"
                alt="Yusuf Kaya"
                fill
                className="object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="prose prose-invert"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Yusuf Kaya</h3>
              <p className="text-gray-300 mb-6">
               Kişisel dökümantasyon amaçlı kullandığım site 
              </p>
              <p className="text-gray-300 mb-6">
                Keyfi.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/YusufKaya00" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-400 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://linkedin.com/in/yusuf-kaya-2a2a48285" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-400 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-400 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* İletişim Section */}
      <section id="contact" className="relative z-20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white mb-16 text-center"
          >
            İletişim
          </motion.h2>
          
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5 }}
                >
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Adınız ve Soyadınız"
                    required
                  />
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-posta</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="E-posta adresiniz"
                    required
                  />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Konu</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Mesajınızın konusu"
                  required
                />
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Mesaj</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Mesajınız"
                  required
                ></textarea>
              </motion.div>
              
              {formStatus.error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm"
                >
                  {formStatus.error}
                </motion.div>
              )}
              
              {formStatus.success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-green-500 text-sm"
                >
                  Mesajınız başarıyla gönderildi!
                </motion.div>
              )}
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center"
              >
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 ${
                    formStatus.loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {formStatus.loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
              </motion.div>
            </form>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-300 mb-4">Veya doğrudan iletişime geçin:</p>
              <p className="text-white text-xl mb-2">yusufkaya380908@gmail.com</p>
              <p className="text-white text-xl">+90 553 583 6306</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Yusuf Kaya. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
