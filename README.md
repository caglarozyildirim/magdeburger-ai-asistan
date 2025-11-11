# Magdeburger Sigorta - AI Destekli Online Satış POC

**Proof of Concept (POC)** - Mevcut Magdeburger web sitesine entegre edilebilir AI destekli online sigorta satış ekranları.

## Proje Hakkında

Bu POC, Magdeburger Sigorta'nın mevcut web sitesine (**https://www.magdeburger.com.tr/**) entegre edilmek üzere geliştirilmiş AI destekli online satış ekranlarını içermektedir.

### Doküman Referansları
- **Online Ürün Satış AI Assistance – Acente & Müşteri Kurgusu Talep Tanım Dokümanı v1**
- **güncel.docx** - Son gereksinimler

## Temel Özellikler

### ✅ Olmazsa Olmaz (Doküman Gereksinimleri)

1. **Ürün Doküman Yükleme Sistemi**
   - Kasko ve Konut için şartname, broşür, teknik dokümanlar
   - Versiyon kontrolü
   - PDF, DOC, DOCX desteği

2. **AI Soru-Cevap Modülü**
   - Ürün dokümanlarından bilgi verme
   - **Kaynak gösterimi (Source Citation)** - Her cevabın altında hangi dokümanın hangi bölümünden geldiği belirtilir
   - Örnek: "Bu bilgi Kasko Şartnamesi - Madde 3.2'den alınmıştır"

3. **Audit Trail Sistemi**
   - Müşteri hangi soruyu sordu → Kaydedilir
   - AI hangi dokümana dayandı → Kaydedilir
   - SEDDK denetimi için 10 yıl saklanır
   - LocalStorage'da demo (Production'da backend DB)

4. **Basit Chatbot Arayüzü**
   - Portal & mobil uyumlu responsive tasarım
   - Soru-cevap mantığı
   - Hızlı cevap önerileri

5. **KVKK/SEDDK Uyum**
   - KVKK Aydınlatma Metni
   - Kullanıcı onay mekanizması
   - Bilgilendirme metinleri
   - Veri saklama politikası

## Mevcut Ekranlar

### 1. Ana Sayfa (index.html)
**Magdeburger web sitesinin 1:1 kopyası**

