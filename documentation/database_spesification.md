# Database Specification Rekofin API

Dokumen ini berisi spesifikasi tabel database berdasarkan schema Prisma saat ini di [prisma/schema.prisma](../prisma/schema.prisma).

## Informasi Umum

- DB Provider: MySQL
- ORM Schema: Prisma
- Konvensi: nama model menggunakan PascalCase, nama tabel fisik menggunakan `@@map("...")`

## Standar Panjang/Length yang Dipakai

Karena Prisma schema tidak menentukan panjang untuk semua `String`, kolom `Panjang/Length` di bawah menggunakan acuan berikut:

- `String` (tanpa `@db.*`): default Prisma MySQL (`VARCHAR(191)`)
- `String @db.Text`: `TEXT` (maks 65,535 karakter)
- `Int`: `INT` (4 byte)
- `Boolean`: `TINYINT(1)` (1 byte)
- `DateTime`: `DATETIME(3)`
- `Enum`: `ENUM` sesuai daftar nilai enum

## Daftar Enum

### Role

- `ADMIN`
- `USER`

### Gender

- `MALE`
- `FEMALE`
- `UNKNOWN`

### ConsultationStatus

- `IN_PROGRESS`
- `COMPLETED`

### SourceType

- `BOOK`
- `WEBSITE`
- `EXPERT`
- `JOURNAL`
- `OTHER`

## Tabel: user (Model `User`)

| Kolom     | Tipe Prisma | Panjang/Length                   | Null | Key | Default         | Keterangan            |
| --------- | ----------- | -------------------------------- | ---- | --- | --------------- | --------------------- |
| id        | Int         | INT (4 byte)                     | No   | PK  | autoincrement() | Primary key           |
| fullname  | String      | VARCHAR(191)                     | No   | -   | -               | Nama lengkap pengguna |
| username  | String      | VARCHAR(191)                     | No   | UQ  | -               | Username unik         |
| email     | String      | VARCHAR(191)                     | No   | UQ  | -               | Email unik            |
| password  | String      | VARCHAR(191)                     | No   | -   | -               | Password hash         |
| role      | Role        | ENUM (`ADMIN`,`USER`)            | No   | -   | USER            | Peran pengguna        |
| gender    | Gender      | ENUM (`MALE`,`FEMALE`,`UNKNOWN`) | Yes  | -   | -               | Jenis kelamin         |
| isActive  | Boolean     | TINYINT(1) (1 byte)              | No   | -   | true            | Status aktif          |
| createdAt | DateTime    | DATETIME(3)                      | No   | -   | now()           | Waktu dibuat          |

Relasi:

- 1:N ke `consultation` melalui `consultation.userId`
- 1:N ke `rule` melalui `rule.createdBy`

## Tabel: fact (Model `Fact`)

| Kolom       | Tipe Prisma       | Panjang/Length              | Null | Key | Default         | Keterangan                  |
| ----------- | ----------------- | --------------------------- | ---- | --- | --------------- | --------------------------- |
| id          | Int               | INT (4 byte)                | No   | PK  | autoincrement() | Primary key                 |
| code        | String            | VARCHAR(191)                | No   | UQ  | -               | Kode fakta unik             |
| description | String (@db.Text) | TEXT (maks 65,535 karakter) | No   | -   | -               | Deskripsi fakta             |
| question    | String            | VARCHAR(191)                | No   | -   | -               | Pertanyaan untuk konsultasi |
| createdAt   | DateTime          | DATETIME(3)                 | No   | -   | now()           | Waktu dibuat                |
| isActive    | Boolean           | TINYINT(1) (1 byte)         | No   | -   | true            | Status aktif                |

Relasi:

- 1:N ke `rule_condition` melalui `rule_condition.factId`
- 1:N ke `consultation_answer` melalui `consultation_answer.factId`

## Tabel: conclusion (Model `Conclusion`)

| Kolom       | Tipe Prisma       | Panjang/Length              | Null | Key | Default         | Keterangan           |
| ----------- | ----------------- | --------------------------- | ---- | --- | --------------- | -------------------- |
| id          | Int               | INT (4 byte)                | No   | PK  | autoincrement() | Primary key          |
| code        | String            | VARCHAR(191)                | No   | UQ  | -               | Kode kesimpulan unik |
| description | String (@db.Text) | TEXT (maks 65,535 karakter) | No   | -   | -               | Deskripsi kesimpulan |
| category    | String            | VARCHAR(191)                | No   | -   | -               | Kategori kesimpulan  |
| createdAt   | DateTime          | DATETIME(3)                 | No   | -   | now()           | Waktu dibuat         |
| isActive    | Boolean           | TINYINT(1) (1 byte)         | No   | -   | true            | Status aktif         |

