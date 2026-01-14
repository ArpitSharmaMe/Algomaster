// ALGOMASTER Main JavaScript File - COMPLETE FIXED VERSION

// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');
const subjectSelect = document.getElementById('subjectSelect');
const startQuizBtn = document.getElementById('startQuizBtn');
const subjectDescription = document.getElementById('subjectDescription');
const selectedSubjectElement = document.getElementById('selectedSubject');

// Subject descriptions data
const subjectDescriptions = {
    "": {
        name: "Select a Subject",
        description: "Choose a subject from the dropdown to see details about the quiz content and start testing your knowledge.",
        shortName: "14 Subjects",
        fileName: ""
    },
    "programming": {
        name: "C-Programming",
        description: "Master the fundamentals of C programming including variables, loops, functions, pointers, memory management, and file handling.",
        shortName: "C Programming",
        fileName: "c-programming-questions.json"
    },
    "objectprograming": {
        name: "Object Oriented Programming",
        description: "Learn OOP concepts like classes, objects, inheritance, polymorphism, encapsulation, and abstraction with practical examples.",
        shortName: "OOP",
        fileName: "oop-questions.json"
    },
    "algorithms": {
        name: "Data Structures and Algorithms",
        description: "Explore arrays, linked lists, trees, graphs, sorting, searching algorithms, and complexity analysis for efficient problem-solving.",
        shortName: "DSA",
        fileName: "dsa-questions.json"
    },
    "python": {
        name: "Python Programming",
        description: "Cover Python basics, data structures, OOP, file handling, modules, libraries, and popular frameworks for versatile programming.",
        shortName: "Python",
        fileName: "python-questions.json"
    },
    "webdev": {
        name: "Web Development",
        description: "Learn HTML5, CSS3, JavaScript, responsive design, frontend frameworks, backend basics, and web application development.",
        shortName: "Web Dev",
        fileName: "web-dev-questions.json"
    },
    "coa": {
        name: "Computer Organization and Architecture",
        description: "Understand digital logic, processor design, memory hierarchy, I/O systems, and computer architecture fundamentals.",
        shortName: "COA",
        fileName: "coa-questions.json"
    },
    "osys": {
        name: "Operating Systems",
        description: "Study process management, memory management, file systems, synchronization, deadlocks, and operating system principles.",
        shortName: "OS",
        fileName: "os-questions.json"
    },
    "dbms": {
        name: "Database Management",
        description: "Learn SQL, database design, normalization, transactions, concurrency control, and database management systems.",
        shortName: "DBMS",
        fileName: "dbms-questions.json"
    },
    "cn": {
        name: "Computer Networks",
        description: "Explore networking models, protocols, TCP/IP, routing, switching, network security, and internet technologies.",
        shortName: "Networks",
        fileName: "networks-questions.json"
    },
    "software": {
        name: "Software Engineering",
        description: "Understand software development lifecycle, requirements, design, testing, maintenance, and project management methodologies.",
        shortName: "SE",
        fileName: "software-eng-questions.json"
    },
    "cloudcomp": {
        name: "Cloud Computing",
        description: "Learn cloud models, virtualization, storage, services, security, and deployment strategies in modern cloud environments.",
        shortName: "Cloud",
        fileName: "cloud-questions.json"
    },
    "ai": {
        name: "Artificial Intelligence",
        description: "Explore machine learning, neural networks, natural language processing, expert systems, and AI problem-solving techniques.",
        shortName: "AI",
        fileName: "ai-questions.json"
    },
    "iot": {
        name: "Internet of Things",
        description: "Study IoT architecture, sensors, connectivity, data processing, security, and real-world IoT applications and implementations.",
        shortName: "IoT",
        fileName: "iot-questions.json"
    }
};

// Mobile Menu Toggle - WITH NULL CHECK
if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Change icon based on menu state
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking a link
if (navMenu) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }
        });
    });
}

// Update subject description and info when selection changes
if (subjectSelect) {
    subjectSelect.addEventListener('change', () => {
        const selectedValue = subjectSelect.value;
        const descriptionData = subjectDescriptions[selectedValue];
        
        if (descriptionData && subjectDescription) {
            // Update subject description
            subjectDescription.innerHTML = `
                <div>
                    <div class="subject-name">${descriptionData.name}</div>
                    <div class="subject-desc">${descriptionData.description}</div>
                </div>
            `;
            
            // Update selected subject in info panel
            if (selectedSubjectElement) {
                selectedSubjectElement.textContent = descriptionData.shortName;
            }
            
            // Enable/Disable Start Quiz button
            if (startQuizBtn) {
                if (selectedValue) {
                    startQuizBtn.disabled = false;
                } else {
                    startQuizBtn.disabled = true;
                }
            }
        }
    });
}

// Start Quiz button functionality - FIXED REDIRECT
if (startQuizBtn) {
    startQuizBtn.addEventListener('click', () => {
        const selectedSubject = subjectSelect ? subjectSelect.value : '';
        const selectedSubjectName = subjectSelect ? subjectSelect.options[subjectSelect.selectedIndex].text : '';
        
        if (selectedSubject) {
            // Show confirmation message
            const confirmStart = confirm(`Start ${selectedSubjectName} Quiz?\n\nThis quiz contains 30 questions. You will have 30 minutes to complete it.`);
            
            if (confirmStart) {
                // Save selected subject to localStorage
                localStorage.setItem('selectedSubject', selectedSubject);
                localStorage.setItem('selectedSubjectName', selectedSubjectName);
                localStorage.setItem('selectedFileName', subjectDescriptions[selectedSubject].fileName);
                
                // Show loading state
                const originalText = startQuizBtn.innerHTML;
                startQuizBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading Quiz...';
                startQuizBtn.disabled = true;
                
                // FIXED: Redirect to quiz page immediately
                window.location.href = 'quiz.html';
            }
        }
    });
}

// Set active navigation link based on current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Initialize subject description
    if (subjectDescription) {
        const initialDescription = subjectDescriptions[""];
        subjectDescription.innerHTML = `
            <div>
                <div class="subject-name">${initialDescription.name}</div>
                <div class="subject-desc">${initialDescription.description}</div>
            </div>
        `;
    }
    
    // Check if we have a subject in localStorage (for quiz.html redirect back)
    const savedSubject = localStorage.getItem('selectedSubject');
    if (savedSubject && subjectSelect) {
        subjectSelect.value = savedSubject;
        subjectSelect.dispatchEvent(new Event('change'));
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl + / to focus search (for topics page)
    if (e.ctrlKey && e.key === '/') {
        const searchInput = document.getElementById('topicSearch');
        if (searchInput) {
            searchInput.focus();
            e.preventDefault();
        }
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileMenuBtn) {
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        }
    }
});