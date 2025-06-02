import { NextResponse } from 'next/server';
import { readBlogsFromFile, writeBlogsToFile } from '../data';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  
  // Blog yazılarını dosyadan oku
  const posts = readBlogsFromFile();
  
  // ID'ye göre blog yazısına eriş
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return NextResponse.json(
      { error: 'Blog yazısı bulunamadı' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(post);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    console.log('API: Blog silme isteği alındı, ID:', id);
    
    // Blog yazılarını dosyadan oku
    const posts = readBlogsFromFile();
    console.log('API: Toplam blog sayısı:', posts.length);
    
    // Silinecek blog yazısını kontrol et
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      console.log('API: Blog yazısı bulunamadı, ID:', id);
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }
    
    console.log('API: Blog siliniyor, index:', postIndex);
    
    // Blog yazısını sil
    posts.splice(postIndex, 1);
    
    // Güncellenmiş listeyi dosyaya kaydet
    writeBlogsToFile(posts);
    
    console.log('API: Blog başarıyla silindi, kalan blog sayısı:', posts.length);
    
    // Başarılı yanıt döndür
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API: Blog silme hatası:', error);
    return NextResponse.json(
      { error: `Blog yazısı silinirken bir hata oluştu: ${error.message}` },
      { status: 500 }
    );
  }
} 