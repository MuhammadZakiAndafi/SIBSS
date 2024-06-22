const PDFDocument = require('pdfkit');
const fs = require("fs");

const download = async (req, res) => {
  try {
    const { id } = req.params;
    const User = await users.findAll({
      where: {
        Id: id
      },
    });
    const matkul = await Subject.findByPk(id,{
      include:[Lecturer]
    })

// Buat dokumen PDF baru
const doc = new PDFDocument();
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', `attachment; filename="SK-BSS-${user.name}.pdf"`);

// Pipe output PDF ke response
doc.pipe(res);

// Tambahkan konten ke PDF
doc.fontSize(20).text(`Surat Keputusan Berhenti Studi Sementara Tahun Ajaran 2024/2025 ${pengajuan.fakultas}`, { align: 'center' });
doc.moveDown(0.1);

pengajuan.forEach((pengajuan, index) => {
  doc.fontSize(12).text(`${index + 1}. Nomor surat: ${pengajuan.id}`);
  doc.text(`   Nama: ${pengajuan.name}`);
  doc.text(`   Nim: ${pengajuan.nim}`);
  doc.moveDown(0.1);
});


// Selesaikan dokumen
doc.end();
} catch (error) {
console.error('Error generating PDF:', error);
res.status(500).send('Internal Server Error');
}

};

module.exports = {
doc
};