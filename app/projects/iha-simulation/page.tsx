'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ImageModal from '@/components/ImageModal';

export default function IhaSimulationProject() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Resime tıklama işlemi
  const handleImageClick = (imageSrc: string) => {
    console.log('IHA Simulation - Resime tıklandı:', imageSrc);
    
    // Modalı açalım
    setSelectedImage(imageSrc);
  };

  // Modal açıldığında konsola bilgi yazdır
  useEffect(() => {
    if (selectedImage) {
      console.log('Rendering modal with image:', selectedImage);
    }
  }, [selectedImage]);

  // Proje resimleri - En az iki resim olduğundan emin olun
  const images = [
    {
      src: '/projects/iha-simulation/iha.jpeg',
      alt: 'IHA Simulation Screenshot 1',
      description: 'Ana Arayüz'
    },
    {
      src: '/projects/iha-simulation/iha1.jpg',
      alt: 'IHA Simulation Screenshot 2',
      description: 'Detaylı Görünüm'
    },
    // Diğer görseller buraya eklenebilir
  ];

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-10" />
      </div>

      <section className="relative z-20 py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-4xl font-bold text-white mb-6">IHA Simulation</h1>
            <p className="text-xl text-gray-300 mb-12">İnsansız Hava Aracı Simülasyon Ortamı</p>
          </motion.div>

          {/* Proje Görseli veya Video */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-video mb-12 rounded-xl overflow-hidden shadow-2xl border border-gray-700"
          >
            {/* Video için */}
            <video
              className="w-full h-full object-cover"
              controls
              poster="/projects/iha-simulation/iha.jpeg"
            >
              <source src="/videos/iha.mp4" type="video/mp4" />
              Tarayıcınız video etiketini desteklemiyor.
            </video>
          </motion.div>

          {/* Proje Detayları */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2 prose prose-invert">
              <h2 className="text-2xl font-bold text-white">Proje Hakkında</h2>
              <p className="text-gray-300">
                IHA Simulation, insansız hava araçları için eğitim ve test amacıyla geliştirilmiş gerçekçi bir simülasyon ortamıdır. Farklı uçuş koşulları ve çevre şartlarında IHA sistemlerinin performansını test etmek, pilot eğitimi vermek ve yeni algoritmalar geliştirmek için ideal bir platform sunar.
              </p>
              <p className="text-gray-300">
                Gerçekçi fizik motoru, detaylı 3D modeller ve çeşitli hava koşulları simülasyonu ile gerçek dünyadaki uçuş senaryolarını yüksek doğrulukla modelleyebilir. Bu sayede IHA operatörleri güvenli bir ortamda deneyim kazanabilir ve sistem geliştiricileri yeni özellikleri risk almadan test edebilir.
              </p>
              <h3 className="text-xl font-bold text-white mt-8">Özellikler</h3>
              <ul className="text-gray-300">
                <li>Gerçekçi fizik tabanlı uçuş modeli</li>
                <li>Çeşitli hava koşulları simülasyonu</li>
                <li>Farklı arazi ve çevre seçenekleri</li>
                <li>Sensör simülasyonu (kamera, radar, GPS)</li>
                <li>Otonom uçuş algoritmaları testi</li>
                <li>Çok oyunculu eğitim senaryoları</li>
                <li>Telemetri verileri kaydı ve analizi</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Teknolojiler</h2>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  Gazebo Classic
                </span>
                <span className="inline-block px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                  ROS
                </span>
                <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                  Python
                </span>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Linux
                </span>
              
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 mt-8">Durumu</h2>
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-blue-300">
                <p className="text-sm">Aktif Geliştirme</p>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <p className="text-xs mt-2">Güncelleme: Son sürüm v2.1.5</p>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4 mt-8">Kaynaklar</h2>
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>Teknik Dokümantasyon</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Demo Video</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Ekstra Görseller */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {images.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg border border-gray-700">
                <div className="relative aspect-video cursor-pointer" onClick={() => handleImageClick(image.src)}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-full items-center justify-center">
                      <span className="text-white font-medium">Büyütmek için tıklayın</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 p-2 text-sm text-gray-300">{image.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Diğer projelerim linkine yönlendirme */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              ← Diğer Projelerim
            </Link>
          </motion.div>
        </div>
      </section>
      
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage || ''}
        alt="Büyütülmüş Proje Görseli"
      />
    </div>
  );
} 