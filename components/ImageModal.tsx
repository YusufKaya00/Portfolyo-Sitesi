'use client';

import { useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

export default function ImageModal({ isOpen, onClose, imageUrl, alt }: ImageModalProps) {
  // Modal açıldığında konsola bilgi yazdır
  useEffect(() => {
    if (isOpen) {
      console.log('[ImageModal] Açılıyor, resim URL:', imageUrl);
      console.log('[ImageModal] Tipi:', typeof imageUrl);
      console.log('[ImageModal] Uzunluk:', imageUrl.length);
      
      // Modal açık olduğunda vücut kaydırmayı engelle
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, imageUrl]);

  // ESC tuşuna basınca modalı kapat
  useEffect(() => {
    const handleEscClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscClose);
    return () => window.removeEventListener('keydown', handleEscClose);
  }, [isOpen, onClose]);

  // Modal kapalıysa hiçbir şey gösterme
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[999999]" 
      onClick={onClose}
      style={{ 
        touchAction: 'none',
        userSelect: 'none'
      }}
    >
      <div 
        className="max-w-full max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[90vh] rounded-lg block mx-auto"
          style={{ objectFit: 'contain' }}
          onLoad={() => console.log('[ImageModal] Resim yüklendi:', imageUrl)}
          onError={() => console.error('[ImageModal] HATA! Resim yüklenemedi:', imageUrl)}
        />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white"
          aria-label="Kapat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
} 