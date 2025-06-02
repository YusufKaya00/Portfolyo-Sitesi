'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';

interface NewUserModalProps {
  onClose: () => void;
  onSave: (user: User) => void;
}

// Sabit avatar URL'leri
const AVATAR_OPTIONS = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
  'https://i.pravatar.cc/150?img=6',
  'https://i.pravatar.cc/150?img=7',
  'https://i.pravatar.cc/150?img=8',
];

export default function NewUserModal({ onClose, onSave }: NewUserModalProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Lütfen bir kullanıcı adı girin.');
      return;
    }
    
    if (!selectedAvatar) {
      setError('Lütfen bir avatar seçin.');
      return;
    }
    
    // Yeni kullanıcı oluştur
    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      avatar: selectedAvatar
    };
    
    onSave(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Yeni Profil Oluştur</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Kullanıcı Adı */}
            <div className="mb-6">
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="userName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
                placeholder="Kullanıcı adınızı girin"
                required
              />
            </div>
            
            {/* Avatar Seçimi */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avatar Seçin
              </label>
              <div className="grid grid-cols-4 gap-3">
                {AVATAR_OPTIONS.map((avatar, index) => (
                  <div 
                    key={index}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`cursor-pointer relative rounded-lg overflow-hidden ${
                      selectedAvatar === avatar ? 'ring-2 ring-pink-500 dark:ring-pink-400' : ''
                    }`}
                  >
                    <img 
                      src={avatar} 
                      alt={`Avatar ${index + 1}`} 
                      className="w-full h-auto aspect-square object-cover"
                    />
                    {selectedAvatar === avatar && (
                      <div className="absolute bottom-1 right-1 bg-pink-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Hata Mesajı */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Butonlar */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Profil Oluştur
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
} 