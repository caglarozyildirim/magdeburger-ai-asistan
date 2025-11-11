// AI Sales POC - JavaScript

// Global variables
let currentProduct = '';
let chatHistory = [];
let auditLog = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAuditTrail();
});

// Start Sales Flow
function startSalesFlow(product) {
    // KVKK onayı al
    if (confirm('KVKK Aydınlatma Metni: Kişisel verileriniz 6698 sayılı KVKK kapsamında işlenecektir. Devam etmek istiyor musunuz?')) {
        // Sales.html sayfasına yönlendir (bu sayfada 5 adımlı satış akışı var)
        window.location.href = `sales.html?product=${product}`;
    }
}

// Open AI Test Modal
function openAITest(product) {
    currentProduct = product;
    document.getElementById('aiModalTitle').textContent = `AI Test - ${product.charAt(0).toUpperCase() + product.slice(1)}`;
    document.getElementById('aiTestModal').style.display = 'flex';

    // Load previous chat if exists
    loadChatHistory(product);
}

// Close AI Test Modal
function closeAITest() {
    document.getElementById('aiTestModal').style.display = 'none';
}

// Open Documents Modal
function openDocuments(product) {
    currentProduct = product;
    document.getElementById('docModalTitle').textContent = `Doküman Yönetimi - ${product.charAt(0).toUpperCase() + product.slice(1)}`;
    document.getElementById('documentsModal').style.display = 'flex';
}

// Close Documents Modal
function closeDocuments() {
    document.getElementById('documentsModal').style.display = 'none';
}

// Handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        alert('Dosya boyutu 10MB\'dan büyük olamaz!');
        return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        alert('Sadece PDF, DOC ve DOCX dosyaları yüklenebilir!');
        return;
    }

    // Simulate upload
    alert(`"${file.name}" başarıyla yüklendi!\n\nDosya AI tarafından işlenmeye başlandı. Birkaç dakika içinde soru-cevap modülünde kullanılabilir olacak.`);

    // Log to audit trail
    logAudit('document_upload', `Doküman yüklendi: ${file.name}`, null);
}

// Chat Functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const question = input.value.trim();

    if (!question) return;

    askQuestion(question);
    input.value = '';
}

function askQuestion(question) {
    const chatMessages = document.getElementById('chatMessages');

    // Add user message
    const userMessage = createMessageElement('user', question);
    chatMessages.appendChild(userMessage);

    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(question);
        const aiMessage = createMessageElement('ai', response.answer, response.source);
        chatMessages.appendChild(aiMessage);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Log to audit trail
        logAudit('qa', question, response);

        // Save to chat history with product info
        const historyItem = {
            product: currentProduct,
            question: question,
            answer: response.answer,
            source: response.source,
            timestamp: new Date().toISOString()
        };
        chatHistory.push(historyItem);

        // Save to localStorage
        saveChatToLocalStorage(historyItem);
    }, 1000);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createMessageElement(type, text, source = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';

    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.textContent = text;

    const meta = document.createElement('div');
    meta.className = 'message-meta';

    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    meta.appendChild(time);

    content.appendChild(messageText);

    // Add source citation for AI messages
    if (type === 'ai' && source) {
        const sourceDiv = document.createElement('div');
        sourceDiv.className = 'message-source';
        sourceDiv.innerHTML = `<i class="fas fa-file-pdf"></i> <strong>Kaynak:</strong> ${source}`;
        content.appendChild(sourceDiv);
    }

    content.appendChild(meta);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    return messageDiv;
}

