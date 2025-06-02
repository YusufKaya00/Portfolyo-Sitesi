'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string);
    }
  }, [params.id]);

  const fetchPost = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/blog/posts/${id}`);
      
      if (!response.ok) {
        throw new Error('Blog yazısı bulunamadı');
      }
      
      const data = await response.json();
      setPost(data);
    } catch (error: any) {
      console.error('Blog yazısı yüklenirken hata:', error);
      setError(error.message || 'Blog yazısı yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // HTML'e dönüştürülmüş içeriği render etme fonksiyonu
  const renderContent = (content: string) => {
    // Basit markdown dönüşümü (gerçek uygulamada bir markdown parser kullanılmalıdır)
    const html = content
      // Başlıklar
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-6 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-white mt-5 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>')
      // Paragraflar
      .replace(/^(?!<h[1-6]|<ul|<ol|<li|<blockquote|<code)(.+)/gm, '<p class="text-gray-300 mb-4">$1</p>')
      // Kod blokları
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-700 p-4 rounded-lg overflow-x-auto mb-4 text-gray-300 font-mono"><code>$1</code></pre>')
      // Kalın
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // İtalik
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Listeler
      .replace(/^- (.*)/gm, '<ul class="list-disc list-inside text-gray-300 mb-4"><li>$1</li></ul>')
      // Inline kod
      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-2 py-1 rounded text-sm">$1</code>');

    return { __html: html };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-gray-800/50 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-sm">
            <div className="mb-6 p-4 bg-red-900/40 border border-red-800 rounded-lg text-red-400">
              {error}
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/blog')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/25"
              >
                Blog Sayfasına Dön
              </button>
            </div>
          </div>
        ) : post ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-sm"
          >
            <div className="mb-6">
              <Link
                href="/blog"
                className="flex items-center text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Blog Sayfasına Dön
              </Link>
            </div>

            <article>
              <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
              
              <div className="flex items-center text-sm text-gray-500 mb-8">
                <span>
                  {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="mx-2">•</span>
                <span>
                  {post.content.split(' ').length} kelime
                </span>
              </div>
              
              <div 
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={renderContent(post.content)} 
              />
            </article>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
} 