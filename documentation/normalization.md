# Analisis Normalisasi Database Rekofin

Dokumen ini menjelaskan bentuk normalisasi dari struktur database pada [prisma/schema.prisma](../prisma/schema.prisma), dimulai dari bentuk **Unnormalized Form (UNF)**, lalu **First Normal Form (1NF)**, **Second Normal Form (2NF)**, dan **Third Normal Form (3NF)**.

## 1. Gambaran Struktur Data Saat Ini

Entitas utama yang ada di schema:

- `User`
- `Fact`
- `Conclusion`
- `Recommendation`
- `Rule`
- `Source`
- `Consultation`

Entitas relasi (junction/associative):

- `RuleCondition` (relasi Rule-Fact)
- `RuleResult` (relasi Rule-Conclusion)
- `ConsultationAnswer` (relasi Consultation-Fact + nilai jawaban)
- `ConsultationConclusion` (relasi Consultation-Conclusion)

Secara desain, schema ini sudah memisahkan data master, relasi many-to-many, dan data transaksi konsultasi.

## 2. Unnormalized Form (UNF)

Pada tahap UNF, data domain sistem pakar biasanya masih bercampur dalam satu tabel besar, misalnya tabel konseptual seperti:

- identitas user
- data konsultasi
- daftar fakta yang dijawab user
- aturan yang terpenuhi
- kesimpulan yang dihasilkan
- rekomendasi dan sumber referensi

Contoh masalah jika semua disimpan dalam satu tabel besar:

1. **Repeating group**: jawaban fakta user bersifat berulang dalam satu konsultasi.
2. **Redundansi tinggi**: informasi user, conclusion, dan source akan berulang pada banyak baris.
3. **Anomali update**: perubahan satu data (mis. author source) harus diubah di banyak baris.
4. **Anomali insert/delete**: sulit menambah data referensi tanpa transaksi konsultasi, atau menghapus baris transaksi bisa menghilangkan data referensi penting.

### Tabel dan Kolom pada UNF

Pada UNF, seluruh data domain diasumsikan masih berada pada satu tabel gabungan.

| Bentuk | Nama Tabel                             | Daftar Kolom                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UNF    | `consultation_report_unf` (konseptual) | `userId`, `fullname`, `username`, `email`, `consultationId`, `status`, `startedAt`, `endedAt`, `factId`, `factCode`, `factDescription`, `question`, `answerValue`, `ruleId`, `ruleName`, `ruleDescription`, `conclusionId`, `conclusionCode`, `conclusionDescription`, `category`, `recommendationId`, `recommendationTitle`, `recommendationContent`, `sourceId`, `sourceTitle`, `sourceAuthor`, `sourceType`, `sourceUrl` |

## 3. First Normal Form (1NF)

### Prinsip 1NF

Setiap atribut harus bernilai atomik (tidak ada array/list di satu kolom), dan tidak boleh ada repeating group dalam satu baris.

### Penerapan pada schema

Schema sudah memenuhi 1NF karena:

1. Nilai kolom bersifat atomik (contoh: `fullname`, `email`, `status`, `value`).
2. Data berulang dipisahkan ke tabel relasi:
   - `RuleCondition` untuk pasangan `ruleId`-`factId`
   - `RuleResult` untuk pasangan `ruleId`-`conclusionId`
   - `ConsultationAnswer` untuk pasangan `consultationId`-`factId`
   - `ConsultationConclusion` untuk pasangan `consultationId`-`conclusionId`

Dengan pemisahan ini, tidak ada kebutuhan menyimpan daftar nilai majemuk dalam satu field.

### Tabel dan Kolom pada 1NF

Pada 1NF, data berulang sudah dipisahkan ke tabel relasi, dan seluruh nilai kolom bersifat atomik.

| Bentuk | Nama Tabel                | Daftar Kolom                                                                                 |
| ------ | ------------------------- | -------------------------------------------------------------------------------------------- |
| 1NF    | `user`                    | `id`, `fullname`, `username`, `email`, `password`, `role`, `gender`, `isActive`, `createdAt` |
| 1NF    | `fact`                    | `id`, `code`, `description`, `question`, `createdAt`, `isActive`                             |
| 1NF    | `conclusion`              | `id`, `code`, `description`, `category`, `createdAt`, `isActive`                             |
| 1NF    | `recommendation`          | `id`, `title`, `content`, `sourceId`, `createdAt`, `isActive`, `conclusionId`                |
| 1NF    | `rule`                    | `id`, `name`, `description`, `isActive`, `createdBy`, `createdAt`                            |
| 1NF    | `rule_condition`          | `id`, `ruleId`, `factId`                                                                     |
| 1NF    | `rule_result`             | `id`, `ruleId`, `conclusionId`                                                               |
| 1NF    | `consultation`            | `id`, `userId`, `status`, `startedAt`, `endedAt`                                             |
| 1NF    | `consultation_answer`     | `id`, `consultationId`, `factId`, `value`                                                    |
| 1NF    | `consultation_conclusion` | `id`, `consultationId`, `conclusionId`                                                       |
| 1NF    | `source`                  | `id`, `title`, `author`, `publisher`, `sourceType`, `url`, `description`, `createdAt`        |

## 4. Second Normal Form (2NF)

### Prinsip 2NF

Tabel harus sudah 1NF, dan semua atribut non-key harus bergantung penuh pada primary key (tidak boleh bergantung sebagian pada composite key).

### Penerapan pada schema

Schema memenuhi 2NF karena:

1. Setiap tabel menggunakan primary key tunggal `id` (surrogate key autoincrement).
2. Tidak ada atribut non-key yang hanya bergantung pada sebagian key komposit.
3. Constraint unik gabungan (mis. `@@unique([ruleId, factId])`) dipakai untuk menjaga keunikan relasi bisnis, bukan sebagai primary key utama tabel.

