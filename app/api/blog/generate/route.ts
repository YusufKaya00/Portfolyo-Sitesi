import { NextResponse } from 'next/server';

// Gemini API için Google Generative AI kütüphanesini kullanacağız
// Not: Bu kütüphaneyi yüklemek için terminal'de:
// cd portfolio-blog && npm install @google/generative-ai

import { GoogleGenerativeAI } from '@google/generative-ai';

// Çevre değişkeninden API anahtarını al (not: bu test için gerçek bir API anahtarı kullanıyoruz)
// Gerçek projede API anahtarı .env.local dosyasında olmalıdır
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyB8VwNLJdgMnpnThTgwZEHPWK0cGIIYyJw';

// API anahtarlarının geçerli olup olmadığını kontrol eden fonksiyon
function isValidAPIKey(key: string) {
  // Gerçek bir API anahtarı en az 30 karakter uzunluğunda olmalı
  // ve genellikle "AIza" ile başlar
  return key && key.length >= 30 && key.startsWith('AIza');
}

// Zaman aşımı süresini artırıyoruz (milisaniye) - 20 saniye
const TIMEOUT_DURATION = 20000;

// Yedek içerik - API çağrısı başarısız olursa kullanılacak
const sampleContent = {
  "default": `# Blog İçeriği Örneği

Bu bir örnek blog içeriğidir. Gerçek bir içerik oluşturmak için Gemini API kullanılacaktır.

## Örnek Alt Başlık

Bu bölümde, içeriğiniz için bir örnek alt başlık görebilirsiniz.

## Sonuç

Daha detaylı ve özelleştirilmiş içerik için lütfen farklı bir konu deneyin veya daha sonra tekrar deneyin.`,

  "blog": `# Blog Yazısı Nasıl Yazılır?

Başarılı bir blog yazısı yazmak için dikkat edilmesi gereken bazı temel noktalar vardır. İyi bir blog yazısı okuyucuyla bağlantı kuran, değer sunan ve net bir şekilde organize edilmiş içerikten oluşur.

## Dikkat Çekici Başlık Kullanın

Başlık, okuyucunun dikkatini çeken ilk unsurdur. Net, özgün ve merak uyandırıcı bir başlık seçmek, okuyucularınızın yazınızı tıklamasını ve okumasını sağlar.

## Güçlü Bir Giriş Yapın

Yazınızın ilk paragrafı, okuyucuları içeriğe çekmek için çok önemlidir. Çarpıcı bir istatistik, soru veya hikaye ile başlayabilirsiniz.

## İçeriği Bölümlere Ayırın

Uzun metin blokları okuyucuları yorar. İçeriğinizi alt başlıklar, maddeler ve paragraflar halinde bölmek okunabilirliği artırır.

## SEO'yu Unutmayın

Anahtar kelimelerinizi doğal bir şekilde içeriğe yerleştirin. Aşırıya kaçmadan, arama motorlarında görünürlüğünüzü artıracak şekilde optimize edin.

## Etkili Bir Sonuç Yazın

Yazınızı özetleyen ve okuyucuyu bir eylem yapmaya teşvik eden güçlü bir sonuç ile bitirin.

Bu temel unsurlara dikkat ederek, okuyucularınızın değer bulacağı ve paylaşmak isteyeceği blog yazıları oluşturabilirsiniz.`,

  "teknoloji": `# Yapay Zeka ve Geleceğimiz

Yapay zeka (AI), günümüzde teknoloji dünyasının en hızlı gelişen ve hayatımızı en çok etkileyen alanlarından biri haline geldi. Peki bu gelişmeler bizi nereye götürüyor?

## Yapay Zekanın Günlük Hayata Etkisi

Artık akıllı telefonlarımızdan ev asistanlarımıza, müşteri hizmetlerinden sağlık uygulamalarına kadar birçok alanda yapay zeka çözümleri kullanıyoruz. Bu teknolojiler hayatımızı kolaylaştırırken, alışkanlıklarımızı ve iş yapma biçimlerimizi de değiştiriyor.

## İş Dünyasındaki Dönüşüm

Yapay zeka, iş dünyasında verimliliği artırırken, bazı mesleklerin dönüşmesine veya ortadan kalkmasına da neden oluyor. Aynı zamanda veri analisti, AI etik uzmanı gibi yeni meslek alanları da ortaya çıkıyor.

## Etik Kaygılar ve Düzenlemeler

Yapay zekanın gelişimi beraberinde önemli etik soruları da getiriyor:
- Mahremiyet ve veri güvenliği nasıl sağlanacak?
- Algoritmalardaki önyargılar nasıl önlenecek?
- Otonom sistemlerin alacağı kararların sorumluluğu kime ait olacak?

## Geleceğe Bakış

Uzmanlar, yapay zekanın önümüzdeki on yılda sağlık, ulaşım, eğitim ve enerji gibi kritik sektörlerde devrim yaratacağını öngörüyor. Genel Yapay Zeka (AGI) çalışmaları ise insanların yerini alabilecek sistemlerin geliştirilmesine doğru ilerliyor.

Sonuç olarak, yapay zeka teknolojisinin sağlayacağı faydaları maksimize ederken, potansiyel risklerini minimize etmek için toplum olarak bilinçli adımlar atmamız gerekiyor.`,

  "yazılım": `# Modern Web Geliştirme: Temel İlkeler ve En İyi Uygulamalar

Web geliştirme dünyası sürekli evrim geçiriyor. Modern bir web geliştiricisi olmak için hangi temel ilkelere dikkat etmeli ve hangi uygulamaları benimsemelisiniz?

## Frontend Geliştirme Temelleri

- **HTML5 ve Semantik Markup**: Doğru etiketleri kullanarak içeriğinizin anlamını ve yapısını belirtin.
- **CSS3 ve Responsive Tasarım**: Tüm cihazlarda iyi görünen ve çalışan uygulamalar geliştirin.
- **JavaScript ve Modern Frameworkler**: React, Vue veya Angular gibi modern frameworkleri öğrenerek geliştirme sürecinizi hızlandırın.

## Backend Geliştirme

- **API Tasarımı**: RESTful veya GraphQL API'leri tasarlayarak frontend ve backend arasında etkili iletişim sağlayın.
- **Veritabanı Optimizasyonu**: Veritabanı sorgularınızı optimize ederek performansı artırın.
- **Güvenlik**: XSS, CSRF ve SQL enjeksiyonu gibi yaygın güvenlik açıklarına karşı önlem alın.

## DevOps ve Deployment

- **Konteynerizasyon**: Docker kullanarak uygulamanızı her ortamda tutarlı bir şekilde çalıştırın.
- **CI/CD**: Sürekli entegrasyon ve sürekli dağıtım pipeline'ları kurarak geliştirme sürecinizi otomatikleştirin.
- **Monitoring**: Uygulamanızın performansını ve sağlığını izleyin.

## En İyi Uygulamalar

- **Kod Kalitesi**: Temiz, okunabilir ve sürdürülebilir kod yazın.
- **Test Odaklı Geliştirme**: Unit testler, entegrasyon testleri ve end-to-end testler yazarak kodunuzun kalitesini artırın.
- **Dokümantasyon**: Kodunuzu ve API'lerinizi iyi dokümante edin.

Modern web geliştirmede başarılı olmak için sürekli öğrenmeye ve yeni teknolojileri takip etmeye açık olun. Temel ilkeleri sağlam tutarak, yeni araçları ve teknikleri projenize entegre edin.`
};

