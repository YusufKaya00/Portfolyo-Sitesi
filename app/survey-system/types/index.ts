// Anket/Form tipi
export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  isPublished: boolean;
  shareableLink?: string;
}

// Soru tipi
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Çoktan seçmeli veya derecelendirme için
  required: boolean;
}

// Soru tipleri
export enum QuestionType {
  MultipleChoice = 'multipleChoice',
  ShortAnswer = 'shortAnswer',
  Rating = 'rating'
}

// Cevap tipi
export interface Answer {
  questionId: string;
  value: string | number | string[]; // Soru tipine göre değişir
}

// Gönderim tipi
export interface Submission {
  id: string;
  surveyId: string;
  answers: Answer[];
  submittedAt: string;
}

// Analiz sonucu
export interface AnalysisResult {
  questionId: string;
  questionText: string;
  questionType: QuestionType;
  data: {
    labels: string[];
    values: number[];
    textResponses?: string[]; // Kısa yanıtlar için metin yanıtları 
  };
} 