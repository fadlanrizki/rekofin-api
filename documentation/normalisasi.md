# Analisis Normalisasi Database Rekofin API

Dokumen ini berisi analisis dan penjelasan tahapan normalisasi basis data pada sistem **Rekofin (Rekomendasi Keuangan Pribadi)** berdasarkan skema database aktual yang didefinisikan dalam [prisma/schema.prisma](prisma/schema.prisma).

---

## 1. Ringkasan Hasil Analisis

Berdasarkan struktur tabel, atribut, serta relasi pada skema database aktual, tingkat normalisasi basis data Rekofin API telah memenuhi **Bentuk Normal Ketiga (3NF / Third Normal Form)** dan juga **Boyce-Codd Normal Form (BCNF)**.

### Ringkasan Tahapan Normalisasi:

- **UNF (Unnormalized Form)**: Seluruh data pengguna, pertanyaan/fakta, jawaban konsultasi, aturan inferensi (rule), hasil kesimpulan, rekomendasi, dan sumber pustaka berada dalam satu tabel monolitik berulang (_repeating groups_).
- **1NF (First Normal Form)**: Mengeliminasi _repeating groups_, memastikan seluruh atribut bernilai atomik, serta menentukan _Primary Key_ awal.
- **2NF (Second Normal Form)**: Mengeliminasi Ketergantungan Parsial (_Partial Dependency_), memisahkan entitas master dari entitas transaksi dan relasi _many-to-many_.
- **3NF (Third Normal Form)**: Mengeliminasi Ketergantungan Transitif (_Transitive Dependency_), memastikan seluruh atribut non-key hanya bergantung langsung pada _Primary Key_.
- **BCNF (Boyce-Codd Normal Form)**: Memastikan setiap determinan ($X \rightarrow Y$) adalah _Super Key_ atau _Candidate Key_.

### Alur Pemecahan Tabel

Normalisasi Rekofin dapat digambarkan dengan pola yang sama seperti contoh, yaitu
sebuah struktur data besar diuraikan secara bertahap menjadi tabel-tabel yang lebih
kecil. Perbedaannya, entitas pada diagram harus mengikuti domain Rekofin:

```text
UNF_Rekofin
  |
  |  Memisahkan kelompok data berulang dan memastikan nilai setiap kolom atomik
  v
1NF
  |-- user
  |-- fact
  |-- conclusion
  |-- source
  |-- recommendation
  |-- rule
  |-- rule_condition
  |-- rule_result
  |-- consultation
  |-- consultation_answer
  `-- consultation_conclusion
  |
  |  Memastikan atribut bergantung penuh pada kunci tabel
  v
2NF
  |
  |  Memindahkan atribut yang bergantung pada atribut non-key ke tabel pemiliknya
  v
3NF
```

Dengan demikian, "tabel besar" pada UNF bukan tabel yang sedang digunakan oleh
aplikasi, melainkan gambaran konseptual kondisi data sebelum didekomposisi. Tabel
yang benar-benar digunakan aplikasi adalah tabel-tabel hasil normalisasi pada
`schema.prisma`.

### Pemetaan Data Besar ke Tabel Kecil

| Kelompok data pada UNF               | Tabel hasil normalisasi   | Alasan pemisahan                                                                                      |
| :----------------------------------- | :------------------------ | :---------------------------------------------------------------------------------------------------- |
| Data akun dan hak akses              | `user`                    | Satu akun dikelola pada satu tempat dan dapat memiliki banyak konsultasi atau aturan.                 |
| Data pertanyaan/fakta                | `fact`                    | Fakta dapat digunakan oleh banyak aturan dan banyak konsultasi.                                       |
| Data kesimpulan                      | `conclusion`              | Kesimpulan merupakan data master yang dapat digunakan oleh aturan, rekomendasi, dan hasil konsultasi. |
| Data sumber referensi                | `source`                  | Detail sumber tidak diulang pada setiap rekomendasi.                                                  |
| Isi rekomendasi                      | `recommendation`          | Rekomendasi merujuk ke `conclusion` dan `source` melalui foreign key.                                 |
| Header aturan inferensi              | `rule`                    | Detail aturan disimpan terpisah dari fakta kondisi dan hasilnya.                                      |
| Fakta yang menjadi kondisi aturan    | `rule_condition`          | Tabel penghubung antara `rule` dan `fact`.                                                            |
| Kesimpulan yang menjadi hasil aturan | `rule_result`             | Tabel penghubung antara `rule` dan `conclusion`.                                                      |
| Header sesi konsultasi               | `consultation`            | Menyimpan identitas user, status, dan waktu sesi.                                                     |
| Jawaban fakta dalam konsultasi       | `consultation_answer`     | Satu baris mewakili satu jawaban fakta pada satu konsultasi.                                          |
| Kesimpulan hasil konsultasi          | `consultation_conclusion` | Tabel penghubung antara sesi konsultasi dan kesimpulan.                                               |

### Daftar Kolom per Tabel

Berikut adalah daftar kolom setiap tabel hasil normalisasi. Kolom ditulis dalam
satu baris dan dipisahkan menggunakan koma agar mudah dipindahkan ke diagram.

```text
user: userId, fullname, username, email, password, role, gender, isActive, createdAt

fact: factId, code, description, question, fact, createdAt, isActive

