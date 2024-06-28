const db = require('../models');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.showSk = async (req, res) => {
  try {
    const userId = req.session.user.id; 
    const userlogin = req.session.user;
    const userRole = userlogin.role; 
    const pengajuan = await db.Pengajuan.findOne({
      where: { userId: userId }
    });
    const sks = await db.SuratKeputusan.findAll({
      where: { pengajuanId: pengajuan.id },
      include: [{model: db.Pengajuan}]
    });

    res.render('user/suratkeputusan', {
       sks,
       title: 'Surat Keputusan',
       userRole
       });
  } catch (error) {
    console.error('Error fetching surat keputusan:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.generateSK = async (req, res) => {
  try {
    const pengajuanId = req.params.id;
    
    const pengajuan = await db.Pengajuan.findOne({
      where: { id: pengajuanId },
      include: [db.SuratKeputusan] 
    });

    if (!pengajuan) {
      req.flash('error', 'Pengajuan tidak ditemukan.');
      return res.redirect('/daftarPengajuan');
    }

    const doc = new PDFDocument();

    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const filePath = path.join(outputDir, `sk_${pengajuanId}.pdf`);

    const output = fs.createWriteStream(filePath);
    doc.pipe(output);

    doc.fontSize(12);
    doc.text(`Surat Keputusan`);
    doc.moveDown();

    if (pengajuan.SuratKeputusan) {
      doc.text(`Nomor Surat: ${pengajuan.SuratKeputusan.nomor}`);
      doc.text(`Tanggal: ${pengajuan.SuratKeputusan.tanggal.toDateString()}`);
    } else {
      doc.text(`Nomor Surat: -`);
      doc.text(`Tanggal: -`);
        
      doc.text('KEPUTUSAN REKTOR UNIVERSITAS ANDALAS',{ fontSize: 24, fontWeight: 'bold' });
      doc.text('Nomor 1084/XIV/R/KPT/2024');

     
      doc.text('BERHENTI STUDI SEMENTARA MAHASISWA PROGRAM SARJANA UNIVERSITAS ANDALAS PADA SEMESTER GENAP TAHUN AKADEMIK 2023/2024', { fontSize: 18, fontWeight: 'bold' });
      doc.text('REKTOR UNIVERSITAS ANDALAS,',{ fontSize: 18, fontWeight: 'bold' });

     
      doc.text('Membaca:', { fontSize: 14, fontWeight: 'bold' });
      doc.text(`Surat Permohonan Berhenti Studi Sementara mahasiswa Program Sarjana Universitas Andalas atas nama ${pengajuan.name} NIM. ${pengajuan.nim} dan kawan-kawan yang telah disetujui Dekan/Direktur Fakultas/Program di lingkungan Universitas Andalas`);

      doc.text('Menimbang:', { fontSize: 14, fontWeight: 'bold' });
      doc.text(`a. bahwa berdasarkan Peraturan Rektor Nomor 3 Tahun 2016 tentang peraturan akademik Universitas Andalas, kepada ${pengajuan.name} NIM. ${pengajuan.nim} dan kawan-kawan dapat diberikan izin untuk Berhenti Studi Sementara;`);
      doc.text('b. bahwa untuk pelaksanaan hal tersebut pada butir a di atas perlu ditetapkan dengan Keputusan Rektor.');

      doc.text('Mengingat:', { fontSize: 14, fontWeight: 'bold' });
      doc.text('1. Undang-Undang Nomor 12 Tahun 2012 tentang Pendidikan Tinggi (Lembaran Negara Republik Indonesia Tahun 2012 Nomor 158, Tambahan Lembaran Negara Republik Indonesia Nomor 5336);');
      doc.text('2. Peraturan Pemerintah Nomor 4 Tahun 2014 tentang Penyelenggaraan Pendidikan Tinggi dan Pengelolaan Perguruan Tinggi (Lembaran Negara Republik Indonesia Tahun 2014 Nomor 14, Tambahan Lembaran Negara Republik Indonesia Nomor 5500);');
      doc.text('3. Peraturan Presiden Republik Indonesia Nomor 8 tahun 2012 tentang Kerangka Kualifikasi Nasional Indonesia (KKNI) (Lembaran Negara Republik Indonesia Tahun 2012 Nomor 24);');
      doc.text('4. Peraturan Menteri Pendidikan dan Kebudayaan Republik Indonesia Nomor 25 Tahun 2012 tentang Organisasi dan Tata Kerja Universitas Andalas (Berita Negara Republik Indonesia Tahun 2012 Nomor 434);');
      doc.text('5. Peraturan Menteri Pendidikan dan Kebudayaan Republik Indonesia Nomor 47 Tahun 2013 tentang Statuta Universitas Andalas (Berita Negara Republik Indonesia Tahun 2013 Nomor 596);');

    }
   
    doc.end();

    if (!pengajuan.SuratKeputusan) {
      await db.SuratKeputusan.create({
        pengajuanId: pengajuanId,
        nomor: '',
        tanggal: new Date(),
        keterangan: '',
        lampiran: '',
   
      });
    }

   
    res.status(201).send(`SK generated successfully and saved to ${filePath}`);

  } catch (error) {
    console.error('Error generating SK:', error);
    req.flash('error', 'Failed to generate SK');
    res.redirect('/daftarPengajuan');
  }
};