# Sistem Informasi Berhenti Studi Sementara (SIBSS)

## Configurasi Project ke Localhost

1. **Clone repo**

   ```bash
   git clone https://github.com/MuhammadZakiAndafi/SIBSS
   ```

2. **Cd ke folder project**

   ```bash
   cd SIBSS
   ```

3. **Install semua depedensi yang diperlukan**

   ```bash
   npm install
   ```

4. **Hidupkan MySQL XAMPP dan buat database & setting koneksi db pada config/config.json**

   ```bash
   "development": {
    "username": "root",
    "password": null,
    "database": "pengajuan_BSS",
    "host": "localhost",
    "dialect": "mysql"
   }
   ```

5. **Jalankan Express dan tailwind di terminal dengan perintah**

   ```bash
   npm run dev 
   ```

6. **Untuk push branch baru**

   ```bash
   git branch (namaBranch)//buat branch baru
   git checkout namaBranch
   git add .
   git commit -m "pesan"
   git push -u origin namaBranch
   ```

## Contributor :

### Muhammad Zaki Andafi (2211523031)
1. mahasiswa dapat mendaftar bss dengan mengisi form pengajuan
2. mahasiswa dapat mengunduh berkas pendukung pendaftaran
3. mahasiswa dapat mengupload berkas pendukung di form pengajuan
4. mahasiswa dapat melihat status permohonan bss
5. mahasiswa dapat mengunduh sk bss


### Regina Nathamiya Pramija (2211523003)
6. mahasiswa dapat melihat periode bss
7. kaprodi dapat melihat daftar yang mengajukan bss
8. kaprodi dapat melihat riwayat mahasiswa yang pernah mengajukan bss
9. kaprodi dapat menyetui permohonan dan menolak permohonan bss
10. kaprodi dapat mengunduh berkas pendukung permohonan bss


### Meydiva Intayeza (2211521012)
11. wadek 1 dapat melihat daftar yang mengajukan bss
12. wadek 1 dapat melihat riwayat mahasiswa yang pernah mengajukan bss
13. wadek 1 dapat mengunduh berkas pendukung permohonan bss
14. wadek 1 dapat menyetui permohonan dan menolak permohonan bss dan 
15. wadek 1 dapat menggenerate sk bss