Özellikler:
- ✅ Gerçek Magdeburger web sitesi tasarımı
- ✅ Tüm ürünler, kampanyalar, blog bölümleri
- ✅ Mega menü (3 kolon) ile tüm ürün kategorileri
- ✅ Responsive tasarım
- ✅ Magdeburger marka renkleri (#555195)
- ✅ Poppins font ailesi

**Amaç:** Müşteriye gerçek site görünümünde POC sunumu

### 2. AI Sales Hub (ai-sales.html) - **YENİ POC ANA SAYFASI**
**AI destekli online satış özellikleri demo sayfası**

Özellikler:
- ✅ Ürün seçimi (Kasko ve Konut kartları)
- ✅ Her ürün için 3 aksiyon:
  - **Satış Başlat** → AI yönetimli 5 adımlı satış akışı (sales.html)
  - **AI Test Et** → Soru-cevap + Audit Trail modal
  - **Dokümanlar** → Doküman yönetimi modal
- ✅ POC özellikleri kartları (6 ana özellik)
- ✅ KVKK onay mekanizması

**Doküman Referansı:**
- "AI Soru-Cevap Modülü: Ürün dokümanlarının yüklenmesi, doğrulanabilir cevap"
- "Basit Kullanıcı Arayüzü: Portal & mobil ekranında sade bir Q&A alanı"

### 3. Satış Süreci (sales.html)
**AI yönetimli 5 adımlı satış akışı**

Özellikler:
- ✅ Adım 1: Kişisel Bilgiler (TC, Ad, Soyad, İletişim)
- ✅ Adım 2: Ürün Detayları (Araç/Konut bilgileri)
- ✅ Adım 3: Acente Seçimi (SFS entegrasyon mockup)
- ✅ Adım 4: Çapraz Satış Önerileri (AI destekli)
- ✅ Adım 5: Ödeme (Web POS mockup)
- ✅ Sağ panel: AI Asistan (Canlı yardım)
- ✅ İlerleme çubuğu

**Doküman Referansı:**
- "AI yönetimli form alanları, diyalog oluşturacak bir UX tasarımı"
- "SFS web servisi ile acente bilgileri ve komisyon yönetimi"

## POC Modalları

### Modal 1: AI Test & Soru-Cevap
**Ürün dokümanlarını AI ile test etme ekranı**

Özellikler:
- ✅ Sol panel: Chat arayüzü
  - AI ile gerçek zamanlı soru-cevap
  - **Kaynak gösterimi** her cevabın altında
  - Hızlı soru önerileri (3 örnek soru)
  - Temizle fonksiyonu

- ✅ Sağ panel: Audit Trail
  - Tüm soru-cevap kayıtları
  - Timestamp ile
  - Hangi doküman referans alındı
  - SEDDK uyum bilgi kutusu
  - Dışa aktar (JSON)

**Doküman Referansı:**
- "Müşteri hangi soruyu sordu, AI hangi dokümana dayandı → sistemde loglanmalı"
- "Cevapların altında kaynak gösterimi (ör. 'Bu bilgi X ürün şartnamesi – Madde 3.2'den alınmıştır')"

### Modal 2: Doküman Yönetimi
**CMS benzeri doküman upload ve yönetim ekranı**

Özellikler:
- ✅ Upload area (drag-drop hazır görünüm)
- ✅ Yüklü dokümanlar listesi (Kasko: 3 doküman)
- ✅ Her doküman için:
  - Icon (PDF kırmızı, Word mavi)
  - İsim, boyut, tarih, versiyon bilgisi
  - 3 aksiyon: Görüntüle, İndir, Sil
- ✅ PDF, DOC, DOCX desteği
- ✅ Max 10MB kontrol

**Doküman Referansı:**
- "Versiyonlama & doküman yönetimi ekranı"
- "En çok kullanılan 1–2 ürünün (ör. Kasko, Konut) şartname, broşür, teknik dokümanları yüklenmiş olmalı"

## Tasarım

### Magdeburger Marka Renkleri
- **Primary:** #555195 (Mor/Mavi)
- **Primary Dark:** #3f3c72
- **Primary Light:** #6d68a8
- **Gradients:** Linear gradients marka renklerinde

### Tipografi
- **Font Ailesi:** Poppins (Google Fonts) + System fonts fallback
- **Weights:** 300, 400, 500, 600, 700
- Başlıklar: 700 weight, Primary renk
- Butonlar: Gradient background, hover effects

### Navigasyon
- **Mega Menu:** Ürünler menüsü 3 kolonlu dropdown
  - Sağlık Sigortaları (7 ürün)
  - Oto Sigortaları (4 ürün) + Mühendislik
  - Diğer Sigortalar (5 ürün)
- Hover animasyonları ve smooth transitions

### Bileşenler
- **Kartlar:** Border-radius 12px, subtle shadow
- **Modals:** Backdrop blur, large size support
- **Butonlar:** Gradient primary, outline secondary
- **Form:** Focus states, validation hints

## Teknoloji Stack

### Frontend
- HTML5
- CSS3 (Custom Properties/Variables)
- Vanilla JavaScript (No framework - CMS uyumlu)

### Veri Yönetimi (POC)
- LocalStorage - Audit Trail
- SessionStorage - Session yönetimi
- Gerçek uygulamada → Backend API

### Özellikler
- Responsive Design (Mobile, Tablet, Desktop)
- Modal sistem
- File upload simulation
- Form validation
- Audit logging

## Kurulum ve Çalıştırma

### Basit HTTP Server

```bash
cd magdeburger-online-urun-satis

# Python ile
python3 -m http.server 8000

# Ya da Node ile
npx http-server
```

Tarayıcıda: `http://localhost:8000`

### Doğrudan Dosya Açma
```bash
open index.html  # Mac
start index.html # Windows
```

## Dosya Yapısı

```
magdeburger-online-urun-satis/
├── index.html                 # Ana sayfa - Gerçek Magdeburger sitesi kopyası
├── ai-sales.html              # POC Ana Sayfası - AI özellikleri hub
├── sales.html                 # AI yönetimli 5 adımlı satış süreci
├── css/
│   └── magdeburger.css        # Tüm stiller (2900+ satır)
├── js/
│   ├── main.js                # Ana sayfa JavaScript
│   └── ai-sales.js            # POC JavaScript logic
├── clear-cache.html           # Cache temizleme sayfası
└── README.md                  # Bu dosya
```

## Kullanım Senaryoları

### Senaryo 1: POC Demo Başlatma

1. **ai-sales.html** sayfasını aç
2. POC hero bölümünde "AI Destekli Online Satış - Proof of Concept" başlığını gör
3. Aşağıda 2 ürün kartı (Kasko ve Konut) listeleniyor
4. Her ürün için 3 doküman yüklü ve AI hazır durumda
5. Altında 6 POC özelliği kartları görüntüleniyor

**Amaç:** Müşteriye tüm POC kapsamını tek bir sayfada göstermek

### Senaryo 2: AI ile Ürün Bilgisi Sorgulama

1. **Kasko** kartında **"AI Test Et"** butonuna tıkla
2. Modal açılır - Sol panel: Chat, Sağ panel: Audit Trail
3. Hızlı soru önerilerinden birini seç veya kendi sorunuzu yaz:
   - **"Bu ürün neleri kapsar?"**
   - **"Teminat limitleri nedir?"**
   - **"Muafiyetler neledir?"**
4. AI anında cevap verir + altında **Kaynak gösterir**:
   - Örnek: "Kasko Şartnamesi v2.1 - Madde 3.2: Teminat Kapsamı"
5. Sağ panelde **Audit Trail**'de kayıt otomatik eklenir:
   - Timestamp
   - Ürün (kasko)
   - Soru-cevap metni
   - Kaynak doküman

**SEDDK Uyum:** Tüm soru-cevap LocalStorage'a kaydedildi ✅
**Dışa Aktar:** "Dışa Aktar" butonu ile JSON formatında indirebilirsiniz

### Senaryo 3: Doküman Yönetimi

1. **Konut** kartında **"Dokümanlar"** butonuna tıkla
2. Modal açılır - Üstte upload area, altta 2 doküman listeleniyor
3. **"Dosya Seç"** ile yeni doküman yükle (PDF/DOCX)
4. Sistem kontrol eder:
   - Format: PDF, DOC, DOCX mi?
   - Boyut: <10MB mi?
   - Otomatik versiyon: v1.0
5. Alert ile başarı mesajı:
   - "Dosya başarıyla yüklendi!"
   - "AI tarafından işlenmeye başlandı"

**AI Entegrasyon:** Production'da yüklenen doküman AI tarafından okunur ✅

### Senaryo 4: Tam Satış Akışı (5 Adım)

1. **Kasko** kartında **"Satış Başlat"** butonuna tıkla
2. KVKK onay penceresi çıkar → Onayla
3. **sales.html** sayfasına yönlendirilirsin
4. **Adım 1:** Kişisel bilgileri doldur (TC, Ad, Soyad, Telefon, E-posta)
5. **Adım 2:** Araç bilgileri (Plaka, Marka, Model, Yıl)
6. **Adım 3:** Acente seçimi
   - Varsayılan acente gösterilir (SFS entegrasyonu mockup)
   - Alternatif acente seçebilirsin
   - Komisyon oranı görüntülenir
7. **Adım 4:** Çapraz satış önerileri
   - AI risk profiline göre ek ürün önerir
   - Örnek: "IMM Sigortası" önerisi
   - Kabul et veya reddet
8. **Adım 5:** Web POS ödeme
   - Kart bilgileri mockup ekranı
   - Taksit seçenekleri
   - "Ödemeyi Tamamla" butonu

**Sağ Panel:** Tüm adımlarda AI Asistan canlı yardım sunar

**SEDDK Uyum:** Her adım audit trail'e kaydedilir ✅

## Doküman Gereksinimleri Karşılama

### ✅ Faz 2 - AI Q&A Modülü (MVP)
- [x] Ürün dokümanları yükleme sistemi
- [x] AI soru-cevap (simülasyon - production'da gerçek AI API)
- [x] Kaynak gösterimi (Source Citation)
- [x] Audit trail tasarımı ve kayıt
- [x] Test senaryoları hazır

### ✅ Kabul Kriterleri
- [x] **Ürün Doküman Yükleme:** Kasko & Konut için 3+2 doküman
- [x] **Versiyon Kontrolü:** Her doküman versiyonlu
- [x] **AI Soru-Cevap:** Temel sorulara cevap
- [x] **Kaynak Gösterimi:** "Bu bilgi X şartnamesi - Madde Y"
- [x] **Audit Trail:** Her soru-cevap loglanıyor
- [x] **Basit Arayüz:** Chatbot benzeri, mobil uyumlu
- [x] **KVKK Uyum:** Aydınlatma metni ve onay

## Entegrasyon Noktaları

### CMS Entegrasyonu İçin

Bu POC ekranları mevcut Magdeburger CMS'ine şu şekilde entegre edilebilir:

1. **Doküman Yönetimi**
   ```javascript
   // Backend API ile değiştir
   uploadDocument(file) → POST /api/documents
   getDocuments(productId) → GET /api/documents/{productId}
   ```

2. **AI Soru-Cevap**
   ```javascript
   // Mevcut AI entegrasyonunuza bağlayın
   getAIResponse(question, productId) → POST /api/ai/chat
   // Response: { answer, source, documentId, section }
   ```

3. **Audit Trail**
   ```javascript
   // Backend'e kaydet
   logAudit(data) → POST /api/audit-trail
   getAuditLogs() → GET /api/audit-trail
   ```

4. **Satış Süreci**
   ```javascript
   // SFS entegrasyonu
   createPolicy(formData) → POST /api/sfs/policy
   assignAgent(customerId) → GET /api/sfs/agent
   ```

## Sonraki Adımlar (Production İçin)

### Backend Entegrasyon
- [ ] Gerçek AI API entegrasyonu (OpenAI, Azure AI, vb.)
- [ ] SFS API entegrasyonu (müşteri-acente, poliçe üretimi)
- [ ] Doküman storage (Azure Blob, AWS S3)
- [ ] Audit trail database (10 yıl saklama)

### Satış Süreci
- [ ] AI yönetimli form (Faz 3)
- [ ] Acente ataması (Faz 4)
- [ ] Çapraz satış motoru (Faz 5)
- [ ] Ödeme entegrasyonu (Web POS)

### Güvenlik & Uyum
- [ ] SSL/TLS sertifikası
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] SEDDK raporlama

### Raporlama
- [ ] AI WS kullanıcısı ayrı raporlanması
- [ ] Satış dashboard
- [ ] Acente komisyon raporları

## Önemli Notlar

### POC Sınırlamaları
- AI cevapları **simüle edilmiştir** (pattern matching)
- Gerçek production'da **GPT-4, Azure OpenAI** gibi modeller kullanılacak
- Doküman upload **simülasyondur**, backend storage gerekli
- Audit trail **LocalStorage**'da, production'da DB gerekli

### SEDDK/KVKK Uyum
- Tüm fonksiyonlar compliance odaklı tasarlandı
- Audit trail her işlem için aktif
- Kaynak gösterimi zorunlu
- KVKK aydınlatma metni her session'da

### Magdeburger Entegrasyonu
- Renk paleti mevcut site ile %100 uyumlu
- Tipografi ve spacing standartları korundu
- Responsive tasarım tüm cihazlarda çalışır
- Modal sistem mevcut site yapısına eklenebilir

## İletişim & Destek

Bu POC, Magdeburger Sigorta için **Online Ürün Satış AI Assistance** projesi kapsamında geliştirilmiştir.

**Proje Dokümanları:**
- Talep Tanım Dokümanı v1
- güncel.docx (Son gereksinimler)

**Geliştirme Tarihi:** Kasım 2025
**Versiyon:** POC v1.0
**Durum:** ✅ Faz 2 MVP Tamamlandı

---

## POC Tamamlanma Durumu

### ✅ Tamamlanan Özellikler

#### 1. Ana Sayfa (index.html)
- ✅ Gerçek Magdeburger web sitesinin 1:1 kopyası
- ✅ Tüm menü yapısı (mega menu dahil)
- ✅ Hero banner, ürünler, kampanyalar, blog, footer
- ✅ Responsive tasarım
- ✅ Magdeburger marka renkleri ve fontları

#### 2. POC Hub Sayfası (ai-sales.html)
- ✅ AI Destekli Online Satış başlığı
- ✅ 2 ürün kartı (Kasko, Konut) 3 aksiyon ile:
  - Satış Başlat
  - AI Test Et
  - Dokümanlar
- ✅ 6 POC özelliği kartı:
  - AI Soru-Cevap
  - AI Yönetimli Satış
  - Acente Ataması
  - Çapraz Satış
  - Web POS Ödeme
  - KVKK/SEDDK Uyum
- ✅ KVKK onay mekanizması

#### 3. AI Test Modal
- ✅ Çift panel tasarım (Chat + Audit Trail)
- ✅ Gerçek zamanlı soru-cevap simülasyonu
- ✅ Kaynak gösterimi (Source Citation)
- ✅ Hızlı soru önerileri
- ✅ Audit trail kayıt sistemi
- ✅ LocalStorage entegrasyonu
- ✅ JSON dışa aktarma
- ✅ SEDDK uyum bilgi kutusu

#### 4. Doküman Yönetimi Modal
- ✅ Upload area (görsel hazır)
- ✅ 3 örnek doküman (Kasko)
- ✅ Versiyon, tarih, boyut gösterimi
- ✅ PDF (kırmızı) ve Word (mavi) icon'ları
- ✅ 3 aksiyon: Görüntüle, İndir, Sil
- ✅ Format kontrolü (PDF, DOC, DOCX)
- ✅ Boyut kontrolü (10MB max)

#### 5. Satış Süreci (sales.html)
- ✅ 5 adımlı form akışı
- ✅ İlerleme çubuğu
- ✅ Adım 1: Kişisel Bilgiler
- ✅ Adım 2: Ürün Detayları
- ✅ Adım 3: Acente Seçimi (SFS mockup)
- ✅ Adım 4: Çapraz Satış Önerileri
- ✅ Adım 5: Web POS Ödeme
- ✅ Sağ panel: AI Asistan

#### 6. KVKK & SEDDK Uyum
- ✅ KVKK onay popup'ı
- ✅ Audit trail sistemi (LocalStorage)
- ✅ Timestamp kayıtları
- ✅ Kaynak doküman takibi
- ✅ 10 yıl saklama bildirimi

#### 7. Teknik Özellikler
- ✅ Vanilla JavaScript (No framework)
- ✅ Responsive tasarım (mobile, tablet, desktop)
- ✅ Modal sistem (overlay + backdrop blur)
- ✅ Animasyonlar (fade, slide, pulse)
- ✅ LocalStorage veri yönetimi
- ✅ 2900+ satır CSS
- ✅ Font Awesome 6.4 icons
- ✅ Poppins font ailesi

---

## Nasıl Kullanılır?

### Hızlı Başlangıç

1. **Tarayıcıda Aç:**
   ```bash
   open ai-sales.html  # Mac
   start ai-sales.html # Windows
   ```

2. **veya HTTP Server ile:**
   ```bash
   cd magdeburger-online-urun-satis
   python3 -m http.server 8000
   # Tarayıcıda: http://localhost:8000/ai-sales.html
   ```

### Demo Akışı

1. **ai-sales.html** → POC ana sayfası
2. **"AI Test Et"** → Soru-cevap ve audit trail demo
3. **"Dokümanlar"** → Doküman yönetimi demo
4. **"Satış Başlat"** → Tam satış akışı (5 adım)

### Gerçek Site Görünümü

- **index.html** → Magdeburger'in gerçek sitesi (1:1 kopya)

---

**Not:** Bu POC, mevcut Magdeburger web sitesine modül olarak eklenebilir şekilde tasarlanmıştır. Tüm stiller, renkler ve tipografi mevcut site ile %100 uyumludur.

**Versiyon:** POC v1.0
**Tarih:** 11 Kasım 2025
**Durum:** ✅ Tüm özellikler tamamlandı
