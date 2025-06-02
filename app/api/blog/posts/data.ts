// Tüm API'lerin paylaşacağı blog yazısı deposu
// Dosya sistemi tabanlı depolama kullanıyor, veritabanı gerektirmez

import fs from 'fs';
import path from 'path';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes?: string[]; // Beğeni listesi ekledik
}

// JSON dosya yolu - data klasörü proje kök dizininde oluşturulacak
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'blogs.json');

// Dosyadan blog yazılarını okuma fonksiyonu
export function readBlogsFromFile(): BlogPost[] {
  try {
    // Dizin yoksa oluştur
    const dirPath = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Dosya yoksa, örnek blog yazılarıyla oluştur
    if (!fs.existsSync(DATA_FILE_PATH)) {
      const initialData = JSON.stringify(initialBlogs, null, 2);
      fs.writeFileSync(DATA_FILE_PATH, initialData);
      return initialBlogs;
    }
    
    // Dosyayı oku ve JSON olarak parse et
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Blog verilerini okuma hatası:', error);
    // Hata durumunda örnek veriler döndür
    return initialBlogs;
  }
}

// Blog yazılarını dosyaya kaydetme fonksiyonu
export function writeBlogsToFile(blogs: BlogPost[]): void {
  try {
    console.log('Dosyaya yazılıyor:', DATA_FILE_PATH);
    
    // Dizin yoksa oluştur
    const dirPath = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      console.log('Dizin oluşturuluyor:', dirPath);
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // JSON formatına dönüştür
    const jsonData = JSON.stringify(blogs, null, 2);
    
    // Dosyaya yaz
    fs.writeFileSync(DATA_FILE_PATH, jsonData, 'utf8');
    console.log('Dosyaya yazma başarılı, blog sayısı:', blogs.length);
  } catch (error) {
    console.error('Blog verilerini yazma hatası:', error);
    // Hata durumunda daha açıklayıcı mesaj
    throw new Error(`Blog verilerini dosyaya yazma başarısız: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
}

// Dosya yoksa başlangıç için örnek blog yazıları
const initialBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'React ile Modern Web Uygulamaları Geliştirme',
    excerpt: 'React, modern web uygulamaları geliştirmek için popüler bir JavaScript kütüphanesidir. Bu yazıda, React ile web uygulamaları geliştirmenin temellerini ve en iyi uygulamaları ele alacağız...',
    content: `# React ile Modern Web Uygulamaları Geliştirme

React, Facebook tarafından geliştirilen ve günümüzde modern web uygulamaları geliştirmek için yaygın olarak kullanılan bir JavaScript kütüphanesidir. Komponent tabanlı mimarisi ve Virtual DOM özelliği sayesinde performanslı ve modüler uygulamalar geliştirmeyi mümkün kılar.

## React'in Avantajları

- **Komponent Tabanlı Mimari**: Uygulamanızı yeniden kullanılabilir, bağımsız parçalara bölerek geliştirmenizi sağlar.
- **Virtual DOM**: DOM manipülasyonlarını optimize ederek daha hızlı render süreçleri sunar.
- **Tek Yönlü Veri Akışı**: Debugging ve hata ayıklamayı kolaylaştırır.
- **Zengin Ekosistem**: Redux, React Router gibi tamamlayıcı kütüphaneler ile güçlü bir ekosistem sunar.

## Başlangıç için Gerekli Araçlar

- Node.js ve npm
- Temel JavaScript/ES6+ bilgisi
- Bir kod editörü (VS Code önerilir)
- Create React App veya Next.js gibi bir başlangıç kiti

Bu temel bilgilerle React öğrenmeye başlayabilir ve modern web uygulamaları geliştirebilirsiniz.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'TypeScript ile Tip Güvenliği Sağlama',
    excerpt: "TypeScript, JavaScript'e statik tip özellikleri ekleyen açık kaynaklı bir programlama dilidir. Bu yazıda, TypeScript'in sunduğu avantajları ve tip güvenliği sağlamanın önemini inceleyeceğiz...",
    content: `# TypeScript ile Tip Güvenliği Sağlama

TypeScript, Microsoft tarafından geliştirilen ve JavaScript'e statik tip özellikleri ekleyen açık kaynaklı bir programlama dilidir. JavaScript'in üst kümesi olarak çalışır ve derleme zamanında tip kontrolleri yaparak kodunuzu daha güvenli hale getirir.

## TypeScript'in Avantajları

- **Statik Tip Kontrolü**: Derleme zamanında hataları yakalamanıza yardımcı olur.
- **IDE Desteği**: Kod tamamlama, refaktörleme ve navigasyon özellikleri sunar.
- **Gelişmiş OOP Özellikleri**: Sınıflar, arayüzler ve kalıtım gibi nesne yönelimli programlama özelliklerini destekler.
- **Daha İyi Dokümantasyon**: Tip tanımlamaları sayesinde kodunuz kendini dokümante eder.

## TypeScript Kurulumu

\`\`\`bash
npm install -g typescript
\`\`\`

## Basit Bir TypeScript Örneği

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Merhaba, \${user.name}!\`;
}

const newUser: User = {
  id: 1,
  name: "Ahmet",
  email: "ahmet@example.com"
};

console.log(greetUser(newUser));
\`\`\`

TypeScript'in sunduğu tip güvenliği, büyük projelerde hata oranını azaltabilir ve bakım maliyetlerini düşürebilir.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Uygulama başladığında dosyadan blogları oku
export let blogPosts: BlogPost[] = readBlogsFromFile(); 