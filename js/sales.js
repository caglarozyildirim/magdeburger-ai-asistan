// Sales Form - Multi-step Navigation and AI Assistant
let currentStep = 1;
const totalSteps = 5;
let currentProduct = 'kasko'; // Will be set from URL parameter

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get product from URL
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');

    // Initialize form
    initializeForm(product);

    // Initialize Sales Chat (AI Assistant)
    initializeSalesChat();
});

// Initialize Form
function initializeForm(product) {
    // Show first step
    showStep(1);

    // Add form validation
    addFormValidation();

    // Load product-specific defaults if needed
    if (product) {
        loadProductDefaults(product);
    }
}

// Navigate to next step
function nextStep() {
    // Validate current step before moving forward
    if (!validateStep(currentStep)) {
        return;
    }

    if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        updateProgress();

        // Scroll to top of form
        document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Send message to AI Assistant
        notifyAIAssistant(`Kullanıcı adım ${currentStep}'e geçti`);
    }
}

// Navigate to previous step
function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();

        // Scroll to top of form
        document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Show specific step
function showStep(step) {
    console.log(`showStep called with step: ${step}`);

    // Hide all steps
    const steps = document.querySelectorAll('.form-step');
    console.log(`Found ${steps.length} form steps`);
    steps.forEach(s => s.classList.remove('active'));

    // Show current step - IMPORTANT: must specify .form-step to avoid selecting .step-item
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    console.log('Current step element:', currentStepElement);

    if (currentStepElement) {
        currentStepElement.classList.add('active');
        console.log(`Added 'active' class to step ${step}`, currentStepElement);
    } else {
        console.error(`Could not find .form-step element with data-step="${step}"`);
    }

    // Update step title
    updateStepTitle(step);
}

// Update progress indicator
function updateProgress() {
    const stepItems = document.querySelectorAll('.step-item');

    stepItems.forEach((item, index) => {
        const stepNumber = index + 1;

        if (stepNumber < currentStep) {
            item.classList.add('completed');
            item.classList.remove('active');
        } else if (stepNumber === currentStep) {
            item.classList.add('active');
            item.classList.remove('completed');
        } else {
            item.classList.remove('active', 'completed');
        }
    });
}

// Update step title in form header
function updateStepTitle(step) {
    const titles = {
        1: 'Kişisel Bilgiler',
        2: 'Ürün Detayları',
        3: 'Acente Seçimi',
        4: 'Teklif ve Cross-Sell',
        5: 'Ödeme'
    };

    const titleElement = document.querySelector('.form-panel h2');
    if (titleElement && titles[step]) {
        titleElement.textContent = `Adım ${step}: ${titles[step]}`;
    }
}

// Validate current step
function validateStep(step) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!currentStepElement) {
        console.error(`Could not find form step with data-step="${step}"`);
        return true;
    }

    // Get all required fields in current step
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    console.log(`Validating step ${step}, found ${requiredFields.length} required fields`);
    let isValid = true;

    requiredFields.forEach(field => {
        const fieldValue = field.value ? field.value.trim() : '';

        if (!fieldValue) {
            isValid = false;
            field.style.borderColor = '#ef4444';
            console.log(`Field ${field.id || field.name} is empty`);

            // Add error message if not exists
            const nextElement = field.nextElementSibling;
            const hasErrorMessage = nextElement && nextElement.classList && nextElement.classList.contains('error-message');

            if (!hasErrorMessage) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.style.color = '#ef4444';
                errorMsg.style.fontSize = '12px';
                errorMsg.style.marginTop = '4px';
                errorMsg.textContent = 'Bu alan zorunludur';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
            }
        } else {
            field.style.borderColor = '#10b981';
            console.log(`Field ${field.id || field.name} is valid`);

            // Remove error message if exists
            const nextElement = field.nextElementSibling;
            if (nextElement && nextElement.classList && nextElement.classList.contains('error-message')) {
                nextElement.remove();
            }
        }
    });

    // Special validations
    if (step === 1) {
        // Validate email
        const emailField = currentStepElement.querySelector('#email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                emailField.style.borderColor = '#ef4444';
                showErrorMessage(emailField, 'Geçerli bir e-posta adresi giriniz');
            }
        }

        // Validate phone
        const phoneField = currentStepElement.querySelector('#phone');
        if (phoneField && phoneField.value) {
            const cleanPhone = phoneField.value.replace(/\D/g, '');
            if (cleanPhone.length !== 10) {
                isValid = false;
                phoneField.style.borderColor = '#ef4444';
                showErrorMessage(phoneField, 'Telefon numarası 10 haneli olmalıdır (5XX XXX XX XX)');
            } else if (!cleanPhone.startsWith('5')) {
                isValid = false;
                phoneField.style.borderColor = '#ef4444';
                showErrorMessage(phoneField, 'Cep telefonu 5 ile başlamalıdır');
            }
        }

        // Validate TC
        const tcField = currentStepElement.querySelector('#tckn');
        if (tcField && tcField.value) {
            if (tcField.value.length !== 11) {
                isValid = false;
                tcField.style.borderColor = '#ef4444';
                showErrorMessage(tcField, 'TC Kimlik No 11 haneli olmalıdır');
            }
        }
    }

    if (!isValid) {
        // Show notification
        showNotification('Lütfen tüm zorunlu alanları doldurunuz', 'error');
    }

    return isValid;
}