Relasi:

- 1:N ke `rule_result` melalui `rule_result.conclusionId`
- 1:N ke `recommendation` melalui `recommendation.conclusionId`
- 1:N ke `consultation_conclusion` melalui `consultation_conclusion.conclusionId`

## Tabel: recommendation (Model `Recommendation`)

| Kolom        | Tipe Prisma       | Panjang/Length              | Null | Key | Default         | Keterangan              |
| ------------ | ----------------- | --------------------------- | ---- | --- | --------------- | ----------------------- |
| id           | Int               | INT (4 byte)                | No   | PK  | autoincrement() | Primary key             |
| title        | String            | VARCHAR(191)                | No   | -   | -               | Judul rekomendasi       |
| content      | String (@db.Text) | TEXT (maks 65,535 karakter) | No   | -   | -               | Isi rekomendasi         |
| sourceId     | Int               | INT (4 byte)                | Yes  | FK  | -               | Referensi ke sumber     |
| createdAt    | DateTime          | DATETIME(3)                 | No   | -   | now()           | Waktu dibuat            |
| isActive     | Boolean           | TINYINT(1) (1 byte)         | No   | -   | true            | Status aktif            |
| conclusionId | Int               | INT (4 byte)                | No   | FK  | -               | Referensi ke kesimpulan |

Relasi:

- N:1 ke `conclusion` melalui `conclusionId`
- N:1 ke `source` melalui `sourceId` (opsional)

## Tabel: rule (Model `Rule`)

| Kolom       | Tipe Prisma       | Panjang/Length              | Null | Key | Default         | Keterangan        |
| ----------- | ----------------- | --------------------------- | ---- | --- | --------------- | ----------------- |
| id          | Int               | INT (4 byte)                | No   | PK  | autoincrement() | Primary key       |
| name        | String            | VARCHAR(191)                | No   | -   | -               | Nama rule         |
| description | String (@db.Text) | TEXT (maks 65,535 karakter) | No   | -   | -               | Deskripsi rule    |
| isActive    | Boolean           | TINYINT(1) (1 byte)         | No   | -   | true            | Status aktif      |
| createdBy   | Int               | INT (4 byte)                | No   | FK  | -               | User pembuat rule |
| createdAt   | DateTime          | DATETIME(3)                 | No   | -   | now()           | Waktu dibuat      |

Relasi:

- N:1 ke `user` melalui `createdBy`
- 1:N ke `rule_condition` melalui `rule_condition.ruleId`
- 1:N ke `rule_result` melalui `rule_result.ruleId`

## Tabel: rule_condition (Model `RuleCondition`)

| Kolom  | Tipe Prisma | Panjang/Length | Null | Key | Default         | Keterangan        |
| ------ | ----------- | -------------- | ---- | --- | --------------- | ----------------- |
| id     | Int         | INT (4 byte)   | No   | PK  | autoincrement() | Primary key       |
| ruleId | Int         | INT (4 byte)   | No   | FK  | -               | Referensi ke rule |
| factId | Int         | INT (4 byte)   | No   | FK  | -               | Referensi ke fact |

Constraint:

- Unique gabungan: (`ruleId`, `factId`)

Relasi:

- N:1 ke `rule` melalui `ruleId`
- N:1 ke `fact` melalui `factId`

## Tabel: rule_result (Model `RuleResult`)

| Kolom        | Tipe Prisma | Panjang/Length | Null | Key | Default         | Keterangan              |
| ------------ | ----------- | -------------- | ---- | --- | --------------- | ----------------------- |
| id           | Int         | INT (4 byte)   | No   | PK  | autoincrement() | Primary key             |
| ruleId       | Int         | INT (4 byte)   | No   | FK  | -               | Referensi ke rule       |
| conclusionId | Int         | INT (4 byte)   | No   | FK  | -               | Referensi ke conclusion |

Constraint:

- Unique gabungan: (`ruleId`, `conclusionId`)

Relasi:

- N:1 ke `rule` melalui `ruleId`
- N:1 ke `conclusion` melalui `conclusionId`

## Tabel: consultation (Model `Consultation`)

