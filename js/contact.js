// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const newsletterInput = document.getElementById('newsletter');
    
    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');
    
    // Chat widget elements
    const chatWidget = document.getElementById('chatWidget');
    const chatIcon = document.querySelector('.chat-icon');
    const chatBox = document.getElementById('chatBox');
    const closeChat = document.getElementById('closeChat');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendChat = document.getElementById('sendChat');
    
    // FAQ elements
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Help section elements
    const helpCards = document.querySelectorAll('.help-card');
    
    // Bot responses for chat
    const botResponses = [
        "Hello! How can I help you with ALGOMASTER today?",
        "I can help you with quiz topics, technical issues, or general inquiries.",
        "You can reach Arpit directly at arpit18sharma2002@gmail.com",
        "Each quiz contains 30 questions and takes about 30 minutes to complete.",
        "ALGOMASTER is completely free to use for everyone.",
        "We have 14 computer science subjects available for quizzing.",
        "Yes, your progress is automatically saved as you take quizzes.",
        "You can suggest new features using the contact form on this page.",
        "Our office is located in Dehradun, Uttarakhand.",
        "We typically respond to emails within 24 hours."
    ];
    
    // Initialize page
    function initPage() {
        setupFormValidation();
        setupChatWidget();
        setupFAQ();
        setupHelpSection();
        setupAnimations();
        setupEventListeners();
    }
    
    // Setup form validation
    function setupFormValidation() {
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
        
        if (validateForm()) {
            // Get form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value,
                message: messageInput.value.trim(),
                newsletter: newsletterInput.checked,
                timestamp: new Date().toISOString()
            };
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                console.log('Form submitted:', formData);
                
                // Show success message
                alert(`Thank you, ${formData.name}! Your message has been sent successfully. Arpit will get back to you at ${formData.email} within 24 hours.`);
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                console.log('Message sent to: arpit18sharma2002@gmail.com');
                console.log('Subject:', formData.subject);
                console.log('Subscribed to newsletter:', formData.newsletter);
            }, 1500);
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
    
    // Setup chat widget
    function setupChatWidget() {
        chatIcon.addEventListener('click', () => {
            chatBox.classList.toggle('active');
            if (chatBox.classList.contains('active')) {
                chatInput.focus();
            }
        });
        
        closeChat.addEventListener('click', () => {
            chatBox.classList.remove('active');
        });
        
        sendChat.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
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
        
        // Simulate bot thinking
        setTimeout(() => {
            // Add typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message bot';
            typingIndicator.innerHTML = '<p><i class="fas fa-ellipsis-h"></i></p>';
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Remove typing indicator and add bot response
            setTimeout(() => {
                typingIndicator.remove();
                
                // Get random bot response
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                
                const botMessage = document.createElement('div');
                botMessage.className = 'message bot';
                botMessage.innerHTML = `<p>${randomResponse}</p>`;
                chatMessages.appendChild(botMessage);
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }, 500);
    }
    
    // Setup FAQ
    function setupFAQ() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-question i');
            
            // Set initial state
            answer.style.maxHeight = '0px';
            answer.style.opacity = '0';
            answer.style.overflow = 'hidden';
            
            question.addEventListener('click', () => {
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        otherItem.classList.remove('active');
                        otherAnswer.style.maxHeight = '0px';
                        otherAnswer.style.opacity = '0';
                        if (otherIcon) {
                            otherIcon.style.transform = 'rotate(0deg)';
                        }
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                    if (icon) {
                        icon.style.transform = 'rotate(180deg)';
                    }
                } else {
                    answer.style.maxHeight = '0px';
                    answer.style.opacity = '0';
                    if (icon) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                }
            });
        });
    }
    
    // Setup help section
    function setupHelpSection() {
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
    }
    
    // Setup animations
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
        
        // Form animation
        const formContainer = document.querySelector('.contact-form-container');
        if (formContainer) {
            formContainer.style.opacity = '0';
            formContainer.style.transform = 'translateY(30px)';
            formContainer.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
            
            const formObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            formObserver.observe(formContainer);
        }
        
        // Help cards animation
        helpCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
            
            const helpObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });
            
            helpObserver.observe(card);
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Social buttons hover effect
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'rotate(10deg) scale(1.1)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'rotate(0) scale(1)';
            });
        });
        
        // Chat icon hover effect
        chatIcon.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'rotate(20deg)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        chatIcon.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'rotate(0)';
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl + / to focus on form
            if (e.ctrlKey && e.key === '/') {
                e.preventDefault();
                nameInput.focus();
            }
            
            // Escape to close chat
            if (e.key === 'Escape' && chatBox.classList.contains('active')) {
                chatBox.classList.remove('active');
            }
            
            // Ctrl + M to open chat
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                chatBox.classList.add('active');
                chatInput.focus();
            }
        });
    }
    
    // Auto-open chat after 10 seconds if not interacted
    setTimeout(() => {
        if (!chatBox.classList.contains('active') && 
            !sessionStorage.getItem('chatInteracted')) {
            chatBox.classList.add('active');
            chatInput.focus();
            
            // Add welcome message
            setTimeout(() => {
                const welcomeMsg = document.createElement('div');
                welcomeMsg.className = 'message bot';
                welcomeMsg.innerHTML = '<p>Hi there! 👋 Need help with ALGOMASTER? I\'m here to assist you!</p>';
                chatMessages.appendChild(welcomeMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
        }
    }, 10000);
    
    // Mark chat as interacted when user sends a message
    sendChat.addEventListener('click', () => {
        sessionStorage.setItem('chatInteracted', 'true');
    });
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sessionStorage.setItem('chatInteracted', 'true');
        }
    });
    
    // Initialize the page
    initPage();
    
    // Log page view
    console.log('Contact page loaded successfully!');
    console.log('Developer: Arpit Sharma');
    console.log('Email: arpit18sharma2002@gmail.com');
    console.log('Phone: +91 7906529891');
});