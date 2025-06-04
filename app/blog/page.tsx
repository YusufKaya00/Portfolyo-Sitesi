'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  likes: string[];
}

// localStorage işlemlerini ayrı bir bileşene taşıyoruz
function LocalStorageHandler({ setUserIdCallback }: { setUserIdCallback: (userId: string) => void }) {
  useEffect(() => {
    // Geçici kullanıcı ID'si oluştur
    const storedUserId = localStorage.getItem('blogUserId');
    if (storedUserId) {
      setUserIdCallback(storedUserId);
    } else {
      const newUserId = Date.now().toString();
      localStorage.setItem('blogUserId', newUserId);
      setUserIdCallback(newUserId);
    }
  }, [setUserIdCallback]);
  
  return null;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await fetch('/api/blog/posts');
      
      if (!response.ok) {
        throw new Error('Blog yazıları yüklenemedi');
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (error: any) {
      console.error('Blog yazıları yüklenirken hata:', error);
      setError(error.message || 'Blog yazıları yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!userId) return;
    
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      
      const isLiked = post.likes?.includes(userId) ?? false;
      const method = isLiked ? 'DELETE' : 'POST';
      
      const response = await fetch(`/api/blog/posts/${postId}/likes`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error('Beğeni işlemi başarısız oldu');
      }
      
      // Client-side state güncellemesi
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          const currentLikes = post.likes || [];
          return {
            ...post,
            likes: isLiked
              ? currentLikes.filter(id => id !== userId)
              : [...currentLikes, userId]
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);
    } catch (error: any) {
      console.error('Beğeni işlemi sırasında hata:', error);
      setError('Beğeni işlemi başarısız oldu: ' + error.message);
    }
  };

  const isPostLiked = (post: BlogPost) => {
    return post.likes?.includes(userId || '') ?? false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={null}>
          <LocalStorageHandler setUserIdCallback={(id) => setUserId(id)} />
        </Suspense>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white">Blog Yazıları</h1>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-800 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl shadow-2xl overflow-hidden hover:shadow-indigo-500/10 transition-all duration-300 border border-gray-700 backdrop-blur-sm"
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 mb-4">{post.excerpt}</p>
                    <div className="text-sm text-gray-500">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="bg-gray-800/80 p-4 flex justify-between items-center border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center space-x-1 group"
                    >
                      <svg
                        className={`w-5 h-5 transition-colors ${
                          isPostLiked(post) ? 'text-red-500' : 'text-gray-500 group-hover:text-red-400'
                        }`}
                        fill={isPostLiked(post) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className={`text-sm ${isPostLiked(post) ? 'text-red-500' : 'text-gray-500 group-hover:text-red-400'}`}>
                        {post.likes?.length || 0}
                      </span>
                    </button>
                  </div>
                  <Link href={`/blog/${post.id}`} className="text-indigo-400 text-sm hover:text-indigo-300">
                    Devamını Oku →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 bg-gray-800/30 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm"
          >
            <svg
              className="w-16 h-16 text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="text-gray-300 text-lg mb-2">Henüz blog yazısı bulunmuyor.</p>
            <p className="text-gray-500 mb-6">Blog yazılarını Admin Paneli'nden ekleyebilirsiniz.</p>
            <Link
              href="/admin/blog"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/25"
            >
              Admin Paneline Git
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
} 