// Show error message
function showErrorMessage(field, message) {
    // Remove existing error message
    if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
        field.nextElementSibling.remove();
    }

    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.style.color = '#ef4444';
    errorMsg.style.fontSize = '12px';
    errorMsg.style.marginTop = '4px';
    errorMsg.textContent = message;
    field.parentNode.insertBefore(errorMsg, field.nextSibling);
}

// Add form validation listeners
function addFormValidation() {
    // Real-time validation on input
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#e5e7eb';
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                    this.nextElementSibling.remove();
                }
            }
        });
    });

    // Phone number formatting and validation
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

            // Limit to 10 digits
            if (value.length > 10) {
                value = value.slice(0, 10);
            }

            // Format as 5XX XXX XX XX
            let formatted = '';
            if (value.length > 0) {
                formatted = value.slice(0, 3);
                if (value.length > 3) {
                    formatted += ' ' + value.slice(3, 6);
                }
                if (value.length > 6) {
                    formatted += ' ' + value.slice(6, 8);
                }
                if (value.length > 8) {
                    formatted += ' ' + value.slice(8, 10);
                }
            }

            e.target.value = formatted;
        });

        // Validate on blur
        phoneField.addEventListener('blur', function() {
            const cleanPhone = this.value.replace(/\D/g, '');
            if (cleanPhone.length > 0 && cleanPhone.length !== 10) {
                this.style.borderColor = '#ef4444';
                showErrorMessage(this, 'Telefon numarası 10 haneli olmalıdır (5XX XXX XX XX)');
            } else if (cleanPhone.length === 10 && !cleanPhone.startsWith('5')) {
                this.style.borderColor = '#ef4444';
                showErrorMessage(this, 'Cep telefonu 5 ile başlamalıdır');
            } else if (cleanPhone.length === 10) {
                this.style.borderColor = '#10b981';
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                    this.nextElementSibling.remove();
                }
            }
        });
    }

    // Email validation on blur
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (this.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(this.value)) {
                    this.style.borderColor = '#10b981';
                    if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                        this.nextElementSibling.remove();
                    }
                } else {
                    this.style.borderColor = '#ef4444';
                    showErrorMessage(this, 'Geçerli bir e-posta adresi giriniz');
                }
            }
        });
    }

    // TC Kimlik No validation
    const tcknField = document.getElementById('tckn');
    if (tcknField) {
        tcknField.addEventListener('input', function(e) {
            // Only allow digits
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        tcknField.addEventListener('blur', function() {
            if (this.value.length > 0 && this.value.length !== 11) {
                this.style.borderColor = '#ef4444';
                showErrorMessage(this, 'TC Kimlik No 11 haneli olmalıdır');
            } else if (this.value.length === 11) {
                this.style.borderColor = '#10b981';
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                    this.nextElementSibling.remove();
                }
            }
        });
    }

    // Birth date - ensure calendar opens on focus
    const birthDateField = document.getElementById('birthDate');
    if (birthDateField) {
        birthDateField.addEventListener('focus', function() {
            // Modern browsers automatically show date picker
            // This ensures it's triggered
            if (this.showPicker) {
                this.showPicker();
            }
        });

        birthDateField.addEventListener('blur', function() {
            if (this.value) {
                this.style.borderColor = '#10b981';
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                    this.nextElementSibling.remove();
                }
            }
        });
    }
}

// Load product-specific defaults
function loadProductDefaults(product) {
    // This could load default values based on product type
    console.log('Loading defaults for product:', product);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: ${type === 'error' ? '#ef4444' : '#555195'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-family: 'Rubik', sans-serif;
        font-size: 14px;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Toggle Agent Selection Area
function toggleAgentSelection() {
    const checkbox = document.getElementById('changeAgent');
    const agentSelectionArea = document.getElementById('agentSelectionArea');

    if (checkbox && agentSelectionArea) {
        if (checkbox.checked) {
            agentSelectionArea.style.display = 'block';
            // Add smooth animation
            setTimeout(() => {
                agentSelectionArea.style.opacity = '1';
                agentSelectionArea.style.transform = 'translateY(0)';
            }, 10);
        } else {
            agentSelectionArea.style.opacity = '0';
            agentSelectionArea.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                agentSelectionArea.style.display = 'none';
            }, 300);
        }
    }
}