conclusion: conclusionId, code, description, category, createdAt, isActive

source: sourceId, title, author, publisher, sourceType, url, description, createdAt

recommendation: recommendationId, title, content, sourceId, createdAt, isActive, conclusionId

rule: ruleId, name, description, isActive, priority, createdBy, createdAt

rule_condition: ruleConditionId, ruleId, factId

rule_result: ruleResultId, ruleId, conclusionId

consultation: consultationId, userId, status, startedAt, endedAt, comparisonNote

consultation_answer: consultationAnswerId, consultationId, factId, value

consultation_conclusion: consultationConclusionId, consultationId, conclusionId
```

Keterangan kunci pada daftar kolom:

```text
PK = Primary Key
FK = Foreign Key
UQ = Unique Key
```

Kolom yang berperan sebagai kunci adalah `userId` (PK), `factId` (PK),
`conclusionId` (PK), `sourceId` (PK), `recommendationId` (PK), `ruleId` (PK),
`ruleConditionId` (PK), `ruleResultId` (PK), `consultationId` (PK),
`consultationAnswerId` (PK), dan `consultationConclusionId` (PK). Kolom
`username`, `email`, `code` pada `fact`, serta `code` pada `conclusion` memiliki
aturan unik sesuai skema database.

### Contoh Relasi pada Hasil Pemecahan

Relasi utama setelah pemecahan dapat dibaca sebagai berikut:

```text
user 1 ----- N consultation 1 ----- N consultation_answer N ----- 1 fact
                                      |
                                      `----- N consultation_conclusion N ----- 1 conclusion

user 1 ----- N rule 1 ----- N rule_condition N ----- 1 fact
                       |
                       `----- N rule_result N ----- 1 conclusion

