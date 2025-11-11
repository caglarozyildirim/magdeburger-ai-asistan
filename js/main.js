/**
 * Ana JavaScript Dosyası
 * Sigorta Online Satış Platformu - AI Destekli
 * CMS Entegrasyonu için hazırlanmıştır
 */

// Ürün Bilgileri (CMS'den gelecek - şimdilik statik)
const products = {
    kasko: {
        id: 'kasko',
        name: 'Kasko Sigortası',
        icon: 'fa-car',
        description: 'Araç sigortası - AI ile otomatik satış',
        documentCount: 3,
        documents: [
            { id: 1, name: 'Kasko Şartnamesi 2025', type: 'pdf', size: '2.5 MB', uploadDate: '2025-01-10', version: 'v1.2' },
            { id: 2, name: 'Kasko Ürün Broşürü', type: 'pdf', size: '1.8 MB', uploadDate: '2025-01-08', version: 'v1.0' },
            { id: 3, name: 'Teknik Doküman', type: 'docx', size: '850 KB', uploadDate: '2025-01-05', version: 'v1.1' }
        ],
        aiEnabled: true,
        status: 'active'
    },
    konut: {
        id: 'konut',
        name: 'Konut Sigortası',
        icon: 'fa-home',
        description: 'Ev sigortası - AI ile otomatik satış',
        documentCount: 2,
        documents: [
            { id: 1, name: 'Konut Şartnamesi 2025', type: 'pdf', size: '1.9 MB', uploadDate: '2025-01-12', version: 'v1.0' },
            { id: 2, name: 'Konut Ürün Broşürü', type: 'pdf', size: '1.2 MB', uploadDate: '2025-01-09', version: 'v1.0' }
        ],
        aiEnabled: true,
        status: 'active'
    }
};

// Global değişkenler
let currentProduct = null;
let currentModal = null;

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sigorta Platformu başlatıldı');

    // KVKK kontrolü
    checkKVKKConsent();

    // Session başlat
    initSession();
});

// Session başlat
function initSession() {
    if (!sessionStorage.getItem('sessionId')) {
        const sessionId = 'sess_' + Date.now() + '_' + generateRandomString(8);
        sessionStorage.setItem('sessionId', sessionId);
        sessionStorage.setItem('sessionStart', new Date().toISOString());
        console.log('📝 Yeni session oluşturuldu:', sessionId);
    }
}

// Random string generator
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// KVKK Kontrol
function checkKVKKConsent() {
    const consent = localStorage.getItem('kvkkConsent');
    if (!consent) {
        // İlk girişte KVKK göster (3 saniye sonra)
        setTimeout(() => {
            openModal('kvkkModal');
        }, 3000);
    }
}

// KVKK Kabul
function acceptKVKK() {
    const consentData = {
        accepted: true,
        date: new Date().toISOString(),
        sessionId: sessionStorage.getItem('sessionId'),
        version: '1.0'
    };

    localStorage.setItem('kvkkConsent', JSON.stringify(consentData));
    closeModal('kvkkModal');

    // Audit trail
    logAudit('kvkk_consent_accepted', consentData);

    showNotification('KVKK onayınız kaydedildi', 'success');
}

// Modal Açma
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        currentModal = modalId;
        document.body.style.overflow = 'hidden';
    }
}

// Modal Kapama
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        currentModal = null;
        document.body.style.overflow = 'auto';
    }
}

// ESC tuşu ile modal kapat
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && currentModal) {
        closeModal(currentModal);
    }
});

