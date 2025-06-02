import { NextResponse } from 'next/server';
import { readBlogsFromFile, writeBlogsToFile } from '../../data';

// Beğeni eklemek için POST
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId gerekli' },
        { status: 400 }
      );
    }
    
    // Blog yazılarını dosyadan oku
    const posts = readBlogsFromFile();
    
    // ID'ye göre blog yazısına eriş
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }
    
    // Post nesnesini al
    const post = posts[postIndex];
    
    // Likes dizisini oluştur (yoksa)
    if (!post.likes) {
      post.likes = [];
    }
    
    // Kullanıcı zaten beğendi mi kontrol et
    if (post.likes.includes(userId)) {
      return NextResponse.json(
        { error: 'Bu yazı zaten beğenilmiş' },
        { status: 400 }
      );
    }
    
    // Beğeniyi ekle
    post.likes.push(userId);
    
    // Güncellenmiş blog yazısını listeye ekle
    posts[postIndex] = post;
    
    // Dosyaya kaydet
    writeBlogsToFile(posts);
    
    return NextResponse.json({ success: true, likes: post.likes });
  } catch (error) {
    console.error('Beğeni ekleme hatası:', error);
    return NextResponse.json(
      { error: 'Beğeni eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Beğeni kaldırmak için DELETE
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId gerekli' },
        { status: 400 }
      );
    }
    
    // Blog yazılarını dosyadan oku
    const posts = readBlogsFromFile();
    
    // ID'ye göre blog yazısına eriş
    const postIndex = posts.findIndex(p => p.id === id);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }
    
    // Post nesnesini al
    const post = posts[postIndex];
    
    // Likes dizisini kontrol et
    if (!post.likes || !post.likes.includes(userId)) {
      return NextResponse.json(
        { error: 'Bu yazı henüz beğenilmemiş' },
        { status: 400 }
      );
    }
    
    // Beğeniyi kaldır
    post.likes = post.likes.filter(id => id !== userId);
    
    // Güncellenmiş blog yazısını listeye ekle
    posts[postIndex] = post;
    
    // Dosyaya kaydet
    writeBlogsToFile(posts);
    
    return NextResponse.json({ success: true, likes: post.likes });
  } catch (error) {
    console.error('Beğeni kaldırma hatası:', error);
    return NextResponse.json(
      { error: 'Beğeni kaldırılırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 