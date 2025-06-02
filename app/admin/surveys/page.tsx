'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

// Anket ve cevap tipleri
interface Question {
  id: string;
  text: string;
  type: string;
  options?: string[];
  required: boolean;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  isPublished: boolean;
  shareableLink: string;
}

interface Answer {
  questionId: string;
  value: any;
}

interface Submission {
  id: string;
  surveyId: string;
  answers: Answer[];
  submittedAt: string;
}

export default function AdminSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSurvey, setExpandedSurvey] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);

  // LocalStorage'dan verileri yükleme
  useEffect(() => {
    setLoading(true);
    try {
      const savedSurveys = localStorage.getItem('surveySystemSurveys');
      const savedSubmissions = localStorage.getItem('surveySystemSubmissions');
      
      if (savedSurveys) {
        setSurveys(JSON.parse(savedSurveys));
      }
      
      if (savedSubmissions) {
        setSubmissions(JSON.parse(savedSubmissions));
      }
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Anket güncelleme
  const handleUpdateSurvey = (updatedSurvey: Survey) => {
    const updatedSurveys = surveys.map(survey => 
      survey.id === updatedSurvey.id ? updatedSurvey : survey
    );
    
    setSurveys(updatedSurveys);
    localStorage.setItem('surveySystemSurveys', JSON.stringify(updatedSurveys));
    setEditingSurvey(null);
  };

  // Anket silme
  const handleDeleteSurvey = (surveyId: string) => {
    // Anketi sil
    const updatedSurveys = surveys.filter(survey => survey.id !== surveyId);
    setSurveys(updatedSurveys);
    localStorage.setItem('surveySystemSurveys', JSON.stringify(updatedSurveys));
    
    // İlgili cevapları da sil
    const updatedSubmissions = submissions.filter(submission => submission.surveyId !== surveyId);
    setSubmissions(updatedSubmissions);
    localStorage.setItem('surveySystemSubmissions', JSON.stringify(updatedSubmissions));
    
    setConfirmDelete(null);
  };

  // Anket detayları göster/gizle
  const toggleSurveyDetails = (surveyId: string) => {
    setExpandedSurvey(expandedSurvey === surveyId ? null : surveyId);
  };

  // Soru sayısını ve türlerini özetleme
  const getSurveyStats = (survey: Survey) => {
    const questionTypes = survey.questions.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalQuestions: survey.questions.length,
      types: questionTypes,
    };
  };

  // Cevap sayısını alma
  const getResponseCount = (surveyId: string) => {
    return submissions.filter(submission => submission.surveyId === surveyId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Anket Yönetimi</h1>
          <p className="text-gray-400 flex items-center">
            <Link href="/admin" className="text-indigo-400 hover:text-indigo-300 inline-flex items-center mr-2">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Admin Paneline Dön
            </Link>
            <span className="text-gray-600">|</span>
            <span className="ml-2">Anketleri düzenleyin, silin ve yönetin</span>
          </p>
        </motion.div>

        {/* Yükleniyor */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Anket listesi */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Tüm Anketler</h2>

            {surveys.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="text-gray-400">Henüz hiç anket yok.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {surveys.map((survey) => {
                  const stats = getSurveyStats(survey);
                  const responseCount = getResponseCount(survey.id);
                  const isExpanded = expandedSurvey === survey.id;
                  
                  return (
                    <div 
                      key={survey.id}
                      className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden"
                    >
                      {/* Anket başlığı ve özeti */}
                      <div 
                        onClick={() => toggleSurveyDetails(survey.id)}
                        className="p-4 cursor-pointer hover:bg-gray-750 transition-colors flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-lg font-medium text-white flex items-center">
                            {survey.title}
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${survey.isPublished ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                              {survey.isPublished ? 'Yayında' : 'Taslak'}
                            </span>
                          </h3>
                          <p className="text-sm text-gray-400">
                            {formatDistanceToNow(new Date(survey.createdAt), { addSuffix: true, locale: tr })} oluşturuldu • {stats.totalQuestions} soru • {responseCount} yanıt
                          </p>
                        </div>
                        <div className="flex items-center">
                          <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Anket detayları ve işlemler */}
                      {isExpanded && (
                        <div className="p-4 border-t border-gray-700 bg-gray-800/60">
                          <p className="text-gray-300 mb-4">{survey.description}</p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {Object.entries(stats.types).map(([type, count]) => (
                              <span key={type} className="text-xs px-2 py-1 rounded-full bg-indigo-900/40 text-indigo-400">
                                {count}x {type === 'multipleChoice' ? 'Çoktan Seçmeli' : type === 'shortAnswer' ? 'Kısa Yanıt' : 'Derecelendirme'}
                              </span>
                            ))}
                          </div>

                          {/* Sorular */}
                          <div className="mt-4 mb-6 space-y-3">
                            <h4 className="text-sm font-semibold text-white">Sorular:</h4>
                            {survey.questions.map((question, index) => (
                              <div key={question.id} className="pl-4 border-l-2 border-gray-700">
                                <p className="text-gray-300 text-sm">{index + 1}. {question.text}</p>
                                <p className="text-xs text-gray-500">
                                  {question.type === 'multipleChoice' ? 'Çoktan Seçmeli' : 
                                   question.type === 'shortAnswer' ? 'Kısa Yanıt' : 'Derecelendirme'} •
                                  {question.required ? ' Zorunlu' : ' İsteğe Bağlı'}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* İşlem butonları */}
                          {confirmDelete === survey.id ? (
                            <div className="flex items-center space-x-3 mt-4">
                              <span className="text-red-400 mr-2">Bu anketi silmek istediğinizden emin misiniz?</span>
                              <button 
                                onClick={() => handleDeleteSurvey(survey.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
                              >
                                Evet, Sil
                              </button>
                              <button 
                                onClick={() => setConfirmDelete(null)}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 text-sm rounded"
                              >
                                İptal
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2 mt-4">
                              <Link 
                                href={`/survey-system?id=${survey.id}`}
                                target="_blank"
                                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Görüntüle
                              </Link>
                              <button
                                onClick={() => {
                                  const updatedSurvey = {
                                    ...survey,
                                    isPublished: !survey.isPublished
                                  };
                                  handleUpdateSurvey(updatedSurvey);
                                }}
                                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-sm rounded"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                {survey.isPublished ? 'Taslağa Çevir' : 'Yayınla'}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(survey.id)}
                                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-sm rounded"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Sil
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
} 