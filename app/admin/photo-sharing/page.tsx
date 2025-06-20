'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  createdAt: string;
}

interface Photo {
  id: string;
  url: string;
  description: string;
  userId: string;
  eventId: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  id: string;
  photoId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export default function AdminPhotoSharingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchEvents();
    fetchAllPhotos();
  }, []);

  const fetchEvents = () => {
    try {
      setError(null);
      // Burada normalde bir API çağrısı yapılabilir
      // Şimdilik localStorage'dan okuyoruz
      const savedEvents = localStorage.getItem('photoSharingEvents');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      } else {
        // Örnek etkinlikler
        const defaultEvents: Event[] = [
          {
            id: '1',
            name: 'Proje Tanıtımı',
            description: 'Yeni projelerin tanıtımı için etkinlik',
            date: '2025-06-15',
            createdAt: new Date().toISOString(),
          },
        ];
        setEvents(defaultEvents);
        localStorage.setItem('photoSharingEvents', JSON.stringify(defaultEvents));
      }
    } catch (error: any) {
      console.error('Etkinlikler yüklenirken hata:', error);
      setError(error.message || 'Etkinlikler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPhotos = () => {
    try {
      setError(null);
      // Burada normalde bir API çağrısı yapılabilir
      // Şimdilik localStorage'dan okuyoruz
      const savedPhotos = localStorage.getItem('photoSharingPhotos');
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos));
      }
    } catch (error: any) {
      console.error('Fotoğraflar yüklenirken hata:', error);
      setError(error.message || 'Fotoğraflar yüklenemedi');
    }
  };

  const saveEvent = () => {
    if (!eventName || !eventDescription || !eventDate) return;

    setSaving(true);
    setError(null);
    try {
      // Yeni etkinlik oluştur
      const newEvent: Event = {
        id: Date.now().toString(),
        name: eventName,
        description: eventDescription,
        date: eventDate,
        createdAt: new Date().toISOString(),
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem('photoSharingEvents', JSON.stringify(updatedEvents));

      // Form temizle
      setEventName('');
      setEventDescription('');
      setEventDate('');
    } catch (error: any) {
      console.error('Etkinlik kaydedilirken hata:', error);
      setError(error.message || 'Etkinlik kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = (eventId: string) => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz? Bu etkinliğe bağlı tüm fotoğraflar da silinecektir.')) return;

    try {
      setError(null);
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem('photoSharingEvents', JSON.stringify(updatedEvents));

      // Bu etkinliğe bağlı fotoğrafları sil
      const updatedPhotos = photos.filter(photo => photo.eventId !== eventId);
      setPhotos(updatedPhotos);
      localStorage.setItem('photoSharingPhotos', JSON.stringify(updatedPhotos));
    } catch (error: any) {
      console.error('Etkinlik silinirken hata:', error);
      setError(error.message || 'Etkinlik silinemedi');
    }
  };

  const deleteSelectedPhotos = () => {
    if (selectedPhotos.length === 0) return;
    if (!confirm(`Seçilen ${selectedPhotos.length} fotoğrafı silmek istediğinizden emin misiniz?`)) return;

    try {
      setError(null);
      const updatedPhotos = photos.filter(photo => !selectedPhotos.includes(photo.id));
      setPhotos(updatedPhotos);
      localStorage.setItem('photoSharingPhotos', JSON.stringify(updatedPhotos));
      setSelectedPhotos([]);
    } catch (error: any) {
      console.error('Fotoğraflar silinirken hata:', error);
      setError(error.message || 'Fotoğraflar silinemedi');
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const filteredPhotos = selectedEvent
    ? photos.filter(photo => photo.eventId === selectedEvent)
    : photos;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">Fotoğraf Paylaşım Yönetimi</h1>
            <p className="text-gray-400">Etkinlikleri ve kullanıcı fotoğraflarını yönetin.</p>
          </motion.div>
          <Link href="/admin" className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300">
            Geri Dön
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-800 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Etkinlik oluşturma formu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Yeni Etkinlik Ekle</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Etkinlik Adı
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Örn: Proje Tanıtımı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Etkinlik Açıklaması
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Etkinlik hakkında kısa bir açıklama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Etkinlik Tarihi
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={saveEvent}
                  disabled={!eventName || !eventDescription || !eventDate || saving}
                  className={`px-6 py-3 rounded-lg text-white font-medium ${
                    !eventName || !eventDescription || !eventDate || saving
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
                  } transition-all duration-300 shadow-lg shadow-pink-500/25 flex items-center space-x-2`}
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Etkinlik Ekle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Etkinlik listesi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Etkinlikler</h2>
              <div className="text-sm text-pink-400">
                Toplam: {events.length}
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : events.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`bg-gray-700/50 rounded-xl p-4 border transition-all duration-300 
                      ${selectedEvent === event.id 
                        ? 'border-pink-500 shadow-lg shadow-pink-500/20' 
                        : 'border-gray-600 hover:border-pink-400'}`}
                  >
                    <div className="flex justify-between">
                      <h3 
                        className="text-lg font-semibold text-white mb-2 cursor-pointer"
                        onClick={() => setSelectedEvent(event.id !== selectedEvent ? event.id : null)}
                      >
                        {event.name}
                      </h3>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">{new Date(event.date).toLocaleDateString('tr-TR')}</span>
                      <span className="text-pink-400">{photos.filter(p => p.eventId === event.id).length} fotoğraf</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-800/30 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-300 text-lg mb-2">Henüz etkinlik bulunmuyor.</p>
                <p className="text-gray-500">İlk etkinliğinizi ekleyin.</p>
              </div>
            )}
          </motion.div>

          {/* Fotoğraf yönetimi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedEvent 
                  ? `${events.find(e => e.id === selectedEvent)?.name} Fotoğrafları` 
                  : 'Tüm Fotoğraflar'}
              </h2>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-pink-400">
                  Toplam: {filteredPhotos.length}
                </div>
                {selectedPhotos.length > 0 && (
                  <button
                    onClick={deleteSelectedPhotos}
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Seçilenleri Sil ({selectedPhotos.length})</span>
                  </button>
                )}
              </div>
            </div>
            
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`relative rounded-lg overflow-hidden border-2 group 
                      ${selectedPhotos.includes(photo.id) 
                        ? 'border-pink-500' 
                        : 'border-transparent hover:border-pink-400'}`}
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedPhotos.includes(photo.id)}
                        onChange={() => togglePhotoSelection(photo.id)}
                        className="h-5 w-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                      />
                    </div>
                    <img
                      src={photo.url}
                      alt={photo.description}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2 bg-gray-800/80 text-xs">
                      <p className="text-white truncate">{photo.description || 'Açıklama yok'}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-pink-400">{photo.likes.length} beğeni</span>
                        <span className="text-gray-400">{photo.comments.length} yorum</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-800/30 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-sm">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-300 text-lg mb-2">
                  {selectedEvent ? 'Bu etkinlikte henüz fotoğraf yok' : 'Henüz fotoğraf yüklenmemiş'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 