// Topics Page JavaScript - COMPLETE FIXED VERSION WITH PROPER REDIRECT

document.addEventListener('DOMContentLoaded', function() {
    // Topics data
    const topics = [
        {
            id: "programming",
            name: "C-Programming",
            description: "Master the fundamentals of C programming including variables, loops, functions, pointers, memory management, and file handling.",
            difficulty: "beginner",
            category: "programming",
            questions: 30,
            time: 30,
            icon: "fas fa-code"
        },
        {
            id: "objectprograming",
            name: "Object Oriented Programming",
            description: "Learn OOP concepts like classes, objects, inheritance, polymorphism, encapsulation, and abstraction with practical examples.",
            difficulty: "intermediate",
            category: "programming",
            questions: 30,
            time: 30,
            icon: "fas fa-object-group"
        },
        {
            id: "algorithms",
            name: "Data Structures and Algorithms",
            description: "Explore arrays, linked lists, trees, graphs, sorting, searching algorithms, and complexity analysis for efficient problem-solving.",
            difficulty: "advanced",
            category: "theory",
            questions: 30,
            time: 30,
            icon: "fas fa-sitemap"
        },
        {
            id: "python",
            name: "Python Programming",
            description: "Cover Python basics, data structures, OOP, file handling, modules, libraries, and popular frameworks for versatile programming.",
            difficulty: "beginner",
            category: "programming",
            questions: 30,
            time: 30,
            icon: "fab fa-python"
        },
        {
            id: "webdev",
            name: "Web Development",
            description: "Learn HTML5, CSS3, JavaScript, responsive design, frontend frameworks, backend basics, and web application development.",
            difficulty: "intermediate",
            category: "programming",
            questions: 30,
            time: 30,
            icon: "fas fa-laptop-code"
        },
        {
            id: "coa",
            name: "Computer Organization and Architecture",
            description: "Understand digital logic, processor design, memory hierarchy, I/O systems, and computer architecture fundamentals.",
            difficulty: "intermediate",
            category: "theory",
            questions: 30,
            time: 30,
            icon: "fas fa-microchip"
        },
        {
            id: "osys",
            name: "Operating Systems",
            description: "Study process management, memory management, file systems, synchronization, deadlocks, and operating system principles.",
            difficulty: "intermediate",
            category: "systems",
            questions: 30,
            time: 30,
            icon: "fas fa-desktop"
        },
        {
            id: "dbms",
            name: "Database Management",
            description: "Learn SQL, database design, normalization, transactions, concurrency control, and database management systems.",
            difficulty: "intermediate",
            category: "systems",
            questions: 30,
            time: 30,
            icon: "fas fa-database"
        },
        {
            id: "cn",
            name: "Computer Networks",
            description: "Explore networking models, protocols, TCP/IP, routing, switching, network security, and internet technologies.",
            difficulty: "intermediate",
            category: "systems",
            questions: 30,
            time: 30,
            icon: "fas fa-network-wired"
        },
        {
            id: "software",
            name: "Software Engineering",
            description: "Understand software development lifecycle, requirements, design, testing, maintenance, and project management methodologies.",
            difficulty: "beginner",
            category: "theory",
            questions: 30,
            time: 30,
            icon: "fas fa-cogs"
        },
        {
            id: "cloudcomp",
            name: "Cloud Computing",
            description: "Learn cloud models, virtualization, storage, services, security, and deployment strategies in modern cloud environments.",
            difficulty: "advanced",
            category: "emerging",
            questions: 30,
            time: 30,
            icon: "fas fa-cloud"
        },
        {
            id: "ai",
            name: "Artificial Intelligence",
            description: "Explore machine learning, neural networks, natural language processing, expert systems, and AI problem-solving techniques.",
            difficulty: "advanced",
            category: "emerging",
            questions: 30,
            time: 30,
            icon: "fas fa-robot"
        },
        {
            id: "iot",
            name: "Internet of Things",
            description: "Study IoT architecture, sensors, connectivity, data processing, security, and real-world IoT applications and implementations.",
            difficulty: "advanced",
            category: "emerging",
            questions: 30,
            time: 30,
            icon: "fas fa-wifi"
        }
    ];

    // DOM Elements
    const topicsGrid = document.getElementById('topicsGrid');
    const topicSearch = document.getElementById('topicSearch');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const popularTopicCards = document.querySelectorAll('.popular-topic-card');

    // Render topics
    function renderTopics(filteredTopics = topics) {
        if (!topicsGrid) return;
        
        topicsGrid.innerHTML = '';
        
        if (filteredTopics.length === 0) {
            topicsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No Topics Found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }
        
        filteredTopics.forEach(topic => {
            const topicCard = document.createElement('div');
            topicCard.className = 'topic-card';
            topicCard.innerHTML = `
                <div class="topic-icon">
                    <i class="${topic.icon}"></i>
                </div>
                <div class="topic-content">
                    <div class="topic-header">
                        <h3>${topic.name}</h3>
                        <span class="difficulty-badge difficulty-${topic.difficulty}">
                            ${topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                        </span>
                    </div>
                    <p class="topic-desc">${topic.description}</p>
                    <div class="topic-meta">
                        <div class="meta-item">
                            <i class="fas fa-question-circle"></i>
                            <span>${topic.questions} Qs</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${topic.time} min</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-layer-group"></i>
                            <span>${topic.category.charAt(0).toUpperCase() + topic.category.slice(1)}</span>
                        </div>
                    </div>
                    <div class="topic-actions">
                        <button class="topic-btn start-btn" data-topic-id="${topic.id}" data-topic-name="${topic.name}">
                            <i class="fas fa-play-circle"></i> Start Quiz
                        </button>
                        <button class="topic-btn preview-btn" data-topic="${topic.id}">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                    </div>
                </div>
            `;
            topicsGrid.appendChild(topicCard);
        });
        
        // Add event listeners to new buttons
        attachTopicButtonListeners();
    }

    // Filter topics based on search and filters
    function filterTopics() {
        const searchTerm = topicSearch ? topicSearch.value.toLowerCase() : '';
        const difficulty = difficultyFilter ? difficultyFilter.value : 'all';
        const category = categoryFilter ? categoryFilter.value : 'all';
        
        const filtered = topics.filter(topic => {
            const matchesSearch = topic.name.toLowerCase().includes(searchTerm) || 
                                  topic.description.toLowerCase().includes(searchTerm);
            const matchesDifficulty = difficulty === 'all' || topic.difficulty === difficulty;
            const matchesCategory = category === 'all' || topic.category === category;
            
            return matchesSearch && matchesDifficulty && matchesCategory;
        });
        
        renderTopics(filtered);
    }

    // Attach event listeners to topic buttons
    function attachTopicButtonListeners() {
        // Start Quiz buttons
        document.querySelectorAll('.topic-btn.start-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const topicId = this.getAttribute('data-topic-id');
                const topicName = this.getAttribute('data-topic-name');
                startQuiz(topicId, topicName, this);
            });
        });
        
        // Preview buttons
        document.querySelectorAll('.topic-btn.preview-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const topicId = this.getAttribute('data-topic');
                const topic = topics.find(t => t.id === topicId);
                if (topic) {
                    previewQuiz(topic);
                }
            });
        });
    }

    // Start quiz function - SIMPLIFIED VERSION THAT DEFINITELY REDIRECTS
    function startQuiz(topicId, topicName, button) {
        // Show confirmation
        const confirmStart = confirm(`Start ${topicName} Quiz?\n\nThis quiz contains 30 questions. You will have 30 minutes to complete it.`);
        
        if (confirmStart) {
            console.log(`Starting quiz for: ${topicName} (${topicId})`);
            
            // Save to localStorage
            localStorage.setItem('selectedSubject', topicId);
            localStorage.setItem('selectedSubjectName', topicName);
            
            // Show loading on button
            if (button) {
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
                button.disabled = true;
                
                // Restore button after 2 seconds (in case redirect fails)
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                }, 2000);
            }
            
            // FIX: IMMEDIATE REDIRECT - No delay, no alert
            console.log('Redirecting to quiz.html...');
            window.location.href = 'quiz.html';
        }
    }

    // Preview quiz function
    function previewQuiz(topic) {
        alert(`${topic.name} Quiz Preview\n\n• ${topic.questions} questions\n• ${topic.time} minutes duration\n• ${topic.difficulty} difficulty level\n• Category: ${topic.category}\n\nDescription: ${topic.description}`);
    }

    // Event listeners for popular topics
    popularTopicCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            const topicId = this.getAttribute('data-topic');
            const topic = topics.find(t => t.id === topicId);
            if (topic) {
                startQuiz(topic.id, topic.name, this);
            }
        });
    });

    // Event listeners for filters
    if (topicSearch) topicSearch.addEventListener('input', filterTopics);
    if (difficultyFilter) difficultyFilter.addEventListener('change', filterTopics);
    if (categoryFilter) categoryFilter.addEventListener('change', filterTopics);

    // Initial render
    renderTopics();
});