// Timeout promise oluştur
function timeoutPromise(ms: number) {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`İstek ${ms}ms içinde tamamlanamadı.`));
    }, ms);
  });
}

// Prompt'a göre uygun yedek içeriği seç
function selectFallbackContent(prompt: string) {
  console.log('Yedek içerik kullanılıyor...');
  
  // Prompt'a göre hazır içeriklerden birini seçelim
  let content = sampleContent.default;
  
  const promptLower = prompt.toLowerCase();
  if (promptLower.includes('blog') || promptLower.includes('yazı')) {
    content = sampleContent.blog;
  } else if (promptLower.includes('teknoloji') || promptLower.includes('yapay zeka') || promptLower.includes('ai')) {
    content = sampleContent.teknoloji;
  } else if (promptLower.includes('yazılım') || promptLower.includes('kod') || promptLower.includes('web')) {
    content = sampleContent.yazılım;
  }
  
  return content;
}

// Gemini API'si ile içerik üretimi
async function generateContentWithGemini(prompt: string) {
  // API anahtarı kontrolü
  if (!isValidAPIKey(GEMINI_API_KEY)) {
    console.log('Geçerli API anahtarı bulunamadı, yedek içerik kullanılıyor');
    return selectFallbackContent(prompt);
  }

  try {
    console.log('Gemini API ile içerik üretiliyor...');
    
    // Google AI modelini başlat
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Prompt hazırlama
    const promptText = `Lütfen aşağıdaki konu hakkında Türkçe bir blog yazısı oluştur. 
      - Markdown formatında olsun
      - Başlık, alt başlıklar içersin
      - Detaylı ve bilgilendirici olsun
      - 300-500 kelime arası olsun
      
      Konu: ${prompt}`;
      
    console.log('API isteği gönderiliyor:', promptText.substring(0, 50) + '...');
    
    // Race condition ile timeout kontrolü
    const generationResult = await Promise.race([
      model.generateContent(promptText),
      timeoutPromise(TIMEOUT_DURATION)
    ]);
    
    // Yanıtı kontrol et ve dön
    if (generationResult) {
      const response = await generationResult.response;
      const text = response.text();
      console.log('API yanıtı alındı:', text.substring(0, 50) + '...');
      return text;
    }
    
    throw new Error('API yanıtı boş geldi');
  } catch (error) {
    console.error('Gemini API hatası:', error);
    return selectFallbackContent(prompt);
  }
}

