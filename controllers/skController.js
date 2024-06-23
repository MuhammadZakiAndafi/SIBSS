const db = require('../models');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.showSk = async (req, res) => {
  try {
    const userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login
    const userlogin = req.session.user;
    const userRole = userlogin.role; // Mendapatkan role user
    // Ambil pengajuan yang terhubung dengan userId
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
    
    // Fetch pengajuan details
    const pengajuan = await db.Pengajuan.findOne({
      where: { id: pengajuanId },
      include: [db.SuratKeputusan] // Include SK if needed
    });

    if (!pengajuan) {
      req.flash('error', 'Pengajuan tidak ditemukan.');
      return res.redirect('/daftarPengajuan');
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set up the output file path and create the directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const filePath = path.join(outputDir, `sk_${pengajuanId}.pdf`);

    // Pipe the PDF into a writable stream
    const output = fs.createWriteStream(filePath);
    doc.pipe(output);

    // Build the content of the PDF dynamically based on pengajuan data
    doc.fontSize(12);
    doc.text(`Surat Keputusan`);
    doc.moveDown();

    // Insert content dynamically
    if (pengajuan.SuratKeputusan) {
      doc.text(`Nomor Surat: ${pengajuan.SuratKeputusan.nomor}`);
      doc.text(`Tanggal: ${pengajuan.SuratKeputusan.tanggal.toDateString()}`);
    } else {
      doc.text(`Nomor Surat: -`);
      doc.text(`Tanggal: -`);
    }
    // Add more content as needed

    // Finalize the PDF and close the stream
    doc.end();

    // Save the SK to database
    if (!pengajuan.SuratKeputusan) {
      await db.SuratKeputusan.create({
        pengajuanId: pengajuanId,
        nomor: '',
        tanggal: new Date(),
        keterangan: '',
        lampiran: '',
        // Add more fields as needed
      });
    }

    // Send a success response
    res.status(201).send(`SK generated successfully and saved to ${filePath}`);

  } catch (error) {
    console.error('Error generating SK:', error);
    req.flash('error', 'Failed to generate SK');
    res.redirect('/daftarPengajuan');
  }
};