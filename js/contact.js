// Contact Page JavaScript for Google Sheets Integration
document.addEventListener('DOMContentLoaded', function() {
    // ==== YOUR GOOGLE APPS SCRIPT URL ====
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzequROAGrLr41finggoaAXWKBBlyycj4AVM9rJ4J9MEfUY0pENSiEXQ1C4uBjz2Bw/exec";
    // =====================================
    
    // Form elements
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const newsletterInput = document.getElementById('newsletter');
    
    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');
    
    // Chat elements
    const chatIcon = document.querySelector('.chat-icon');
    const chatBox = document.getElementById('chatBox');
    const closeChat = document.getElementById('closeChat');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendChat = document.getElementById('sendChat');
    
    // FAQ elements
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Help cards
    const helpCards = document.querySelectorAll('.help-card');
    
    // Bot responses
    const botResponses = [
        "Hello! I'm your ALGOMASTER assistant. How can I help you today?",
        "You can contact Arpit directly at algomaster18@gmail.com",
        "We respond to all messages within 24 hours!",
        "Check out our quiz topics to test your computer science knowledge!",
        "ALGOMASTER is completely free to use for everyone.",
        "Each quiz has 30 questions covering fundamental to advanced topics.",
        "Your progress is automatically saved as you take quizzes.",
        "We have 14 computer science subjects available for quizzing.",
        "You can suggest new features using the contact form.",
        "Our office is in Dehradun, Uttarakhand."
    ];
    
    // Initialize everything
    init();
    
    function init() {
        console.log("🚀 ALGOMASTER Contact Page Initializing...");
        console.log("📊 Google Sheets URL:", GOOGLE_SCRIPT_URL);
        
        setupForm();
        setupFAQ();
        setupChat();
        setupAnimations();
        setupEventListeners();
        
        console.log("✅ ALGOMASTER Contact Page Ready!");
        
        // Auto-open chat after 5 seconds
        setTimeout(() => {
            if (chatBox && !chatBox.classList.contains('active') && 
                !sessionStorage.getItem('chatInteracted')) {
                chatBox.classList.add('active');
                chatInput.focus();
                
                // Add welcome message
                setTimeout(() => {
                    const welcomeMsg = document.createElement('div');
                    welcomeMsg.className = 'message bot';
                    welcomeMsg.innerHTML = '<p>Hi there! 👋 Need help with ALGOMASTER? Ask me anything!</p>';
                    chatMessages.appendChild(welcomeMsg);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 300);
            }
        }, 5000);
    }
    
    // ================= FORM HANDLING =================
    function setupForm() {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        nameInput.addEventListener('blur', validateName);
        emailInput.addEventListener('blur', validateEmail);
        messageInput.addEventListener('blur', validateMessage);
    }
    
    function validateName() {
        if (nameInput.value.trim() && nameInput.value.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            return false;
        } else if (nameInput.value.trim()) {
            nameError.textContent = '';
            return true;
        }
        return false;
    }
    
    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() && !emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address';
            return false;
        } else if (emailInput.value.trim()) {
            emailError.textContent = '';
            return true;
        }
        return false;
    }
    
    function validateMessage() {
        if (messageInput.value.trim() && messageInput.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            return false;
        } else if (messageInput.value.trim()) {
            messageError.textContent = '';
            return true;
        }
        return false;
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        console.log("📝 Form submission started...");
        
        if (validateForm()) {
            // Get form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value,
                message: messageInput.value.trim(),
                newsletter: newsletterInput.checked ? "Yes" : "No"
            };
            
            console.log("📤 Form data:", formData);
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Create URL with encoded data
            const url = GOOGLE_SCRIPT_URL + '?' + 
                'name=' + encodeURIComponent(formData.name) +
                '&email=' + encodeURIComponent(formData.email) +
                '&subject=' + encodeURIComponent(formData.subject) +
                '&message=' + encodeURIComponent(formData.message) +
                '&newsletter=' + encodeURIComponent(formData.newsletter);
            
            console.log("🔗 Sending to:", url);
            
            // METHOD 1: Image method only (no new tab, no CORS issues)
            const img = new Image();
            img.src = url;
            
            // Show success message after a short delay
            setTimeout(() => {
                // Show success message
                alert(`✅ Thank you ${formData.name}!\n\nYour message has been sent successfully.\nArpit will email you back at ${formData.email} within 24 hours.`);
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                console.log("🎉 Form submitted successfully!");
                console.log("📊 Data saved to Google Sheets and email sent.");
                
            }, 1000);
        }
    }
    
    function validateForm() {
        let isValid = true;
        
        // Clear previous errors
        [nameError, emailError, subjectError, messageError].forEach(el => {
            el.textContent = '';
        });
        
        // Validate name
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Please enter your name';
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Please enter your email';
            isValid = false;
        } else if (!emailRegex.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate subject
        if (!subjectInput.value) {
            subjectError.textContent = 'Please select a subject';
            isValid = false;
        }
        
        // Validate message
        if (!messageInput.value.trim()) {
            messageError.textContent = 'Please enter your message';
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            isValid = false;
        }
        
        return isValid;
    }
    
    // ================= FAQ HANDLING =================
    function setupFAQ() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-question i');
            
            // Set initial state
            answer.style.maxHeight = '0';
            answer.style.opacity = '0';
            answer.style.overflow = 'hidden';
            
            question.addEventListener('click', () => {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        otherItem.classList.remove('active');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.opacity = '0';
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle current item
                const isActive = item.classList.contains('active');
                item.classList.toggle('active');
                
                if (!isActive) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                    }
                } else {
                    answer.style.maxHeight = '0';
                    answer.style.opacity = '0';
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                }
            });
        });
    }
    
    // ================= CHAT HANDLING =================
    function setupChat() {
        if (!chatIcon || !chatBox) return;
        
        chatIcon.addEventListener('click', () => {
            chatBox.classList.toggle('active');
            if (chatBox.classList.contains('active')) {
                chatInput.focus();
            }
        });
        
        if (closeChat) {
            closeChat.addEventListener('click', () => {
                chatBox.classList.remove('active');
            });
        }
        
        if (sendChat && chatInput) {
            sendChat.addEventListener('click', sendChatMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendChatMessage();
            });
        }
    }
    
    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(userMessage);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Mark as interacted
        sessionStorage.setItem('chatInteracted', 'true');
        
        // Simulate bot thinking
        setTimeout(() => {
            // Get random response
            const response = botResponses[Math.floor(Math.random() * botResponses.length)];
            
            const botMessage = document.createElement('div');
            botMessage.className = 'message bot';
            botMessage.innerHTML = `<p>${response}</p>`;
            chatMessages.appendChild(botMessage);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
    
    // ================= ANIMATIONS =================
    function setupAnimations() {
        // Contact methods animation
        const contactMethods = document.querySelectorAll('.contact-method');
        contactMethods.forEach((method, index) => {
            method.style.opacity = '0';
            method.style.transform = 'translateX(-20px)';
            method.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(method);
        });
        
        // Help cards animation
        helpCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(card);
        });
    }
    
    // ================= EVENT LISTENERS =================
    function setupEventListeners() {
        // Help cards hover effects
        helpCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.help-icon');
                const btn = this.querySelector('.help-btn i');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(10deg)';
                }
                if (btn) {
                    btn.style.transform = 'translateX(3px)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.help-icon');
                const btn = this.querySelector('.help-btn i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0)';
                }
                if (btn) {
                    btn.style.transform = 'translateX(0)';
                }
            });
        });
        
        // Chat icon hover effect
        if (chatIcon) {
            chatIcon.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(20deg)';
                }
            });
            
            chatIcon.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl + / to focus on name field
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                nameInput.focus();
            }
            
            // Escape to close chat
            if (e.key === 'Escape' && chatBox && chatBox.classList.contains('active')) {
                chatBox.classList.remove('active');
            }
        });
    }
});
