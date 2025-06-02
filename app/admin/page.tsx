'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  likes?: string[];
}

export default function AdminPage() {
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  const [surveyCount, setSurveyCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verileri localStorage'dan yükleme
    try {
      // Blog verileri
      const savedPosts = localStorage.getItem('posts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts) as BlogPost[];
        // Tüm beğenileri topla
        const likes = posts.reduce((total: number, post: BlogPost) => total + (post.likes?.length || 0), 0);
        setTotalLikes(likes);
        setBlogCount(posts.length);
      }

      // Fotoğraf verileri
      const savedPhotos = localStorage.getItem('photoSharingPhotos');
      if (savedPhotos) {
        const photos = JSON.parse(savedPhotos);
        // Fotoğraf sayısı
        setPhotoCount(photos.length);
      }

      // Anket verileri
      const savedSurveys = localStorage.getItem('surveySystemSurveys');
      if (savedSurveys) {
        const surveys = JSON.parse(savedSurveys);
        setSurveyCount(surveys.length);
      }

      // Ziyaretçi sayısı (simülasyon)
      const visits = localStorage.getItem('totalVisits');
      if (visits) {
        setTotalVisits(parseInt(visits));
      } else {
        // Rastgele bir ziyaretçi sayısı oluştur
        const randomVisits = Math.floor(Math.random() * 500) + 100;
        setTotalVisits(randomVisits);
        localStorage.setItem('totalVisits', randomVisits.toString());
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Admin Paneli</h1>
          <p className="text-gray-400">Site yönetimi için gerekli araçları buradan kullanabilirsiniz.</p>
        </motion.div>

        {/* İstatistik Kartları */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          {/* Ziyaretçi Sayısı */}
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6 shadow-lg border border-blue-800/50 backdrop-blur-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Toplam Ziyaretçi</p>
                <h3 className="text-white text-2xl font-bold mt-1">
                  {loading ? (
                    <div className="h-8 w-16 bg-blue-700/50 animate-pulse rounded"></div>
                  ) : totalVisits.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-blue-800/50 rounded-lg">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-blue-300">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Son 30 günde</span>
              </div>
            </div>
          </div>

          {/* Toplam Beğeni */}
          <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 rounded-xl p-6 shadow-lg border border-red-800/50 backdrop-blur-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">Toplam Beğeni</p>
                <h3 className="text-white text-2xl font-bold mt-1">
                  {loading ? (
                    <div className="h-8 w-16 bg-red-700/50 animate-pulse rounded"></div>
                  ) : totalLikes.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-red-800/50 rounded-lg">
                <svg className="w-8 h-8 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs text-red-300">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Tüm içerikler</span>
              </div>
            </div>
          </div>

          {/* Blog Yazıları */}
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 shadow-lg border border-purple-800/50 backdrop-blur-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Blog Yazıları</p>
                <h3 className="text-white text-2xl font-bold mt-1">
                  {loading ? (
                    <div className="h-8 w-16 bg-purple-700/50 animate-pulse rounded"></div>
                  ) : blogCount.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-purple-800/50 rounded-lg">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <Link href="/admin/blog" className="flex items-center text-xs text-purple-300 hover:underline">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Yönet</span>
              </Link>
            </div>
          </div>

          {/* Fotoğraflar */}
          <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 rounded-xl p-6 shadow-lg border border-pink-800/50 backdrop-blur-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-pink-300 text-sm font-medium">Fotoğraflar</p>
                <h3 className="text-white text-2xl font-bold mt-1">
                  {loading ? (
                    <div className="h-8 w-16 bg-pink-700/50 animate-pulse rounded"></div>
                  ) : photoCount.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-pink-800/50 rounded-lg">
                <svg className="w-8 h-8 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <Link href="/admin/photo-sharing" className="flex items-center text-xs text-pink-300 hover:underline">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Yönet</span>
              </Link>
            </div>
          </div>

          {/* Anketler */}
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl p-6 shadow-lg border border-green-800/50 backdrop-blur-sm">
            <div className="flex justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Anketler</p>
                <h3 className="text-white text-2xl font-bold mt-1">
                  {loading ? (
                    <div className="h-8 w-16 bg-green-700/50 animate-pulse rounded"></div>
                  ) : surveyCount.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 bg-green-800/50 rounded-lg">
                <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <Link href="/admin/surveys" className="flex items-center text-xs text-green-300 hover:underline">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Yönet</span>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/admin/blog">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800/50 rounded-xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-sm p-8 hover:border-indigo-500 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center mb-6">
                <svg className="w-20 h-20 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Blog Yönetimi</h2>
              <p className="text-gray-400 text-center">Blog yazılarını ekleyin, düzenleyin ve yönetin. AI destekli içerik oluşturma özelliğini kullanın.</p>
              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-indigo-900/50 text-indigo-400">
                  Gemini AI Destekli
                </span>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/photo-sharing">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800/50 rounded-xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-sm p-8 hover:border-pink-500 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center mb-6">
                <svg className="w-20 h-20 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Fotoğraf Paylaşım Yönetimi</h2>
              <p className="text-gray-400 text-center">Kullanıcı fotoğraflarını yönetin, etkinlikler oluşturun ve içerikleri düzenleyin.</p>
              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-pink-900/50 text-pink-400">
                  Etkinlik Yönetimi
                </span>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/surveys">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800/50 rounded-xl shadow-2xl overflow-hidden border border-gray-700 backdrop-blur-sm p-8 hover:border-green-500 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-center mb-6">
                <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Anket Yönetimi</h2>
              <p className="text-gray-400 text-center">Anketleri düzenleyin ve silin, kullanıcı cevaplarını analiz edin ve raporlar oluşturun.</p>
              <div className="mt-6 flex justify-center">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-900/50 text-green-400">
                  Veri Analitiği
                </span>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
} 