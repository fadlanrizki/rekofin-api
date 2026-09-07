# Hasil Kesimpulan Akhir Per User

Berdasarkan data pada `survey.md`, `current_base_knowledge.md`, dan aturan pada `rule.md`, maka kesimpulan akhir yang seharusnya diperoleh masing-masing user adalah sebagai berikut.

> Catatan: implementasi yang dipakai adalah logika `priority-first`. Aturan dengan prioritas lebih kecil diproses lebih dulu, dan jika beberapa rule cocok pada level prioritas yang sama, rule dengan jumlah kondisi lebih banyak (lebih spesifik) akan dipilih.

| No  | Nama User    | Fakta yang bernilai `true`               | Kesimpulan Akhir                                                   |
| --- | ------------ | ---------------------------------------- | ------------------------------------------------------------------ |
| 1   | Karyawan 001 | F004, F010, F011                         | C004 – Mengelola Utang Dengan Bijak                                |
| 2   | Karyawan 002 | F002, F003, F005, F006, F007, F010       | C002 – Menyusun Rencana Keuangan Pribadi                           |
| 3   | Karyawan 003 | F004, F007, F009                         | C004 – Mengelola Utang Dengan Bijak                                |
| 4   | Karyawan 004 | F002, F004, F005, F006, F007, F010, F011 | C002 – Menyusun Rencana Keuangan Pribadi                           |
| 5   | Karyawan 005 | F004, F010                               | C004 – Mengelola Utang Dengan Bijak                                |
| 6   | Karyawan 006 | F002, F004, F006, F010                   | C002 – Menyusun Rencana Keuangan Pribadi                           |
| 7   | Karyawan 007 | F010, F011                               | C013 – Investasi untuk profil risiko conservative kategori syariah |
| 8   | Karyawan 008 | F004, F008                               | C004 – Mengelola Utang Dengan Bijak                                |
| 9   | Karyawan 009 | F004, F006, F010                         | C004 – Mengelola Utang Dengan Bijak                                |
| 10  | Karyawan 010 | F004, F009, F011                         | C004 – Mengelola Utang Dengan Bijak                                |
| 11  | Karyawan 011 | F004, F009, F011                         | C004 – Mengelola Utang Dengan Bijak                                |
| 12  | Karyawan 012 | F001, F002, F006, F007, F009, F011       | C001 – Memahami Kebiasaan Belanja                                  |

## Catatan Logika

- Aturan diproses berdasarkan nilai prioritas: prioritas yang lebih kecil diproses lebih dulu.
- Jika beberapa rule cocok pada level prioritas yang sama, rule dengan jumlah kondisi lebih banyak (lebih spesifik) akan dipilih.
- Dengan pola ini, hasil akhir mengikuti prioritas yang ditetapkan, dan untuk fakta yang memuat `F011` serta profil risiko, kesimpulan syariah spesifik seperti `C011` sampai `C013` dapat dipilih lebih dulu.
- Jika user hanya memiliki profil risiko saja tanpa `F011`, maka rule yang cocok adalah:
  - `IF F008 THEN C008`
  - `IF F009 THEN C009`
  - `IF F010 THEN C010`