conclusion 1 ----- N recommendation N ----- 0..1 source
```

Foreign key hanya menyimpan identitas data yang dirujuk. Contohnya, tabel
`consultation_answer` menyimpan `consultationId`, `factId`, dan `value`; tabel ini
tidak menyalin `username`, `fact`, atau `question`. Detail tersebut diambil dari
tabel `user` dan `fact` melalui relasi.

---

## 2. Bentuk Tidak Ternormalisasi (UNF - Unnormalized Form)

Pada bentuk awal sebelum dilakukan normalisasi (UNF), seluruh data sistem Rekofin digabungkan ke dalam satu struktur tabel monolitik. Bentuk ini mengandung kelompok data berulang (_repeating groups_) dan banyak atribut bernilai ganda (_multivalued attributes_).

### Structure UNF (Contoh Skema Monolitik `UNF_Rekofin`):

```text
UNF_Rekofin (
    consultationId, userId, fullname, username, email, password, role, gender,
    consultation_status, startedAt, endedAt, comparisonNote,
    { factId, fact_code, fact_description, fact_question, fact_text, answer_value },
    { ruleId, rule_name, rule_description, rule_priority, createdBy, creator_fullname,
        { condition_factId, condition_fact_code },
        { result_conclusionId, result_conclusion_code }
    },
    { conclusionId, conclusion_code, conclusion_description, category,
        { recommendationId, rec_title, rec_content, sourceId, source_title, source_author, source_publisher, sourceType, source_url }
    }
)
```

### Tabel Atribut Kolom pada Unnormalized Form (`UNF_Rekofin`):

Berikut adalah rincian seluruh atribut kolom yang tergabung dalam satu tabel monolitik UNF beserta pengelompokan _repeating groups_-nya:

| No  | Atribut Kolom            | Kelompok Data / Kategori              | Keterangan & Status Kelompok                           |
| :-: | :----------------------- | :------------------------------------ | :----------------------------------------------------- |
|  1  | `consultationId`         | Header Konsultasi                     | Atribut utama sesi konsultasi                          |
|  2  | `userId`                 | Pengguna (_User_)                     | ID pengguna yang melakukan konsultasi                  |
|  3  | `fullname`               | Pengguna (_User_)                     | Nama lengkap pengguna                                  |
|  4  | `username`               | Pengguna (_User_)                     | Nama pengguna unik                                     |
|  5  | `email`                  | Pengguna (_User_)                     | Alamat email pengguna                                  |
|  6  | `password`               | Pengguna (_User_)                     | Kata sandi terenkripsi                                 |
|  7  | `role`                   | Pengguna (_User_)                     | Hak akses (`ADMIN` / `USER`)                           |
|  8  | `gender`                 | Pengguna (_User_)                     | Jenis kelamin pengguna                                 |
|  9  | `consultation_status`    | Header Konsultasi                     | Status sesi (`IN_PROGRESS` / `COMPLETED`)              |
| 10  | `startedAt`              | Header Konsultasi                     | Waktu mulai konsultasi                                 |
| 11  | `endedAt`                | Header Konsultasi                     | Waktu selesai konsultasi                               |
| 12  | `comparisonNote`         | Header Konsultasi                     | Catatan perbandingan hasil                             |
| 13  | `factId`                 | **Repeating Group 1** (Jawaban)       | ID fakta yang dijawab dalam konsultasi (_multivalued_) |
| 14  | `fact_code`              | **Repeating Group 1** (Jawaban)       | Kode fakta (_multivalued_)                             |
| 15  | `fact_description`       | **Repeating Group 1** (Jawaban)       | Deskripsi fakta (_multivalued_)                        |
| 16  | `fact_question`          | **Repeating Group 1** (Jawaban)       | Pertanyaan fakta (_multivalued_)                       |
| 17  | `fact_text`              | **Repeating Group 1** (Jawaban)       | Pernyataan fakta (_multivalued_)                       |
| 18  | `answer_value`           | **Repeating Group 1** (Jawaban)       | Jawaban user (`true`/`false`) (_multivalued_)          |
| 19  | `ruleId`                 | **Repeating Group 2** (Aturan)        | ID aturan yang teruji/terpemicu (_multivalued_)        |
| 20  | `rule_name`              | **Repeating Group 2** (Aturan)        | Nama aturan inferensi (_multivalued_)                  |
| 21  | `rule_description`       | **Repeating Group 2** (Aturan)        | Deskripsi aturan (_multivalued_)                       |
| 22  | `rule_priority`          | **Repeating Group 2** (Aturan)        | Nilai prioritas eksekusi aturan (_multivalued_)        |
| 23  | `createdBy`              | **Repeating Group 2** (Aturan)        | ID admin pembuat aturan (_multivalued_)                |
| 24  | `creator_fullname`       | **Repeating Group 2** (Aturan)        | Nama admin pembuat aturan (_multivalued_)              |
| 25  | `condition_factId`       | **Repeating Group 2.1** (Syarat Rule) | ID fakta syarat kondisi aturan (_nested array_)        |
| 26  | `condition_fact_code`    | **Repeating Group 2.1** (Syarat Rule) | Kode fakta syarat kondisi aturan (_nested array_)      |
| 27  | `result_conclusionId`    | **Repeating Group 2.2** (Hasil Rule)  | ID kesimpulan hasil aturan (_nested array_)            |
| 28  | `result_conclusion_code` | **Repeating Group 2.2** (Hasil Rule)  | Kode kesimpulan hasil aturan (_nested array_)          |
| 29  | `conclusionId`           | **Repeating Group 3** (Kesimpulan)    | ID kesimpulan hasil konsultasi (_multivalued_)         |
| 30  | `conclusion_code`        | **Repeating Group 3** (Kesimpulan)    | Kode kesimpulan (_multivalued_)                        |
| 31  | `conclusion_description` | **Repeating Group 3** (Kesimpulan)    | Deskripsi kesimpulan (_multivalued_)                   |
| 32  | `category`               | **Repeating Group 3** (Kesimpulan)    | Kategori kesimpulan (_multivalued_)                    |
| 33  | `recommendationId`       | **Repeating Group 3.1** (Rekomendasi) | ID rekomendasi (_nested array_)                        |
| 34  | `rec_title`              | **Repeating Group 3.1** (Rekomendasi) | Judul rekomendasi (_nested array_)                     |
| 35  | `rec_content`            | **Repeating Group 3.1** (Rekomendasi) | Konten/isi rekomendasi (_nested array_)                |
| 36  | `sourceId`               | **Repeating Group 3.1** (Sumber)      | ID sumber referensi (_nested array_)                   |
| 37  | `source_title`           | **Repeating Group 3.1** (Sumber)      | Judul sumber referensi (_nested array_)                |
| 38  | `source_author`          | **Repeating Group 3.1** (Sumber)      | Penulis/pakar sumber (_nested array_)                  |
| 39  | `source_publisher`       | **Repeating Group 3.1** (Sumber)      | Penerbit sumber (_nested array_)                       |
| 40  | `sourceType`             | **Repeating Group 3.1** (Sumber)      | Tipe sumber (`BOOK`/`JOURNAL`/dll.) (_nested array_)   |
| 41  | `source_url`             | **Repeating Group 3.1** (Sumber)      | URL tautan sumber (_nested array_)                     |

### Anomali yang Terjadi pada UNF:

1. **Anomali Penyisipan (Insertion Anomaly)**:
   - Data fakta baru (`Fact`), aturan inferensi (`Rule`), atau sumber pustaka (`Source`) tidak dapat dimasukkan ke dalam basis data jika belum ada sesi konsultasi (`Consultation`) yang dilakukan oleh pengguna.
2. **Anomali Penghapusan (Deletion Anomaly)**:
   - Jika suatu baris transaksi sesi konsultasi (`Consultation`) dihapus, maka data profil pengguna (`User`), fakta (`Fact`), kesimpulan (`Conclusion`), dan rekomendasi (`Recommendation`) yang terkait dalam baris tersebut akan ikut terhapus dari sistem.
3. **Anomali Perubahan (Update Anomaly)**:
   - Jika terdapat perubahan data master (misalnya perubahan nama pengguna `fullname` atau deskripsi fakta `fact_description`), maka perubahan harus dilakukan pada banyak baris data di seluruh sesi konsultasi yang mencatatnya. Ketidakkonsistenan data akan terjadi jika ada baris yang terlewat saat _update_.

---

## 3. Bentuk Normal Pertama (1NF - First Normal Form)

### Syarat 1NF:

1. Tidak ada atribut bernilai ganda (_multivalued attributes_) atau kelompok berulang (_repeating groups_). Setiap sel data harus bernilai atomik (_atomic value_).
2. Setiap tabel memiliki penanda unik (_Primary Key_).

### Langkah Transformasi UNF $\rightarrow$ 1NF:

Memecah kelompok berulang pada bentuk UNF menjadi baris-baris terpisah dan mengelompokkan atribut berdasarkan entitas utamanya dengan menentukan _Primary Key_ (PK) dan _Foreign Key_ (FK) awal.

### Structure & Rincian Tabel pada 1NF:

Pada tahap ini, kelompok data berulang pada UNF diuraikan menjadi **11 tabel**.
Setiap tabel memiliki nilai atomik dan _Primary Key_. Tabel-tabel ini kemudian
dievaluasi kembali pada tahap 2NF dan 3NF; jadi, 1NF merupakan tahap awal
dekomposisi, bukan klaim bahwa seluruh ketergantungan sudah selesai.

#### 1. Tabel `user` (Master Pengguna)

| Kolom       | Tipe Data       | Null | Kunci | Keterangan                                   |
| :---------- | :-------------- | :--: | :---: | :------------------------------------------- |
| `userId`    | Int             |  No  |  PK   | Primary Key, Auto Increment                  |
| `fullname`  | String          |  No  |   -   | Nama lengkap pengguna                        |
| `username`  | String          |  No  |  UQ   | Username unik                                |
| `email`     | String          |  No  |  UQ   | Alamat email unik                            |
| `password`  | String          |  No  |   -   | Password terenkripsi                         |
| `role`      | Enum (`Role`)   |  No  |   -   | Role: `ADMIN` / `USER` (Default: `USER`)     |
| `gender`    | Enum (`Gender`) | Yes  |   -   | Jenis kelamin: `MALE` / `FEMALE` / `UNKNOWN` |
| `isActive`  | Boolean         |  No  |   -   | Status aktif akun (Default: `true`)          |
| `createdAt` | DateTime        |  No  |   -   | Waktu pembuatan akun (Default: `now()`)      |

#### 2. Tabel `fact` (Master Fakta & Pertanyaan)

| Kolom         | Tipe Data     | Null | Kunci | Keterangan                               |
| :------------ | :------------ | :--: | :---: | :--------------------------------------- |
| `factId`      | Int           |  No  |  PK   | Primary Key, Auto Increment              |
| `code`        | String        |  No  |  UQ   | Kode fakta unik (misal: `F01`)           |
| `description` | String (Text) |  No  |   -   | Deskripsi fakta                          |
| `question`    | String        |  No  |   -   | Pertanyaan untuk menguji fakta           |
| `fact`        | String        |  No  |   -   | Pernyataan fakta singkat                 |
| `createdAt`   | DateTime      |  No  |   -   | Waktu pembuatan fakta (Default: `now()`) |
| `isActive`    | Boolean       |  No  |   -   | Status aktif fakta (Default: `true`)     |

#### 3. Tabel `conclusion` (Master Kesimpulan)

| Kolom          | Tipe Data     | Null | Kunci | Keterangan                                    |
| :------------- | :------------ | :--: | :---: | :-------------------------------------------- |
| `conclusionId` | Int           |  No  |  PK   | Primary Key, Auto Increment                   |
| `code`         | String        |  No  |  UQ   | Kode kesimpulan unik (misal: `K01`)           |
| `description`  | String (Text) |  No  |   -   | Deskripsi kesimpulan                          |
| `category`     | String        |  No  |   -   | Kategori kesimpulan keuangan                  |
| `createdAt`    | DateTime      |  No  |   -   | Waktu pembuatan kesimpulan (Default: `now()`) |
| `isActive`     | Boolean       |  No  |   -   | Status aktif kesimpulan (Default: `true`)     |

#### 4. Tabel `source` (Master Sumber Pustaka / Pakar)

| Kolom         | Tipe Data           | Null | Kunci | Keterangan                                                    |
| :------------ | :------------------ | :--: | :---: | :------------------------------------------------------------ |
| `sourceId`    | Int                 |  No  |  PK   | Primary Key, Auto Increment                                   |
| `title`       | String              |  No  |   -   | Judul sumber pustaka/pakar                                    |
| `author`      | String              |  No  |   -   | Nama penulis/pakar                                            |
| `publisher`   | String              | Yes  |   -   | Nama penerbit                                                 |
| `sourceType`  | Enum (`SourceType`) |  No  |   -   | Jenis sumber: `BOOK`, `WEBSITE`, `EXPERT`, `JOURNAL`, `OTHER` |
| `url`         | String              | Yes  |   -   | URL tautan referensi                                          |
| `description` | String (Text)       | Yes  |   -   | Deskripsi/catatan tambahan                                    |
| `createdAt`   | DateTime            |  No  |   -   | Waktu pembuatan data sumber (Default: `now()`)                |

#### 5. Tabel `recommendation` (Master Rekomendasi)

| Kolom              | Tipe Data     | Null | Kunci | Keterangan                                       |
| :----------------- | :------------ | :--: | :---: | :----------------------------------------------- |
| `recommendationId` | Int           |  No  |  PK   | Primary Key, Auto Increment                      |
| `title`            | String        |  No  |   -   | Judul rekomendasi                                |
| `content`          | String (Text) |  No  |   -   | Isi rekomendasi                                  |
| `conclusionId`     | Int           |  No  |  FK   | Foreign Key merujuk ke `conclusion.conclusionId` |
| `sourceId`         | Int           | Yes  |  FK   | Foreign Key merujuk ke `source.sourceId`         |
| `createdAt`        | DateTime      |  No  |   -   | Waktu pembuatan rekomendasi (Default: `now()`)   |
| `isActive`         | Boolean       |  No  |   -   | Status aktif rekomendasi (Default: `true`)       |

#### 6. Tabel `rule` (Master Aturan Inferensi)

| Kolom         | Tipe Data     | Null | Kunci | Keterangan                                |
| :------------ | :------------ | :--: | :---: | :---------------------------------------- |
| `ruleId`      | Int           |  No  |  PK   | Primary Key, Auto Increment               |
| `name`        | String        |  No  |   -   | Nama aturan inferensi                     |
| `description` | String (Text) |  No  |   -   | Deskripsi aturan                          |
| `priority`    | Int           |  No  |   -   | Tingkat prioritas aturan (Default: `0`)   |
| `createdBy`   | Int           |  No  |  FK   | Foreign Key merujuk ke `user.userId`      |
| `isActive`    | Boolean       |  No  |   -   | Status aktif aturan (Default: `true`)     |
| `createdAt`   | DateTime      |  No  |   -   | Waktu pembuatan aturan (Default: `now()`) |

#### 7. Tabel `rule_condition` (Junction Kondisi Aturan)

| Kolom             | Tipe Data | Null | Kunci  | Keterangan                                             |
| :---------------- | :-------- | :--: | :----: | :----------------------------------------------------- |
| `ruleConditionId` | Int       |  No  |   PK   | Primary Key, Auto Increment                            |
| `ruleId`          | Int       |  No  | FK, UQ | Foreign Key merujuk ke `rule.ruleId` (Komposit Unique) |
| `factId`          | Int       |  No  | FK, UQ | Foreign Key merujuk ke `fact.factId` (Komposit Unique) |

#### 8. Tabel `rule_result` (Junction Hasil Aturan)

| Kolom          | Tipe Data | Null | Kunci  | Keterangan                                                         |
| :------------- | :-------- | :--: | :----: | :----------------------------------------------------------------- |
| `ruleResultId` | Int       |  No  |   PK   | Primary Key, Auto Increment                                        |
| `ruleId`       | Int       |  No  | FK, UQ | Foreign Key merujuk ke `rule.ruleId` (Komposit Unique)             |
| `conclusionId` | Int       |  No  | FK, UQ | Foreign Key merujuk ke `conclusion.conclusionId` (Komposit Unique) |

#### 9. Tabel `consultation` (Transaksi Konsultasi Header)

| Kolom            | Tipe Data                   | Null | Kunci | Keterangan                                     |
| :--------------- | :-------------------------- | :--: | :---: | :--------------------------------------------- |
| `consultationId` | Int                         |  No  |  PK   | Primary Key, Auto Increment                    |
| `userId`         | Int                         |  No  |  FK   | Foreign Key merujuk ke `user.userId`           |
| `status`         | Enum (`ConsultationStatus`) |  No  |   -   | Status konsultasi: `IN_PROGRESS` / `COMPLETED` |
| `startedAt`      | DateTime                    |  No  |   -   | Waktu mulai sesi (Default: `now()`)            |
| `endedAt`        | DateTime                    | Yes  |   -   | Waktu selesai sesi                             |
| `comparisonNote` | String (Text)               | Yes  |   -   | Catatan perbandingan                           |

#### 10. Tabel `consultation_answer` (Transaksi Detail Jawaban)

| Kolom                  | Tipe Data | Null | Kunci  | Keterangan                                                             |
| :--------------------- | :-------- | :--: | :----: | :--------------------------------------------------------------------- |
| `consultationAnswerId` | Int       |  No  |   PK   | Primary Key, Auto Increment                                            |
| `consultationId`       | Int       |  No  | FK, UQ | Foreign Key merujuk ke `consultation.consultationId` (Komposit Unique) |
| `factId`               | Int       |  No  | FK, UQ | Foreign Key merujuk ke `fact.factId` (Komposit Unique)                 |
| `value`                | Boolean   |  No  |   -    | Jawaban pengguna (`true` / `false`)                                    |

#### 11. Tabel `consultation_conclusion` (Transaksi Detail Kesimpulan)

| Kolom                      | Tipe Data | Null | Kunci  | Keterangan                                                             |
| :------------------------- | :-------- | :--: | :----: | :--------------------------------------------------------------------- |
| `consultationConclusionId` | Int       |  No  |   PK   | Primary Key, Auto Increment                                            |
| `consultationId`           | Int       |  No  | FK, UQ | Foreign Key merujuk ke `consultation.consultationId` (Komposit Unique) |
| `conclusionId`             | Int       |  No  | FK, UQ | Foreign Key merujuk ke `conclusion.conclusionId` (Komposit Unique)     |

_Status 1NF_: Seluruh atribut pada ke-11 tabel di atas sudah bernilai atomik, tidak ada kelompok berulang (_repeating groups_), dan setiap tabel memiliki _Primary Key_ yang didefinisikan secara jelas.

---

## 4. Bentuk Normal Kedua (2NF - Second Normal Form)

### Hasil Perubahan Struktur pada 2NF

Pada tahap 2NF tidak dilakukan perubahan atau pemecahan tabel tambahan dari
hasil 1NF. Hal ini karena pada tahap 1NF, data sudah dipisahkan berdasarkan
entitasnya, setiap tabel sudah memiliki primary key, dan atribut non-key pada
masing-masing tabel telah bergantung sepenuhnya pada primary key tabel tersebut.
Dengan demikian, hasil dekomposisi pada 1NF telah memenuhi persyaratan 2NF.

Pernyataan bahwa tidak ada perubahan pada tahap 2NF bukan berarti bentuk 1NF
secara otomatis selalu memenuhi 2NF. Hasil tersebut diperoleh setelah dilakukan
pemeriksaan terhadap ketergantungan fungsional setiap tabel. Pada Rekofin,
pemeriksaan tersebut tidak menemukan ketergantungan parsial, sehingga struktur
tabel dari 1NF dapat dipertahankan sampai 2NF.

### Syarat 2NF:

1. Sudah memenuhi bentuk 1NF.
2. Tidak ada Ketergantungan Parsial (_Partial Dependency_). Seluruh atribut non-key harus bergantung sepenuhnya secara fungsional (_Full Functional Dependency_) pada seluruh komponen _Primary Key_.

### Evaluasi Ketergantungan Parsial pada Rekofin:

Ketergantungan parsial rentan terjadi pada tabel relasi (_junction tables_) atau tabel transaksi detail yang menggunakan _Composite Key_ (kunci komposit).

1. **Tabel `consultation_answer`**:
   - Pasangan kunci alaminya (_natural composite key_) adalah (`consultationId`, `factId`).
   - Atribut non-key `value` (jawaban `true`/`false`) bergantung secara penuh pada kombinasi (`consultationId`, `factId`). Nilai `value` tidak dapat ditentukan hanya dengan `consultationId` saja (karena satu konsultasi memiliki banyak fakta) dan tidak dapat ditentukan hanya dengan `factId` saja (karena fakta yang sama dijawab oleh banyak konsultasi).
   - Ketergantungan Fungsional: $\{consultationId, factId\} \rightarrow value$.
   - Tidak ada ketergantungan parsial.

2. **Tabel `rule_condition`**:
   - Memiliki kunci unik komposit (`ruleId`, `factId`).
   - Keduanya berfungsi sebagai _Foreign Key_ yang menghubungkan _Rule_ dan _Fact_. Ketergantungan bersifat penuh terhadap relasi tersebut.

3. **Tabel `rule_result`**:
   - Memiliki kunci unik komposit (`ruleId`, `conclusionId`).
   - Berfungsi menghubungkan _Rule_ dan _Conclusion_ secara penuh.

4. **Tabel `consultation_conclusion`**:
   - Memiliki kunci unik komposit (`consultationId`, `conclusionId`).
   - Berfungsi mencatat kesimpulan hasil konsultasi secara penuh.

5. **Penggunaan _Surrogate Primary Key_**:
   - Pada [prisma/schema.prisma](prisma/schema.prisma), setiap tabel relasi menggunakan _Surrogate Primary Key_ tunggal bertipe _autoincrement_ (`ruleConditionId`, `ruleResultId`, `consultationAnswerId`, `consultationConclusionId`) disertai batasan unik `@unique` pada kombinasi _foreign key_.
   - Pendekatan ini secara otomatis mencegah ketergantungan parsial karena _Primary Key_ terdiri dari satu kolom tunggal.

_Status 2NF_: Seluruh tabel pada sistem Rekofin telah memenuhi 2NF.

_Kesimpulan perubahan 2NF_: Tidak terdapat perubahan struktur tabel maupun
penambahan tabel baru. Sebelas tabel hasil dekomposisi 1NF tetap digunakan pada
tahap 2NF karena seluruh atribut non-key telah memiliki ketergantungan penuh
terhadap primary key masing-masing.

---

## 5. Bentuk Normal Ketiga (3NF - Third Normal Form)

### Hasil Perubahan Struktur pada 3NF

Pada tahap 3NF juga tidak dilakukan perubahan atau pemecahan tabel tambahan.
Struktur yang telah memenuhi 2NF dapat langsung dipertahankan karena tidak
ditemukan ketergantungan transitif pada tabel-tabel Rekofin. Atribut deskriptif
user, fakta, kesimpulan, sumber, dan pembuat aturan telah disimpan pada tabel
entitas masing-masing, sedangkan tabel transaksi dan tabel penghubung hanya
menyimpan atribut yang berkaitan langsung dengan tabel tersebut serta foreign
key yang diperlukan.

Dengan demikian, hasil akhir normalisasi pada 1NF, 2NF, dan 3NF memiliki
struktur tabel yang sama, yaitu sebelas tabel. Perbedaannya terletak pada hasil
verifikasi ketergantungan: pada 1NF diperiksa keatomikan data, pada 2NF
diperiksa ketergantungan parsial, dan pada 3NF diperiksa ketergantungan
transitif. Ketiga pemeriksaan tersebut menghasilkan kesimpulan bahwa tidak
dibutuhkan dekomposisi lanjutan.

### Syarat 3NF:

1. Sudah memenuhi bentuk 2NF.
2. Tidak ada Ketergantungan Transitif (_Transitive Dependency_), yaitu atribut non-key tidak boleh bergantung pada atribut non-key lainnya ($X \rightarrow Y$ di mana $X$ bukan _candidate key_ dan $Y$ bukan atribut utama).

### Analisis Ketergantungan Fungsional (FD) per Tabel:

#### 1. Tabel `user`

- **Primary Key**: `userId`
- **Candidate Key (Unique)**: `username`, `email`
- **Functional Dependencies**:
  - $userId \rightarrow \{fullname, username, email, password, role, gender, isActive, createdAt\}$
  - $username \rightarrow \{userId, fullname, email, password, role, gender, isActive, createdAt\}$
  - $email \rightarrow \{userId, fullname, username, password, role, gender, isActive, createdAt\}$
- **Analisis**: Semua penentu (_determinant_) adalah _Candidate Key_. Atribut non-key (seperti `fullname`, `role`, `gender`) hanya bergantung pada `userId` (atau `username`/`email`), tidak ada ketergantungan antar atribut non-key.

#### 2. Tabel `fact`

- **Primary Key**: `factId`
- **Candidate Key (Unique)**: `code`
- **Functional Dependencies**:
  - $factId \rightarrow \{code, description, question, fact, createdAt, isActive\}$
  - $code \rightarrow \{factId, description, question, fact, createdAt, isActive\}$
- **Analisis**: Atribut `description`, `question`, `fact`, `isActive` bergantung secara langsung pada `factId` / `code`. Tidak ada transitivitas.

#### 3. Tabel `conclusion`

- **Primary Key**: `conclusionId`
- **Candidate Key (Unique)**: `code`
- **Functional Dependencies**:
  - $conclusionId \rightarrow \{code, description, category, createdAt, isActive\}$
  - $code \rightarrow \{conclusionId, description, category, createdAt, isActive\}$
- **Analisis**: `category` dan `description` bergantung pada `conclusionId`. Tidak ada atribut non-key yang menentukan atribut non-key lain.

#### 4. Tabel `source`

- **Primary Key**: `sourceId`
- **Functional Dependencies**:
  - $sourceId \rightarrow \{title, author, publisher, sourceType, url, description, createdAt\}$
- **Analisis**: Atribut seperti `author`, `publisher`, `url` bergantung langsung pada `sourceId`.

#### 5. Tabel `recommendation`

- **Primary Key**: `recommendationId`
- **Foreign Key**: `conclusionId`, `sourceId` (opsional)
- **Functional Dependencies**:
  - $recommendationId \rightarrow \{title, content, sourceId, conclusionId, createdAt, isActive\}$
- **Analisis**: Detail sumber pustaka (seperti `author` atau `publisher`) tidak disimpan di dalam tabel `recommendation`, melainkan hanya merujuk `sourceId`. Hal ini menghindarkan Ketergantungan Transitif $recommendationId \rightarrow sourceId \rightarrow author$.

#### 6. Tabel `rule`

- **Primary Key**: `ruleId`
- **Foreign Key**: `createdBy` (merujuk ke `user.userId`)
- **Functional Dependencies**:
  - $ruleId \rightarrow \{name, description, isActive, priority, createdBy, createdAt\}$
- **Analisis**: Atribut `name`, `description`, `priority`, `createdBy` bergantung langsung pada `ruleId`. Detail profil pembuat aturan (`fullname`, `email`) tidak disimpan berulang di tabel `rule`.

#### 7. Tabel `rule_condition`

- **Primary Key**: `ruleConditionId`
- **Candidate Key (Unique)**: `(ruleId, factId)`
- **Functional Dependencies**:
  - $ruleConditionId \rightarrow \{ruleId, factId\}$
  - $\{ruleId, factId\} \rightarrow ruleConditionId$
- **Analisis**: Hanya berisi hubungan antara `rule` dan `fact`.

#### 8. Tabel `rule_result`

- **Primary Key**: `ruleResultId`
- **Candidate Key (Unique)**: `(ruleId, conclusionId)`
- **Functional Dependencies**:
  - $ruleResultId \rightarrow \{ruleId, conclusionId\}$
  - $\{ruleId, conclusionId\} \rightarrow ruleResultId$
- **Analisis**: Hanya berisi hubungan antara `rule` dan `conclusion`.

#### 9. Tabel `consultation`

- **Primary Key**: `consultationId`
- **Foreign Key**: `userId`
- **Functional Dependencies**:
  - $consultationId \rightarrow \{userId, status, startedAt, endedAt, comparisonNote\}$
- **Analisis**: Seluruh atribut sesi konsultasi bergantung langsung pada `consultationId`. Detail user tidak disimpan di sini.

#### 10. Tabel `consultation_answer`

- **Primary Key**: `consultationAnswerId`
- **Candidate Key (Unique)**: `(consultationId, factId)`
- **Functional Dependencies**:
  - $consultationAnswerId \rightarrow \{consultationId, factId, value\}$
  - $\{consultationId, factId\} \rightarrow \{consultationAnswerId, value\}$
- **Analisis**: Atribut `value` bergantung langsung pada entitas jawaban konsultasi.

#### 11. Tabel `consultation_conclusion`

- **Primary Key**: `consultationConclusionId`
- **Candidate Key (Unique)**: `(consultationId, conclusionId)`
- **Functional Dependencies**:
  - $consultationConclusionId \rightarrow \{consultationId, conclusionId\}$
  - $\{consultationId, conclusionId\} \rightarrow consultationConclusionId$
- **Analisis**: Hanya mencatat kesimpulan yang dihasilkan oleh suatu sesi konsultasi.

_Status 3NF_: Karena tidak ditemukan ketergantungan transitif pada seluruh tabel, basis data Rekofin API berada dalam **Bentuk Normal Ketiga (3NF)**.

_Kesimpulan perubahan 3NF_: Tidak ada perubahan struktur dari 2NF ke 3NF.
Sebelas tabel yang terbentuk pada tahap 1NF tetap menjadi struktur akhir karena
setiap atribut non-key bergantung langsung pada primary key dan tidak bergantung
pada atribut non-key lainnya.

---

## 6. Analisis Boyce-Codd Normal Form (BCNF)

### Syarat BCNF:

Untuk setiap Ketergantungan Fungsional $X \rightarrow Y$ yang nontrivial, $X$ harus merupakan **Super Key** (atau _Candidate Key_).

### Evaluasi BCNF:

1. Pada tabel `user`, determinan penentu data adalah `userId`, `username`, dan `email`. Ketiganya adalah _Candidate Key_ (memiliki penanda unik `@unique`).
2. Pada tabel `fact` dan `conclusion`, determinan penentu adalah `factId`/`code` dan `conclusionId`/`code`. Keduanya adalah _Candidate Key_.
3. Pada tabel relasi (`rule_condition`, `rule_result`, `consultation_answer`, `consultation_conclusion`), determinan penentu adalah _Surrogate PK_ atau pasangan komposit unik `@unique`. Semuanya merupakan _Super Key_.
4. Tidak ada ketergantungan fungsional di mana penentunya ($X$) bukan merupakan _Super Key_.

_Status BCNF_: Skema database Rekofin API telah memenuhi kriteria **Boyce-Codd Normal Form (BCNF)**.

---

## 7. Matriks Ringkasan Evaluasi Normalisasi

Tabel berikut merangkum hasil evaluasi normalisasi untuk 11 tabel pada skema database Rekofin:

| Nama Tabel                    | Tipe Tabel | Primary Key                | Candidate / Unique Key           | Status Normalisasi | Catatan                                                |
| :---------------------------- | :--------- | :------------------------- | :------------------------------- | :----------------: | :----------------------------------------------------- |
| **`user`**                    | Master     | `userId`                   | `username`, `email`              |   **3NF / BCNF**   | Bebas anomali, seluruh determinan adalah Candidate Key |
| **`fact`**                    | Master     | `factId`                   | `code`                           |   **3NF / BCNF**   | Berisi master fakta & pertanyaan inferensi atomik      |
| **`conclusion`**              | Master     | `conclusionId`             | `code`                           |   **3NF / BCNF**   | Berisi master kesimpulan rekomendasi keuangan          |
| **`source`**                  | Master     | `sourceId`                 | -                                |   **3NF / BCNF**   | Berisi data sumber pustaka/pakar                       |
| **`recommendation`**          | Master     | `recommendationId`         | -                                |   **3NF / BCNF**   | Merujuk ke `conclusion` dan `source` via Foreign Key   |
| **`rule`**                    | Master     | `ruleId`                   | -                                |   **3NF / BCNF**   | Berisi header aturan inferensi dan FK `createdBy`      |
| **`rule_condition`**          | Junction   | `ruleConditionId`          | `(ruleId, factId)`               |   **3NF / BCNF**   | Penghubung _many-to-many_ antara Rule dan Fact         |
| **`rule_result`**             | Junction   | `ruleResultId`             | `(ruleId, conclusionId)`         |   **3NF / BCNF**   | Penghubung _many-to-many_ antara Rule dan Conclusion   |
| **`consultation`**            | Transaksi  | `consultationId`           | -                                |   **3NF / BCNF**   | Header transaksi sesi konsultasi pengguna              |
| **`consultation_answer`**     | Transaksi  | `consultationAnswerId`     | `(consultationId, factId)`       |   **3NF / BCNF**   | Detail jawaban fakta pengguna per konsultasi           |
| **`consultation_conclusion`** | Transaksi  | `consultationConclusionId` | `(consultationId, conclusionId)` |   **3NF / BCNF**   | Detail hasil kesimpulan inferensi per konsultasi       |

---

## 8. Kesimpulan Dokumentasi

Skema basis data Rekofin API telah dirancang dengan struktur yang sangat terorganisasi:

1. Data terbebas dari _repeating groups_ (1NF).
2. Memisahkan data master dan transaksi serta menghilangkan ketergantungan parsial (2NF).
3. Mengeliminasi ketergantungan transitif sehingga atribut non-key murni bergantung pada _Primary Key_ masing-masing (3NF).
4. Seluruh penentu ketergantungan fungsional merupakan _Super Key_ (BCNF).

Rancangan database hingga bentuk **3NF / BCNF** ini menjamin integritas data, efisiensi penyimpanan, serta mencegah timbulnya anomali penyisipan (_insertion_), penghapusan (_deletion_), maupun perbaruan (_update_) pada aplikasi sistem pakar Rekofin.