function generateAIResponse(question) {
    const lowerQuestion = question.toLowerCase();

    // Kasko specific responses
    if (currentProduct === 'kasko') {
        if (lowerQuestion.includes('kapsar') || lowerQuestion.includes('neleri') || lowerQuestion.includes('kapsam')) {
            return {
                answer: 'KaskolaMAG Sigortası, aracınızın çarpma, çarpışma, devrilme, yangın, hırsızlık, doğal afetler gibi risklere karşı kapsamlı koruma sağlar. MAG Servislerde tamir imkanı sunulur ve onarım süresi boyunca araç teminatı, Magdeburger garantisi verilir. Ayrıca çekilme-kurtarma hizmeti, yol kenarı yardımı, lastik değiştirilmesi ve kaza anında kiralık araç desteği sağlanmaktadır.',
                source: 'KaskolaMAG Ürün Dokümanı v2.1 - Bölüm 3: Teminat Kapsamı'
            };
        }
        if (lowerQuestion.includes('indirim') || lowerQuestion.includes('fiyat') || lowerQuestion.includes('%')) {
            return {
                answer: 'KaskolaMAG ile poliçe priminde %30\'a varan indirim avantajından yararlanabilirsiniz. Hasarsızlık indiriminiz korunur ve MAG Servislerde tamir yaptırdığınızda ek avantajlar elde edersiniz. Mekanik bakım sonrası indirimler ve onarım sonrası yıkama-vale hizmetleri de sunulmaktadır.',
                source: 'KaskolaMAG Ürün Broşürü v1.8 - Sayfa 2: Fiyat Avantajları'
            };
        }
        if (lowerQuestion.includes('ikame') || lowerQuestion.includes('yedek') || lowerQuestion.includes('araç')) {
            return {
                answer: 'KaskolaMAG sigortası ikame araç hizmeti sunar. Hasarlı aracınız tamirdeyken size kullanımınız için geçici bir araç tahsis edilir. Ayrıca ulaşım masrafı teminatı seçeneği ile ek destek alabilirsiniz.',
                source: 'KaskolaMAG Şartnamesi v2.1 - Madde 7.3: İkame Araç Hizmeti'
            };
        }
        if (lowerQuestion.includes('mag') || lowerQuestion.includes('servis') || lowerQuestion.includes('tamir')) {
            return {
                answer: 'MAG Servis ağında onarım yaptırdığınızda özel avantajlardan yararlanırsınız: Onarım süresi boyunca Magdeburger garantisi, mekanik bakım sonrası indirimler, onarım sonrası ücretsiz yıkama ve vale hizmeti sunulur. MAG Servisler, yüksek kaliteli onarım ve müşteri memnuniyeti odaklı hizmet vermektedir.',
                source: 'KaskolaMAG Ürün Dokümanı v2.1 - Bölüm 5: MAG Servis Avantajları'
            };
        }
        if (lowerQuestion.includes('asistans') || lowerQuestion.includes('yardım') || lowerQuestion.includes('çekici')) {
            return {
                answer: 'KaskolaMAG ile 7/24 yol yardımı hizmetinden faydalanabilirsiniz. Çekilme-kurtarma hizmeti, yol kenarı yardımı, lastik değiştirilmesi, akü takviyesi gibi hizmetler kapsam dahilindedir. Arıza durumunda 0850 808 26 24 numaralı hattımızdan destek alabilirsiniz.',
                source: 'KaskolaMAG Şartnamesi v2.1 - Madde 8: Asistans Hizmetleri'
            };
        }
    }

    // Konut specific responses
    if (currentProduct === 'konut') {
        if (lowerQuestion.includes('kapsar') || lowerQuestion.includes('neleri') || lowerQuestion.includes('kapsam')) {
            return {
                answer: 'Konut Sigortası, evinizi ve içerisindeki eşyalarınızı yangın, yıldırım, infilak, hırsızlık, su baskını, deprem, doğal afetler, cam kırılması gibi risklere karşı korur. Ev sahipleri ve kiracılar için kapsamlı güvence sağlar. Elektronik cihaz arızaları, alternatif konut masrafları ve sorumluluk teminatı da dahildir.',
                source: 'Konut Sigortası Ürün Dokümanı v3.0 - Bölüm 2: Teminat Kapsamı'
            };
        }
        if (lowerQuestion.includes('yangın') || lowerQuestion.includes('doğal') || lowerQuestion.includes('afet')) {
            return {
                answer: 'Konut Sigortası yangın, yıldırım, infilak teminatı ile evinizi korur. Doğal afetler kapsamında deprem, sel, fırtına, dolu gibi risklere karşı güvence sağlanır. Yangın nedeniyle oluşan hasarlar ve doğal afetlerden kaynaklanan zararlar poliçe limitleri dahilinde karşılanır.',
                source: 'Konut Sigortası Şartnamesi v3.0 - Madde 4.1: Yangın ve Doğal Afet Teminatı'
            };
        }
        if (lowerQuestion.includes('hırsızlık') || lowerQuestion.includes('çalınma')) {
            return {
                answer: 'Konut Sigortası hırsızlık teminatı ile evinizden çalınan eşyalarınız güvence altındadır. Zorlama ile gerçekleşen hırsızlık olayları ve bu sırada oluşan hasar ve zararlar teminat kapsamındadır. Eşya değerleri poliçe limitine kadar karşılanır.',
                source: 'Konut Sigortası Şartnamesi v3.0 - Madde 4.3: Hırsızlık Teminatı'
            };
        }
        if (lowerQuestion.includes('su') || lowerQuestion.includes('baskın') || lowerQuestion.includes('sızıntı')) {
            return {
                answer: 'Su baskını teminatı ile kapalı boru tesisatından sızan su, yağmur suları, çatı akıntıları nedeniyle oluşan hasarlar karşılanır. Komşu su baskını zararları da teminat kapsamındadır. Konut içindeki eşyalar ve bina hasarları poliçe limitleri dahilinde karşılanır.',
                source: 'Konut Sigortası Şartnamesi v3.0 - Madde 4.2: Su Baskını Teminatı'
            };
        }
        if (lowerQuestion.includes('cam') || lowerQuestion.includes('kırılma') || lowerQuestion.includes('pencere')) {
            return {
                answer: 'Cam kırılması teminatı ile konutunuzdaki sabit camlar, vitrin camları, pencere ve balkon camlarının kırılması durumunda ortaya çıkan masraflar karşılanır. Teminat, kasıtlı olmayan kırılmalar için geçerlidir.',
                source: 'Konut Sigortası Şartnamesi v3.0 - Madde 4.5: Cam Kırılması Teminatı'
            };
        }
        if (lowerQuestion.includes('alternatif') || lowerQuestion.includes('kiralama') || lowerQuestion.includes('geçici')) {
            return {
                answer: 'Alternatif konut masrafları teminatı ile eviniz oturulamaz hale geldiğinde geçici olarak ikamet edeceğiniz konut için oluşan kiralama masrafları karşılanır. Bu teminat, yangın, su baskını gibi olaylar sonrası devreye girer ve belirli bir limit dahilinde sunulur.',
                source: 'Konut Sigortası Şartnamesi v3.0 - Madde 4.7: Alternatif Konut Masrafları'
            };
        }
        if (lowerQuestion.includes('deprem') || lowerQuestion.includes('zelzele')) {
            return {
                answer: 'Konut Sigortası deprem teminatı ile deprem ve deprem sonucu oluşan yangın, su baskını gibi ikincil hasarlar güvence altındadır. DASK (Doğal Afet Sigortaları Kurumu) ile birlikte eksiksiz koruma sağlanır. Teminat limitleri poliçe kapsamında belirlenir.',
                source: 'Konut Sigortası Şartnamesi v3.0 - Madde 4.4: Deprem Teminatı'
            };
        }
    }

    // Common responses for both products
    if (lowerQuestion.includes('fiyat') || lowerQuestion.includes('prim') || lowerQuestion.includes('ücret')) {
        return {
            answer: `${currentProduct.charAt(0).toUpperCase() + currentProduct.slice(1)} sigortası primleri ${currentProduct === 'kasko' ? 'araç değeri, model yılı, kullanım şekli, sürücü profili' : 'konut değeri, lokasyonu, yapı özellikleri, teminat kapsamı'} gibi birçok faktöre bağlıdır. Detaylı fiyat teklifi için satış sürecini başlatabilir veya 0850 808 26 24 numaralı hattımızdan bilgi alabilirsiniz. Online teklif de alabilirsiniz.`,
            source: 'Magdeburger Fiyatlandırma Politikası v2.0 - Bölüm 3'
        };
    }

    if (lowerQuestion.includes('başvuru') || lowerQuestion.includes('nasıl') || lowerQuestion.includes('satın')) {
        return {
            answer: 'Magdeburger sigortalarını üç yoldan satın alabilirsiniz: 1) Bu platformda "Satış Başlat" butonuna tıklayarak online başvuru yapabilirsiniz, 2) 0850 808 26 24 numaralı hattımızı arayarak telefon üzerinden başvuru yapabilirsiniz, 3) En yakın Magdeburger acentesini ziyaret edebilirsiniz.',
            source: 'Magdeburger Satış Kanalları Rehberi v1.2'
        };
    }

    if (lowerQuestion.includes('hasar') || lowerQuestion.includes('talep') || lowerQuestion.includes('zarar')) {
        return {
            answer: 'Hasar durumunda 0850 808 26 24 numaralı yardım hattımızı arayarak hasar ihbarında bulunabilirsiniz. Hasar ekibimiz sizi yönlendirecek ve gerekli belgeleri talep edecektir. Online hasar bildirim sistemimizden de 7/24 başvuru yapabilirsiniz. Hasar dosyanız en kısa sürede değerlendirilir.',
            source: 'Magdeburger Hasar Süreçleri Rehberi v3.1 - Bölüm 1'
        };
    }

    // Default response
    return {
        answer: `${currentProduct.charAt(0).toUpperCase() + currentProduct.slice(1)} sigortası hakkında daha spesifik bir soru sorabilir misiniz? Örneğin teminat kapsamı, fiyatlandırma, başvuru süreci veya özel avantajlar hakkında detaylı bilgi verebilirim. Ayrıca 0850 808 26 24 numaralı hattımızdan danışmanlarımıza ulaşabilirsiniz.`,
        source: `${currentProduct.charAt(0).toUpperCase() + currentProduct.slice(1)} Ürün Dokümanı - Genel Bilgiler`
    };
}

