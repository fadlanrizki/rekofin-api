# LRS Diagram - Rekofin Backend Database

## Overview

Diagram Logical Relationship Schema (LRS) untuk sistem Rekofin menampilkan struktur database lengkap dengan semua entity, atribut, dan relasi antar tabel.

## Entities & Attributes

### 1. **USER** (Master Table)

- `id` (PK): Primary Key
- `fullname`: Nama lengkap pengguna
- `username` (UK): Username unik
- `email` (UK): Email unik
- `password`: Password terenkripsi
- `role`: ADMIN atau USER
- `gender`: MALE, FEMALE, atau UNKNOWN
- `isActive`: Status aktif/non-aktif
- `createdAt`: Timestamp pembuatan

### 2. **FACT** (Master Table)

- `id` (PK): Primary Key
- `code` (UK): Kode fakta unik
- `description`: Deskripsi detail fakta
- `question`: Pertanyaan yang berhubungan
- `createdAt`: Timestamp pembuatan
- `isActive`: Status aktif/non-aktif

### 3. **CONCLUSION** (Master Table)

- `id` (PK): Primary Key
- `code` (UK): Kode kesimpulan unik
- `description`: Deskripsi detail kesimpulan
- `category`: Kategori kesimpulan
- `createdAt`: Timestamp pembuatan
- `isActive`: Status aktif/non-aktif

### 4. **RULE** (Master Table)

- `id` (PK): Primary Key
- `name`: Nama rule
- `description`: Deskripsi rule
- `isActive`: Status aktif/non-aktif
- `createdBy` (FK): Referensi ke USER
- `createdAt`: Timestamp pembuatan

### 5. **SOURCE** (Master Table)

- `id` (PK): Primary Key
- `title`: Judul sumber
- `author`: Penulis/Pembuat
- `publisher`: Penerbit
- `sourceType`: BOOK, WEBSITE, EXPERT, JOURNAL, atau OTHER
- `url`: URL sumber (opsional)
- `description`: Deskripsi sumber
- `createdAt`: Timestamp pembuatan

### 6. **RECOMMENDATION** (Master Table)

- `id` (PK): Primary Key
- `title`: Judul rekomendasi
- `content`: Konten rekomendasi
- `conclusionId` (FK): Referensi ke CONCLUSION
- `sourceId` (FK): Referensi ke SOURCE (opsional)
- `createdAt`: Timestamp pembuatan
- `isActive`: Status aktif/non-aktif

### 7. **RULE_CONDITION** (Junction Table - Many-to-Many)

- `id` (PK): Primary Key
- `ruleId` (FK): Referensi ke RULE
- `factId` (FK): Referensi ke FACT
- **Unique**: `[ruleId, factId]`
- **Purpose**: Menghubungkan Rule dengan Fact (kondisi rule)

### 8. **RULE_RESULT** (Junction Table - Many-to-Many)

- `id` (PK): Primary Key
- `ruleId` (FK): Referensi ke RULE
- `conclusionId` (FK): Referensi ke CONCLUSION
- **Unique**: `[ruleId, conclusionId]`
- **Purpose**: Menghubungkan Rule dengan Conclusion (hasil rule)

### 9. **CONSULTATION** (Transaction Table)

- `id` (PK): Primary Key
- `userId` (FK): Referensi ke USER
- `status`: IN_PROGRESS atau COMPLETED
- `startedAt`: Waktu konsultasi dimulai
- `endedAt`: Waktu konsultasi selesai (opsional)

### 10. **CONSULTATION_ANSWER** (Transaction Table - Many-to-Many)

- `id` (PK): Primary Key
- `consultationId` (FK): Referensi ke CONSULTATION
- `factId` (FK): Referensi ke FACT
- `value`: Boolean (jawaban pengguna)
- **Unique**: `[consultationId, factId]`
- **Purpose**: Menyimpan jawaban pengguna untuk setiap fact dalam konsultasi