// KVKK Modal Functions
function openKVKKModal() {
    const modal = document.getElementById('kvkkModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeKVKKModal() {
    const modal = document.getElementById('kvkkModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Log to audit trail
function logToAudit(action) {
    const auditLog = {
        action: action,
        timestamp: new Date().toISOString(),
        step: currentStep
    };

    // Save to localStorage
    let auditTrail = JSON.parse(localStorage.getItem('salesAuditTrail') || '[]');
    auditTrail.push(auditLog);
    localStorage.setItem('salesAuditTrail', JSON.stringify(auditTrail));
}

// AI Sales Assistant Chat Functions

// Initialize product from URL and update chat
function initializeSalesChat() {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');

    if (product) {
        currentProduct = product;

        // Update product name in chat
        const productNameChat = document.getElementById('productNameChat');
        if (productNameChat) {
            productNameChat.textContent = product === 'kasko' ? 'Kasko Sigortası' : 'Konut Sigortası';
        }
    }
}

function sendChatMessage() {
    const input = document.getElementById('salesChatInput');
    const message = input.value.trim();

    if (message === '') return;

    // Add user message
    addChatMessage('user', message);
    input.value = '';

    // Generate and add AI response after delay
    setTimeout(() => {
        const response = generateSalesAIResponse(message);
        addChatMessage('ai', response.answer, response.source);
    }, 1000);
}

function sendQuickMessage(message) {
    // Add user message
    addChatMessage('user', message);

    // Generate and add AI response after delay
    setTimeout(() => {
        const response = generateSalesAIResponse(message);
        addChatMessage('ai', response.answer, response.source);
    }, 1000);
}

function handleChatEnter(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function addChatMessage(type, text, source = null) {
    const chatContainer = document.getElementById('salesChat');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = type === 'user'
        ? '<i class="fas fa-user"></i>'
        : '<i class="fas fa-robot"></i>';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    let bubbleContent = `<p>${text}</p>`;

    // Add source if provided (for AI messages)
    if (source && type === 'ai') {
        bubbleContent += `<div class="message-source"><i class="fas fa-file-alt"></i> Kaynak: ${source}</div>`;
    }

    bubbleContent += `<div class="message-time">Az önce</div>`;
    bubble.innerHTML = bubbleContent;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    chatContainer.appendChild(messageDiv);

    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function generateSalesAIResponse(question) {
    const lowerQuestion = question.toLowerCase();

    // Greeting responses
    if (lowerQuestion.includes('başla') || lowerQuestion.includes('merhaba') || lowerQuestion.includes('selam')) {
        return {
            answer: `Harika! ${currentProduct === 'kasko' ? 'Kasko' : 'Konut'} sigortası için satış sürecine başlıyoruz. Öncelikle kişisel bilgilerinizi dolduralım. Formdaki alanları doldurduktan sonra "Devam Et" butonuna tıklayarak ilerleyebilirsiniz.`,
            source: 'Magdeburger Satış Süreçleri Rehberi v1.0'
        };
    }

    // Product info - Kasko
    if (currentProduct === 'kasko') {
        if (lowerQuestion.includes('kapsar') || lowerQuestion.includes('neleri') || lowerQuestion.includes('kapsam')) {
            return {
                answer: 'KaskolaMAG Sigortası, aracınızın çarpma, çarpışma, devrilme, yangın, hırsızlık, doğal afetler gibi risklere karşı kapsamlı koruma sağlar. MAG Servislerde tamir imkanı sunulur ve onarım süresi boyunca araç teminatı, Magdeburger garantisi verilir. Ayrıca çekilme-kurtarma hizmeti, yol kenarı yardımı, lastik değiştirilmesi ve kaza anında kiralık araç desteği sağlanmaktadır.',
                source: 'KaskolaMAG Ürün Dokümanı v2.1 - Bölüm 3: Teminat Kapsamı'
            };
        }

        if (lowerQuestion.includes('ürün') || lowerQuestion.includes('kasko') || lowerQuestion.includes('hakkında')) {
            return {
                answer: 'KaskolaMAG, yeni nesil kasko sigortasıdır. MAG Servislerde tamir imkanı, %30\'a varan indirim, ikame araç hizmeti ve 7/24 yol yardımı sunmaktadır. Hasarsızlık indiriminiz korunur.',
                source: 'KaskolaMAG Ürün Broşürü v1.8 - Sayfa 1: Genel Bilgiler'
            };
        }

        if (lowerQuestion.includes('indirim') || lowerQuestion.includes('fiyat') || lowerQuestion.includes('%') || lowerQuestion.includes('prim') || lowerQuestion.includes('ücret')) {
            return {
                answer: 'KaskolaMAG ile poliçe priminde %30\'a varan indirim avantajından yararlanabilirsiniz. Hasarsızlık indiriminiz korunur ve MAG Servislerde tamir yaptırdığınızda ek avantajlar elde edersiniz. Kasko primi araç değeri, model yılı, kullanım şekli ve sürücü profilinize göre belirlenir. Formu doldurduktan sonra size özel fiyat teklifini görebileceksiniz.',
                source: 'KaskolaMAG Ürün Broşürü v1.8 - Sayfa 2: Fiyat Avantajları'
            };
        }

        if (lowerQuestion.includes('ikame') || lowerQuestion.includes('yedek') || lowerQuestion.includes('kiralık')) {
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

        if (lowerQuestion.includes('asistans') || lowerQuestion.includes('yardım') || lowerQuestion.includes('çekici') || lowerQuestion.includes('yol')) {
            return {
                answer: 'KaskolaMAG ile 7/24 yol yardımı hizmetinden faydalanabilirsiniz. Çekilme-kurtarma hizmeti, yol kenarı yardımı, lastik değiştirilmesi, akü takviyesi gibi hizmetler kapsam dahilindedir. Arıza durumunda 0850 808 26 24 numaralı hattımızdan destek alabilirsiniz.',
                source: 'KaskolaMAG Şartnamesi v2.1 - Madde 8: Asistans Hizmetleri'
            };
        }

        if (lowerQuestion.includes('teminat')) {
            return {
                answer: 'KaskolaMAG teminatları: Çarpma-çarpışma, yangın, hırsızlık, doğal afetler, cam kırılması, MAG Servis garantisi, ikame araç, 7/24 yol yardımı, çekici hizmeti. Ayrıca ihtiyacınıza göre ek teminatlar ekleyebilirsiniz.',
                source: 'KaskolaMAG Şartnamesi v2.1 - Bölüm 2: Teminat Listesi'
            };
        }
    }

    // Product info - Konut
    if (currentProduct === 'konut') {
        if (lowerQuestion.includes('kapsar') || lowerQuestion.includes('neleri') || lowerQuestion.includes('kapsam')) {
            return {
                answer: 'Konut Sigortası, evinizi ve içerisindeki eşyalarınızı yangın, yıldırım, infilak, hırsızlık, su baskını, deprem, doğal afetler, cam kırılması gibi risklere karşı korur. Ev sahipleri ve kiracılar için kapsamlı güvence sağlar. Elektronik cihaz arızaları, alternatif konut masrafları ve sorumluluk teminatı da dahildir.',
                source: 'Konut Sigortası Ürün Dokümanı v3.0 - Bölüm 2: Teminat Kapsamı'
            };
        }

        if (lowerQuestion.includes('ürün') || lowerQuestion.includes('konut') || lowerQuestion.includes('hakkında')) {
            return {
                answer: 'Konut Sigortamız evinizi yangın, su baskını, hırsızlık, deprem ve doğal afetlere karşı korur. Alternatif konut masrafları ve cam kırılması gibi ek teminatlar da mevcuttur.',
                source: 'Konut Sigortası Broşürü v2.0 - Sayfa 1: Genel Bilgiler'
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

        if (lowerQuestion.includes('deprem') || lowerQuestion.includes('zelzele')) {
            return {
                answer: 'Konut Sigortası deprem teminatı ile deprem ve deprem sonucu oluşan yangın, su baskını gibi ikincil hasarlar güvence altındadır. DASK (Doğal Afet Sigortaları Kurumu) ile birlikte eksiksiz koruma sağlanır. Teminat limitleri poliçe kapsamında belirlenir.',
                source: 'Konut Sigortası Şartnamesi v3.0 - Madde 4.4: Deprem Teminatı'
            };
        }

        if (lowerQuestion.includes('teminat')) {
            return {
                answer: 'Konut Sigortası teminatları: Yangın, su baskını, hırsızlık, deprem, cam kırılması, doğal afetler, elektronik cihaz arızaları, alternatif konut masrafları ve sorumluluk teminatı.',
                source: 'Konut Sigortası Şartnamesi v3.0 - Bölüm 2: Teminat Listesi'
            };
        }

        if (lowerQuestion.includes('fiyat') || lowerQuestion.includes('prim') || lowerQuestion.includes('ücret')) {
            return {
                answer: 'Konut sigortası primleri konut değeri, lokasyonu, yapı özellikleri, teminat kapsamı gibi birçok faktöre bağlıdır. Detaylı fiyat teklifi için formu doldurabilir veya 0850 808 26 24 numaralı hattımızdan bilgi alabilirsiniz.',
                source: 'Magdeburger Fiyatlandırma Politikası v2.0 - Bölüm 3'
            };
        }
    }

    // Process help
    if (lowerQuestion.includes('nasıl') || lowerQuestion.includes('adım') || lowerQuestion.includes('süreç')) {
        return {
            answer: `Satış süreci 5 adımdan oluşuyor: 1) Kişisel Bilgiler, 2) ${currentProduct === 'kasko' ? 'Araç' : 'Konut'} Detayları, 3) Acente Seçimi, 4) Çapraz Satış Önerileri, 5) Ödeme. Her adımda size yardımcı olacağım!`,
            source: 'Magdeburger Satış Süreçleri Rehberi v1.0 - Bölüm 2'
        };
    }

    // Payment related
    if (lowerQuestion.includes('ödeme') || lowerQuestion.includes('taksit') || lowerQuestion.includes('kart')) {
        return {
            answer: 'Ödeme adımında kredi kartı veya havale/EFT seçeneklerini kullanabilirsiniz. Kredi kartı ile tek çekim veya 3, 6, 9 taksit seçenekleri mevcuttur. Tüm ödemeler SSL güvenliği ile korunmaktadır.',
            source: 'Magdeburger Ödeme Sistemleri Kılavuzu v1.5'
        };
    }

    // KVKK related
    if (lowerQuestion.includes('kvkk') || lowerQuestion.includes('veri') || lowerQuestion.includes('gizlilik')) {
        return {
            answer: 'Tüm kişisel verileriniz KVKK kapsamında korunmaktadır. Verileriniz sadece sigorta işlemleriniz için kullanılır ve 3. taraflarla paylaşılmaz. Son adımda KVKK aydınlatma metnini onaylamanız gerekecektir.',
            source: 'KVKK Aydınlatma Metni v2.0'
        };
    }

    // Hasar related
    if (lowerQuestion.includes('hasar') || lowerQuestion.includes('talep') || lowerQuestion.includes('zarar') || lowerQuestion.includes('kaza')) {
        return {
            answer: 'Hasar durumunda 0850 808 26 24 numaralı yardım hattımızı arayarak hasar ihbarında bulunabilirsiniz. Hasar ekibimiz sizi yönlendirecek ve gerekli belgeleri talep edecektir. Online hasar bildirim sistemimizden de 7/24 başvuru yapabilirsiniz.',
            source: 'Magdeburger Hasar Süreçleri Rehberi v3.1 - Bölüm 1'
        };
    }

    // Default response
    return {
        answer: `Size nasıl yardımcı olabilirim? ${currentProduct === 'kasko' ? 'Kasko' : 'Konut'} sigortası hakkında teminat kapsamı, fiyatlandırma, satış süreci veya özel avantajlar hakkında detaylı bilgi verebilirim. Formla ilgili bir adımda takılırsanız da yardımcı olabilirim!`,
        source: `${currentProduct === 'kasko' ? 'KaskolaMAG' : 'Konut Sigortası'} Ürün Dokümanı - Genel Bilgiler`
    };
}

function notifyAIAssistant(action) {
    // Notify AI about user actions
    console.log('AI Notification:', action);
}

// ========================================
// VEHICLE BRAND-MODEL DATABASE
// ========================================

const vehicleDatabase = {
    'Volkswagen': [
        { model: 'Golf 1.6 TDI Comfortline', engine: '1598cc', values: { '2024': 1250000, '2023': 1150000, '2022': 1050000, '2021': 950000 } },
        { model: 'Passat 1.6 TDI Comfortline', engine: '1598cc', values: { '2024': 1650000, '2023': 1500000, '2022': 1380000, '2021': 1250000 } },
        { model: 'Polo 1.0 TSI Comfortline', engine: '999cc', values: { '2024': 950000, '2023': 880000, '2022': 800000, '2021': 720000 } },
        { model: 'Tiguan 1.5 TSI Comfortline', engine: '1498cc', values: { '2024': 1850000, '2023': 1720000, '2022': 1580000, '2021': 1450000 } },
        { model: 'T-Roc 1.5 TSI Style', engine: '1498cc', values: { '2024': 1550000, '2023': 1430000, '2022': 1320000, '2021': 1200000 } }
    ],
    'BMW': [
        { model: '3.20i Sedan', engine: '1998cc', values: { '2024': 2450000, '2023': 2280000, '2022': 2100000, '2021': 1920000 } },
        { model: '5.20i Sedan', engine: '1998cc', values: { '2024': 3250000, '2023': 3050000, '2022': 2850000, '2021': 2650000 } },
        { model: 'X1 18i sDrive', engine: '1499cc', values: { '2024': 2850000, '2023': 2650000, '2022': 2450000, '2021': 2250000 } },
        { model: 'X3 20i xDrive', engine: '1998cc', values: { '2024': 3650000, '2023': 3420000, '2022': 3180000, '2021': 2950000 } },
        { model: '1.16i Hatchback', engine: '1499cc', values: { '2024': 1950000, '2023': 1820000, '2022': 1680000, '2021': 1550000 } }
    ],
    'Mercedes': [
        { model: 'A 180d Sedan', engine: '1461cc', values: { '2024': 2150000, '2023': 2000000, '2022': 1850000, '2021': 1700000 } },
        { model: 'C 200d Sedan', engine: '1993cc', values: { '2024': 3150000, '2023': 2950000, '2022': 2750000, '2021': 2550000 } },
        { model: 'E 200d Sedan', engine: '1993cc', values: { '2024': 4250000, '2023': 3980000, '2022': 3700000, '2021': 3420000 } },
        { model: 'GLA 200d SUV', engine: '1993cc', values: { '2024': 2850000, '2023': 2650000, '2022': 2480000, '2021': 2300000 } },
        { model: 'GLC 200d 4MATIC', engine: '1993cc', values: { '2024': 3850000, '2023': 3600000, '2022': 3350000, '2021': 3100000 } }
    ],
    'Audi': [
        { model: 'A3 Sedan 1.6 TDI', engine: '1598cc', values: { '2024': 2050000, '2023': 1900000, '2022': 1750000, '2021': 1600000 } },
        { model: 'A4 Sedan 2.0 TDI', engine: '1968cc', values: { '2024': 2950000, '2023': 2750000, '2022': 2550000, '2021': 2350000 } },
        { model: 'Q3 35 TDI Quattro', engine: '1968cc', values: { '2024': 3250000, '2023': 3050000, '2022': 2850000, '2021': 2650000 } },
        { model: 'A6 Sedan 2.0 TDI', engine: '1968cc', values: { '2024': 4150000, '2023': 3880000, '2022': 3620000, '2021': 3350000 } },
        { model: 'Q5 40 TDI Quattro', engine: '1968cc', values: { '2024': 3950000, '2023': 3700000, '2022': 3450000, '2021': 3200000 } }
    ],
    'Ford': [
        { model: 'Focus 1.5 TDCi Trend X', engine: '1499cc', values: { '2024': 1150000, '2023': 1050000, '2022': 950000, '2021': 850000 } },
        { model: 'Fiesta 1.0 Ecoboost Trend', engine: '998cc', values: { '2024': 850000, '2023': 780000, '2022': 720000, '2021': 650000 } },
        { model: 'Kuga 1.5 Ecoboost Trend', engine: '1496cc', values: { '2024': 1650000, '2023': 1520000, '2022': 1400000, '2021': 1280000 } },
        { model: 'Puma 1.0 Ecoboost Titanium', engine: '999cc', values: { '2024': 1350000, '2023': 1250000, '2022': 1150000, '2021': 1050000 } },
        { model: 'Mondeo 2.0 TDCi Titanium', engine: '1997cc', values: { '2024': 1550000, '2023': 1450000, '2022': 1350000, '2021': 1250000 } }
    ],
    'Renault': [
        { model: 'Clio 1.5 dCi Touch', engine: '1461cc', values: { '2024': 750000, '2023': 690000, '2022': 630000, '2021': 570000 } },
        { model: 'Megane 1.5 dCi Touch', engine: '1461cc', values: { '2024': 1050000, '2023': 970000, '2022': 890000, '2021': 810000 } },
        { model: 'Taliant 1.0 TCe Touch', engine: '999cc', values: { '2024': 850000, '2023': 780000, '2022': 720000, '2021': 650000 } },
        { model: 'Captur 1.3 TCe Icon', engine: '1332cc', values: { '2024': 1250000, '2023': 1150000, '2022': 1050000, '2021': 950000 } },
        { model: 'Kadjar 1.5 dCi Icon', engine: '1461cc', values: { '2024': 1450000, '2023': 1350000, '2022': 1250000, '2021': 1150000 } }
    ]
};

// ========================================
// VEHICLE DROPDOWN INITIALIZATION
// ========================================

function initializeVehicleDropdowns() {
    const brandSelect = document.getElementById('vehicleBrand');
    const modelSelect = document.getElementById('vehicleModel');
    const yearSelect = document.getElementById('vehicleYear');
    const valueInput = document.getElementById('vehicleValue');
    const engineInput = document.getElementById('engineVolume');
    const valueHint = document.getElementById('vehicleValueHint');

    if (!brandSelect || !modelSelect) return;

    // Brand change handler
    brandSelect.addEventListener('change', function() {
        const selectedBrand = this.value;

        // Reset model dropdown
        modelSelect.innerHTML = '<option value="">Seçiniz</option>';
        modelSelect.disabled = false;

        // Reset other fields
        yearSelect.value = '';
        valueInput.value = '';
        engineInput.value = '';

        if (selectedBrand && vehicleDatabase[selectedBrand]) {
            // Populate models for selected brand
            vehicleDatabase[selectedBrand].forEach(vehicle => {
                const option = document.createElement('option');
                option.value = JSON.stringify(vehicle); // Store entire vehicle object
                option.textContent = vehicle.model;
                modelSelect.appendChild(option);
            });

            valueHint.textContent = 'Model ve yıl seçildikten sonra otomatik hesaplanacaktır';
        } else {
            modelSelect.disabled = true;
            modelSelect.innerHTML = '<option value="">Önce marka seçiniz</option>';
            valueHint.textContent = 'Marka, model ve yıl seçildikten sonra otomatik hesaplanacaktır';
        }
    });

    // Model change handler
    modelSelect.addEventListener('change', function() {
        if (this.value) {
            try {
                const vehicle = JSON.parse(this.value);

                // Set engine volume
                engineInput.value = vehicle.engine;
                engineInput.style.borderColor = '#10b981';

                // Calculate value if year is selected
                const selectedYear = yearSelect.value;
                if (selectedYear && vehicle.values[selectedYear]) {
                    updateVehicleValue(vehicle, selectedYear);
                } else {
                    valueInput.value = '';
                    valueHint.textContent = 'Model yılı seçildikten sonra araç değeri otomatik hesaplanacaktır';
                }
            } catch (e) {
                console.error('Error parsing vehicle data:', e);
            }
        } else {
            engineInput.value = '';
            valueInput.value = '';
            valueHint.textContent = 'Model ve yıl seçildikten sonra otomatik hesaplanacaktır';
        }
    });

    // Year change handler
    yearSelect.addEventListener('change', function() {
        const modelValue = modelSelect.value;
        const selectedYear = this.value;

        if (modelValue && selectedYear) {
            try {
                const vehicle = JSON.parse(modelValue);
                updateVehicleValue(vehicle, selectedYear);
            } catch (e) {
                console.error('Error parsing vehicle data:', e);
            }
        } else {
            valueInput.value = '';
            if (selectedYear) {
                valueHint.textContent = 'Model seçildikten sonra araç değeri otomatik hesaplanacaktır';
            }
        }
    });
}

function updateVehicleValue(vehicle, year) {
    const valueInput = document.getElementById('vehicleValue');
    const valueHint = document.getElementById('vehicleValueHint');

    if (vehicle.values[year]) {
        const value = vehicle.values[year];
        valueInput.value = new Intl.NumberFormat('tr-TR').format(value) + ' TL';
        valueInput.style.borderColor = '#10b981';
        valueInput.dataset.numericValue = value; // Store numeric value for form submission

        valueHint.innerHTML = `<i class="fas fa-check-circle" style="color: #10b981;"></i> TSB Kasko Değer Listesinden alınmıştır (${year} model)`;
        valueHint.style.color = '#10b981';

        // Calculate premiums based on coverage type
        const standardPremium = Math.round(value * 0.035); // 3.5%
        const premiumPremium = Math.round(value * 0.042); // 4.2%

        // Update coverage package prices
        const coverageCards = document.querySelectorAll('.coverage-card');
        coverageCards.forEach(card => {
            const radio = card.querySelector('input[name="coverage"]');
            const priceDisplay = card.querySelector('.coverage-price');

            if (radio && priceDisplay) {
                if (radio.value === 'standard') {
                    priceDisplay.textContent = new Intl.NumberFormat('tr-TR').format(standardPremium) + ' TL/yıl';
                } else if (radio.value === 'premium') {
                    priceDisplay.textContent = new Intl.NumberFormat('tr-TR').format(premiumPremium) + ' TL/yıl';
                }
            }
        });

        // Update main product price in cart based on selected coverage
        const selectedCoverage = document.querySelector('input[name="coverage"]:checked');
        let selectedPremium = standardPremium; // default to standard

        if (selectedCoverage && selectedCoverage.value === 'premium') {
            selectedPremium = premiumPremium;
        }

        // Update main product price in cart
        if (typeof updateMainProductPrice === 'function') {
            updateMainProductPrice(selectedPremium);
        }
    } else {
        valueInput.value = '';
        valueHint.textContent = `${year} model yılı için değer bulunamadı. Lütfen farklı bir yıl seçiniz.`;
        valueHint.style.color = '#ef4444';

        // Reset main product price if value not found
        if (typeof updateMainProductPrice === 'function') {
            updateMainProductPrice(0);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure other initializations are done
    setTimeout(initializeVehicleDropdowns, 100);
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

// ========================================
// SHOPPING CART SYSTEM
// ========================================

// Shopping cart object
const shoppingCart = {
    mainProduct: null,
    additionalProducts: [],
    taxRate: 0.18 // %18 KDV
};

// Initialize cart with main product
function initializeCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const productType = urlParams.get('product') || 'kasko';

    shoppingCart.mainProduct = {
        type: productType,
        name: productType === 'kasko' ? 'KaskolaMAG Sigortası' : 'Konut Sigortası',
        price: 0,
        period: 'Yıllık'
    };
}

// Add product to cart
function addToCart(productType, productName, price, period = 'Yıllık') {
    // Check if product already exists
    const existingIndex = shoppingCart.additionalProducts.findIndex(p => p.type === productType);

    if (existingIndex === -1) {
        shoppingCart.additionalProducts.push({
            type: productType,
            name: productName,
            price: price,
            period: period
        });
    }

    updateCartUI();
}

// Remove product from cart
function removeFromCart(productType) {
    shoppingCart.additionalProducts = shoppingCart.additionalProducts.filter(p => p.type !== productType);

    // Uncheck the corresponding checkbox
    const checkbox = document.querySelector(`input[data-product-type="${productType}"]`);
    if (checkbox) {
        checkbox.checked = false;
    }

    updateCartUI();
}

// Calculate cart totals
function calculateCartTotals() {
    let subtotal = shoppingCart.mainProduct ? shoppingCart.mainProduct.price : 0;

    shoppingCart.additionalProducts.forEach(product => {
        subtotal += product.price;
    });

    const tax = subtotal * shoppingCart.taxRate;
    const total = subtotal + tax;

    const itemCount = (shoppingCart.mainProduct && shoppingCart.mainProduct.price > 0 ? 1 : 0) + shoppingCart.additionalProducts.length;

    return {
        subtotal: subtotal,
        tax: tax,
        total: total,
        itemCount: itemCount
    };
}

// Format price in Turkish locale
function formatPrice(price) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price) + ' TL';
}

// Update cart UI
function updateCartUI() {
    const totals = calculateCartTotals();
    const cartFooter = document.getElementById('cartSummaryFooter');
    const cartItemCount = document.getElementById('cartItemCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTax = document.getElementById('cartTax');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartFooter) return;

    // Show or hide cart footer
    if (totals.itemCount > 0) {
        cartFooter.style.display = 'block';
        document.body.classList.add('cart-visible');
    } else {
        cartFooter.style.display = 'none';
        document.body.classList.remove('cart-visible');
    }

    // Update cart count
    cartItemCount.textContent = totals.itemCount + ' Ürün';

    // Update totals
    cartSubtotal.textContent = formatPrice(totals.subtotal);
    cartTax.textContent = formatPrice(totals.tax);
    cartTotal.innerHTML = '<strong>' + formatPrice(totals.total) + '</strong>';

    // Update cart items list
    updateCartItemsList();
}

// Update cart items list in dropup
function updateCartItemsList() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;

    cartItemsList.innerHTML = '';

    // Add main product if it has a price
    if (shoppingCart.mainProduct && shoppingCart.mainProduct.price > 0) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${shoppingCart.mainProduct.name}</div>
                <div class="cart-item-period">${shoppingCart.mainProduct.period}</div>
            </div>
            <div class="cart-item-price">${formatPrice(shoppingCart.mainProduct.price)}</div>
        `;
        cartItemsList.appendChild(itemDiv);
    }

    // Add additional products
    shoppingCart.additionalProducts.forEach(product => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${product.name}</div>
                <div class="cart-item-period">${product.period}</div>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-price">${formatPrice(product.price)}</span>
                <button class="cart-item-remove" onclick="removeFromCart('${product.type}')" title="Sepetten çıkar">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        cartItemsList.appendChild(itemDiv);
    });

    if (cartItemsList.children.length === 0) {
        cartItemsList.innerHTML = '<div style="text-align: center; color: #6b7280; padding: 20px;">Sepetiniz boş</div>';
    }
}

// Toggle cart details dropup
function toggleCartDetails() {
    const dropup = document.getElementById('cartDetailsDropup');
    const icon = document.getElementById('cartToggleIcon');

    if (!dropup) return;

    if (dropup.style.display === 'none' || dropup.style.display === '') {
        dropup.style.display = 'block';
        if (icon) icon.className = 'fas fa-chevron-down';
    } else {
        dropup.style.display = 'none';
        if (icon) icon.className = 'fas fa-chevron-up';
    }
}

// Update main product price (called when calculating premium)
function updateMainProductPrice(price) {
    if (shoppingCart.mainProduct) {
        shoppingCart.mainProduct.price = price;
        updateCartUI();
    }
}

// Initialize cross-sell checkboxes
function initializeCrossSellCheckboxes() {
    // Home insurance checkbox
    const homeInsuranceCheckbox = document.querySelector('input[data-product-type="home-insurance"]');
    if (homeInsuranceCheckbox) {
        homeInsuranceCheckbox.addEventListener('change', function() {
            if (this.checked) {
                addToCart('home-insurance', 'Konut Sigortası', 850, 'Yıllık');
            } else {
                removeFromCart('home-insurance');
            }
        });
    }

    // Health insurance checkbox
    const healthInsuranceCheckbox = document.querySelector('input[data-product-type="health-insurance"]');
    if (healthInsuranceCheckbox) {
        healthInsuranceCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Monthly price is 320 TL, calculate yearly (320 * 12 = 3840)
                addToCart('health-insurance', 'Tamamlayıcı Sağlık Sigortası', 3840, 'Yıllık (320 TL/ay)');
            } else {
                removeFromCart('health-insurance');
            }
        });
    }
}

// Initialize coverage package listeners
function initializeCoveragePackages() {
    const coverageRadios = document.querySelectorAll('input[name="coverage"]');

    coverageRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Get current vehicle value to calculate realistic premium
            const valueInput = document.getElementById('vehicleValue');
            const numericValue = valueInput?.dataset?.numericValue ? parseInt(valueInput.dataset.numericValue) : 0;

            if (numericValue > 0) {
                let premiumRate;

                if (this.value === 'standard') {
                    // Standard package: 3.5% of vehicle value
                    premiumRate = 0.035;
                } else if (this.value === 'premium') {
                    // Premium package: 4.2% of vehicle value (20% more than standard)
                    premiumRate = 0.042;
                }

                const premium = Math.round(numericValue * premiumRate);

                // Update main product price in cart
                if (typeof updateMainProductPrice === 'function') {
                    updateMainProductPrice(premium);
                }

                // Update the displayed price in the coverage card
                const priceDisplay = this.closest('.coverage-card').querySelector('.coverage-price');
                if (priceDisplay) {
                    priceDisplay.textContent = new Intl.NumberFormat('tr-TR').format(premium) + ' TL/yıl';
                }
            }
        });
    });
}

// Initialize cart system on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    initializeCrossSellCheckboxes();
    initializeCoveragePackages();
    updateCartUI();
});
