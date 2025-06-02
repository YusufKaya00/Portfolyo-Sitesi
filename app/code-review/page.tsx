'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import ReactMarkdown from 'react-markdown';

// Dil seçenekleri
const LANGUAGES = [
  { name: 'JavaScript', value: 'javascript' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'Python', value: 'python' },
  { name: 'Java', value: 'java' },
  { name: 'C#', value: 'csharp' },
  { name: 'PHP', value: 'php' },
  { name: 'HTML', value: 'html' },
  { name: 'CSS', value: 'css' },
  { name: 'Go', value: 'go' },
  { name: 'Ruby', value: 'ruby' },
  { name: 'Rust', value: 'rust' },
  { name: 'Swift', value: 'swift' },
  { name: 'Kotlin', value: 'kotlin' },
  { name: 'SQL', value: 'sql' },
];

// Kod analiz türleri
const ANALYSIS_TYPES = [
  { name: 'Kalite Metrikler', value: 'quality', icon: '📊' },
  { name: 'Güvenlik Açıkları', value: 'security', icon: '🔒' },
  { name: 'Performans İyileştirme', value: 'performance', icon: '⚡' },
  { name: 'Kod Temizliği', value: 'clean_code', icon: '✨' },
  { name: 'Okunabilirlik', value: 'readability', icon: '👁️' },
];

// Kalite metrik değerlendirme fonksiyonu (simüle edilmiş)
const calculateMetrics = (code: string) => {
  const lines = code.split('\n').length;
  const complexity = Math.min(10, Math.max(1, Math.floor(lines / 10)));
  const readability = Math.max(1, 10 - complexity + Math.floor(Math.random() * 3));
  
  return {
    lines,
    complexity,
    readability
  };
};