Karena PK tabel tunggal, isu partial dependency praktis tidak muncul.

### Tabel dan Kolom pada 2NF

Semua tabel tetap sama seperti 1NF, namun pada 2NF ditekankan bahwa atribut non-key bergantung penuh pada PK tunggal (`id`).

| Bentuk | Nama Tabel                | Primary Key | Kolom Non-Key                                                                          |
| ------ | ------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| 2NF    | `user`                    | `id`        | `fullname`, `username`, `email`, `password`, `role`, `gender`, `isActive`, `createdAt` |
| 2NF    | `fact`                    | `id`        | `code`, `description`, `question`, `createdAt`, `isActive`                             |
| 2NF    | `conclusion`              | `id`        | `code`, `description`, `category`, `createdAt`, `isActive`                             |
| 2NF    | `recommendation`          | `id`        | `title`, `content`, `sourceId`, `createdAt`, `isActive`, `conclusionId`                |
| 2NF    | `rule`                    | `id`        | `name`, `description`, `isActive`, `createdBy`, `createdAt`                            |
| 2NF    | `rule_condition`          | `id`        | `ruleId`, `factId`                                                                     |
| 2NF    | `rule_result`             | `id`        | `ruleId`, `conclusionId`                                                               |
| 2NF    | `consultation`            | `id`        | `userId`, `status`, `startedAt`, `endedAt`                                             |
| 2NF    | `consultation_answer`     | `id`        | `consultationId`, `factId`, `value`                                                    |
| 2NF    | `consultation_conclusion` | `id`        | `consultationId`, `conclusionId`                                                       |
| 2NF    | `source`                  | `id`        | `title`, `author`, `publisher`, `sourceType`, `url`, `description`, `createdAt`        |

## 5. Third Normal Form (3NF)

### Prinsip 3NF

Tabel harus sudah 2NF dan tidak boleh ada ketergantungan transitif antar atribut non-key (non-key -> non-key).

### Penerapan pada schema

Secara umum, schema sudah berada pada 3NF:

1. Atribut deskriptif user hanya di tabel `User`.
2. Atribut deskriptif fakta hanya di tabel `Fact`.
3. Atribut deskriptif kesimpulan hanya di tabel `Conclusion`.
4. Data bibliografi dipusatkan di tabel `Source` dan direlasikan dari `Recommendation`.
5. Tabel transaksi (`Consultation`, `ConsultationAnswer`, `ConsultationConclusion`) menyimpan fakta kejadian konsultasi, bukan duplikasi atribut master.

### Catatan interpretasi (jika diperdebatkan)

Ada relasi FK seperti `Recommendation -> Conclusion` atau `Rule -> User (createdBy)` yang secara logika dapat menelusuri atribut di tabel lain. Ini **bukan** pelanggaran 3NF selama atribut non-key tidak diduplikasi sebagai field turunan di tabel asal.

Artinya, dependency lintas tabel lewat foreign key adalah desain relasional normal, bukan transitif dalam satu tabel yang sama.

### Tabel dan Kolom pada 3NF

Pada 3NF, struktur tabel tetap, tetapi setiap atribut non-key ditempatkan pada entitas yang tepat dan tidak menjadi atribut turunan non-key dalam tabel yang sama.

| Bentuk | Nama Tabel                | Kolom Kunci | Kolom Non-Key Utama                                                                    |
| ------ | ------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| 3NF    | `user`                    | `id`        | `fullname`, `username`, `email`, `password`, `role`, `gender`, `isActive`, `createdAt` |
| 3NF    | `fact`                    | `id`        | `code`, `description`, `question`, `createdAt`, `isActive`                             |
| 3NF    | `conclusion`              | `id`        | `code`, `description`, `category`, `createdAt`, `isActive`                             |
| 3NF    | `recommendation`          | `id`        | `title`, `content`, `sourceId`, `createdAt`, `isActive`, `conclusionId`                |
| 3NF    | `rule`                    | `id`        | `name`, `description`, `isActive`, `createdBy`, `createdAt`                            |
| 3NF    | `rule_condition`          | `id`        | `ruleId`, `factId`                                                                     |
| 3NF    | `rule_result`             | `id`        | `ruleId`, `conclusionId`                                                               |
| 3NF    | `consultation`            | `id`        | `userId`, `status`, `startedAt`, `endedAt`                                             |
| 3NF    | `consultation_answer`     | `id`        | `consultationId`, `factId`, `value`                                                    |
| 3NF    | `consultation_conclusion` | `id`        | `consultationId`, `conclusionId`                                                       |
| 3NF    | `source`                  | `id`        | `title`, `author`, `publisher`, `sourceType`, `url`, `description`, `createdAt`        |

## 6. Kesimpulan

Normalisasi struktur database pada [prisma/schema.prisma](../prisma/schema.prisma) dapat diringkas sebagai berikut:

1. **UNF**: Secara konseptual akan menimbulkan repeating group dan redundansi tinggi jika semua data digabung.
2. **1NF**: Sudah tercapai dengan atribut atomik dan pemisahan repeating group ke tabel relasi.
3. **2NF**: Sudah tercapai karena penggunaan primary key tunggal per tabel, sehingga tidak ada partial dependency.
4. **3NF**: **Ada / tercapai secara praktis** pada desain saat ini, karena atribut non-key berada pada entitas yang tepat dan tidak ada duplikasi transitif dalam tabel yang sama.

Dengan demikian, schema saat ini sudah menunjukkan desain relasional yang baik untuk kebutuhan sistem pakar berbasis aturan.