| Kolom     | Tipe Prisma        | Panjang/Length                   | Null | Key | Default         | Keterangan        |
| --------- | ------------------ | -------------------------------- | ---- | --- | --------------- | ----------------- |
| id        | Int                | INT (4 byte)                     | No   | PK  | autoincrement() | Primary key       |
| userId    | Int                | INT (4 byte)                     | No   | FK  | -               | Referensi ke user |
| status    | ConsultationStatus | ENUM (`IN_PROGRESS`,`COMPLETED`) | No   | -   | IN_PROGRESS     | Status konsultasi |
| startedAt | DateTime           | DATETIME(3)                      | No   | -   | now()           | Waktu mulai       |
| endedAt   | DateTime           | DATETIME(3)                      | Yes  | -   | -               | Waktu selesai     |

Relasi:

- N:1 ke `user` melalui `userId`
- 1:N ke `consultation_answer` melalui `consultation_answer.consultationId`
- 1:N ke `consultation_conclusion` melalui `consultation_conclusion.consultationId`

## Tabel: consultation_answer (Model `ConsultationAnswer`)

| Kolom          | Tipe Prisma | Panjang/Length      | Null | Key | Default         | Keterangan                |
| -------------- | ----------- | ------------------- | ---- | --- | --------------- | ------------------------- |
| id             | Int         | INT (4 byte)        | No   | PK  | autoincrement() | Primary key               |
| consultationId | Int         | INT (4 byte)        | No   | FK  | -               | Referensi ke consultation |
| factId         | Int         | INT (4 byte)        | No   | FK  | -               | Referensi ke fact         |
| value          | Boolean     | TINYINT(1) (1 byte) | No   | -   | -               | Nilai jawaban user        |

Constraint:

- Unique gabungan: (`consultationId`, `factId`)

Relasi:

- N:1 ke `consultation` melalui `consultationId`
- N:1 ke `fact` melalui `factId`

## Tabel: consultation_conclusion (Model `ConsultationConclusion`)

| Kolom          | Tipe Prisma | Panjang/Length | Null | Key | Default         | Keterangan                |
| -------------- | ----------- | -------------- | ---- | --- | --------------- | ------------------------- |
| id             | Int         | INT (4 byte)   | No   | PK  | autoincrement() | Primary key               |
| consultationId | Int         | INT (4 byte)   | No   | FK  | -               | Referensi ke consultation |
| conclusionId   | Int         | INT (4 byte)   | No   | FK  | -               | Referensi ke conclusion   |

Constraint:

- Unique gabungan: (`consultationId`, `conclusionId`)

Relasi:

- N:1 ke `consultation` melalui `consultationId`
- N:1 ke `conclusion` melalui `conclusionId`

## Tabel: source (Model `Source`)

| Kolom       | Tipe Prisma       | Panjang/Length                                     | Null | Key | Default         | Keterangan                                   |
| ----------- | ----------------- | -------------------------------------------------- | ---- | --- | --------------- | -------------------------------------------- |
| id          | Int               | INT (4 byte)                                       | No   | PK  | autoincrement() | Primary key                                  |
| title       | String            | VARCHAR(191)                                       | No   | -   | -               | Judul sumber                                 |
| author      | String            | VARCHAR(191)                                       | No   | -   | -               | Penulis sumber                               |
| publisher   | String            | VARCHAR(191)                                       | Yes  | -   | -               | Penerbit                                     |
| sourceType  | SourceType        | ENUM (`BOOK`,`WEBSITE`,`EXPERT`,`JOURNAL`,`OTHER`) | No   | -   | -               | Jenis sumber, disimpan sebagai `source_type` |
| url         | String            | VARCHAR(191)                                       | Yes  | -   | -               | URL sumber                                   |
| description | String (@db.Text) | TEXT (maks 65,535 karakter)                        | Yes  | -   | -               | Deskripsi sumber                             |
| createdAt   | DateTime          | DATETIME(3)                                        | No   | -   | now()           | Waktu dibuat, disimpan sebagai `created_at`  |

Relasi:

- 1:N ke `recommendation` melalui `recommendation.sourceId`

## Ringkasan Constraint Unik

- `user.username` (unique)
- `user.email` (unique)
- `fact.code` (unique)
- `conclusion.code` (unique)
- `rule_condition (ruleId, factId)` (unique gabungan)
- `rule_result (ruleId, conclusionId)` (unique gabungan)
- `consultation_answer (consultationId, factId)` (unique gabungan)
- `consultation_conclusion (consultationId, conclusionId)` (unique gabungan)
