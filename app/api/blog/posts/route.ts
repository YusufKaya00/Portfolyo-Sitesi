import { NextResponse } from 'next/server';
import { blogPosts, BlogPost, readBlogsFromFile, writeBlogsToFile } from './data';

export async function GET() {
  // Tüm blog yazılarını dosyadan okuyup döndür
  const posts = readBlogsFromFile();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  try {
    console.log('API: Blog yazısı oluşturma isteği alındı');
    
    const body = await request.json();
    console.log('API: İstek gövdesi alındı');
    
    const { title, content, excerpt } = body;
    
    if (!title || !content) {
      console.log('API: Eksik alanlar var');
      return NextResponse.json(
        { error: 'Başlık ve içerik gereklidir' }, 
        { status: 400 }
      );
    }
    
    console.log('API: Blog yazısı oluşturuluyor');
    
    // Güncel blog listesini dosyadan oku
    const posts = readBlogsFromFile();
    
    // Yeni bir blog gönderisi oluşturma
    const newPost: BlogPost = {
      id: `${Date.now()}`, // Benzersiz ID için timestamp kullanma
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Yeni blog yazısını listeye ekle
    posts.unshift(newPost); // Yeni yazıyı en üste ekle
    
    // Güncellenmiş listeyi dosyaya kaydet
    writeBlogsToFile(posts);
    
    console.log('API: Blog yazısı başarıyla oluşturuldu:', newPost.id);
    
    return NextResponse.json(newPost);
  } catch (error: any) {
    console.error('API: Blog yazısı oluşturma hatası:', error);
    return NextResponse.json(
      { error: `Blog yazısı oluşturulurken bir hata oluştu: ${error.message}` },
      { status: 500 }
    );
  }
} 