// Analiz sonuçlarını gösterme
const ResultView = ({ results }: { results: any[] }) => {
  return (
    <div className="space-y-8 mt-4">
      {results.map((result, index) => (
        <div 
          key={index} 
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="flex items-center bg-gray-700 p-4">
            <span className="text-xl mr-3">{result.icon}</span>
            <h3 className="text-lg font-semibold text-white">{result.title}</h3>
          </div>
          
          <div className="p-4 prose prose-invert max-w-none">
            <ReactMarkdown>
              {result.analysis}
            </ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function CodeReview() {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>(['quality', 'security']);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [tab, setTab] = useState<'code' | 'results'>('code');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [metrics, setMetrics] = useState<any>(null);
  
  // Dosya yükleme işlemi
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Dil tespiti (dosya uzantısına göre)
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const detectedLanguage = detectLanguageFromExtension(extension);
    if (detectedLanguage) {
      setLanguage(detectedLanguage);
    }
    
    // Dosyayı oku
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCode(content || '');
    };
    reader.readAsText(file);
  };
  
  // Dosya uzantısından dil tespiti
  const detectLanguageFromExtension = (extension: string): string | null => {
    const extensionMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cs': 'csharp',
      'php': 'php',
      'html': 'html',
      'css': 'css',
      'go': 'go',
      'rb': 'ruby',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'sql': 'sql',
    };
    
    return extensionMap[extension] || null;
  };
  
  // Analiz işlemi
  const analyzeCode = async () => {
    if (!code.trim()) {
      alert('Lütfen analiz edilecek kod girin veya bir dosya yükleyin.');
      return;
    }
    
    setIsAnalyzing(true);
    setTab('results');
    
    try {
      // Basit metrikler hesaplama (client-side)
      const calculatedMetrics = calculateMetrics(code);
      setMetrics(calculatedMetrics);
      
      // API çağrısı yerine simüle edilmiş analiz
      const simResults = await simulateAIAnalysis(code, language, selectedAnalysisTypes);
      setResult(simResults);
      
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Analiz hatası:', error);
      setIsAnalyzing(false);
      alert('Kod analizi sırasında bir hata oluştu.');
    }
  };
  
  // Yapay zeka analizi simülasyonu (gerçek uygulamada Gemini API kullanılacak)
  const simulateAIAnalysis = async (code: string, language: string, analysisTypes: string[]) => {
    // Simüle edilmiş tepkiler
    const responses: Record<string, any> = {
      quality: {
        title: 'Kod Kalitesi ve Metrikler',
        icon: '📊',
        analysis: `
## Kod Kalitesi Metrikleri

### Bulgular:
* Kod uzunluğu: ${code.split('\n').length} satır
* Karmaşıklık: ${Math.min(10, Math.max(1, Math.floor(code.split('\n').length / 10)))} / 10
* Okunabilirlik: ${Math.max(1, 10 - Math.min(10, Math.max(1, Math.floor(code.split('\n').length / 10))) + Math.floor(Math.random() * 3))} / 10

### Değerlendirme:
${code.split('\n').length > 100 
  ? 'Kodunuz uzun ve karmaşık görünüyor. Bu kodun daha küçük parçalara bölünmesi bakımı kolaylaştıracaktır.'
  : 'Kodunuz makul uzunlukta ve anlaşılır görünüyor. İyi bir şekilde organize edilmiş.'}

### Öneriler:
${code.split('\n').length > 100 
  ? '- Kodu daha küçük fonksiyonlara bölün\n- Tekrarlayan kodları ortak fonksiyonlara taşıyın\n- Her fonksiyonun tek bir sorumluluğu olduğundan emin olun'
  : '- Kodunuz iyi görünüyor, ancak yorumları artırabilirsiniz\n- Fonksiyon ve değişken isimlendirmelerini gözden geçirin'}
`,
      },
      security: {
        title: 'Güvenlik Açıkları (OWASP)',
        icon: '🔒',
        analysis: `
## Güvenlik Analizi

### Potansiyel Güvenlik Riskleri:
${code.includes('eval(') 
  ? '⚠️ **KRİTİK**: `eval()` kullanımı tespit edildi. Bu, zararlı kod çalıştırma riski oluşturur (CWE-95).'
  : ''}
${code.includes('innerHTML') 
  ? '⚠️ **ORTA**: `innerHTML` kullanımı XSS saldırılarına açık olabilir (CWE-79).'
  : ''}
${code.includes('exec(') || code.includes('child_process') 
  ? '⚠️ **KRİTİK**: Komut yürütme fonksiyonları tespit edildi. Güvenlik için girdi doğrulaması çok önemlidir (CWE-78).'
  : ''}
${code.includes('password') || code.includes('şifre') 
  ? '⚠️ **UYARI**: Şifre bilgilerinin güvenli şekilde işlendiğinden emin olun. Şifrelerin her zaman hashlenmiş olarak saklanması gerekir.'
  : ''}
${(code.includes('sql') || code.includes('query')) && (code.includes('+') || code.includes('${')) 
  ? '⚠️ **YÜKSEK**: Olası SQL enjeksiyon riski tespit edildi. Parametreli sorgular kullanın (CWE-89).'
  : ''}
${code.includes('http:') && !code.includes('https:') 
  ? '⚠️ **DÜŞÜK**: Güvensiz HTTP bağlantıları kullanılıyor. HTTPS kullanmayı düşünün.'
  : ''}
${!code.includes('eval(') && !code.includes('innerHTML') && !code.includes('password') && !code.includes('exec(') 
  ? '✅ Belirgin bir güvenlik açığı tespit edilmedi. Ancak bu, kodun tamamen güvenli olduğu anlamına gelmez.'
  : ''}

### Öneriler:
${code.includes('eval(') 
  ? '- `eval()` kullanımından kaçının, bunun yerine daha güvenli alternatifler kullanın\n'
  : ''}
${code.includes('innerHTML') 
  ? '- `innerHTML` yerine `textContent` veya DOM manipülasyon metodları kullanın\n'
  : ''}
${code.includes('password') 
  ? '- Şifreleri her zaman güçlü hash algoritmaları (bcrypt, Argon2) ile saklayın\n'
  : ''}
${(code.includes('sql') || code.includes('query')) && (code.includes('+') || code.includes('${')) 
  ? '- String birleştirme yerine parametre kullanarak SQL enjeksiyonu riskini azaltın\n'
  : ''}
- Tüm kullanıcı girdilerini doğrulayın ve temizleyin
- Güvenlik açısından kritik kodları düzenli olarak gözden geçirin
`,
      },
      performance: {
        title: 'Performans İyileştirme',
        icon: '⚡',
        analysis: `
## Performans Analizi

### Performans Değerlendirmesi:
${code.includes('for (') || code.includes('forEach') || code.includes('map(') 
  ? '- Döngüler tespit edildi. Büyük veri kümeleri için optimizasyon gerekebilir.'
  : ''}
${(language === 'javascript' || language === 'typescript') && code.includes('.forEach') 
  ? '- Bazı durumlarda `Array.forEach()` yerine `for...of` döngüsü daha performanslı olabilir.'
  : ''}
${(language === 'javascript' || language === 'typescript') && code.includes('filter') && code.includes('map') && code.includes('reduce') 
  ? '- Birden fazla dizi işlemi (`filter`, `map`, `reduce`) zincirlenmesi tespit edildi. Bu, büyük dizilerde performans sorunlarına neden olabilir.'
  : ''}
${code.includes('setTimeout') || code.includes('setInterval') 
  ? '- Timer fonksiyonları (`setTimeout`/`setInterval`) tespit edildi. Bunlar uygun şekilde temizlenmediğinde bellek sızıntılarına neden olabilir.'
  : ''}
${(language === 'javascript' || language === 'typescript') && code.includes('querySelector') && code.includes('for') 
  ? '- Döngü içinde DOM sorguları tespit edildi. Bu, yeniden akış ve yeniden boyama işlemlerine neden olabilir.'
  : ''}
${code.includes('new RegExp') && code.includes('for') 
  ? '- Döngü içinde düzenli ifadeler oluşturulması tespit edildi. Bu, performans sorunlarına neden olabilir.'
  : ''}
${!code.includes('for (') && !code.includes('.forEach') && !code.includes('setTimeout') 
  ? '- Kodunuzda belirgin bir performans sorunu tespit edilmedi.'
  : ''}

### İyileştirme Önerileri:
${code.includes('for (') || code.includes('forEach') || code.includes('map(') 
  ? '- Büyük döngüler için veri yapılarını optimize edin\n- Gereksiz yinelemelerden kaçının\n'
  : ''}
${(language === 'javascript' || language === 'typescript') && code.includes('filter') && code.includes('map') 
  ? '- Birden fazla dizi işlemi yerine tek bir `reduce` veya `for` döngüsü kullanmayı düşünün\n'
  : ''}
${code.includes('setTimeout') || code.includes('setInterval') 
  ? '- Zamanlayıcıları component/object yok edildiğinde temizleyin\n'
  : ''}
- Gereksiz hesaplamaları önleyin
- Memoization kullanarak tekrarlayan işlemleri optimize edin
- Yoğun işlemleri ana thread dışında çalıştırmayı düşünün (Web Workers gibi)
`,
      },
      clean_code: {
        title: 'Temiz Kod Prensipleri',
        icon: '✨',
        analysis: `
## Kod Temizliği Analizi

### Temiz Kod Değerlendirmesi:
${code.includes('function') && code.split('function').length > 5 
  ? '- Çok sayıda fonksiyon tespit edildi. İşlevselliği sınıflara veya modüllere bölmeyi düşünün.'
  : ''}
${code.includes('//') 
  ? '- Yorum satırları tespit edildi, ancak daha açıklayıcı olabilir.'
  : '- Kodunuza açıklayıcı yorumlar eklemeniz önerilir.'}
${code.includes('    ') || code.includes('\t') 
  ? '- Girintileme için tutarlı boşluk kullanımı iyi.'
  : '- Tutarlı girinti kullanmanız önerilir.'}
${code.includes('var ') && (language === 'javascript' || language === 'typescript') 
  ? '- Modern JavaScript/TypeScript kodunda `var` yerine `let` ve `const` kullanmanız önerilir.'
  : ''}
${code.includes('TODO') || code.includes('FIXME') 
  ? '- Kodunuzda TODO ve FIXME yorumları bulunuyor. Bunları çözmeniz önerilir.'
  : ''}
${(code.match(/[a-zA-Z0-9_]+=/) || []).length > 5 && !code.includes('const') && !code.includes('let') && !code.includes('var')
  ? '- Kodu global scope\'ta tanımlamak yerine daha iyi kapsülleme kullanmanız önerilir.'
  : ''}

### İyileştirme Önerileri:
- DRY (Kendini Tekrar Etme) prensibini uygulayın
- SOLID prensiplerini takip edin (Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion)
- Değişken/fonksiyon isimlerini açıklayıcı yapın
- Fonksiyonların kısa ve amaca yönelik olmasını sağlayın
- İşlevsiz kodları temizleyin
- Tutarlı kod stili ve girinti kullanın
`,
      },
      readability: {
        title: 'Okunabilirlik ve Sürdürülebilirlik',
        icon: '👁️',
        analysis: `
## Okunabilirlik Analizi

### Okunabilirlik Değerlendirmesi:
${code.split('\n').some(line => line.length > 80) 
  ? '- Bazı satırlar çok uzun. 80-120 karakter ile sınırlandırmanız önerilir.'
  : '- Satır uzunlukları makul görünüyor.'}
${code.includes('const') || code.includes('let') 
  ? '- Modern değişken tanımlama kullanımı iyi.'
  : language === 'javascript' || language === 'typescript' 
    ? '- `var` yerine `const`/`let` kullanmanız önerilir.'
    : ''}
${(code.includes('  ') && code.includes('    ')) || (code.includes('  ') && code.includes('\t')) 
  ? '- Tutarsız girinti kullanımı tespit edildi. Aynı dosyada hem tab hem boşluk kullanılmamalıdır.'
  : '- Tutarlı girinti kullanımı iyi.'}
${code.includes(';') && !code.includes('};') && (language === 'javascript' || language === 'typescript') 
  ? '- Noktalı virgül kullanımı tutarlı görünüyor, bu iyi bir uygulama.'
  : (language === 'javascript' || language === 'typescript') 
    ? '- Noktalı virgül kullanımı tutarsız olabilir, tutarlı olması önerilir.'
    : ''}
${(code.match(/[a-zA-Z0-9_]{20,}/) || []).length > 0 
  ? '- Bazı değişken/fonksiyon isimleri çok uzun veya karmaşık. Daha kısa ve anlamlı isimler kullanın.'
  : ''}
${(code.match(/^[a-z]|^[A-Z][a-z]/) || []).length > 10 
  ? '- İsimlendirme tutarlılığı iyi görünüyor.'
  : '- İsimlendirme kurallarınızı tutarlı hale getirin (camelCase veya snake_case).'}

### İyileştirme Önerileri:
- Kod bloklarını mantıksal bölümlere ayırın
- Açıklayıcı yorumlar ekleyin, özellikle karmaşık işlemler için
- İsimlendirmeleri anlamlı yapın
- Kod formatınızı tutarlı hale getirin (bir linter veya formatter kullanın)
- Aynı dosya içinde farklı formatları karıştırmaktan kaçının
- Fonksiyonları ve sınıfları uygun şekilde belgelendirin
`,
      },
    };
    
    // Seçilen analiz türlerine göre sonuçları oluştur
    const results = analysisTypes.map(type => responses[type]).filter(Boolean);
    
    // Kodun ne işe yaradığını özetleyen kısım ekle - her zaman sonuçlara eklenecek
    const codeAnalysisSummary = {
      title: 'Kod Özeti',
      icon: '🔍',
      analysis: generateCodeSummary(code, language),
    };
    
    // Özeti her zaman ekle
    results.push(codeAnalysisSummary);
    
    return results;
  };
  
  // Kodun ne işe yaradığını özetleyen fonksiyon
  const generateCodeSummary = (code: string, language: string): string => {
    // Kod içinde desen eşleştirmeleri yaparak özet oluştur
    let summaryPoints = [];
    
    // Kod türünü belirleme
    if (code.includes('class') && code.includes('extends')) {
      summaryPoints.push('- Bu kod bir **sınıf kalıtımı** içeriyor ve üst sınıfın özelliklerini genişletiyor.');
    } else if (code.includes('class') && (code.includes('constructor') || code.includes('function'))) {
      summaryPoints.push('- Kod **nesne yönelimli programlama** paradigmasını kullanarak bir veya daha fazla sınıf tanımlıyor.');
    }
    
    // Fonksiyonlar ve geri dönüş değerleri
    if (code.includes('function') && code.includes('return')) {
      summaryPoints.push('- Veri işleme ve sonuç döndüren **bir veya birden fazla fonksiyon** tanımlanmış.');
    }
    
    // API çağrıları
    if (code.includes('fetch(') || code.includes('axios')) {
      summaryPoints.push('- Kod **API çağrıları** yaparak uzak servislerden veri alıyor veya gönderiyor.');
    }
    
    // Olay işleyicileri
    if (code.includes('addEventListener') || code.includes('onClick') || code.includes('onChange')) {
      summaryPoints.push('- **Kullanıcı etkileşimlerine** yanıt veren olay işleyicileri tanımlanmış.');
    }
    
    // React hooks
    if (code.includes('useState') || code.includes('useEffect')) {
      summaryPoints.push('- Kod **React hooks** kullanarak bileşen durumu ve yan etkiler tanımlıyor.');
    }
    
    // Veritabanı işlemleri
    if (code.toUpperCase().includes('SELECT') && code.toUpperCase().includes('FROM')) {
      summaryPoints.push('- Kod içinde **SQL sorguları** bulunuyor, veritabanından veri çekme işlemleri yapılıyor.');
    } else if (code.toUpperCase().includes('INSERT') || code.toUpperCase().includes('UPDATE') || code.toUpperCase().includes('DELETE')) {
      summaryPoints.push('- Kod içinde **veritabanı manipülasyon sorguları** (INSERT/UPDATE/DELETE) bulunuyor.');
    }
    
    // Döngüler ve koşullar
    if (code.includes('for') || code.includes('while') || code.includes('forEach') || code.includes('map(')) {
      summaryPoints.push('- Veri koleksiyonlarını işlemek için **döngü yapıları** kullanılmış.');
    }
    
    if (code.includes('if') && code.includes('else')) {
      summaryPoints.push('- Kod farklı koşullara göre farklı işlemler yapan **koşullu mantık** içeriyor.');
    }
    
    // Kullanılan teknolojileri tespit etme
    const technologies = [];
    if (code.includes('React') || code.includes('useState') || code.includes('useEffect')) technologies.push('React');
    if (code.includes('Vue') || code.includes('createApp') || code.includes('v-') || code.includes('Vue.')) technologies.push('Vue.js');
    if (code.includes('Angular') || code.includes('@Component') || code.includes('ngFor')) technologies.push('Angular');
    if (code.includes('Express') || code.includes('app.get(') || code.includes('app.use(') || code.includes('app.post(')) technologies.push('Express.js');
    if (code.includes('mongoose') || code.includes('Schema')) technologies.push('MongoDB/Mongoose');
    if (code.includes('sequelize') || code.includes('Model.define')) technologies.push('SQL/Sequelize');
    if (code.includes('axios')) technologies.push('Axios');
    if (code.includes('import tensorflow') || code.includes('from tensorflow') || code.includes('tf.') || code.includes('keras')) technologies.push('TensorFlow/Keras');
    if (code.includes('import torch') || code.includes('from torch') || code.includes('nn.Module')) technologies.push('PyTorch');
    if (code.includes('flutter') || code.includes('StatelessWidget') || code.includes('StatefulWidget')) technologies.push('Flutter');
    if (code.includes('docker') || code.includes('FROM') && code.includes('RUN') && code.includes('CMD')) technologies.push('Docker');
    
    // Dil özelinde tespitler
    if (language === 'python') {
      if (code.includes('def __init__') && code.includes('self')) summaryPoints.push('- Python sınıf tanımlamaları kullanılmış.');
      if (code.includes('import numpy') || code.includes('np.')) technologies.push('NumPy');
      if (code.includes('import pandas') || code.includes('pd.')) technologies.push('Pandas');
      if (code.includes('import matplotlib') || code.includes('plt.')) technologies.push('Matplotlib');
    } else if (language === 'javascript' || language === 'typescript') {
      if (code.includes('async') && code.includes('await')) summaryPoints.push('- Asenkron programlama için **async/await** yapısı kullanılmış.');
      if (code.includes('Promise')) summaryPoints.push('- Asenkron işlemler için **Promise** yapısı kullanılmış.');
      if (code.includes('.then(') && code.includes('.catch(')) summaryPoints.push('- Promise zincirlemesi için **then/catch** yapısı kullanılmış.');
    } else if (language === 'java') {
      if (code.includes('@Override')) summaryPoints.push('- Metot ezme (override) kullanılmış.');
      if (code.includes('interface ')) summaryPoints.push('- Arayüz (interface) tanımlamaları yapılmış.');
      if (code.includes('extends ') && code.includes('implements ')) summaryPoints.push('- Kalıtım ve arayüz implementasyonu birlikte kullanılmış.');
    }
    
    if (technologies.length > 0) {
      summaryPoints.push(`- Kullanılan teknolojiler/kütüphaneler: **${technologies.join('**, **')}**`);
    }
    
    // Kod karmaşıklığı değerlendirmesi
    const lines = code.split('\n').length;
    const linesText = lines < 50 ? "küçük" : lines < 200 ? "orta büyüklükte" : "büyük ve karmaşık";
    summaryPoints.push(`- Kodunuz ${lines} satırdan oluşan ${linesText} bir yapıya sahip.`);
    
    if (summaryPoints.length === 0) {
      return `## Kod Özeti\n\nBu kod ${language} programlama dilinde yazılmış ve çeşitli işlevler içeriyor. Detaylı bir analiz için daha fazla içerik gerekebilir.`;
    }
    
    return `## Kod Özeti\n\n${summaryPoints.join('\n')}\n\nBu analiz, kodunuzdaki belirli kalıplar ve anahtar kelimeler incelenerek otomatik olarak oluşturulmuştur.`;
  };
  
  // Analiz türlerini değiştirme işlemi
  const toggleAnalysisType = (type: string) => {
    setSelectedAnalysisTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  
  // Metrik skoru rengini belirleme
  const getMetricColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Örnek kod template
  const getExampleCode = () => {
    const examples: Record<string, string> = {
      javascript: `// Örnek JavaScript fonksiyonu
function calculateTotal(items) {
  let total = 0;
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    total += item.price * item.quantity;
  }
  
  return total;
}

// Kullanıcı girdisini doğrudan eval ile çalıştırma (güvenlik riski)
function calculateExpression(expression) {
  return eval(expression);
}`,
      python: `# Örnek Python fonksiyonu
def calculate_total(items):
    total = 0
    
    for item in items:
        total += item['price'] * item['quantity']
    
    return total

# SQL enjeksiyon riski (güvenlik açığı)
def get_user(username):
    query = f"SELECT * FROM users WHERE username = '{username}'"
    # return db.execute(query)  # Bu güvensiz bir sorgu oluşturabilir`,
      java: `// Örnek Java sınıfı
public class OrderCalculator {
    public double calculateTotal(List<Item> items) {
        double total = 0;
        
        for (Item item : items) {
            total += item.getPrice() * item.getQuantity();
        }
        
        return total;
    }
    
    // Performans sorunu: Büyük String birleştirme
    public String createReport(List<Item> items) {
        String report = "";
        for (Item item : items) {
            report += item.getName() + ": " + item.getPrice() + "\\n";
        }
        return report;
    }
}`,
    };
    
    return examples[language] || examples.javascript;
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-10" />
      </div>

      <div className="relative z-20 pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Kod Gözden Geçirme
            </motion.h1>
            <motion.p 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-300"
            >
              Yapay Zeka Destekli Kod Analizi ve İyileştirme Aracı
            </motion.p>
          </div>

          {/* Ana içerik alanı */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 overflow-hidden"
          >
            {/* Sekme Başlıkları */}
            <div className="flex border-b border-gray-700">
              <button
                className={`px-6 py-4 text-sm font-medium flex-1 md:flex-none md:min-w-[150px] text-center ${
                  tab === 'code' 
                    ? 'bg-indigo-600/30 text-white border-b-2 border-indigo-500' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
                onClick={() => setTab('code')}
              >
                1. Kod Girişi
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium flex-1 md:flex-none md:min-w-[150px] text-center ${
                  tab === 'results' 
                    ? 'bg-indigo-600/30 text-white border-b-2 border-indigo-500' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
                onClick={() => setTab('results')}
                disabled={!result && !isAnalyzing}
              >
                2. Analiz Sonuçları
              </button>
            </div>
            
            {/* Kod Giriş Alanı */}
            {tab === 'code' && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Soldaki Seçenekler */}
                  <div className="md:col-span-1 space-y-6">
                    {/* Dil Seçimi */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Programlama Dili
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Analiz Türleri */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Analiz Türleri
                      </label>
                      <div className="space-y-2">
                        {ANALYSIS_TYPES.map((type) => (
                          <div key={type.value} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`type-${type.value}`}
                              checked={selectedAnalysisTypes.includes(type.value)}
                              onChange={() => toggleAnalysisType(type.value)}
                              className="h-4 w-4 text-indigo-600 rounded border-gray-700 bg-gray-800 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`type-${type.value}`}
                              className="ml-2 text-sm text-gray-300"
                            >
                              {type.icon} {type.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Dosya Yükleme */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dosya Yükle
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-600 rounded-lg">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-400">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300"
                            >
                              <span>Dosya Yükle</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".js,.jsx,.ts,.tsx,.py,.java,.cs,.php,.html,.css,.go,.rb,.rs,.swift,.kt,.sql"
                              />
                            </label>
                            <p className="pl-1">ya da sürükle bırak</p>
                          </div>
                          <p className="text-xs text-gray-400">
                            .js, .py, .java gibi kod dosyaları
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Örnek Kod */}
                    <div>
                      <button
                        onClick={() => setCode(getExampleCode())}
                        className="w-full px-4 py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 rounded-md text-sm font-medium"
                      >
                        Örnek Kod Yükle
                      </button>
                    </div>
                  </div>
                  
                  {/* Sağdaki Kod Editörü */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kodu Yapıştırın veya Yazın
                    </label>
                    <div className="border border-gray-700 rounded-md overflow-hidden bg-gray-900 shadow-lg shadow-indigo-900/30">
                      <div className="border-b border-gray-700 bg-gray-800 px-4 py-2 flex items-center">
                        <span className="text-xs text-gray-400">{LANGUAGES.find(l => l.value === language)?.name || language}</span>
                      </div>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full bg-gray-900 text-gray-300 p-4 font-mono text-sm min-h-[500px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={`${LANGUAGES.find(l => l.value === language)?.name || language} kodunuzu buraya yapıştırın...`}
                      ></textarea>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={analyzeCode}
                        disabled={isAnalyzing || !code.trim()}
                        className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                          isAnalyzing || !code.trim()
                            ? 'bg-gray-700 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {isAnalyzing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analiz Ediliyor...
                          </>
                        ) : (
                          'Kodu Analiz Et'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Analiz Sonuçları */}
            {tab === 'results' && (
              <div className="p-6">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <svg className="animate-spin h-16 w-16 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h3 className="text-xl text-indigo-300 mb-2">Yapay Zeka Kodunuzu Analiz Ediyor</h3>
                    <p className="text-gray-400 text-center max-w-md">
                      Kod kalitesi, güvenlik açıkları ve iyileştirme önerileri için kodunuz analiz ediliyor...
                    </p>
                  </div>
                ) : result ? (
                  <div className="space-y-8">
                    {/* Temel Metrikler */}
                    {metrics && (
                      <div className="bg-gray-800/50 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-white mb-4">Temel Metrikler</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-800 rounded-md p-4 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{metrics.lines}</div>
                            <div className="text-sm text-gray-400">Satır Sayısı</div>
                          </div>
                          <div className="bg-gray-800 rounded-md p-4 text-center">
                            <div className={`text-3xl font-bold ${getMetricColor(11 - metrics.complexity)} mb-1`}>
                              {metrics.complexity}/10
                            </div>
                            <div className="text-sm text-gray-400">Karmaşıklık</div>
                          </div>
                          <div className="bg-gray-800 rounded-md p-4 text-center">
                            <div className={`text-3xl font-bold ${getMetricColor(metrics.readability)} mb-1`}>
                              {metrics.readability}/10
                            </div>
                            <div className="text-sm text-gray-400">Okunabilirlik</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Analiz Sonuçları */}
                    <ResultView results={result} />
                    
                    {/* Analiz edilen kod */}
                    <div className="bg-gray-800/50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-white mb-4">Analiz Edilen Kod</h3>
                      <div className="border border-gray-700 rounded-md overflow-auto max-h-[400px]">
                        <SyntaxHighlighter
                          language={language}
                          style={vscDarkPlus}
                          showLineNumbers
                          wrapLines
                        >
                          {code}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                    
                    {/* Yeni bir analiz yap */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => setTab('code')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium"
                      >
                        Yeni Bir Kod Analiz Et
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-400">
                      Henüz analiz sonucu bulunmuyor. Lütfen önce kodunuzu girin ve analiz edin.
                    </p>
                    <button
                      onClick={() => setTab('code')}
                      className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white text-sm font-medium"
                    >
                      Kod Girişine Dön
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Geri Git Butonu */}
          <div className="mt-12 text-center">
            <Link
              href="/portfolio" 
              className="inline-flex items-center text-indigo-400 hover:text-indigo-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Portfolyoya Geri Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 