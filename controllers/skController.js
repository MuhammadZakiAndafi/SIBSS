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

    // Pipe the PDF into a writable stream which then gets piped to response
    const filePath = path.join(__dirname, '..', 'tmp', `sk_${pengajuanId}.pdf`);
    const output = fs.createWriteStream(filePath);
    doc.pipe(output);

    // Build the content of the PDF dynamically based on pengajuan data
    doc.fontSize(12);
    doc.text(`Surat Keputusan`);
    doc.moveDown();

    // Insert content dynamically
    doc.text(`Nomor Surat: ${pengajuan.SuratKeputusan.nomor}`);
    doc.text(`Tanggal: ${pengajuan.SuratKeputusan.tanggal.toDateString()}`);
    // Add more content as needed

    // Finalize the PDF and close the stream
    doc.end();

    // Send file as response for download
    output.on('finish', () => {
      res.download(filePath, `SK_${pengajuanId}.pdf`, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).send('Failed to download file.');
        }
        // Delete the temporary file after download
        fs.unlinkSync(filePath);
      });
    });

  } catch (error) {
    console.error('Error generating SK:', error);
    req.flash('error', 'Failed to generate SK');
    res.redirect('/daftarPengajuan');
  }
};