### 11. **CONSULTATION_CONCLUSION** (Transaction Table - Many-to-Many)

- `id` (PK): Primary Key
- `consultationId` (FK): Referensi ke CONSULTATION
- `conclusionId` (FK): Referensi ke CONCLUSION
- **Unique**: `[consultationId, conclusionId]`
- **Purpose**: Menyimpan kesimpulan hasil konsultasi

## Relationships

### Kardinalitas

- **1:N Relations**:
  - USER → CONSULTATION (1 User : Many Consultations)
  - USER → RULE (1 User : Many Rules/Created)
  - FACT → RULE_CONDITION (1 Fact : Many Rule Conditions)
  - FACT → CONSULTATION_ANSWER (1 Fact : Many Answers)
  - CONCLUSION → RULE_RESULT (1 Conclusion : Many Rule Results)
  - CONCLUSION → RECOMMENDATION (1 Conclusion : Many Recommendations)
  - CONCLUSION → CONSULTATION_CONCLUSION (1 Conclusion : Many Results)
  - RULE → RULE_CONDITION (1 Rule : Many Conditions)
  - RULE → RULE_RESULT (1 Rule : Many Results)
  - SOURCE → RECOMMENDATION (1 Source : Many Recommendations)
  - CONSULTATION → CONSULTATION_ANSWER (1 Consultation : Many Answers)
  - CONSULTATION → CONSULTATION_CONCLUSION (1 Consultation : Many Conclusions)

### M:N Relations (Junction Tables)

- **RULE ↔ FACT** (via RULE_CONDITION): Setiap Rule bisa punya banyak Fact sebagai kondisi
- **RULE ↔ CONCLUSION** (via RULE_RESULT): Setiap Rule bisa menghasilkan banyak Conclusion
- **CONSULTATION ↔ FACT** (via CONSULTATION_ANSWER): Menjalani konsultasi menjawab banyak Fact
- **CONSULTATION ↔ CONCLUSION** (via CONSULTATION_CONCLUSION): Satu konsultasi bisa menghasilkan banyak Conclusion

## Data Flow

### Alur Konsultasi

1. User memulai CONSULTATION
2. System mengajukan pertanyaan berdasarkan FACT
3. User menjawab → disimpan di CONSULTATION_ANSWER
4. System menjalankan RULE berdasarkan jawaban
5. RULE mengevaluasi RULE_CONDITION dengan FACT yang dijawab
6. Jika kondisi terpenuhi → RULE menghasilkan CONCLUSION (RULE_RESULT)
7. Hasil CONCLUSION disimpan di CONSULTATION_CONCLUSION
8. RECOMMENDATION ditampilkan berdasarkan CONCLUSION yang dihasilkan

### Alur Manajemen Rules

1. Admin/Creator membuat RULE
2. Admin menambahkan FACT sebagai kondisi → RULE_CONDITION
3. Admin menambahkan CONCLUSION sebagai hasil → RULE_RESULT
4. RECOMMENDATION dibuat dan dihubungkan dengan CONCLUSION
5. SOURCE dapat direferensikan untuk memberikan landasan ilmiah

## Key Design Patterns

1. **Soft Delete**: Semua master table punya field `isActive` untuk soft delete
2. **Audit Trail**: Semua table punya `createdAt` timestamp
3. **Unique Constraints**: Code fields di FACT dan CONCLUSION untuk identifikasi unik
4. **Junction Tables**: Menggunakan explicit junction tables untuk M:N relationships
5. **Foreign Keys**: Semua FK diasosiasikan untuk menjaga referential integrity
6. **Enums**: Menggunakan enums untuk values yang terbatas (Role, Gender, ConsultationStatus, SourceType)

## Normalization Level

Database sudah mencapai **3NF (Third Normal Form)**:

- ✅ 1NF: Atomic values, no repeating groups
- ✅ 2NF: No partial dependencies
- ✅ 3NF: No transitive dependencies
- ✅ M:N relationships dibreakdown dengan junction tables