// AI Test Açma
function openAITest(productId) {
    currentProduct = products[productId];

    if (!currentProduct) {
        showNotification('Ürün bulunamadı', 'error');
        return;
    }

    // Modal başlık güncelle
    document.getElementById('testProductName').textContent = currentProduct.name;
    document.getElementById('chatProductName').textContent = currentProduct.name;

    // Chat'i temizle
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="chat-message ai-message">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">
                    Merhaba! ${currentProduct.name} hakkında sorularınızı cevaplayabilirim.
                    Sistemde yüklü dokümanlardan bilgi vereceğim.
                </div>
                <div class="message-meta">
                    <span class="message-time">${getCurrentTime()}</span>
                </div>
            </div>
        </div>
    `;

    // Audit listesini temizle
    document.getElementById('auditList').innerHTML = `
        <div class="audit-info">
            <i class="fas fa-info-circle"></i>
            <p>Tüm soru-cevap kayıtları burada görüntülenir. SEDDK denetimi için saklanır.</p>
        </div>
    `;

    // Modal aç
    openModal('aiTestModal');

    // Input focus
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 300);

    // Audit log
    logAudit('ai_test_opened', {
        productId: productId,
        productName: currentProduct.name
    });
}

// Doküman Yönetimi Açma
function manageDocuments(productId) {
    currentProduct = products[productId];

    if (!currentProduct) {
        showNotification('Ürün bulunamadı', 'error');
        return;
    }

    // Modal başlık güncelle
    document.getElementById('docProductName').textContent = currentProduct.name;

    // Doküman listesini göster
    renderDocuments();

    // Modal aç
    openModal('documentsModal');

    // Audit log
    logAudit('documents_opened', {
        productId: productId,
        productName: currentProduct.name
    });
}

// Dokümanları Render Et
function renderDocuments() {
    const documentsList = document.getElementById('documentsList');

    if (!currentProduct || !currentProduct.documents || currentProduct.documents.length === 0) {
        documentsList.innerHTML = `
            <div class="audit-info">
                <i class="fas fa-info-circle"></i>
                <p>Henüz doküman yüklenmemiş.</p>
            </div>
        `;
        return;
    }

    documentsList.innerHTML = currentProduct.documents.map(doc => `
        <div class="document-item">
            <div class="document-info">
                <div class="document-icon">
                    <i class="fas fa-file-${doc.type === 'pdf' ? 'pdf' : 'word'}"></i>
                </div>
                <div class="document-details">
                    <h5>${doc.name}</h5>
                    <div class="document-meta">
                        ${doc.size} • ${doc.uploadDate} • ${doc.version}
                    </div>
                </div>
            </div>
            <div class="document-actions">
                <button class="btn-icon" onclick="viewDocument(${doc.id})" title="Görüntüle">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" onclick="downloadDocument(${doc.id})" title="İndir">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon" onclick="deleteDocument(${doc.id})" title="Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Doküman İşlemleri
function viewDocument(docId) {
    showNotification('Doküman görüntüleme - CMS entegrasyonunda aktif olacak', 'info');
    logAudit('document_viewed', { docId, productId: currentProduct.id });
}

function downloadDocument(docId) {
    showNotification('Doküman indiriliyor...', 'success');
    logAudit('document_downloaded', { docId, productId: currentProduct.id });
}

function deleteDocument(docId) {
    if (confirm('Bu dokümanı silmek istediğinizden emin misiniz?\n\nÖNEMLİ: Doküman silinirse AI asistan bu doküman hakkında bilgi veremez.')) {
        showNotification('Doküman silindi', 'success');
        logAudit('document_deleted', { docId, productId: currentProduct.id });

        // Listeyi güncelle (gerçek uygulamada API'den çekilir)
        currentProduct.documents = currentProduct.documents.filter(d => d.id !== docId);
        currentProduct.documentCount = currentProduct.documents.length;
        renderDocuments();
    }
}

// Dosya Yükleme
document.getElementById('fileUpload')?.addEventListener('change', function(e) {
    const files = e.target.files;

    if (files.length === 0) return;

    // Simülasyon - Gerçek uygulamada backend'e yüklenecek
    showNotification(`${files.length} dosya yükleniyor...`, 'info');

    // Her dosya için
    Array.from(files).forEach(file => {
        // Dosya boyut kontrolü (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showNotification(`${file.name} çok büyük (max 10MB)`, 'error');
            return;
        }

        // Format kontrolü
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            showNotification(`${file.name} desteklenmeyen format`, 'error');
            return;
        }

        // Simüle upload
        setTimeout(() => {
            const newDoc = {
                id: Date.now(),
                name: file.name,
                type: file.name.endsWith('.pdf') ? 'pdf' : 'docx',
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                uploadDate: new Date().toISOString().split('T')[0],
                version: 'v1.0'
            };

            currentProduct.documents.push(newDoc);
            currentProduct.documentCount++;

            renderDocuments();
            showNotification(`${file.name} başarıyla yüklendi`, 'success');

            logAudit('document_uploaded', {
                fileName: file.name,
                fileSize: file.size,
                productId: currentProduct.id
            });
        }, 1000);
    });

    // Input'u temizle
    e.target.value = '';
});

