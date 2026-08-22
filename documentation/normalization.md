# Analisis Normalisasi Database Rekofin

Dokumen ini menjelaskan bentuk normalisasi dari struktur database pada [prisma/schema.prisma](../prisma/schema.prisma), dimulai dari bentuk **Unnormalized Form (UNF)**, lalu **First Normal Form (1NF)**, **Second Normal Form (2NF)**, dan **Third Normal Form (3NF)**.

## 1. Gambaran Struktur Data Saat Ini

Entitas utama yang ada di schema:

- User
- Fact
- Conclusion
- Recommendation
- Rule
- Source
- Consultation

Entitas relasi (junction/associative):

- RuleCondition (relasi Rule-Fact)
- RuleResult (relasi Rule-Conclusion)
- ConsultationAnswer (relasi Consultation-Fact + nilai jawaban)
- ConsultationConclusion (relasi Consultation-Conclusion)

Secara desain, schema ini sudah memisahkan data master, relasi many-to-many, dan data transaksi konsultasi.

## 2. Unnormalized Form (UNF)

Pada tahap UNF, data domain sistem pakar masih digabung dalam satu catatan besar dan masih mengandung repeating group. Bentuk ini berguna sebagai titik awal sebelum data dipecah menjadi atribut atomik.

Contoh masalah jika semua disimpan dalam satu catatan besar:

1. Jawaban fakta pada satu konsultasi berulang dalam satu grup data.
2. Informasi user, rule, conclusion, recommendation, dan source ikut berulang di banyak baris.
3. Perubahan satu data referensi, misalnya author atau source type, harus disesuaikan di banyak tempat.
4. Data referensi sulit dikelola terpisah dari transaksi konsultasi.

### Tabel dan Kolom pada UNF

| Bentuk | Nama Tabel                           | Daftar Kolom                                                                                                                                                                                                                                             |
| ------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UNF    | consultation_bundle_unf (konseptual) | user{fullname, username, email}, consultation{status, startedAt, endedAt}, facts[{code, question, answerValue}], rules[{name, description}], conclusions[{code, category}], recommendations[{title, content}], sources[{title, author, sourceType, url}] |

## 3. First Normal Form (1NF)

### Prinsip 1NF

Setiap atribut harus bernilai atomik. Data sudah dipecah per nilai, tetapi struktur masih dapat menyimpan banyak atribut lintas entitas dalam satu tabel datar.

### Penerapan pada schema

Pada tahap ini, data dibuat atomik dengan satu baris untuk satu kombinasi konsultasi dan jawaban fakta. Nilai master masih menempel di baris yang sama sehingga redundansi masih tinggi.

### Tabel dan Kolom pada 1NF

| Bentuk | Nama Tabel                         | Daftar Kolom                                                                                                                                                                                                           |
| ------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1NF    | consultation_flat_1nf (konseptual) | userId, fullname, username, email, consultationId, status, startedAt, endedAt, factId, factCode, question, answerValue, ruleId, ruleName, conclusionId, conclusionCode, recommendationTitle, sourceTitle, sourceAuthor |

### Hasil penyaringan pada 1NF

Yang berubah dari UNF ke 1NF adalah:

1. Repeating group dipecah menjadi baris atomik.
2. Satu baris mewakili satu fakta yang dijawab pada satu konsultasi.
3. Atribut masih bercampur antar entitas, jadi redundansi belum hilang.

## 4. Second Normal Form (2NF)

### Prinsip 2NF

Tabel harus sudah 1NF, dan semua atribut non-key harus bergantung penuh pada primary key (tidak boleh bergantung sebagian pada composite key).

### Penerapan pada schema

Pada tahap 2NF, data sudah dipisah ke master table, transaction table, dan junction table. Penyaringan utamanya adalah menghilangkan ketergantungan yang tidak perlu dari tabel datar 1NF.

### Tabel dan Kolom pada 2NF

| Bentuk | Nama Tabel              | Peran                                        |
| ------ | ----------------------- | -------------------------------------------- |
| 2NF    | user                    | master user                                  |
| 2NF    | fact                    | master fakta                                 |
| 2NF    | conclusion              | master kesimpulan                            |
| 2NF    | rule                    | master rule                                  |
| 2NF    | consultation            | transaksi konsultasi                         |
| 2NF    | consultation_answer     | detail jawaban fakta per konsultasi          |
| 2NF    | consultation_conclusion | hasil kesimpulan per konsultasi              |
| 2NF    | rule_condition          | relasi rule-fact                             |
| 2NF    | rule_result             | relasi rule-conclusion                       |
| 2NF    | recommendation          | data rekomendasi yang menempel ke conclusion |
| 2NF    | source                  | data referensi awal                          |