function clearChat() {
    if (confirm('Tüm sohbet geçmişi silinecek. Emin misiniz?')) {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="chat-message ai-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        Merhaba! ${currentProduct.charAt(0).toUpperCase() + currentProduct.slice(1)} sigortası hakkında sorularınızı cevaplayabilirim. Tüm cevaplarım ürün dokümanlarına dayanmaktadır.
                    </div>
                    <div class="message-meta">
                        <span class="message-time">Az önce</span>
                    </div>
                </div>
            </div>
        `;

        // Clear chat history for current product from localStorage
        const allHistory = JSON.parse(localStorage.getItem('chatHistory') || '{}');
        delete allHistory[currentProduct];
        localStorage.setItem('chatHistory', JSON.stringify(allHistory));

        // Update global variable
        chatHistory = chatHistory.filter(item => item.product !== currentProduct);
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Audit Trail Functions
function logAudit(type, question, response) {
    const auditItem = {
        type: type,
        product: currentProduct,
        question: question,
        answer: response ? response.answer : null,
        source: response ? response.source : null,
        timestamp: new Date().toISOString()
    };

    auditLog.unshift(auditItem);

    // Save to localStorage
    localStorage.setItem('auditLog', JSON.stringify(auditLog));

    // Update UI
    updateAuditTrail();
}

function loadAuditTrail() {
    const saved = localStorage.getItem('auditLog');
    if (saved) {
        auditLog = JSON.parse(saved);
        updateAuditTrail();
    }
}

function updateAuditTrail() {
    const auditTrailDiv = document.getElementById('auditTrail');
    if (!auditTrailDiv) return;

    // Clear existing
    auditTrailDiv.innerHTML = '';

    // Add items
    auditLog.forEach(item => {
        const auditItemDiv = document.createElement('div');
        auditItemDiv.className = 'audit-item';

        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let content = `
            <div class="audit-header">
                <span class="audit-time">
                    <i class="fas fa-clock"></i> ${formattedDate}
                </span>
                <span class="audit-product">${item.product}</span>
            </div>
            <div class="audit-body">
        `;

        if (item.type === 'qa') {
            content += `
                <div class="audit-question">
                    <strong>Soru:</strong> ${item.question}
                </div>
                <div class="audit-answer">
                    <strong>Cevap:</strong> ${item.answer.substring(0, 80)}...
                </div>
                <div class="audit-source">
                    <i class="fas fa-file-pdf"></i>
                    <strong>Kaynak:</strong> ${item.source}
                </div>
            `;
        } else if (item.type === 'document_upload') {
            content += `
                <div class="audit-action">
                    <i class="fas fa-upload"></i> ${item.question}
                </div>
            `;
        }

        content += `</div>`;
        auditItemDiv.innerHTML = content;
        auditTrailDiv.appendChild(auditItemDiv);
    });
}

function exportAuditTrail() {
    // Export to JSON
    const dataStr = JSON.stringify(auditLog, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-trail-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function saveChatToLocalStorage(historyItem) {
    // Get all chat history from localStorage
    const allHistory = JSON.parse(localStorage.getItem('chatHistory') || '{}');

    // Initialize product array if doesn't exist
    if (!allHistory[historyItem.product]) {
        allHistory[historyItem.product] = [];
    }

    // Add new message
    allHistory[historyItem.product].push(historyItem);

    // Keep only last 50 messages per product to avoid storage limits
    if (allHistory[historyItem.product].length > 50) {
        allHistory[historyItem.product] = allHistory[historyItem.product].slice(-50);
    }

    // Save back to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(allHistory));
}

function loadChatHistory(product) {
    // Get all chat history from localStorage
    const allHistory = JSON.parse(localStorage.getItem('chatHistory') || '{}');
    const productHistory = allHistory[product] || [];

    // Clear chat messages
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="chat-message ai-message">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">
                    Merhaba! ${product.charAt(0).toUpperCase() + product.slice(1)} sigortası hakkında sorularınızı cevaplayabilirim. Tüm cevaplarım ürün dokümanlarına dayanmaktadır.
                </div>
                <div class="message-meta">
                    <span class="message-time">Az önce</span>
                </div>
            </div>
        </div>
    `;

    // Restore previous messages
    productHistory.forEach(item => {
        // Add user message
        const userMessage = createMessageElement('user', item.question);
        chatMessages.appendChild(userMessage);

        // Add AI response
        const aiMessage = createMessageElement('ai', item.answer, item.source);
        chatMessages.appendChild(aiMessage);
    });

    // Update global chatHistory
    chatHistory = productHistory;

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Close modals on outside click
window.onclick = function(event) {
    const aiModal = document.getElementById('aiTestModal');
    const docModal = document.getElementById('documentsModal');

    if (event.target === aiModal) {
        closeAITest();
    }
    if (event.target === docModal) {
        closeDocuments();
    }
}