// Satış Sayfasına Git
function openProductSales(productId) {
    // Gerçek uygulamada sales.html?product=kasko gibi bir sayfaya yönlendirilecek
    showNotification('Satış ekranı - Devam ediyor...', 'info');
    logAudit('sales_page_opened', { productId });

    // Şimdilik sales.html'e yönlendir
    setTimeout(() => {
        window.location.href = `sales.html?product=${productId}`;
    }, 500);
}

// Chat Enter Tuşu
function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendTestMessage();
    }
}

// Test Mesajı Gönder
function sendTestMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (message === '') return;

    // Kullanıcı mesajını ekle
    addChatMessage(message, 'user');

    // Input'u temizle
    input.value = '';

    // AI cevabını al (500ms gecikme ile)
    setTimeout(() => {
        const response = getAIResponse(message);
        addChatMessage(response.text, 'ai', response.source);

        // Audit trail ekle
        addAuditItem(message, response.text, response.source);
    }, 500);

    // Audit log
    logAudit('user_question', {
        productId: currentProduct.id,
        question: message
    });
}

// Öneri Gönder
function sendSuggestion(message) {
    document.getElementById('chatInput').value = message;
    sendTestMessage();
}

// Chat Mesajı Ekle
function addChatMessage(text, type, source = null) {
    const chatMessages = document.getElementById('chatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;

    const avatar = type === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${avatar}
        </div>
        <div class="message-content">
            <div class="message-text">
                ${text}
            </div>
            ${source ? `
            <div class="message-source">
                <i class="fas fa-book"></i> Kaynak: ${source}
            </div>
            ` : ''}
            <div class="message-meta">
                <span class="message-time">${getCurrentTime()}</span>
            </div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// AI Cevabını Al (Simülasyon - Gerçekte CMS'teki AI'a gidecek)
function getAIResponse(question) {
    const q = question.toLowerCase();

    // Basit pattern matching - Gerçek uygulamada AI API çağrısı yapılacak
    if (q.includes('kapsam') || q.includes('neleri kapsar') || q.includes('teminat')) {
        return {
            text: `${currentProduct.name} için teminat kapsamı şunları içerir:\n\n• Temel teminatlar\n• Ek teminatlar\n• Özel durumlar\n\nDetaylı bilgi için ürün şartnamesini inceleyebilirsiniz.`,
            source: `${currentProduct.name} Şartnamesi - Madde 3.2`
        };
    }

    if (q.includes('fiyat') || q.includes('ücret') || q.includes('prim')) {
        return {
            text: `${currentProduct.name} fiyatlandırması müşteri profiline ve talep edilen teminatlara göre değişiklik gösterir. Detaylı teklif için lütfen satış formunu doldurunuz.`,
            source: `${currentProduct.name} Broşürü - Sayfa 4`
        };
    }

    if (q.includes('yaş') || q.includes('sınır')) {
        return {
            text: `${currentProduct.name} için yaş sınırlaması ürün özelliklerine göre belirlenir. Detaylı bilgi için dokümanları inceleyebilirsiniz.`,
            source: `${currentProduct.name} Teknik Doküman - Bölüm 2.1`
        };
    }

    // Varsayılan cevap
    return {
        text: `"${question}" hakkında bilgi almak için dokümanları tarayabilirim. Ancak bu soru için daha spesifik bir yanıt verebilmem için lütfen sorunuzu detaylandırın veya şartnameleri inceleyebilirsiniz.`,
        source: null
    };
}

// Audit Item Ekle
function addAuditItem(question, answer, source) {
    const auditList = document.getElementById('auditList');

    // İlk info mesajını kaldır
    const infoDiv = auditList.querySelector('.audit-info');
    if (infoDiv) {
        infoDiv.remove();
    }

    const auditItem = document.createElement('div');
    auditItem.className = 'audit-item';

    auditItem.innerHTML = `
        <div class="audit-item-header">
            <span class="audit-timestamp">${new Date().toLocaleString('tr-TR')}</span>
        </div>
        <div class="audit-question"><strong>S:</strong> ${question}</div>
        <div class="audit-question"><strong>C:</strong> ${answer.substring(0, 100)}${answer.length > 100 ? '...' : ''}</div>
        ${source ? `<div class="audit-source">📚 ${source}</div>` : ''}
    `;

    auditList.insertBefore(auditItem, auditList.firstChild);

    // Audit log kaydet
    logAudit('ai_response_generated', {
        productId: currentProduct.id,
        question: question,
        answerLength: answer.length,
        source: source,
        timestamp: new Date().toISOString()
    });
}

// Chat Temizle
function clearChat() {
    if (confirm('Chat geçmişini temizlemek istediğinizden emin misiniz?')) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="chat-message ai-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        Merhaba! ${currentProduct.name} hakkında sorularınızı cevaplayabilirim.
                        Sistemde yüklü dokümanlardan bilgi vereceğim.
                    </div>
                    <div class="message-meta">
                        <span class="message-time">${getCurrentTime()}</span>
                    </div>
                </div>
            </div>
        `;

        showNotification('Chat temizlendi', 'success');
    }
}

// Audit Trail Kaydet
function logAudit(action, data) {
    const auditLog = {
        sessionId: sessionStorage.getItem('sessionId'),
        timestamp: new Date().toISOString(),
        action: action,
        data: data,
        userAgent: navigator.userAgent
    };

    // LocalStorage'a kaydet (gerçek uygulamada backend'e gönderilir)
    let auditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
    auditTrail.push(auditLog);

    // Son 1000 kaydı tut
    if (auditTrail.length > 1000) {
        auditTrail = auditTrail.slice(-1000);
    }

    localStorage.setItem('auditTrail', JSON.stringify(auditTrail));

    console.log('📊 Audit Log:', action, data);
}

// Bildirim Göster
function showNotification(message, type = 'info') {
    // Basit alert - Gerçek uygulamada toast notification kullanılır
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Geçici olarak alert kullan
    if (type === 'error') {
        alert('❌ ' + message);
    } else if (type === 'success') {
        alert('✅ ' + message);
    } else {
        alert('ℹ️ ' + message);
    }
}

// Saat formatı
function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' +
           now.getMinutes().toString().padStart(2, '0');
}

// Global fonksiyonları dışa aktar
window.openModal = openModal;
window.closeModal = closeModal;
window.openAITest = openAITest;
window.manageDocuments = manageDocuments;
window.openProductSales = openProductSales;
window.acceptKVKK = acceptKVKK;
window.handleChatEnter = handleChatEnter;
window.sendTestMessage = sendTestMessage;
window.sendSuggestion = sendSuggestion;
window.clearChat = clearChat;
window.viewDocument = viewDocument;
window.downloadDocument = downloadDocument;
window.deleteDocument = deleteDocument;

// Mega Menu - Static grid layout (no JavaScript needed)

console.log('✅ main.js yüklendi');
