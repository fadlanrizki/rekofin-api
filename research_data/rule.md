# Aturan Forward Chaining Rekofin

## 1. Dasar Penentuan Aturan

Berdasarkan data pada `current_base_knowledge.md` dan pola jawaban pada `survey.md`, fakta yang bernilai `Y`/`true` pada indikator awal dapat langsung memicu kesimpulan yang sesuai. Dalam implementasi sistem, aturan diproses dengan pendekatan forward chaining, yaitu:

- semua fakta kondisi pada `ruleConditions` harus terpenuhi,
- jika kondisi terpenuhi, maka hasil pada `ruleResults` akan ditambahkan ke daftar kesimpulan.

Karena pada data penelitian setiap fakta utama memiliki korespondensi satu-satu dengan kesimpulan yang dituju, maka aturan yang paling konsisten adalah aturan satu kondisi ke satu kesimpulan.

## 2. Tabel Aturan Forward Chaining

| No  | Nama Aturan | Aturan                     | Prioritas |
| --- | ----------- | -------------------------- | --------- |
| 1   | R001        | IF F001 THEN C001          | 1         |
| 2   | R002        | IF F002 THEN C002          | 2         |
| 3   | R003        | IF F003 THEN C003          | 3         |
| 4   | R004        | IF F004 THEN C004          | 4         |
| 5   | R005        | IF F005 THEN C005          | 5         |
| 6   | R006        | IF F007 THEN C006          | 6         |
| 7   | R007        | IF F006 THEN C007          | 7         |
| 8   | R008        | IF F008 THEN C008          | 8         |
| 9   | R009        | IF F009 THEN C009          | 9         |
| 10  | R010        | IF F010 THEN C010          | 10        |
| 11  | R011        | IF F008 AND F011 THEN C011 | 11        |
| 12  | R012        | IF F009 AND F011 THEN C012 | 12        |
| 13  | R013        | IF F010 AND F011 THEN C013 | 13        |

## 3. Interpretasi Kode

- F001 → `Belum Memahami Kebiasaan Belanja` → C001 → `Memahami Kebiasaan Belanja`
- F002 → `Belum Menyusun Rencana Keuangan` → C002 → `Menyusun Rencana Keuangan Pribadi`
- F003 → `Belum Mempunyai Tabungan` → C003 → `Mulai Menabung`
- F004 → `Mempunyai Hutang` → C004 → `Mengelola Utang Dengan Bijak`
- F005 → `Belum Memilih Produk Keuangan` → C005 → `Memilih Produk Keuangan Yang Tepat`
- F007 → `Belum Mulai Berinvestasi` → C006 → `Mulai Berinvestasi Untuk Masa Depan`
- F006 → `Belum Mengelola Risiko Keuangan` → C007 → `Mengelola Risiko Keuangan`
- F008 → `Profil Risiko Aggressive` → C008 → `Investasi untuk profil risiko aggressive`
- F009 → `Profil Risiko Moderat` → C009 → `Investasi untuk profil risiko moderat`
- F010 → `Profil Risiko Conservative` → C010 → `Investasi untuk profil risiko conservative`
- F008 AND F011 → C011 → `Investasi untuk profil risiko aggressive kategori syariah`
- F009 AND F011 → C012 → `Investasi untuk profil risiko moderat kategori syariah`
- F010 AND F011 → C013 → `Investasi untuk profil risiko conservative kategori syariah`

## 4. Catatan Data Pendukung

- F008, F009, dan F010 adalah fakta profil risiko (`Aggressive`, `Moderat`, `Conservative`) yang dapat membentuk kesimpulan spesifik pada tahap investasi.
- F011 (`Prinsip Finansial Syariah`) berfungsi sebagai penguat konteks agar rekomendasi produk dan investasi tetap sesuai prinsip syariah.
- Pada data `survey.md`, pola `Y` pada fakta utama memang secara konsisten menunjukkan kebutuhan rekomendasi terhadap kesimpulan yang sesuai.
- Dalam implementasi `priority-first`, rule yang lebih umum (`F001` sampai `F010`) harus diproses terlebih dahulu, sedangkan rule investasi spesifik (`F008 AND F011`, `F009 AND F011`, `F010 AND F011`) diletakkan di akhir karena mereka merepresentasikan tahap lanjut setelah user sudah masuk ke fase investasi. Dengan kata lain, `R011-R013` diprioritaskan terakhir agar hasil keputusan tetap mengikuti alur fase perencanaan dan pengelolaan keuangan sebelum masuk ke konteks investasi spesifik.
