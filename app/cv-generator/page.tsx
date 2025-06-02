'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import OpenAI from 'openai';

// Form veri tipleri
type Experience = {
  position: string;
  company: string;
  period: string;
  details: string;
};

type Education = {
  degree: string;
  school: string;
  period: string;
  gpa: string;
};

type Skill = {
  category: string;
  level: string;
};

type Language = {
  name: string;
  level: string;
};

type Link = {
  name: string;
  url: string;
};

type Project = {
  name: string;
  description: string;
  tags: string;
};

type FormData = {
  fullName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  links: Link[];
  projects: Project[];
};

export default function CVGenerator() {
  // State for user inputs
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    experience: [{ position: '', company: '', period: '', details: '' }],
    education: [{ degree: '', school: '', period: '', gpa: '' }],
    skills: [{ category: '', level: '' }],
    languages: [{ name: '', level: '' }],
    links: [{ name: '', url: '' }],
    projects: [{ name: '', description: '', tags: '' }]
  });

  // Şablon seçimi için state
  const [selectedTemplate, setSelectedTemplate] = useState<'classic' | 'modern' | 'minimal' | 'minimal-text' | 'portfolio' | 'portfolio-text' | 'minimal-noexp'>('classic');

  // State for AI prompt
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reference to the CV container for PDF generation
  const cvRef = useRef<HTMLDivElement>(null);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: keyof FormData,
    index?: number,
    field?: string
  ) => {
    const { name, value } = e.target;

    if (section && index !== undefined && field) {
      // For nested objects like experience, education, skills
      setFormData(prev => {
        const updatedSection = [...prev[section] as any[]];
        updatedSection[index] = { 
          ...updatedSection[index], 
          [field]: value 
        };
        return { ...prev, [section]: updatedSection };
      });
    } else {
      // For top-level fields
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Add new item to a section array
  const addItem = (section: keyof FormData, template: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev[section] as any[]), template]
    }));
  };

  // Remove an item from a section array
  const removeItem = (section: keyof FormData, index: number) => {
    const sectionArray = formData[section] as any[];
    if (sectionArray.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i: number) => i !== index)
    }));
  };

  // Generate PDF from the CV container
  const generatePDF = async () => {
    if (cvRef.current) {
      try {
        // Create a deep clone of the CV container to modify it without affecting the UI
        const clonedCv = cvRef.current.cloneNode(true) as HTMLElement;
        
        // Boyutunu A4 kağıdına uygun ayarla
        clonedCv.style.width = '210mm';
        clonedCv.style.minHeight = '297mm';
        clonedCv.style.padding = '10mm';
        clonedCv.style.boxSizing = 'border-box';
        
        // Apply a style reset to remove Tailwind's oklch colors
        const resetStyles = document.createElement('style');
        resetStyles.textContent = `
          /* Basic reset for PDF generation */
          * {
            font-family: 'Arial', sans-serif !important;
          }
          
          /* Replace common color classes with hex values */
          .bg-indigo-600, [class*="bg-indigo"] { background-color: #4f46e5 !important; }
          .text-indigo-600, [class*="text-indigo"] { color: #4f46e5 !important; }
          .border-indigo-600, [class*="border-indigo"] { border-color: #4f46e5 !important; }
          
          .bg-blue-600, [class*="bg-blue"] { background-color: #2563eb !important; }
          .text-blue-600, [class*="text-blue"] { color: #2563eb !important; }
          .border-blue-600, [class*="border-blue"] { border-color: #2563eb !important; }
          
          .bg-purple-600, [class*="bg-purple"] { background-color: #9333ea !important; }
          .text-purple-600, [class*="text-purple"] { color: #9333ea !important; }
          .border-purple-600, [class*="border-purple"] { border-color: #9333ea !important; }
          
          .bg-gray-900, [class*="bg-gray"] { background-color: #111827 !important; }
          .text-gray-900, [class*="text-gray"] { color: #111827 !important; }
          .border-gray-900, [class*="border-gray"] { border-color: #111827 !important; }
          
          .bg-white { background-color: #ffffff !important; }
          .text-white { color: #ffffff !important; }
          
          .bg-black { background-color: #000000 !important; }
          .text-black { color: #000000 !important; }
          
          /* Adjust font sizes for better visibility */
          h1 { font-size: 24pt !important; font-weight: bold !important; }
          h2 { font-size: 18pt !important; font-weight: bold !important; }
          h3 { font-size: 14pt !important; font-weight: bold !important; }
          p, div { font-size: 10pt !important; }
          
          /* Adjust layout for full page */
          .p-8 { padding: 10mm !important; }
          
          /* Ensure content fills the page */
          .min-h-\\[297mm\\] {
            min-height: 277mm !important; /* 297mm - 20mm for padding */
          }
          
          /* Font style fixes */
          * {
            text-rendering: geometricPrecision !important;
            -webkit-font-smoothing: antialiased !important;
          }
          
          /* Fix line heights */
          p, div { line-height: 1.5 !important; }
          h1, h2, h3 { line-height: 1.3 !important; }
          
          /* Make full width elements actually full width */
          .w-full { width: 100% !important; }
          
          /* Force elements to display correctly */
          div { display: block !important; }
          
          /* Set correct margins/spacing */
          body { margin: 0 !important; }
          
          /* Optimize spacing */
          .mb-1, .my-1, .m-1 { margin-bottom: 0.25rem !important; }
          .mb-2, .my-2, .m-2 { margin-bottom: 0.5rem !important; }
          .mb-3, .my-3, .m-3 { margin-bottom: 0.75rem !important; }
          .mb-4, .my-4, .m-4 { margin-bottom: 1rem !important; }
          
          .mt-1, .my-1, .m-1 { margin-top: 0.25rem !important; }
          .mt-2, .my-2, .m-2 { margin-top: 0.5rem !important; }
          .mt-3, .my-3, .m-3 { margin-top: 0.75rem !important; }
          .mt-4, .my-4, .m-4 { margin-top: 1rem !important; }

          /* Modern şablon için grid düzeltmeleri */
          .grid-cols-12 { 
            display: grid !important;
            grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
          }
          
          .gap-8 {
            gap: 2rem !important;
          }
          
          .col-span-8 {
            grid-column: span 8 / span 8 !important;
          }
          
          .col-span-4 {
            grid-column: span 4 / span 4 !important;
          }
          
          /* Portfolio şablonu için gerekli stiller */
          .portfolio-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }
          
          .portfolio-item {
            border: 1px solid #e5e7eb !important;
            border-radius: 0.5rem !important;
            padding: 1rem !important;
            margin-bottom: 1rem !important;
          }
          
          .portfolio-title {
            font-weight: bold !important;
            font-size: 14pt !important;
            margin-bottom: 0.5rem !important;
          }
          
          .tag {
            display: inline-block !important;
            background-color: #f3f4f6 !important;
            color: #4b5563 !important;
            padding: 0.25rem 0.5rem !important;
            border-radius: 9999px !important;
            font-size: 8pt !important;
            margin-right: 0.5rem !important;
            margin-bottom: 0.5rem !important;
          }
        `;
        
        // Create a temporary container for rendering
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '210mm'; // A4 width
        tempContainer.style.height = '297mm'; // A4 height
        tempContainer.appendChild(resetStyles);
        tempContainer.appendChild(clonedCv);
        document.body.appendChild(tempContainer);
        
        try {
          // Daha yüksek kalite için ölçek faktörünü artır
          const scaleFactor = 2.5; // Yüksek kalite için
          
          // Use html2canvas with specific settings to bypass color function issues
          const canvas = await html2canvas(clonedCv, {
            scale: scaleFactor,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false, // Disable logging
            width: 210 * 3.779527559, // A4 genişliği piksel (mm to px)
            height: 297 * 3.779527559, // A4 yüksekliği piksel (mm to px)
            windowWidth: 210 * 3.779527559,
            windowHeight: 297 * 3.779527559,
            onclone: (doc) => {
              // Force all elements to use standard colors
              const allElements = doc.querySelectorAll('*');
              allElements.forEach(el => {
                if (el instanceof HTMLElement) {
                  const computedStyle = getComputedStyle(el);
                  const bgColor = computedStyle.backgroundColor;
                  const textColor = computedStyle.color;
                  
                  // Apply computed colors directly as inline styles
                  if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
                    el.style.backgroundColor = bgColor;
                  }
                  
                  if (textColor) {
                    el.style.color = textColor;
                  }
                  
                  // CV içeriğinde boşlukları optimize et
                  if (el.tagName === 'DIV' && el.classList.contains('mb-6')) {
                    el.style.marginBottom = '12px';
                  }
                  
                  // Optimize heading sizes
                  if (el.tagName === 'H1') {
                    el.style.fontSize = '24pt';
                    el.style.fontWeight = 'bold';
                  } else if (el.tagName === 'H2') {
                    el.style.fontSize = '18pt';
                    el.style.fontWeight = 'bold';
                  } else if (el.tagName === 'H3') {
                    el.style.fontSize = '14pt';
                    el.style.fontWeight = 'bold';
                  }
                }
              });
              
              // CV container'ını düzenle
              const pdfContainer = doc.querySelector('[ref="cvRef"]');
              if (pdfContainer && pdfContainer instanceof HTMLElement) {
                pdfContainer.style.width = '190mm'; // A4 - margins
                pdfContainer.style.minHeight = '277mm'; // A4 - margins
                pdfContainer.style.padding = '10mm';
                pdfContainer.style.backgroundColor = '#ffffff';
                pdfContainer.style.overflow = 'visible';
                pdfContainer.style.boxSizing = 'border-box';
              }
            }
          });
          
          // Create PDF with the canvas
          const imgData = canvas.toDataURL('image/png', 1.0); // Tam kalite
          
          // PDF oluştur
          const pdf = new jspdf({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
          });
          
          // A4 boyutu (mm olarak)
          const pdfWidth = 210;
          const pdfHeight = 297;
          
          // PDF'in tam boyutuna ayarla
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          
          // Download the PDF
          pdf.save(`${formData.fullName || 'cv'}.pdf`);
        } finally {
          // Always clean up the temporary container
          if (tempContainer && tempContainer.parentNode) {
            tempContainer.parentNode.removeChild(tempContainer);
          }
        }
      } catch (error) {
        console.error('PDF generation failed:', error);
        alert('PDF oluşturulurken bir hata oluştu. Lütfen tarayıcı konsolunu kontrol edin.');
      }
    }
  };

  // Generate CV using Qwen AI
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/cv-ai-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      if (data.cv) {
        setFormData(data.cv);
      } else {
        throw new Error('CV data not found in response');
      }
    } catch (error) {
      console.error('AI CV generation failed:', error);
      alert('CV oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-4">CV Oluşturucu</h1>
          <p className="text-xl text-gray-300">
            Profesyonel, metin tabanlı CV'nizi kolayca oluşturun
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6 shadow-xl"
          >
            <h2 className="text-2xl font-semibold mb-6 text-white">Bilgileri Girin</h2>

            {/* AI Generator */}
            <div className="mb-8 border border-gray-700 rounded-lg p-4 bg-gray-900">
              <h3 className="text-xl font-medium mb-3 text-indigo-400">Gemini AI ile Otomatik Oluşturma</h3>
              <div className="mb-4">
                <label htmlFor="aiPrompt" className="block text-sm font-medium text-gray-300 mb-1">
                  Deneyimleriniz hakkında birkaç cümle yazın:
                </label>
                <textarea
                  id="aiPrompt"
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Yazılım mühendisiyim, 5 yıl deneyimim var, React ve Node.js ile çalışıyorum..."
                />
              </div>
              <button
                onClick={generateWithAI}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    İşleniyor...
                  </span>
                ) : "AI ile Otomatik Doldur"}
              </button>
            </div>

            {/* Form fields */}
            <div className="space-y-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-white">Kişisel Bilgiler</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                      Ünvan
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                      Konum
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="İstanbul, Türkiye"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="ornek@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Telefon
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="+90 555 123 4567"
                    />
                  </div>
                </div>
              </div>
              
              {/* Experience Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-white">İş Deneyimi</h3>
                  <button
                    onClick={() => addItem('experience', { position: '', company: '', period: '', details: '' })}
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Deneyim Ekle
                  </button>
                </div>
                
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-900 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                      {formData.experience.length > 1 && (
                        <button
                          onClick={() => removeItem('experience', index)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Kaldır
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Pozisyon
                        </label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleInputChange(e, 'experience', index, 'position')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Şirket
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleInputChange(e, 'experience', index, 'company')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Dönem
                        </label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => handleInputChange(e, 'experience', index, 'period')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Eki 2019 - Günümüz"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Detaylar
                      </label>
                      <textarea
                        rows={3}
                        value={exp.details}
                        onChange={(e) => handleInputChange(e, 'experience', index, 'details')}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Bu pozisyondaki görev ve başarılarınız..."
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Education Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-white">Eğitim</h3>
                  <button
                    onClick={() => addItem('education', { degree: '', school: '', period: '', gpa: '' })}
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Eğitim Ekle
                  </button>
                </div>
                
                {formData.education.map((edu, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-900 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                      {formData.education.length > 1 && (
                        <button
                          onClick={() => removeItem('education', index)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Kaldır
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Derece
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleInputChange(e, 'education', index, 'degree')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Okul
                        </label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => handleInputChange(e, 'education', index, 'school')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Dönem
                        </label>
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => handleInputChange(e, 'education', index, 'period')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="2015 - 2019"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Not Ortalaması
                        </label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => handleInputChange(e, 'education', index, 'gpa')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="3.8/4.0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Skills Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-white">Beceriler</h3>
                  <button
                    onClick={() => addItem('skills', { category: '', level: '' })}
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Beceri Ekle
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-3 bg-gray-900 flex justify-between items-center">
                      <div className="space-y-2 w-full">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                          {formData.skills.length > 1 && (
                            <button
                              onClick={() => removeItem('skills', index)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Kaldır
                            </button>
                          )}
                        </div>
                        
                        <input
                          type="text"
                          value={skill.category}
                          onChange={(e) => handleInputChange(e, 'skills', index, 'category')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Beceri adı"
                        />
                        
                        <input
                          type="text"
                          value={skill.level}
                          onChange={(e) => handleInputChange(e, 'skills', index, 'level')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Deneyimli, Başlangıç, vb."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-white">Diller</h3>
                  <button
                    onClick={() => addItem('languages', { name: '', level: '' })}
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Dil Ekle
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.languages.map((language, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-3 bg-gray-900 flex justify-between items-center">
                      <div className="space-y-2 w-full">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                          {formData.languages.length > 1 && (
                            <button
                              onClick={() => removeItem('languages', index)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Kaldır
                            </button>
                          )}
                        </div>
                        
                        <input
                          type="text"
                          value={language.name}
                          onChange={(e) => handleInputChange(e, 'languages', index, 'name')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="İngilizce, Türkçe, vb."
                        />
                        
                        <input
                          type="text"
                          value={language.level}
                          onChange={(e) => handleInputChange(e, 'languages', index, 'level')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Akıcı, Orta, Başlangıç"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-medium text-white">Bağlantılar</h3>
                  <button
                    onClick={() => addItem('links', { name: '', url: '' })}
                    className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Bağlantı Ekle
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.links.map((link, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-3 bg-gray-900 flex justify-between items-center">
                      <div className="space-y-2 w-full">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                          {formData.links.length > 1 && (
                            <button
                              onClick={() => removeItem('links', index)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Kaldır
                            </button>
                          )}
                        </div>
                        
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => handleInputChange(e, 'links', index, 'name')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="LinkedIn, Github, vb."
                        />
                        
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleInputChange(e, 'links', index, 'url')}
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projeler Bölümü - Portfolio şablonu seçildiğinde görünür */}
              {(selectedTemplate === 'portfolio' || selectedTemplate === 'portfolio-text' || selectedTemplate === 'minimal-noexp' || selectedTemplate === 'minimal-text') && (
                <div className="space-y-4 mt-6 pt-6 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-medium text-white">Projelerim</h3>
                    <button
                      onClick={() => addItem('projects', { name: '', description: '', tags: '' })}
                      className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Proje Ekle
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {formData.projects.map((project, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-900 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-400">Proje #{index + 1}</span>
                          {formData.projects.length > 1 && (
                            <button
                              onClick={() => removeItem('projects', index)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Kaldır
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Proje Adı
                            </label>
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => handleInputChange(e, 'projects', index, 'name')}
                              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Projenin adı"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Açıklama
                            </label>
                            <textarea
                              rows={3}
                              value={project.description}
                              onChange={(e) => handleInputChange(e, 'projects', index, 'description')}
                              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="Proje hakkında kısa açıklama"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Etiketler
                            </label>
                            <input
                              type="text"
                              value={project.tags}
                              onChange={(e) => handleInputChange(e, 'projects', index, 'tags')}
                              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder="React, TypeScript, Node.js (virgülle ayırın)"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* CV Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col"
          >
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl mb-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Önizleme</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex flex-wrap space-x-2 mr-4">
                    <button 
                      onClick={() => setSelectedTemplate('classic')}
                      className={`px-3 py-1 mb-2 rounded-md text-sm font-medium ${
                        selectedTemplate === 'classic' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Klasik
                    </button>
                    <button 
                      onClick={() => setSelectedTemplate('modern')}
                      className={`px-3 py-1 mb-2 rounded-md text-sm font-medium ${
                        selectedTemplate === 'modern' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Modern
                    </button>
                    <button 
                      onClick={() => setSelectedTemplate('minimal')}
                      className={`px-3 py-1 mb-2 rounded-md text-sm font-medium ${
                        selectedTemplate === 'minimal' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Minimal
                    </button>
                    <button 
                      onClick={() => setSelectedTemplate('minimal-text')}
                      className={`px-3 py-1 mb-2 rounded-md text-sm font-medium ${
                        selectedTemplate === 'minimal-text' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Minimal Text
                    </button>
                    <button 
                      onClick={() => setSelectedTemplate('portfolio')}
                      className={`px-3 py-1 mb-2 rounded-md text-sm font-medium ${
                        selectedTemplate === 'portfolio' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Portfolio
                    </button>
                    <button 
                      onClick={() => setSelectedTemplate('portfolio-text')}
                      className={`px-3 py-1 mb-2 rounded-md text-sm font-medium ${
                        selectedTemplate === 'portfolio-text' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Portfolio Text
                    </button>
                  </div>
                  
                  <button
                    onClick={generatePDF}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    PDF İndir
                  </button>
                </div>
              </div>
              
              <div 
                ref={cvRef} 
                className="bg-white text-black font-serif p-8 rounded-md shadow-lg min-h-[297mm] max-w-[210mm] mx-auto overflow-hidden"
                style={{ maxHeight: '80vh', overflowY: 'auto' }}
              >
                {selectedTemplate === 'classic' && (
                  <div className="p-6 font-sans">
                    <div className="mb-6 border-b pb-6">
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">{formData.fullName || 'Ad Soyad'}</h1>
                      <p className="text-lg text-gray-700 mb-2">{formData.title || 'Pozisyon'}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {formData.location && <div>{formData.location}</div>}
                        {formData.email && <div>{formData.email}</div>}
                        {formData.phone && <div>{formData.phone}</div>}
                        {formData.links.map((link, index) => (
                          <div key={index}>{link.name}: {link.url}</div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Experience Section */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-4">İş Deneyimi</h2>
                      {formData.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between">
                            <div className="font-semibold">{exp.position || 'Pozisyon'}</div>
                            <div className="text-gray-600">{exp.period || 'Dönem'}</div>
                          </div>
                          <div className="text-gray-800 mb-1">{exp.company || 'Şirket'}</div>
                          <div className="text-sm text-gray-700 whitespace-pre-line">
                            {exp.details || 'Detaylar...'}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Education Section */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-4">Eğitim</h2>
                      {formData.education.map((edu, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between">
                            <div className="font-semibold">{edu.degree || 'Derece'}</div>
                            <div className="text-gray-600">{edu.period || 'Dönem'}</div>
                          </div>
                          <div className="text-gray-800 mb-1">{edu.school || 'Okul'}</div>
                          {edu.gpa && <div className="text-sm text-gray-700">Not: {edu.gpa}</div>}
                        </div>
                      ))}
                    </div>
                    
                    {/* Skills Section */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-4">Beceriler</h2>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.skills.map((skill, index) => (
                          <div key={index} className="mb-1">
                            <span className="font-medium">{skill.category || 'Beceri'}: </span>
                            <span className="text-gray-700">{skill.level || 'Seviye'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Languages Section */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-4">Diller</h2>
                      <div className="grid grid-cols-2 gap-2">
                        {formData.languages.map((language, index) => (
                          <div key={index} className="mb-1">
                            <span className="font-medium">{language.name || 'Dil'}: </span>
                            <span className="text-gray-700">{language.level || 'Seviye'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTemplate === 'modern' && (
                  <div className="font-sans">
                    <div className="bg-indigo-600 text-white p-8">
                      <h1 className="text-3xl font-bold mb-2">{formData.fullName || 'Ad Soyad'}</h1>
                      <p className="text-xl mb-4">{formData.title || 'Pozisyon'}</p>
                      <div className="flex flex-wrap gap-6 text-sm">
                        {formData.location && <div className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {formData.location}</div>}
                        {formData.email && <div className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> {formData.email}</div>}
                        {formData.phone && <div className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> {formData.phone}</div>}
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-8">
                          {/* Experience */}
                          <div className="mb-8">
                            <h2 className="text-lg font-bold text-indigo-600 border-b border-indigo-200 pb-2 mb-4">İŞ DENEYİMİ</h2>
                            {formData.experience.map((exp, index) => (
                              <div key={index} className="mb-5">
                                <h3 className="font-bold text-gray-800">{exp.position || 'Pozisyon'}</h3>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <div>{exp.company || 'Şirket'}</div>
                                  <div>{exp.period || 'Dönem'}</div>
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-line">{exp.details || 'Detaylar...'}</p>
                              </div>
                            ))}
                          </div>
                          
                          {/* Education */}
                          <div className="mb-8">
                            <h2 className="text-lg font-bold text-indigo-600 border-b border-indigo-200 pb-2 mb-4">EĞİTİM</h2>
                            {formData.education.map((edu, index) => (
                              <div key={index} className="mb-4">
                                <h3 className="font-bold text-gray-800">{edu.degree || 'Derece'}</h3>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <div>{edu.school || 'Okul'}</div>
                                  <div>{edu.period || 'Dönem'}</div>
                                </div>
                                {edu.gpa && <p className="text-sm text-gray-700">Not: {edu.gpa}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="col-span-4">
                          {/* Skills */}
                          <div className="mb-8">
                            <h2 className="text-lg font-bold text-indigo-600 border-b border-indigo-200 pb-2 mb-4">BECERİLER</h2>
                            <ul className="space-y-2">
                              {formData.skills.map((skill, index) => (
                                <li key={index} className="text-gray-700">
                                  <span className="font-medium">{skill.category || 'Beceri'}</span>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div 
                                      className="bg-indigo-600 h-1.5 rounded-full" 
                                      style={{ 
                                        width: skill.level === 'İleri' ? '90%' : 
                                              skill.level === 'Orta' ? '60%' : 
                                              skill.level === 'Başlangıç' ? '30%' : '50%' 
                                      }}
                                    ></div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Languages */}
                          <div className="mb-8">
                            <h2 className="text-lg font-bold text-indigo-600 border-b border-indigo-200 pb-2 mb-4">DİLLER</h2>
                            <ul className="space-y-2">
                              {formData.languages.map((language, index) => (
                                <li key={index} className="text-gray-700">
                                  <span className="font-medium">{language.name || 'Dil'}</span>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div 
                                      className="bg-indigo-600 h-1.5 rounded-full" 
                                      style={{ 
                                        width: language.level === 'Anadil' ? '100%' : 
                                              language.level === 'İleri' ? '90%' : 
                                              language.level === 'Orta' ? '60%' : 
                                              language.level === 'Başlangıç' ? '30%' : '50%' 
                                      }}
                                    ></div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Links */}
                          <div className="mb-8">
                            <h2 className="text-lg font-bold text-indigo-600 border-b border-indigo-200 pb-2 mb-4">BAĞLANTILAR</h2>
                            <ul className="space-y-2">
                              {formData.links.map((link, index) => (
                                <li key={index} className="text-gray-700 break-words">
                                  <span className="font-medium">{link.name || 'Platform'}: </span>
                                  <span className="text-indigo-600">{link.url || 'URL'}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTemplate === 'minimal' && (
                  <div className="p-8 font-serif">
                    <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                      <h1 style={{ fontSize: '18pt', marginBottom: '0.5rem', fontWeight: 'bold' }}>{formData.fullName || 'AD SOYAD'}</h1>
                      <p style={{ fontSize: '12pt', marginBottom: '0.5rem' }}>{formData.title || 'Pozisyon'}</p>
                      
                      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        {formData.location && <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>Adres: {formData.location}</div>}
                        {formData.email && <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>E-posta: {formData.email}</div>}
                        {formData.phone && <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>Telefon: {formData.phone}</div>}
                        
                        {formData.links.map((link, index) => (
                          <div key={index} style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>
                            {link.name}: {link.url}
                          </div>
                        ))}
                      </div>
                    </div>

                    <hr style={{ margin: '1rem 0', borderTop: '1px solid #ddd' }} />

                    {/* İş Deneyimi Bölümü */}
                    {formData.experience.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>İŞ DENEYİMİ</h2>
                        
                        {formData.experience.map((exp, index) => (
                          <div key={index} style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{exp.position || 'Pozisyon'}</div>
                              <div style={{ fontSize: '10pt' }}>{exp.period || 'Dönem'}</div>
                            </div>
                            <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>{exp.company || 'Şirket'}</div>
                            <div style={{ fontSize: '10pt' }}>{exp.details || 'Detaylar'}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Eğitim Bölümü */}
                    {formData.education.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>EĞİTİM</h2>
                        
                        {formData.education.map((edu, index) => (
                          <div key={index} style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{edu.degree || 'Derece'}</div>
                              <div style={{ fontSize: '10pt' }}>{edu.period || 'Dönem'}</div>
                            </div>
                            <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>{edu.school || 'Okul'}</div>
                            {edu.gpa && <div style={{ fontSize: '10pt' }}>GPA: {edu.gpa}</div>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Beceriler ve Diller Bölümü (Yan yana) */}
                    <div style={{ display: 'flex', columnGap: '2rem' }}>
                      {/* Beceriler */}
                      {formData.skills.length > 0 && (
                        <div style={{ flex: 1 }}>
                          <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>BECERİLER</h2>
                          
                          {formData.skills.map((skill, index) => (
                            <div key={index} style={{ fontSize: '10pt', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span>{skill.category || 'Beceri'}</span>
                              <span>{skill.level || 'Seviye'}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Diller */}
                      {formData.languages.length > 0 && (
                        <div style={{ flex: 1 }}>
                          <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>DİLLER</h2>
                          
                          {formData.languages.map((language, index) => (
                            <div key={index} style={{ fontSize: '10pt', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span>{language.name || 'Dil'}</span>
                              <span>{language.level || 'Seviye'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedTemplate === 'minimal-text' && (
                  <div className="p-8 font-serif">
                    <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                      <h1 style={{ fontSize: '18pt', marginBottom: '0.5rem', fontWeight: 'bold' }}>{formData.fullName || 'AD SOYAD'}</h1>
                      <p style={{ fontSize: '12pt', marginBottom: '0.5rem' }}>{formData.title || 'Pozisyon'}</p>
                      
                      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        {formData.location && <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>Adres: {formData.location}</div>}
                        {formData.email && <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>E-posta: {formData.email}</div>}
                        {formData.phone && <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>Telefon: {formData.phone}</div>}
                        
                        {formData.links.map((link, index) => (
                          <div key={index} style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>
                            {link.name}: {link.url}
                          </div>
                        ))}
                      </div>
                    </div>

                    <hr style={{ margin: '1rem 0', borderTop: '1px solid #ddd' }} />

                    {/* İki sütunlu düzen */}
                    <div style={{ display: 'flex', columnGap: '2rem' }}>
                      {/* Sol Sütun */}
                      <div style={{ flex: 1 }}>
                        {/* Beceriler */}
                        {formData.skills.length > 0 && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>BECERİLER</h2>
                            
                            {formData.skills.map((skill, index) => (
                              <div key={index} style={{ fontSize: '10pt', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{skill.category || 'Beceri'}</span>
                                <span>{skill.level || 'Seviye'}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Diller */}
                        {formData.languages.length > 0 && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>DİLLER</h2>
                            
                            {formData.languages.map((language, index) => (
                              <div key={index} style={{ fontSize: '10pt', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{language.name || 'Dil'}</span>
                                <span>{language.level || 'Seviye'}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Projeler */}
                        {formData.projects.length > 0 && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>PROJELER</h2>
                            
                            {formData.projects.map((project, index) => (
                              <div key={index} style={{ marginBottom: '1rem' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{project.name || 'Proje Adı'}</div>
                                <p style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>{project.description || 'Proje açıklaması'}</p>
                                
                                {project.tags && (
                                  <div style={{ fontSize: '9pt' }}>
                                    <span style={{ fontStyle: 'italic' }}>Teknolojiler: </span>
                                    {project.tags}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Sağ Sütun */}
                      <div style={{ flex: 2 }}>
                        {/* İş Deneyimi */}
                        {formData.experience.length > 0 && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>İŞ DENEYİMİ</h2>
                            
                            {formData.experience.map((exp, index) => (
                              <div key={index} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{exp.position || 'Pozisyon'}</div>
                                  <div style={{ fontSize: '10pt' }}>{exp.period || 'Dönem'}</div>
                                </div>
                                <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>{exp.company || 'Şirket'}</div>
                                <div style={{ fontSize: '10pt' }}>{exp.details || 'Detaylar'}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Eğitim */}
                        {formData.education.length > 0 && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #ddd', paddingBottom: '0.25rem' }}>EĞİTİM</h2>
                            
                            {formData.education.map((edu, index) => (
                              <div key={index} style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{edu.degree || 'Derece'}</div>
                                  <div style={{ fontSize: '10pt' }}>{edu.period || 'Dönem'}</div>
                                </div>
                                <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>{edu.school || 'Okul'}</div>
                                {edu.gpa && <div style={{ fontSize: '10pt' }}>GPA: {edu.gpa}</div>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTemplate === 'portfolio' && (
                  <div className="p-8 bg-white">
                    <div className="bg-purple-600 py-4 px-6 text-white text-center">
                      <h1 className="text-3xl font-bold mb-1">{formData.fullName || 'AD SOYAD'}</h1>
                      <p className="text-xl">{formData.title || 'Pozisyon'}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mt-8">
                      <div className="col-span-1 bg-gray-50 p-4 rounded-lg">
                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-purple-800 border-b-2 border-purple-300 pb-1 mb-2">İLETİŞİM</h2>
                          <div className="text-sm space-y-2">
                            {formData.email && (
                              <div>
                                <span className="font-bold">Email:</span> {formData.email}
                              </div>
                            )}
                            {formData.phone && (
                              <div>
                                <span className="font-bold">Telefon:</span> {formData.phone}
                              </div>
                            )}
                            {formData.location && (
                              <div>
                                <span className="font-bold">Adres:</span> {formData.location}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-purple-800 border-b-2 border-purple-300 pb-1 mb-2">BAĞLANTILAR</h2>
                          <div className="text-sm space-y-2">
                            {formData.links.map((link, index) => (
                              <div key={index}>
                                <span className="font-bold">{link.name}:</span> {link.url}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-purple-800 border-b-2 border-purple-300 pb-1 mb-2">YETENEKLER</h2>
                          <div className="text-sm space-y-3">
                            {formData.skills.map((skill, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="font-bold">{skill.category || 'Beceri'}</span>
                                  <span>{skill.level || 'Seviye'}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${parseInt(skill.level) * 10 || 50}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-purple-800 border-b-2 border-purple-300 pb-1 mb-2">DİLLER</h2>
                          <div className="text-sm space-y-3">
                            {formData.languages.map((language, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="font-bold">{language.name || 'Dil'}</span>
                                  <span>{language.level || 'Seviye'}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${parseInt(language.level) * 10 || 50}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-purple-800 border-b-2 border-purple-300 pb-1 mb-3">PROFİL</h2>
                          <p className="text-sm">
                            {formData.title ? `${formData.fullName} ${formData.title} pozisyonunda çalışan deneyimli bir profesyonel.` : 'Bu alan CV\'nizin kısa bir özetini içerecektir.'}
                          </p>
                        </div>

                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-purple-800 border-b-2 border-purple-300 pb-1 mb-3">ÇALIŞMA DENEYİMİ</h2>
                          <div className="space-y-4">
                            {formData.experience.map((exp, index) => (
                              <div key={index}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold text-base">{exp.position || 'Pozisyon'}</h3>
                                    <p className="text-sm text-gray-600">{exp.company || 'Şirket'}</p>
                                  </div>
                                  <p className="text-sm text-gray-600">{exp.period || 'Dönem'}</p>
                                </div>
                                <p className="text-sm mt-1">{exp.details || 'İş detayları'}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mb-6">
                          <h2 className="text-lg font-bold text-purple-800 border-b-2 border-purple-300 pb-1 mb-3">EĞİTİM</h2>
                          <div className="space-y-4">
                            {formData.education.map((edu, index) => (
                              <div key={index}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold text-base">{edu.degree || 'Derece'}</h3>
                                    <p className="text-sm text-gray-600">{edu.school || 'Okul'}</p>
                                  </div>
                                  <p className="text-sm text-gray-600">{edu.period || 'Dönem'}</p>
                                </div>
                                {edu.gpa && <p className="text-sm mt-1">GPA: {edu.gpa}</p>}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h2 className="text-lg font-bold text-purple-800 border-b-2 border-purple-300 pb-1 mb-3">PROJELER</h2>
                          <div className="space-y-4">
                            {formData.projects.map((project, index) => (
                              <div key={index}>
                                <h3 className="font-bold text-base">{project.name || 'Proje Adı'}</h3>
                                <p className="text-sm mt-1">{project.description || 'Proje açıklaması'}</p>
                                {project.tags && (
                                  <p className="text-xs mt-1 text-purple-800">
                                    <span className="font-bold">Teknolojiler:</span> {project.tags}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTemplate === 'portfolio-text' && (
                  <div className="p-8 font-serif">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <h1 style={{ fontSize: '18pt', fontWeight: 'bold', marginBottom: '0.5rem' }}>{formData.fullName || 'AD SOYAD'}</h1>
                      <p style={{ fontSize: '12pt', marginBottom: '1rem' }}>{formData.title || 'Pozisyon'}</p>
                      
                      <div style={{ fontSize: '10pt' }}>
                        {formData.location && <span style={{ marginRight: '1rem' }}>{formData.location}</span>}
                        {formData.email && <span style={{ marginRight: '1rem' }}>{formData.email}</span>}
                        {formData.phone && <span>{formData.phone}</span>}
                      </div>
                      
                      {formData.links.length > 0 && (
                        <div style={{ fontSize: '10pt', marginTop: '0.5rem' }}>
                          {formData.links.map((link, index) => (
                            <span key={index} style={{ marginRight: '1rem' }}>
                              {link.name}: {link.url}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <h2 style={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', borderBottom: '1px solid #000', paddingBottom: '0.25rem' }}>HAKKIMDA</h2>
                      <p style={{ fontSize: '10pt', lineHeight: 1.5 }}>
                        {formData.title ? `${formData.title} pozisyonunda çalışan profesyonel.` : 'Profesyonel olarak çalışan birey.'}
                      </p>
                    </div>

                    {/* Deneyim Bölümü */}
                    {formData.experience.length > 0 && (
                      <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', borderBottom: '1px solid #000', paddingBottom: '0.25rem' }}>DENEYİM</h2>
                        
                        {formData.experience.map((exp, index) => (
                          <div key={index} style={{ marginBottom: '1.5rem' }}>
                            <div style={{ marginBottom: '0.5rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '11pt' }}>{exp.position || 'Pozisyon'}</span>
                                <span style={{ fontSize: '10pt' }}>{exp.period || 'Dönem'}</span>
                              </div>
                              <div style={{ fontSize: '10pt', fontStyle: 'italic', marginBottom: '0.5rem' }}>{exp.company || 'Şirket'}</div>
                            </div>
                            <p style={{ fontSize: '10pt', lineHeight: 1.5 }}>{exp.details || 'Detaylar'}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Eğitim Bölümü */}
                    {formData.education.length > 0 && (
                      <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', borderBottom: '1px solid #000', paddingBottom: '0.25rem' }}>EĞİTİM</h2>
                        
                        {formData.education.map((edu, index) => (
                          <div key={index} style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontWeight: 'bold', fontSize: '11pt' }}>{edu.degree || 'Derece'}</span>
                              <span style={{ fontSize: '10pt' }}>{edu.period || 'Dönem'}</span>
                            </div>
                            <div style={{ fontSize: '10pt', fontStyle: 'italic', marginBottom: '0.25rem' }}>{edu.school || 'Okul'}</div>
                            {edu.gpa && <div style={{ fontSize: '10pt' }}>GPA: {edu.gpa}</div>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projeler Bölümü */}
                    {formData.projects.length > 0 && (
                      <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', borderBottom: '1px solid #000', paddingBottom: '0.25rem' }}>PROJELER</h2>
                        
                        {formData.projects.map((project, index) => (
                          <div key={index} style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '11pt', marginBottom: '0.25rem' }}>{project.name || 'Proje Adı'}</div>
                            <p style={{ fontSize: '10pt', marginBottom: '0.5rem', lineHeight: 1.5 }}>{project.description || 'Proje açıklaması'}</p>
                            
                            {project.tags && (
                              <div style={{ fontSize: '9pt' }}>
                                <span style={{ fontWeight: 'bold' }}>Teknolojiler: </span>
                                {project.tags}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* İki sütunlu düzen (Beceriler ve Diller & İletişim) */}
                    <div style={{ display: 'flex', columnGap: '2rem' }}>
                      {/* Beceriler ve Diller */}
                      <div style={{ flex: 1 }}>
                        {formData.skills.length > 0 && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #000', paddingBottom: '0.25rem' }}>BECERİLER</h2>
                            
                            {formData.skills.map((skill, index) => (
                              <div key={index} style={{ fontSize: '10pt', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{skill.category || 'Beceri'}</span>
                                <span>{skill.level || 'Seviye'}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {formData.languages.length > 0 && (
                          <div>
                            <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #000', paddingBottom: '0.25rem' }}>DİLLER</h2>
                            
                            {formData.languages.map((language, index) => (
                              <div key={index} style={{ fontSize: '10pt', display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>{language.name || 'Dil'}</span>
                                <span>{language.level || 'Seviye'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* İletişim */}
                      <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #000', paddingBottom: '0.25rem' }}>İLETİŞİM</h2>
                        
                        <div style={{ fontSize: '10pt', lineHeight: 1.8 }}>
                          {formData.location && (
                            <div style={{ marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 'bold' }}>Adres: </span>
                              <span>{formData.location}</span>
                            </div>
                          )}
                          
                          {formData.email && (
                            <div style={{ marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 'bold' }}>E-posta: </span>
                              <span>{formData.email}</span>
                            </div>
                          )}
                          
                          {formData.phone && (
                            <div style={{ marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 'bold' }}>Telefon: </span>
                              <span>{formData.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTemplate === 'minimal-noexp' && (
                  <div className="p-8 font-serif">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                      <h1 style={{ fontSize: '20pt', marginBottom: '0.5rem', fontWeight: 'bold' }}>{formData.fullName || 'AD SOYAD'}</h1>
                      <p style={{ fontSize: '12pt', marginBottom: '0.5rem' }}>{formData.title || 'Pozisyon/Unvan'}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: '10pt' }}>
                        {formData.location && <span>{formData.location}</span>}
                        {formData.email && <span>• {formData.email}</span>}
                        {formData.phone && <span>• {formData.phone}</span>}
                      </div>
                      
                      {formData.links.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', fontSize: '10pt' }}>
                          {formData.links.map((link, index) => (
                            <span key={index}>{link.name}: {link.url}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <hr style={{ margin: '1rem 0', borderTop: '1px solid #ddd' }} />

                    {/* Eğitim Bölümü */}
                    {formData.education.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem' }}>EĞİTİM</h2>
                        
                        {formData.education.map((edu, index) => (
                          <div key={index} style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{edu.degree || 'Derece'}</div>
                              <div style={{ fontSize: '10pt' }}>{edu.period || 'Dönem'}</div>
                            </div>
                            <div style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>{edu.school || 'Okul'}</div>
                            {edu.gpa && <div style={{ fontSize: '10pt' }}>GPA: {edu.gpa}</div>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projeler Bölümü */}
                    {formData.projects.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem' }}>PROJELER</h2>
                        
                        {formData.projects.map((project, index) => (
                          <div key={index} style={{ marginBottom: '1rem' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{project.name || 'Proje Adı'}</div>
                            <p style={{ fontSize: '10pt', marginBottom: '0.25rem' }}>{project.description || 'Proje açıklaması'}</p>
                            
                            {project.tags && (
                              <div style={{ fontSize: '9pt', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 'bold' }}>Teknolojiler: </span>
                                {project.tags}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Beceriler ve Diller Bölümü */}
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      {/* Beceriler */}
                      <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem' }}>BECERİLER</h2>
                        
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', fontSize: '10pt' }}>
                          {formData.skills.map((skill, index) => (
                            <li key={index}>
                              <strong>{skill.category || 'Beceri'}</strong> - {skill.level || 'Seviye'}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Diller */}
                      <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem' }}>DİLLER</h2>
                        
                        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', fontSize: '10pt' }}>
                          {formData.languages.map((language, index) => (
                            <li key={index}>
                              <strong>{language.name || 'Dil'}</strong> - {language.level || 'Seviye'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Kişisel Bilgiler Bölümü */}
                    <div style={{ marginTop: '1.5rem' }}>
                      <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '0.75rem' }}>KİŞİSEL BİLGİLER</h2>
                      
                      <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '10pt' }}>
                        {formData.location && (
                          <li style={{ marginBottom: '0.25rem' }}>
                            <strong>Adres:</strong> {formData.location}
                          </li>
                        )}
                        
                        {formData.email && (
                          <li style={{ marginBottom: '0.25rem' }}>
                            <strong>E-posta:</strong> {formData.email}
                          </li>
                        )}
                        
                        {formData.phone && (
                          <li style={{ marginBottom: '0.25rem' }}>
                            <strong>Telefon:</strong> {formData.phone}
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/projects"
            className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Tüm Projelere Dön
          </Link>
        </div>
      </div>
    </div>
  );
} 