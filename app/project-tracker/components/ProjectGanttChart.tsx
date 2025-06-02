'use client';

import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  assignedTo?: string;
  progress: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  color: string;
}

interface ProjectGanttChartProps {
  tasks: Task[];
  teamMembers: TeamMember[];
}

export default function ProjectGanttChart({ tasks, teamMembers }: ProjectGanttChartProps) {
  const [timeScale, setTimeScale] = useState<'day' | 'week' | 'month'>('day');
  const [showMermaidCode, setShowMermaidCode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Zaman ölçeğini değiştir
  const changeTimeScale = (scale: 'day' | 'week' | 'month') => {
    setTimeScale(scale);
  };
  
  // Gantt çizelgesindeki tüm tarihleri hesapla
  const calculateDateRange = () => {
    if (tasks.length === 0) {
      const today = new Date();
      return {
        minDate: today,
        maxDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000) // 2 hafta sonrası
      };
    }
    
    const startDates = tasks.map(task => new Date(task.startDate));
    const endDates = tasks.map(task => new Date(task.endDate));
    
    const minDate = new Date(Math.min(...startDates.map(date => date.getTime())));
    const maxDate = new Date(Math.max(...endDates.map(date => date.getTime())));
    
    // Başlangıç tarihinden bir gün önce, bitiş tarihinden bir gün sonrası
    minDate.setDate(minDate.getDate() - 1);
    maxDate.setDate(maxDate.getDate() + 1);
    
    return { minDate, maxDate };
  };
  
  // Tarih aralığını al
  const { minDate, maxDate } = calculateDateRange();
  
  // Zaman ölçeğine göre günleri/haftaları/ayları oluştur
  const generateTimeUnits = () => {
    const timeUnits = [];
    let currentDate = new Date(minDate);
    
    while (currentDate <= maxDate) {
      if (timeScale === 'day') {
        timeUnits.push({
          date: new Date(currentDate),
          label: moment(currentDate).format('DD MMM')
        });
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (timeScale === 'week') {
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        timeUnits.push({
          date: weekStart,
          endDate: weekEnd,
          label: `${moment(weekStart).format('DD MMM')} - ${moment(weekEnd).format('DD MMM')}`
        });
        
        currentDate.setDate(currentDate.getDate() + 7);
      } else { // month
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        timeUnits.push({
          date: monthStart,
          endDate: monthEnd,
          label: moment(monthStart).format('MMMM YYYY')
        });
        
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      }
    }
    
    return timeUnits;
  };
  
  const timeUnits = generateTimeUnits();
  
  // Tarihten piksel pozisyonu hesapla
  const getPositionForDate = (date: Date) => {
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayWidth = 100 / totalDays; // yüzde olarak
    const daysFromStart = Math.ceil((date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysFromStart * dayWidth;
  };
  
  // Görev süresini piksel genişliğine çevir
  const getTaskWidth = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return (durationDays / totalDays) * 100; // yüzde olarak
  };
  
  // İlerleme durumuna göre renk belirle
  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Ekip üyesinin rengini bul
  const getMemberColor = (memberId?: string) => {
    if (!memberId) return '#64748b'; // default gri
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.color : '#64748b';
  };
  
  // Ekip üyesinin adını bul
  const getMemberName = (memberId?: string) => {
    if (!memberId) return 'Atanmamış';
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Bilinmeyen Üye';
  };
  
  // Tarih hesaplamaları
  const today = new Date();
  const todayPosition = getPositionForDate(today);

  // Mermaid kodu oluşturma
  const generateMermaidCode = () => {
    // Mermaid Gantt başlangıç
    let mermaidCode = 'gantt\n';
    mermaidCode += `    title Proje Gantt Diyagramı\n`;
    mermaidCode += `    dateFormat YYYY-MM-DD\n`;
    mermaidCode += `    axisFormat %d-%m-%Y\n\n`;

    // Ekip üyelerine göre bölüm ekle
    const memberIds = [...new Set(tasks.filter(t => t.assignedTo).map(t => t.assignedTo))];

    // Atanmamış görevler için bölüm
    mermaidCode += `    section Atanmamış\n`;
    tasks.filter(t => !t.assignedTo).forEach(task => {
      const startDate = moment(task.startDate).format('YYYY-MM-DD');
      const endDate = moment(task.endDate).format('YYYY-MM-DD');
      const progressText = task.progress < 100 ? ` ${task.progress}%` : ' done';
      mermaidCode += `    ${task.name}:${progressText}, ${startDate}, ${endDate}\n`;
    });

    // Ekip üyelerine göre görevleri gruplandır
    memberIds.forEach(memberId => {
      if (!memberId) return;
      const memberName = getMemberName(memberId);
      mermaidCode += `\n    section ${memberName}\n`;
      
      tasks.filter(t => t.assignedTo === memberId).forEach(task => {
        const startDate = moment(task.startDate).format('YYYY-MM-DD');
        const endDate = moment(task.endDate).format('YYYY-MM-DD');
        const progressText = task.progress < 100 ? ` ${task.progress}%` : ' done';
        mermaidCode += `    ${task.name}:${progressText}, ${startDate}, ${endDate}\n`;
      });
    });
    
    return mermaidCode;
  };

  // Mermaid kodunu clipboard'a kopyala
  const copyMermaidCode = () => {
    const code = generateMermaidCode();
    navigator.clipboard.writeText(code);
    alert('Mermaid kodu panoya kopyalandı!');
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 overflow-hidden">
      {/* Gantt kontrolleri */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-400 text-sm">
          {tasks.length} görev • {moment(minDate).format('DD MMM YYYY')} - {moment(maxDate).format('DD MMM YYYY')}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => changeTimeScale('day')}
            className={`px-3 py-1 text-xs rounded ${timeScale === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Gün
          </button>
          <button
            onClick={() => changeTimeScale('week')}
            className={`px-3 py-1 text-xs rounded ${timeScale === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Hafta
          </button>
          <button
            onClick={() => changeTimeScale('month')}
            className={`px-3 py-1 text-xs rounded ${timeScale === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Ay
          </button>
          <button 
            onClick={() => setShowMermaidCode(!showMermaidCode)}
            className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            {showMermaidCode ? 'Grafiği Göster' : 'Mermaid Kodu'}
          </button>
        </div>
      </div>
      
      {/* Sayfa yenilenirse veri kaybolacak uyarısı */}
      <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-400 text-sm p-2 rounded-lg mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Dikkat: Sayfa yenilendiğinde tüm veriler kaybolacaktır. Lütfen Mermaid kodunu kaydederek yedekleyin.</span>
        </div>
      </div>
      
      {showMermaidCode ? (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-medium">Mermaid Kodu</h3>
            <button 
              onClick={copyMermaidCode}
              className="text-xs flex items-center text-blue-400 hover:text-blue-300"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Kopyala
            </button>
          </div>
          <div className="bg-gray-950 p-3 rounded-lg">
            <pre className="text-green-400 text-xs overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
              {tasks.length > 0 ? generateMermaidCode() : 'Henüz görev eklenmemiş.'}
            </pre>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Bu kodu <a href="https://mermaid.live" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">mermaid.live</a> gibi araçlarda kullanabilirsiniz.
          </p>
        </div>
      ) : (
        <>
          {/* Gantt çizelgesi */}
          <div 
            className="relative border border-gray-700 rounded-lg overflow-x-auto" 
            style={{ minHeight: '300px' }}
            ref={containerRef}
          >
            {/* Zaman çizelgesi başlıkları */}
            <div className="sticky top-0 z-10 flex border-b border-gray-700 bg-gray-800">
              <div className="w-1/4 min-w-[200px] p-2 border-r border-gray-700 bg-gray-800 text-gray-300 font-medium">
                Görev
              </div>
              <div className="w-3/4 flex-grow relative">
                {timeUnits.map((unit, index) => (
                  <div 
                    key={index} 
                    className="absolute top-0 bottom-0 border-r border-gray-700 bg-gray-800 flex items-center justify-center"
                    style={{ 
                      left: `${getPositionForDate(unit.date)}%`, 
                      width: timeScale === 'day' 
                        ? `${getTaskWidth(unit.date, unit.date)}%` 
                        : `${getTaskWidth(unit.date, unit.endDate || unit.date)}%`
                    }}
                  >
                    <div className="text-xs text-gray-400 whitespace-nowrap px-1 truncate">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Bugünün çizgisi */}
            <div 
              className="absolute top-8 bottom-0 w-px bg-blue-500 z-20"
              style={{ left: `calc(${todayPosition}% + ${1/4 * 100}%)` }}
            >
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 px-1 py-0.5 bg-blue-500 text-white text-xs rounded">
                Bugün
              </div>
            </div>
            
            {/* Gantt içeriği */}
            <div className="relative flex flex-col">
              {tasks.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  Henüz görev yok
                </div>
              ) : (
                tasks.map((task, index) => (
                  <div key={task.id} className="flex border-b border-gray-700 hover:bg-gray-800/50">
                    {/* Görev bilgisi */}
                    <div className="w-1/4 min-w-[200px] p-2 border-r border-gray-700">
                      <div className="font-medium text-white">{task.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {moment(task.startDate).format('DD MMM')} - {moment(task.endDate).format('DD MMM YYYY')}
                      </div>
                      <div className="flex items-center mt-1">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: getMemberColor(task.assignedTo) }}
                        ></div>
                        <span className="text-xs text-gray-400">{getMemberName(task.assignedTo)}</span>
                      </div>
                    </div>
                    
                    {/* Görev çubuğu */}
                    <div className="w-3/4 flex-grow relative h-20">
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 h-6 rounded-md border border-gray-600 flex items-center overflow-hidden"
                        style={{ 
                          left: `${getPositionForDate(new Date(task.startDate))}%`, 
                          width: `${getTaskWidth(new Date(task.startDate), new Date(task.endDate))}%`,
                          backgroundColor: `${getMemberColor(task.assignedTo)}40` // 40 alfa değeri (saydamlık)
                        }}
                      >
                        {/* İlerleme çubuğu */}
                        <div 
                          className={`h-full ${getProgressColor(task.progress)}`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                        
                        {/* Görev adı ve ilerleme */}
                        <div className="absolute left-2 right-2 text-xs font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis">
                          {task.name} - %{task.progress}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Lejant */}
          <div className="mt-4 flex items-center space-x-4 text-xs text-gray-400">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
              <span>0-24%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-sm mr-1"></div>
              <span>25-49%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-sm mr-1"></div>
              <span>50-74%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
              <span>75-100%</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 