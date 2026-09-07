## Data Kesimpulan

| No  | Kode Kesimpulan | Kesimpulan                                                  |
| --- | --------------- | ----------------------------------------------------------- |
| 1   | C001            | Memahami Kebiasaan Belanja                                  |
| 2   | C002            | Menyusun Rencana Keuangan Pribadi                           |
| 3   | C003            | Mulai Menabung                                              |
| 4   | C004            | Mengelola Utang Dengan Bijak                                |
| 5   | C005            | Memilih Produk Keuangan Yang Tepat                          |
| 6   | C006            | Mulai Berinvestasi Untuk Masa Depan                         |
| 7   | C007            | Mengelola Risiko Keuangan                                   |
| 8   | C008            | Investasi untuk profil risiko aggressive                    |
| 9   | C009            | Investasi untuk profil risiko moderat                       |
| 10  | C010            | Investasi untuk profil risiko conservative                  |
| 11  | C011            | Investasi untuk profil risiko aggressive kategori syariah   |
| 12  | C012            | Investasi untuk profil risiko moderat kategori syariah      |
| 13  | C013            | Investasi untuk profil risiko conservative kategori syariah |

## Data Fakta

| No  | Kode Fakta | Fakta                            |
| --- | ---------- | -------------------------------- |
| 1   | F001       | Belum Memahami Kebiasaan Belanja |
| 2   | F002       | Belum Menyusun Rencana Keuangan  |
| 3   | F003       | Belum Mempunyai Tabungan         |
| 4   | F004       | Mempunyai Hutang                 |
| 5   | F005       | Belum Memilih Produk Keuangan    |
| 6   | F006       | Belum Mengelola Risiko Keuangan  |
| 7   | F007       | Belum Mulai Berinvestasi         |
| 8   | F008       | Profil Risiko Aggressive         |
| 9   | F009       | Profil Risiko Moderat            |
| 10  | F010       | Profil Risiko Conservative       |
| 11  | F011       | Prinsip Finansial Syariah        |

## Catatan Aturan Forward Chaining

- F001 sampai F007 merupakan fakta pemicu utama untuk menghasilkan kesimpulan C001 sampai C007 secara langsung.
- F008, F009, dan F010 merupakan fakta profil risiko (`Aggressive`, `Moderat`, `Conservative`) yang dapat dipakai untuk menghasilkan conclusion spesifik pada tahap investasi.
- F011 merupakan fakta preferensi syariah yang dapat dipakai sebagai penguat konteks rekomendasi produk dan investasi agar sesuai prinsip syariah.
- Ketika user sudah berada pada tahap investasi, maka kombinasi fakta profil risiko dan syariah dapat memicu kesimpulan spesifik berikut:
  - `F008` → `C008`
  - `F009` → `C009`
  - `F010` → `C010`
  - `F008 AND F011` → `C011`
  - `F009 AND F011` → `C012`
  - `F010 AND F011` → `C013`
- Dalam skema inferensi, setiap fakta yang bernilai `Y`/`true` pada F001-F007 tetap dapat memicu satu kesimpulan yang bersesuaian. Untuk F008-F011, kesimpulan baru akan muncul bila fakta-fakta tersebut digabungkan dalam rule yang spesifik.
