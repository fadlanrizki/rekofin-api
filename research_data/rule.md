# Aturan Forward Chaining Rekofin

## 1. Dasar Penentuan Aturan

Berdasarkan data pada `current_base_knowledge.md` dan pola jawaban pada `survey.md`, fakta yang bernilai `Y`/`true` pada indikator awal dapat langsung memicu kesimpulan yang sesuai. Dalam implementasi sistem, aturan diproses dengan pendekatan forward chaining, yaitu:

- semua fakta kondisi pada `ruleConditions` harus terpenuhi,
- jika kondisi terpenuhi, maka hasil pada `ruleResults` akan ditambahkan ke daftar kesimpulan.

Karena pada data penelitian setiap fakta utama memiliki korespondensi satu-satu dengan kesimpulan yang dituju, maka aturan yang paling konsisten adalah aturan satu kondisi ke satu kesimpulan.

## 2. Tabel Aturan Forward Chaining

| No | Nama Aturan | Aturan |
| --- | ----------- | ------ |
| 1 | R001 | IF F001 THEN C001 |
| 2 | R002 | IF F002 THEN C002 |
| 3 | R003 | IF F003 THEN C003 |
| 4 | R004 | IF F004 THEN C004 |
| 5 | R005 | IF F005 THEN C005 |
| 6 | R006 | IF F007 THEN C006 |
| 7 | R007 | IF F006 THEN C007 |

## 3. Interpretasi Kode

- F001 → `Belum Memahami Kebiasaan Belanja` → C001 → `Memahami Kebiasaan Belanja`
- F002 → `Belum Menyusun Rencana Keuangan` → C002 → `Menyusun Rencana Keuangan Pribadi`
- F003 → `Belum Mempunyai Tabungan` → C003 → `Mulai Menabung`
- F004 → `Mempunyai Hutang` → C004 → `Mengelola Utang Dengan Bijak`
- F005 → `Belum Memilih Produk Keuangan` → C005 → `Memilih Produk Keuangan Yang Tepat`
- F007 → `Belum Mulai Berinvestasi` → C006 → `Mulai Berinvestasi Untuk Masa Depan`
- F006 → `Belum Mengelola Risiko Keuangan` → C007 → `Mengelola Risiko Keuangan`

## 4. Catatan Data Pendukung

- F008, F009, dan F010 adalah fakta profil risiko (`Aggressive`, `Moderat`, `Conservative`) yang tidak membentuk kesimpulan utama, tetapi berfungsi sebagai konteks untuk personalisasi rekomendasi.
- F011 (`Prinsip Finansial Syariah`) juga berfungsi sebagai konteks tambahan agar rekomendasi produk dan investasi tetap sesuai prinsip syariah.
- Pada data `survey.md`, pola `Y` pada fakta utama memang secara konsisten menunjukkan kebutuhan rekomendasi terhadap kesimpulan yang sesuai.