export async function POST(request: Request) {
  try {
    // İsteği ayrıştır
    const body = await request.json();
    const { prompt } = body;

    // Prompt kontrolü
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Geçerli bir prompt gerekli' },
        { status: 400 }
      );
    }

    console.log(`İçerik üretme isteği alındı - Prompt: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`);

    // İçerik üretme
    let content;
    let source = 'gemini'; // Varsayılan olarak API'den geldiğini varsayalım
    
    try {
      // API anahtarı kontrolü
      if (!isValidAPIKey(GEMINI_API_KEY)) {
        console.log('API anahtarı geçerli değil - yedek içerik kullanılıyor');
        content = selectFallbackContent(prompt);
        source = 'fallback_invalid_key';
      } else {
        // Gemini API ile içerik üretmeyi dene
        content = await generateContentWithGemini(prompt);
      }
    } catch (error: any) {
      // Hata durumunda yedek içerik kullan
      console.error('İçerik üretme hatası:', error.message || error);
      content = selectFallbackContent(prompt);
      source = `fallback_error: ${error.message || 'bilinmeyen hata'}`;
    }
    
    // İçerik kontrolü - boş veya çok kısa ise yedek içerik kullan
    if (!content || content.length < 50) {
      console.log('Üretilen içerik çok kısa veya boş - yedek içerik kullanılıyor');
      content = selectFallbackContent(prompt);
      source = 'fallback_short_content';
    }
    
    console.log(`İçerik üretildi - Kaynak: ${source}`);
    
    return NextResponse.json({ 
      content,
      source
    });
    
  } catch (error: any) {
    console.error('Genel hata:', error.message || error);
    return NextResponse.json(
      { 
        error: `Bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`,
        content: selectFallbackContent('genel hata'),
        source: 'error_fallback'
      },
      { status: 500 }
    );
  }
}