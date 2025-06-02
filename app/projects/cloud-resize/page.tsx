'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ImageModal from '@/components/ImageModal';

export default function CloudResizeProject() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Resime tıklama işlemi
  const handleImageClick = (imageSrc: string) => {
    console.log('Cloud Resize - Resime tıklandı:', imageSrc);
    setSelectedImage(imageSrc);
  };

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
            <h1 className="text-4xl font-bold text-white mb-6">Cloud Photo Resize</h1>
            <p className="text-xl text-gray-300 mb-12">Backend Geliştirici</p>
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
              poster="/projects/cloud/cloud-resize.png"
            >
              <source src="/videos/aws.mp4" type="video/mp4" />
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
                Cloud Photo Resize, tamamen bulut tabanlı bir görüntü yükleme ve yönetim sistemi olarak tasarlanmıştır. Kullanıcılar, siteyi ziyaret ederek kişisel bilgilerini (ad, e-posta, telefon) doldurup görüntü yükleyebilirler. Yüklenen görüntüler otomatik olarak yeniden boyutlandırılır ve veriler sistemde depolanır.
              </p>
              <p className="text-gray-300">
                Bu proje, Amazon Web Services (AWS) ekosistemini verimli bir şekilde kullanarak, yüksek ölçeklenebilirlik, güvenilirlik ve performans sağlayan modern bir mimari üzerine inşa edilmiştir. Sunucusuz mimari ve çeşitli AWS servisleri kullanılarak, sistem minimum bakım gereksinimiyle maksimum esneklik sunacak şekilde tasarlanmıştır.
              </p>
              <h3 className="text-xl font-bold text-white mt-8">Özellikler</h3>
              <ul className="text-gray-300">
                <li>S3 Bucket ve Lambda entegrasyonu ile otomatik görüntü işleme</li>
                <li>IAM rolleri ve izinleri ile güvenli erişim kontrolü</li>
                <li>EC2 sunucu yapılandırması ve uygulama dağıtımı</li>
                <li>Elastik Dosya Sistemi (EFS) ve RDS ile veri depolama</li>
                <li>Auto Scaling ve Load Balancer ile trafik yönetimi</li>
                <li>VPC ve Subnet yapılandırmaları (CIDR hesaplamaları dahil)</li>
                <li>CloudFront ile içerik dağıtım ağı entegrasyonu</li>
                <li>CloudWatch ile sistem izleme ve hata ayıklama</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Teknolojiler</h2>
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  Node.js
                </span>
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">
                  AWS Lambda
                </span>
                <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                  Amazon S3
                </span>
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  Amazon EC2
                </span>
                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  Express.js
                </span>
                <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                  Amazon RDS
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4 mt-8">Durumu</h2>
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 text-blue-300">
                <p className="text-sm">Tamamlanmış</p>
                <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs mt-2">Son güncelleme: Haziran 2023</p>
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
                    <path d="M14.38,3.467l0.232-0.633c0.086-0.226-0.031-0.477-0.264-0.559c-0.229-0.081-0.48,0.033-0.562,0.262l-0.234,0.631C10.695,2.38,7.648,3.89,6.616,6.689l-1.447,3.93l-2.664,1.227c-0.354,0.166-0.337,0.672,0.035,0.805l4.811,1.729c-0.19,1.119,0.445,2.25,1.561,2.65c1.119,0.402,2.341-0.059,2.923-1.039l4.811,1.73c0,0.002,0.002,0.002,0.002,0.002c0.23,0.082,0.48-0.033,0.562-0.262c0.084-0.226-0.031-0.477-0.262-0.559L14.38,3.467z M10.215,14.323c-0.857-0.307-1.311-1.23-1.006-2.086c0.307-0.857,1.231-1.311,2.088-1.005c0.856,0.308,1.318,1.231,1.006,2.087C11.996,14.174,11.072,14.632,10.215,14.323z"/>
                  </svg>
                  <span>AWS Architecture</span>
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
            <div 
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handleImageClick('/projects/cloud/cloud-resize.png')}
            >
              <img
                src="/projects/cloud/cloud-resize.png"
                alt="Cloud Photo Resize Screenshot 1"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-full items-center justify-center">
                  <span className="text-white font-medium">Büyütmek için tıklayın</span>
                </div>
              </div>
            </div>
            <div 
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handleImageClick('/projects/cloud/cloud-resize.png')}
            >
              <img
                src="/projects/cloud/cloud-resize.png"
                alt="Cloud Photo Resize Screenshot 2"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-full items-center justify-center">
                  <span className="text-white font-medium">Büyütmek için tıklayın</span>
                </div>
              </div>
            </div>
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