### Kolom utama 2NF

| Tabel                   | Kolom utama                                                                |
| ----------------------- | -------------------------------------------------------------------------- |
| user                    | id, fullname, username, email, password, role, gender, isActive, createdAt |
| fact                    | id, code, description, question, fact, createdAt, isActive                 |
| conclusion              | id, code, description, category, createdAt, isActive                       |
| rule                    | id, name, description, isActive, priority, createdBy, createdAt            |
| consultation            | id, userId, status, startedAt, endedAt, comparisonNote                     |
| consultation_answer     | id, consultationId, factId, value                                          |
| consultation_conclusion | id, consultationId, conclusionId                                           |
| rule_condition          | id, ruleId, factId                                                         |
| rule_result             | id, ruleId, conclusionId                                                   |
| recommendation          | id, title, content, sourceId, createdAt, isActive, conclusionId            |
| source                  | id, title, author, publisher, sourceType, url, description, createdAt      |

## 5. Third Normal Form (3NF)

### Prinsip 3NF

Tabel harus sudah 2NF dan tidak boleh ada ketergantungan transitif antar atribut non-key (non-key -> non-key).

### Penerapan pada schema

Pada schema Prisma terbaru, 3NF tercapai karena atribut referensi sudah dipisah dari data utamanya:

1. Identitas user hanya tersimpan di User.
2. Informasi fakta hanya tersimpan di Fact.
3. Informasi kesimpulan hanya tersimpan di Conclusion.
4. Rekomendasi disimpan terpisah dan hanya menunjuk ke Source dan Conclusion.
5. Data transaksi konsultasi tidak menyalin atribut master ke tabel transaksi.

### Tabel dan Kolom pada 3NF

Berikut komposisi tabel final yang sesuai dengan [prisma/schema.prisma](../prisma/schema.prisma):

| Bentuk | Nama Tabel              | Kolom Utama                                                                |
| ------ | ----------------------- | -------------------------------------------------------------------------- |
| 3NF    | user                    | id, fullname, username, email, password, role, gender, isActive, createdAt |
| 3NF    | fact                    | id, code, description, question, fact, createdAt, isActive                 |
| 3NF    | conclusion              | id, code, description, category, createdAt, isActive                       |
| 3NF    | rule                    | id, name, description, isActive, priority, createdBy, createdAt            |
| 3NF    | rule_condition          | id, ruleId, factId                                                         |
| 3NF    | rule_result             | id, ruleId, conclusionId                                                   |
| 3NF    | consultation            | id, userId, status, startedAt, endedAt, comparisonNote                     |
| 3NF    | consultation_answer     | id, consultationId, factId, value                                          |
| 3NF    | consultation_conclusion | id, consultationId, conclusionId                                           |
| 3NF    | recommendation          | id, title, content, sourceId, createdAt, isActive, conclusionId            |
| 3NF    | source                  | id, title, author, publisher, sourceType, url, description, createdAt      |

### Catatan penting

Pada schema saat ini, tahap 2NF dan 3NF memang tampak mirip karena desain akhirnya sudah cukup rapi. Perbedaan utamanya ada pada penjelasan proses: 2NF menekankan pemisahan entitas dan junction table, sedangkan 3NF menegaskan bahwa atribut referensi tidak lagi bercampur dengan atribut utama dalam tabel yang sama.

## 6. Kesimpulan

Normalisasi struktur database pada [prisma/schema.prisma](../prisma/schema.prisma) dapat diringkas sebagai berikut:

1. **UNF**: Secara konseptual akan menimbulkan repeating group dan redundansi tinggi jika semua data digabung.
2. **1NF**: Sudah tercapai pada level data atomik, tetapi masih ada redundansi karena atribut lintas entitas masih bercampur dalam satu baris datar.
3. **2NF**: Sudah tercapai karena data dipisah ke master table, transaction table, dan junction table.
4. **3NF**: Sudah tercapai pada schema Prisma terbaru karena atribut referensi tidak lagi bercampur dengan atribut utama dalam tabel yang sama.

Dengan demikian, schema saat ini sudah menunjukkan desain relasional yang baik untuk kebutuhan sistem pakar berbasis aturan.
