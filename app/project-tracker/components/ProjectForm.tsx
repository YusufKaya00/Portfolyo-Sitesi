'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed' | 'onHold';
}

interface ProjectFormProps {
  project?: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    name: '',
    description: '',
    startDate: new Date(),
    endDate: moment().add(1, 'month').toDate(),
    status: 'planning'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Hata durumunda temizle
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (date: Date | null, fieldName: string) => {
    if (date) {
      setFormData(prev => ({ ...prev, [fieldName]: date }));
      
      // Hata durumunda temizle
      if (errors[fieldName]) {
        setErrors(prev => ({ ...prev, [fieldName]: '' }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Proje adı zorunludur';
    }
    
    if (moment(formData.endDate).isBefore(formData.startDate)) {
      newErrors.endDate = 'Bitiş tarihi başlangıç tarihinden önce olamaz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        id: project?.id || Date.now().toString(),
        ...formData
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="border-b border-gray-800 p-4">
          <h2 className="text-lg font-medium text-white">
            {project ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            {/* Proje Adı */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Proje Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Proje adını girin"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            {/* Açıklama */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Açıklama
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Proje açıklaması girin"
              />
            </div>
            
            {/* Tarihler */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                  Başlangıç Tarihi
                </label>
                <DatePicker
                  id="startDate"
                  selected={formData.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Başlangıç tarihi"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                  Bitiş Tarihi
                </label>
                <DatePicker
                  id="endDate"
                  selected={formData.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Bitiş tarihi"
                  minDate={formData.startDate}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>
            
            {/* Durum */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                Durum
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="planning">Planlama</option>
                <option value="active">Aktif</option>
                <option value="completed">Tamamlandı</option>
                <option value="onHold">Beklemede</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md focus:outline-none"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none"
            >
              {project ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 