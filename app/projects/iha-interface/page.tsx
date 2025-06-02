'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ImageModal from '@/components/ImageModal';

export default function IhaInterfaceProject() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Resime tıklama işlemi
  const handleImageClick = (imageSrc: string) => {
    console.log('IHA Interface - Resime tıklandı:', imageSrc);
    setSelectedImage(imageSrc);
  };

  // Proje resimleri
  const images = [
    {
      src: '/projects/iha-interface/ihainter.png',
      alt: 'IHA Interface Görseli 1',
      description: 'Ana Kontrol Arayüzü'
    },
    {
      src: '/projects/iha-interface/ihainter2.png',
      alt: 'IHA Interface Görseli 2',
      description: 'Telemetri Verileri'
    }
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
            <h1 className="text-4xl font-bold text-white mb-6">IHA Interface</h1>
            <p className="text-xl text-gray-300 mb-12">MissionPlanner ile Entegre İnsansız Hava Aracı Otomasyonu</p>
          </motion.div>

          {/* Proje Görseli */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-video mb-12 rounded-xl overflow-hidden shadow-2xl border border-gray-700"
          >
            <video
              className="w-full h-full object-cover"
              controls
              poster="/projects/iha-interface/ihainter1.png"
            >
              <source src="/videos/ihainter1.mkv" type="video/webm" />
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
                IHA Interface, insansız hava araçlarının (IHA) kontrol ve yönetimini sağlayan, MissionPlanner ile entegre çalışan bir arayüz ve otomasyon sistemidir. Bu sistem, IHA'ların uçuş planlaması, gerçek zamanlı izlenmesi ve otonom görev yürütme yetenekleri sunmaktadır.
              </p>
              <p className="text-gray-300">
                Proje, MissionPlanner yazılımının API'lerini kullanarak genişletilmiş otomasyon özellikleri sağlar ve çeşitli IHA modellerine uyum gösterecek şekilde tasarlanmıştır. Kullanıcı dostu arayüzü sayesinde, teknik bilgisi sınırlı olan operatörler bile karmaşık görevleri kolaylıkla programlayabilir ve yönetebilir.
              </p>
              <h3 className="text-xl font-bold text-white mt-8">Özellikler</h3>
              <ul className="text-gray-300">
                <li>MissionPlanner ile tam entegrasyon</li>
                <li>Otomatik uçuş rota planlaması</li>
                <li>Gerçek zamanlı telemetri veri görselleştirme</li>
                <li>Çoklu IHA yönetim desteği</li>
                <li>Görev otomasyonu ve zamanlanmış görevler</li>
                <li>Sınır ihlali ve acil durum protokolleri</li>
                <li>Gelişmiş veri kayıt ve analiz araçları</li>
                <li>2D harita entegrasyonu ve arazi analizi</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Teknolojiler</h2>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  C#
                </span>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  .NET Framework
                </span>
                <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  MAVLink Protokolü
                </span>
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  WPF
                </span>
                <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                  MissionPlanner API
                </span>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  GMap.NET
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 mt-8">Durumu</h2>
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-blue-300">
                <p className="text-sm">Geliştirme Aşamasında</p>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs mt-2">Tahmini tamamlanma: Q2 2024</p>
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
                  <span>GitHub Repo</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.989 11.572a7.96 7.96 0 0 0-1.573-4.351 9.749 9.749 0 0 0-.92-1.193c-.262-.282-.52-.577-.783-.9-.292-.347-.455-.525-.733-.684-.952-.686-1.858-.759-2.347-.022-.155.251-.27.575-.509 1.161-.122.312-.245.629-.409.981-.147.344-.258.651-.405 1.006-.147.355-.3.731-.417 1.12a10.51 10.51 0 0 0-.497 2.81c-.031 1.083.09 2.187.498 3.323.195.609.428 1.226.676 1.844.203.519.43 1.03.715 1.515.287.487.602.954.944 1.395.925 1.201 2.018 2.203 3.003 3.301.899 1.008 1.743 2.072 2.406 3.267.663 1.195 1.056 2.535.812 4.007-.134.852-.522 1.67-1.179 2.341-.651.674-1.519 1.186-2.41 1.247-1.315.09-2.539-.523-3.5-1.31-.961-.789-1.72-1.762-2.437-2.717-.47-.635-.934-1.286-1.444-1.814-.51-.527-1.161-.883-1.662-.772-.869.239-1.019 1.592-.696 2.462.195.566.524 1.023.908 1.416.383.392.81.741 1.242 1.077 1.743 1.357 3.598 2.57 5.489 3.642 1.856 1.056 3.795 1.968 5.693 1.879.3-.014.614-.062.92-.151 2.442-.721 4.035-3.042 4.35-5.637.182-1.496-.039-2.949-.735-4.244-.695-1.296-1.708-2.415-2.752-3.451-.657-.65-1.34-1.295-1.934-2.013-.267-.336-.46-.773-.49-1.207.11-.453.465-.832.79-1.121.324-.289.676-.544 1.013-.769a5.256 5.256 0 0 0 1.711-1.961c.35-.661.49-1.38.502-2.092a5.324 5.324 0 0 0-.258-1.781c-.186-.614-.485-1.192-.881-1.698-.392-.501-.89-.95-1.432-1.302A7.257 7.257 0 0 0 13.8 7.191c-.799.1-1.534.399-2.138.931a5.253 5.253 0 0 0-1.199 1.505c-.275.511-.451 1.064-.518 1.634a4.681 4.681 0 0 0 .089 1.642c.135.538.358 1.052.673 1.506.317.455.69.847 1.109 1.181.82.646 1.736 1.149 2.686 1.426.701.204 1.428.322 2.144.239.644-.076 1.259-.303 1.772-.646.512-.343.935-.79 1.242-1.292a4.132 4.132 0 0 0 .705-2.229 3.03 3.03 0 0 0-.306-1.386c-.333-.693-.847-1.281-1.469-1.687-.622-.406-1.325-.682-2.035-.712a3.988 3.988 0 0 0-1.613.279 3.956 3.956 0 0 0-1.37.846 7.6 7.6 0 0 0-.354.349"/>
                  </svg>
                  <span>Dokümantasyon</span>
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