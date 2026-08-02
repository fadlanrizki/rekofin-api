# Hasil Kesimpulan Akhir Per User

Berdasarkan data pada `survey.md`, `current_base_knowledge.md`, dan aturan pada `rule.md`, maka kesimpulan akhir yang seharusnya diperoleh masing-masing user adalah sebagai berikut.

> Catatan: implementasi yang dipakai adalah logika `priority-first`, sehingga rule yang paling spesifik akan dipilih terlebih dahulu.

| No  | Nama User    | Fakta yang bernilai `true`               | Kesimpulan Akhir                                  |
| --- | ------------ | ---------------------------------------- | ------------------------------------------------- |
| 1   | Karyawan 001 | F004, F010, F011                         | C004 – Mengelola Utang Dengan Bijak               |
| 2   | Karyawan 002 | F002, F003, F005, F006, F007, F010       | C002 – Menyusun Rencana Keuangan Pribadi          |
| 3   | Karyawan 003 | F004, F007, F009                         | C004 – Mengelola Utang Dengan Bijak               |
| 4   | Karyawan 004 | F002, F004, F005, F006, F007, F010, F011 | C002 – Menyusun Rencana Keuangan Pribadi          |
| 5   | Karyawan 005 | F004, F010                               | C004 – Mengelola Utang Dengan Bijak               |
| 6   | Karyawan 006 | F002, F004, F006, F010                   | C002 – Menyusun Rencana Keuangan Pribadi          |
| 7   | Karyawan 007 | F010, F011                               | C010 – Investasi untuk profil risiko conservative |
| 8   | Karyawan 008 | F004, F008                               | C004 – Mengelola Utang Dengan Bijak               |
| 9   | Karyawan 009 | F004, F006, F010                         | C004 – Mengelola Utang Dengan Bijak               |
| 10  | Karyawan 010 | F004, F009, F011                         | C004 – Mengelola Utang Dengan Bijak               |
| 11  | Karyawan 011 | F004, F009, F011                         | C004 – Mengelola Utang Dengan Bijak               |
| 12  | Karyawan 012 | F001, F002, F006, F007, F009, F011       | C001 – Memahami Kebiasaan Belanja                 |

## Catatan Logika

- Rule umum (`R001` sampai `R010`) diproses terlebih dahulu.
- Rule investasi spesifik (`R011` sampai `R013`) diposisikan di akhir agar hanya muncul setelah fase dasar keuangan selesai.
- Dengan pola ini, hasil akhir cenderung mengikuti kesimpulan umum seperti `C001` sampai `C010` sebelum masuk ke kesimpulan spesifik investasi.
- Jika user hanya memiliki profil risiko saja tanpa `F011`, maka rule yang cocok adalah:
  - `IF F008 THEN C008`
  - `IF F009 THEN C009`
  - `IF F010 THEN C010`
