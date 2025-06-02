'use client';

import React, { useState } from 'react';
import { Photo, User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoCardProps {
  photo: Photo;
  currentUser: User | null;
  users: User[];
  onLike: (photoId: string) => void;
  onComment: (photoId: string, text: string) => void;
  onDownload: () => void;
}

export default function PhotoCard({ photo, currentUser, users, onLike, onComment, onDownload }: PhotoCardProps) {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showEnlarged, setShowEnlarged] = useState(false);
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    onComment(photo.id, comment);
    setComment('');
  };
  
  const isLiked = currentUser && photo.likes.includes(currentUser.id);
  
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Bilinmeyen Kullanıcı';
  };
  
  const getUserAvatar = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.avatar : 'https://i.pravatar.cc/150?img=0';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="relative">
          <img 
            src={photo.url} 
            alt={photo.description} 
            className="w-full h-64 object-cover"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          {/* Beğeni butonu */}
          <button
            onClick={() => onLike(photo.id)}
            className={`absolute top-3 right-3 p-2 rounded-full ${
              isLiked 
                ? 'text-white bg-red-500 hover:bg-red-600' 
                : 'text-gray-600 bg-white/80 hover:bg-white'
            } transition-colors shadow-md z-10`}
          >
            <svg 
              className="w-5 h-5"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
          
          {/* Text info on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg font-semibold mb-1">
              {photo.description.length > 30 ? `${photo.description.substring(0, 30)}...` : photo.description}
            </h3>
            <p className="text-sm text-gray-200 flex items-center">
              {photo.tags.map((tag, index) => 
                index < 2 && <span key={tag} className="mr-2">#{tag}</span>
              )}
              <span className="ml-auto">{formatDate(photo.createdAt)}</span>
            </p>
          </div>
        </div>
        
        <div className="p-4">
          {/* Değerlendirme ve yorumlar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <svg 
                className="w-5 h-5 text-red-500 mr-1"
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {photo.likes.length} beğeni
              </span>
            </div>
            
            {photo.comments.length > 0 && (
              <button 
                onClick={() => setShowComments(!showComments)} 
                className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
              >
                {showComments ? 'Yorumları Gizle' : `${photo.comments.length} Yorum`}
              </button>
            )}
          </div>
          
          {/* Detay görüntüleme butonu */}
          <button
            onClick={() => setShowEnlarged(true)}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Detayları Görüntüle
          </button>
        </div>
        
        {/* Yorumlar bölümü */}
        {showComments && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
              Yorumlar
            </h4>
            
            <div className="space-y-3 mb-3 max-h-40 overflow-y-auto">
              {photo.comments.length > 0 ? (
                photo.comments.map(comment => (
                  <div key={comment.id} className="flex space-x-2">
                    <img 
                      src={getUserAvatar(comment.userId)} 
                      alt={getUserName(comment.userId)} 
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                        <p className="text-xs font-medium text-gray-800 dark:text-white">
                          {getUserName(comment.userId)}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {comment.text}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                  Henüz yorum yapılmamış
                </p>
              )}
            </div>
            
            <form onSubmit={handleSubmitComment} className="flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Yorum yaz..."
                className="flex-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                disabled={!currentUser}
              />
              <button
                type="submit"
                disabled={!comment.trim() || !currentUser}
                className={`px-3 py-1 rounded-lg text-white text-sm ${
                  !comment.trim() || !currentUser
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-pink-600 hover:bg-pink-700'
                } transition-colors`}
              >
                Gönder
              </button>
            </form>
          </div>
        )}
      </motion.div>
      
      {/* Enlarged Image Modal */}
      <AnimatePresence>
        {showEnlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEnlarged(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 p-2 bg-gray-800/70 hover:bg-gray-800/90 text-white rounded-full z-10"
                onClick={() => setShowEnlarged(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="relative">
                <img 
                  src={photo.url} 
                  alt={photo.description} 
                  className="w-full max-h-[70vh] object-contain"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <img 
                    src={getUserAvatar(photo.userId)} 
                    alt={getUserName(photo.userId)} 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {getUserName(photo.userId)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(photo.createdAt)}
                    </p>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {photo.description}
                </h2>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {photo.tags.map(tag => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => onLike(photo.id)}
                    className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                  >
                    <svg 
                      className={`w-6 h-6 ${isLiked ? 'text-pink-600 dark:text-pink-500 fill-current' : ''}`}
                      fill={isLiked ? "currentColor" : "none"}
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
                    <span>{photo.likes.length} beğeni</span>
                  </button>
                  
                  <button
                    onClick={onDownload}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    İndir
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 