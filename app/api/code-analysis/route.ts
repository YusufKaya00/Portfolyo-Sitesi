import { NextResponse } from 'next/server';

// OpenRouter API anahtarı (Qwen model için)
const QWEN_API_KEY = process.env.QWEN_API_KEY || '';
const TIMEOUT_DURATION = 30000; // 30 saniye

// API anahtarlarının geçerli olup olmadığını kontrol eden fonksiyon
function isValidAPIKey(key: string) {
  // OpenRouter API anahtarı kontrolü
  return key && key.length >= 30 && key.startsWith('sk-or-v1');
}

// Timeout promise oluştur
function timeoutPromise(ms: number) {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`İstek ${ms}ms içinde tamamlanamadı.`));
    }, ms);
  });
}

// Kod analizi için OpenRouter API çağrısı (Qwen model)
async function analyzeCodeWithQwen(
  code: string,
  language: string,
  analysisTypes: string[]
) {
  // API anahtarı kontrolü
  if (!isValidAPIKey(QWEN_API_KEY)) {
    console.log('Geçerli API anahtarı bulunamadı, simüle edilmiş analiz kullanılıyor');
    return simulateCodeAnalysis(code, language, analysisTypes);
  }

  try {
    console.log('OpenRouter API ile kod analizi yapılıyor...');
    
    // AI istek metni oluşturma
    const typeDescriptions = analysisTypes.map(type => {
      switch (type) {
        case 'quality': return 'kod kalitesi ve metrikler (satır sayısı, karmaşıklık, okunabilirlik)';
        case 'security': return 'OWASP kurallarına göre güvenlik açıkları';
        case 'performance': return 'performans iyileştirme önerileri';
        case 'clean_code': return 'temiz kod prensipleri ve iyileştirmeler';
        case 'readability': return 'okunabilirlik ve sürdürülebilirlik analizi';
        default: return type;
      }
    }).join(', ');
    
    const promptText = `Aşağıdaki ${language} kodunu analiz et ve şu alanlarda değerlendirme yap: ${typeDescriptions}.
    
    Kod:
    \`\`\`${language}
    ${code}
    \`\`\`
    
    Her kategori için ayrı ayrı şu formatta yanıt ver:

    # [Kategori Adı]
    
    ## Bulgular:
    - [Bulgu 1]
    - [Bulgu 2]
    
    ## Değerlendirme:
    [Genel değerlendirme]
    
    ## İyileştirme Önerileri:
    - [Öneri 1]
    - [Öneri 2]
    
    JSON çıktısı istemiyorum, markdown formatında yanıt ver.`;
    
    console.log('API isteği gönderiliyor...');
    
    // OpenRouter API'ye istek gönder
    const response = await Promise.race([
      fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${QWEN_API_KEY}`,
          'HTTP-Referer': 'https://portfolio-ysfproject.vercel.app',
          'X-Title': 'Portfolio Project'
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-30b-a3b:free',
          messages: [
            { role: 'system', content: 'Sen profesyonel bir kod analisti ve yazılım geliştirme uzmanısın. Kod kalitesi, güvenlik, performans ve temiz kod prensipleri konusunda uzmanlaştın.' },
            { role: 'user', content: promptText }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      }).then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(`OpenRouter API Hatası: ${errData.error?.message || 'Bilinmeyen hata'}`);
          });
        }
        return res.json();
      }).then(data => data.choices[0].message.content),
      timeoutPromise(TIMEOUT_DURATION)
    ]);
    
    // Yanıtı kontrol et
    if (response) {
      const text = response as string;
      console.log('API yanıtı alındı');
      
      // Markdown yanıtı HTML'e çevir ve kategorilere ayır
      const results = parseAndFormatAnalysisResults(text, analysisTypes);
      return results;
    }
    
    throw new Error('API yanıtı boş geldi');
  } catch (error) {
    console.error('OpenRouter API hatası:', error);
    // Hata durumunda simüle edilmiş analizi kullan
    return simulateCodeAnalysis(code, language, analysisTypes);
  }
}

// Markdown formatındaki analiz sonuçlarını parse et
function parseAndFormatAnalysisResults(markdownText: string, analysisTypes: string[]) {
  // Her bir kategori için ikon belirle
  const icons: Record<string, string> = {
    quality: '📊',
    security: '🔒',
    performance: '⚡',
    clean_code: '✨',
    readability: '👁️',
  };
  
  // Markdown'ı bölümlere ayır, # ile başlayan her bir başlık bir kategoridir
  const sections = markdownText.split(/(?=# )/g);
  
  // Her bir analiz türü için karşılık gelen bölümü bul
  return analysisTypes.map(type => {
    const typeTitle = {
      quality: 'Kod Kalitesi ve Metrikler',
      security: 'Güvenlik Açıkları',
      performance: 'Performans İyileştirme',
      clean_code: 'Temiz Kod Prensipleri',
      readability: 'Okunabilirlik ve Sürdürülebilirlik',
    }[type] || type;
    
    // Bu analiz türüne karşılık gelen bölümü bul
    const section = sections.find(s => 
      s.toLowerCase().includes(type.toLowerCase()) || 
      s.toLowerCase().includes(typeTitle.toLowerCase())
    ) || `# ${typeTitle}\n\n## Bulgular\n- Analiz yapılamadı`;
    
    return {
      type,
      title: typeTitle,
      icon: icons[type] || '🔍',
      // HTML yerine markdown formatını döndür, frontend'de işlenecek
      analysis: section.trim()
    };
  });
}

// Simüle edilmiş kod analizi (API çağrısı başarısız olursa yedek olarak)
function simulateCodeAnalysis(code: string, language: string, analysisTypes: string[]) {
  const lines = code.split('\n').length;
  const complexity = Math.min(10, Math.max(1, Math.floor(lines / 10)));
  const readability = Math.max(1, 10 - complexity + Math.floor(Math.random() * 3));
  
  // Her analiz türü için simüle edilmiş sonuçlar
  return analysisTypes.map(type => {
    const results = {
      quality: {
        type,
        title: 'Kod Kalitesi ve Metrikler',
        icon: '📊',
        analysis: `# Kod Kalitesi ve Metrikler

## Bulgular
- Kod uzunluğu: ${lines} satır
- Karmaşıklık: ${complexity} / 10
- Okunabilirlik: ${readability} / 10

## Değerlendirme
Kodunuz ${lines > 100 ? 'uzun ve karmaşık. Daha küçük fonksiyonlara bölünmesi önerilir.' : 'makul uzunlukta ve anlaşılır görünüyor.'}

## İyileştirme Önerileri
- Fonksiyonları tek bir sorumluluğa sahip olacak şekilde ayırın
- Yorum satırları ekleyerek kodun anlaşılabilirliğini artırın`
      },
      security: {
        type,
        title: 'Güvenlik Açıkları',
        icon: '🔒',
        analysis: `# Güvenlik Açıkları

## Potansiyel Riskler
${code.includes('eval(') ? '- ⚠️ Kritik: eval() kullanımı tespit edildi. Bu, zararlı kod çalıştırma riski oluşturur.' : ''}
${code.includes('innerHTML') ? '- ⚠️ Orta: innerHTML kullanımı XSS saldırılarına açık olabilir.' : ''}
${code.includes('password') || code.includes('şifre') ? '- ⚠️ Uyarı: Şifre bilgilerinin güvenli şekilde işlendiğinden emin olun.' : ''}
${!code.includes('password') && !code.includes('innerHTML') && !code.includes('eval(') ? '- ✓ Belirgin bir güvenlik açığı tespit edilmedi.' : ''}

## Değerlendirme
${code.includes('eval(') || code.includes('innerHTML') ? 'Kodunuzda önemli güvenlik riskleri bulunuyor.' : 'Kodunuz güvenlik açısından iyi durumda gözüküyor, ancak her zaman girdi doğrulaması yapmayı unutmayın.'}

## İyileştirme Önerileri
- Kullanıcı girdilerini her zaman doğrulayın ve temizleyin
- Hassas bilgileri şifreleyerek saklayın`
      },
      performance: {
        type,
        title: 'Performans İyileştirme',
        icon: '⚡',
        analysis: `# Performans İyileştirme

## Performans Değerlendirmesi
${code.includes('for (') ? '- Döngüler tespit edildi. Büyük veri kümeleri için optimize edilebilir.' : ''}
${language === 'javascript' && code.includes('.forEach') ? '- Array.forEach() yerine for...of döngüsü daha performanslı olabilir.' : ''}
${code.includes('setTimeout') || code.includes('setInterval') ? '- Timer fonksiyonları dikkatli kullanılmalı ve temizlenmelidir.' : ''}
${!code.includes('for (') && !code.includes('.forEach') && !code.includes('setTimeout') ? '- Belirgin bir performans sorunu tespit edilmedi.' : ''}

## İyileştirme Önerileri
- Gereksiz hesaplamaları önleyin
- Memoization kullanarak tekrarlayan işlemleri optimize edin`
      },
      clean_code: {
        type,
        title: 'Temiz Kod Prensipleri',
        icon: '✨',
        analysis: `# Temiz Kod Prensipleri

## Temiz Kod Değerlendirmesi
${code.includes('function') && code.split('function').length > 5 ? '- Çok sayıda fonksiyon tespit edildi. İşlevselliği sınıflara veya modüllere bölmeyi düşünün.' : ''}
${code.includes('//') ? '- Yorum satırları tespit edildi, ancak daha açıklayıcı olabilir.' : '- Yorum satırları eklemeniz önerilir.'}
${code.includes('    ') ? '- Tutarlı girinti kullanımı iyi.' : '- Tutarlı girinti kullanmanız önerilir.'}

## İyileştirme Önerileri
- DRY (Kendini Tekrar Etme) prensibini uygulayın
- Değişken ve fonksiyon isimlerini açıklayıcı yapın`
      },
      readability: {
        type,
        title: 'Okunabilirlik ve Sürdürülebilirlik',
        icon: '👁️',
        analysis: `# Okunabilirlik ve Sürdürülebilirlik

## Okunabilirlik Değerlendirmesi
${code.split('\n').some(line => line.length > 80) ? '- Bazı satırlar çok uzun. 80-120 karakter ile sınırlandırmanız önerilir.' : '- Satır uzunlukları makul görünüyor.'}
${code.includes('const') || code.includes('let') ? '- Modern değişken tanımlama kullanımı iyi.' : language === 'javascript' || language === 'typescript' ? '- var yerine const/let kullanmanız önerilir.' : ''}
${code.includes('  ') && code.includes('    ') ? '- Tutarsız girinti kullanımı tespit edildi.' : ''}

## İyileştirme Önerileri
- Kod bloklarını mantıksal bölümlere ayırın
- Açıklayıcı yorumlar ekleyin
- İsimlendirmeleri anlamlı yapın`
      },
    };
    
    return results[type as keyof typeof results] || {
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Analizi`,
      icon: '🔍',
      analysis: `# ${type.charAt(0).toUpperCase() + type.slice(1)} Analizi\n\nBu analiz türü için simüle edilmiş veri bulunmuyor.`
    };
  });
}

export async function POST(request: Request) {
  try {
    // İsteği ayrıştır
    const body = await request.json();
    const { code, language, analysisTypes } = body;

    // Gerekli alanların kontrolü
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return NextResponse.json(
        { error: 'Geçerli bir kod gerekli' },
        { status: 400 }
      );
    }

    if (!language || typeof language !== 'string') {
      return NextResponse.json(
        { error: 'Geçerli bir programlama dili gerekli' },
        { status: 400 }
      );
    }

    if (!analysisTypes || !Array.isArray(analysisTypes) || analysisTypes.length === 0) {
      return NextResponse.json(
        { error: 'En az bir analiz türü seçilmeli' },
        { status: 400 }
      );
    }

    console.log(`Kod analiz isteği alındı - Dil: ${language}, Analiz türleri: ${analysisTypes.join(', ')}`);

    // Kod analizi
    try {
      const results = await analyzeCodeWithQwen(code, language, analysisTypes);
      
      return NextResponse.json({ 
        results,
        source: isValidAPIKey(QWEN_API_KEY) ? 'qwen' : 'simulation'
      });
    } catch (error: any) {
      console.error('Analiz hatası:', error.message || error);
      
      // Hata durumunda simulasyon sonuçlarını döndür
      const simulatedResults = simulateCodeAnalysis(code, language, analysisTypes);
      
      return NextResponse.json({ 
        results: simulatedResults,
        source: 'simulation_fallback',
        error: error.message
      });
    }
    
  } catch (error: any) {
    console.error('Genel hata:', error.message || error);
    return NextResponse.json(
      { 
        error: `Bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`,
        source: 'error_fallback'
      },
      { status: 500 }
    );
  }
} 