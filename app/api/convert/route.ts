import { NextResponse } from 'next/server';

// Online API'nin demo hali - gerçek uygulamada API anahtarı ile çalışacaktır
export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    // Dosya boyutu kontrolü (10MB)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: 'Dosya boyutu 10MB\'dan büyük olamaz' },
        { status: 400 }
      );
    }

    // Demo amaçlı, API tarafının simülasyonu
    try {
      // Gerçek bir API entegrasyonu burada olacak
      // Örneğin: CloudConvert, PDF.co, ILovePDF, Zamzar vb.
      
      // API çağrısını simüle ediyoruz
      console.log('Dönüştürme işlemi başlatıldı:', file.name);
      
      // API'den yanıt simülasyonu için 2 saniye bekletme
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // PDF dosyasının içeriğini alıyoruz
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Türkçe karakterleri ve diğer özel karakterleri temizleyerek ASCII uyumlu dosya adı oluştur
      const sanitizedFilename = file.name
        .replace('.pdf', '.docx')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Aksanlı karakterleri temizle
        .replace(/[^\x00-\x7F]/g, '') // ASCII olmayan karakterleri temizle
        .replace(/[^a-zA-Z0-9.-]/g, '_'); // Diğer özel karakterleri alt çizgi ile değiştir
      
      // Eğer dosya adı boş kaldıysa varsayılan bir isim ver
      const finalFilename = sanitizedFilename.trim() || 'dokuman.docx';
      
      // Blob API'sini kullanarak yanıt oluştur (karakter kodlama sorunlarını önler)
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${finalFilename}"`,
          'Content-Length': buffer.length.toString()
        },
      });
    } catch (error: any) {
      console.error('API dönüştürme hatası:', error);
      
      return NextResponse.json(
        { error: `Dönüştürme API hatası: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Genel dönüştürme hatası:', error);
    return NextResponse.json(
      { error: `Dönüştürme işlemi başarısız oldu: ${error.message}` },
      { status: 500 }
    );
  }
} 