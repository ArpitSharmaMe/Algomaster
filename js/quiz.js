// Quiz Page JavaScript - COMPLETE FIXED VERSION
// File Location: algomaster/js/quiz.js

document.addEventListener('DOMContentLoaded', function() {
    // Quiz Data Structure
    const quizData = {
        subject: "Subject",
        totalQuestions: 0,
        timeLimit: 30 * 60,
        questions: []
    };

    // Quiz State
    let quizState = {
        currentQuestion: 0,
        score: 0,
        timeLeft: 30 * 60,
        timer: null,
        isPaused: false,
        userAnswers: [],
        bookmarkedQuestions: [],
        flaggedQuestions: [],
        hintsUsed: [],
        startTime: null,
        endTime: null,
        isReviewMode: false,
        reviewQuestionIndex: 0
    };

    // DOM Elements
    const quizSubject = document.getElementById('quizSubject');
    const timerDisplay = document.getElementById('timer');
    const currentQuestionDisplay = document.getElementById('currentQuestion');
    const totalQuestionsDisplay = document.getElementById('totalQuestions');
    const scoreDisplay = document.getElementById('score');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressText = document.getElementById('progressText');
    const questionNumber = document.getElementById('questionNumber');
    const questionDifficulty = document.getElementById('questionDifficulty');
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const hintBtn = document.getElementById('hintBtn');
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const flagBtn = document.getElementById('flagBtn');
    const submitQuizBtn = document.getElementById('submitQuizBtn');
    const restartBtn = document.getElementById('restartBtn');
    const exitBtn = document.getElementById('exitBtn');
    const paletteGrid = document.getElementById('paletteGrid');
    
    // Quiz footer stats
    const correctCount = document.getElementById('correctCount');
    const incorrectCount = document.getElementById('incorrectCount');
    const unansweredCount = document.getElementById('unansweredCount');
    const bookmarkedCount = document.getElementById('bookmarkedCount');
    const flaggedCount = document.getElementById('flaggedCount');
    
    // Hide stats during quiz
    if (correctCount && correctCount.parentElement) {
        correctCount.parentElement.style.display = 'none';
    }
    if (incorrectCount && incorrectCount.parentElement) {
        incorrectCount.parentElement.style.display = 'none';
    }
    
    const timerText = document.getElementById('timerText');
    const timerProgress = document.querySelector('.timer-progress');

    // Review Mode Elements
    const reviewContainer = document.getElementById('reviewContainer');
    const reviewQuestionNumber = document.getElementById('reviewQuestionNumber');
    const reviewQuestionDifficulty = document.getElementById('reviewQuestionDifficulty');
    const reviewQuestionText = document.getElementById('reviewQuestionText');
    const reviewOptionsContainer = document.getElementById('reviewOptionsContainer');
    const explanationSection = document.getElementById('explanationSection');
    const explanationText = document.getElementById('explanationText');
    const reviewPrevBtn = document.getElementById('reviewPrevBtn');
    const reviewFinishBtn = document.getElementById('reviewFinishBtn');
    const reviewCurrent = document.getElementById('reviewCurrent');
    const reviewTotal = document.getElementById('reviewTotal');

    // Modal Elements
    const resultModal = document.getElementById('resultModal');
    const hintModal = document.getElementById('hintModal');
    const exitModal = document.getElementById('exitModal');
    const modalClose = document.getElementById('modalClose');
    const hintModalClose = document.getElementById('hintModalClose');
    const exitConfirmBtn = document.getElementById('exitConfirmBtn');
    const exitCancelBtn = document.getElementById('exitCancelBtn');
    const reviewBtn = document.getElementById('reviewBtn');
    const retryBtn = document.getElementById('retryBtn');
    const homeBtn = document.getElementById('homeBtn');
    const hintText = document.getElementById('hintText');

    // Result Modal Elements
    const resultTitle = document.getElementById('resultTitle');
    const finalScore = document.getElementById('finalScore');
    const resultMessage = document.getElementById('resultMessage');
    const finalCorrect = document.getElementById('finalCorrect');
    const finalIncorrect = document.getElementById('finalIncorrect');
    const timeTaken = document.getElementById('timeTaken');
    const accuracy = document.getElementById('accuracy');

    // Helper function to format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Initialize Quiz
    async function initQuiz() {
        console.log('Initializing quiz...');
        
        // Check if we have a subject selected
        const subject = localStorage.getItem('selectedSubject');
        const subjectName = localStorage.getItem('selectedSubjectName');
        
        console.log('Subject from localStorage:', subject);
        console.log('SubjectName from localStorage:', subjectName);
        
        if (!subject) {
            alert('No subject selected. Please select a subject from the home page.');
            window.location.href = 'index.html';
            return;
        }
        
        // Load quiz data from JSON
        await loadQuizData(subject);
        
        // Check if we have questions loaded
        if (quizData.questions.length === 0) {
            alert('Failed to load quiz questions. Please try again.');
            window.location.href = 'index.html';
            return;
        }
        
        console.log(`Loaded ${quizData.questions.length} questions from JSON`);
        
        // Set start time BEFORE initializing timer
        quizState.startTime = new Date();
        console.log('Quiz start time set:', quizState.startTime);
        
        // Initialize UI
        initializeUI();
        
        // Start timer
        startTimer();
        
        // Load first question
        loadQuestion(quizState.currentQuestion);
        
        // Generate question palette
        generateQuestionPalette();
        
        // Update stats
        updateStatsDuringQuiz();
        
        // Set up event listeners
        setupEventListeners();
        
        console.log('Quiz initialized with', quizData.totalQuestions, 'questions');
    }

    // Load Quiz Data from JSON
    async function loadQuizData(subject) {
        try {
            // Get subject name from localStorage
            const subjectName = localStorage.getItem('selectedSubjectName');
            
            if (!subject) {
                throw new Error('No subject selected. Please select a subject first.');
            }
            
            console.log(`Loading quiz for subject: ${subject} (${subjectName})`);
            
            quizData.subject = subjectName || 'Quiz';
            
            // Load questions from JSON file
            await loadQuestionsFromJSON(subject);
            
            // Initialize user answers array
            quizState.userAnswers = new Array(quizData.totalQuestions).fill(null);
            
            console.log(`Successfully loaded ${quizData.totalQuestions} questions from ${subjectName} quiz`);
            
        } catch (error) {
            console.error('Error loading quiz data:', error);
            
            // Check if it's a CORS error (opening file directly)
            if (error.message.includes('file://')) {
                alert('Error: Please run this website through a local server.\n\nOpen terminal/command prompt in algomaster folder and run:\n\npython -m http.server 8000\n\nThen visit: http://localhost:8000/');
            } else {
                alert(`Error: ${error.message}. Redirecting to home page.`);
            }
            
            window.location.href = 'index.html';
        }
    }

    // Load questions from JSON file
    async function loadQuestionsFromJSON(subject) {
        return new Promise(async (resolve, reject) => {
            try {
                // Map subject IDs to JSON file names
                const subjectFiles = {
                    'programming': 'c-programming-questions.json',
                    'objectprograming': 'oop-questions.json',
                    'algorithms': 'dsa-questions.json',
                    'python': 'python-questions.json',
                    'webdev': 'web-dev-questions.json',
                    'coa': 'coa-questions.json',
                    'osys': 'os-questions.json',
                    'dbms': 'dbms-questions.json',
                    'cn': 'networks-questions.json',
                    'software': 'software-eng-questions.json',
                    'cloudcomp': 'cloud-questions.json',
                    'ai': 'ai-questions.json',
                    'iot': 'iot-questions.json'
                };
                
                // Check if subject exists in mapping
                if (!subjectFiles[subject]) {
                    throw new Error(`Subject '${subject}' not found.`);
                }
                
                const fileName = subjectFiles[subject];
                console.log(`Loading quiz file: data/${fileName}`);
                
                // Check if running from file:// protocol
                if (window.location.protocol === 'file:') {
                    throw new Error('Please run this website through a local server.\n\nOpen terminal in algomaster folder and run:\npython -m http.server 8000\n\nThen visit: http://localhost:8000/');
                }
                
                // Try to load the JSON file
                const response = await fetch(`data/${fileName}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to load quiz file: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Validate the data structure
                if (!data.questions || !Array.isArray(data.questions)) {
                    throw new Error('Invalid quiz data format: questions array not found');
                }
                
                if (data.questions.length === 0) {
                    throw new Error('Quiz file contains no questions');
                }
                
                // Set quiz data from JSON
                quizData.questions = data.questions;
                quizData.totalQuestions = data.totalQuestions || data.questions.length;
                quizData.timeLimit = data.timeLimit || (30 * 60);
                quizData.subject = data.subject || quizData.subject;
                quizState.timeLeft = quizData.timeLimit;
                
                console.log(`✅ Loaded ${quizData.totalQuestions} ${quizData.subject} questions`);
                console.log('First question:', quizData.questions[0].text);
                
                resolve();
                
            } catch (error) {
                console.error('❌ Error loading JSON file:', error);
                reject(error);
            }
        });
    }

    // Initialize UI
    function initializeUI() {
        if (quizSubject) quizSubject.textContent = `${quizData.subject} Quiz`;
        if (totalQuestionsDisplay) totalQuestionsDisplay.textContent = quizData.totalQuestions;
        
        // Update timer display
        updateTimerDisplay();
        
        // Set initial button states
        updateNavigationButtons();
        
        // Hide review container initially
        if (reviewContainer) {
            reviewContainer.style.display = 'none';
        }
        
        // Initialize circular timer
        if (timerProgress) {
            const radius = 54;
            const circumference = 2 * Math.PI * radius;
            timerProgress.style.strokeDasharray = `${circumference} ${circumference}`;
            timerProgress.style.strokeDashoffset = circumference;
        }
    }

    // Start Timer
    function startTimer() {
        quizState.timer = setInterval(() => {
            if (!quizState.isPaused && quizState.timeLeft > 0) {
                quizState.timeLeft--;
                updateTimerDisplay();
                
                // Update circular timer
                if (timerProgress) {
                    const radius = 54;
                    const circumference = 2 * Math.PI * radius;
                    const progress = ((quizData.timeLimit - quizState.timeLeft) / quizData.timeLimit);
                    const offset = circumference - (progress * circumference);
                    timerProgress.style.strokeDashoffset = offset;
                }
                
                // Check if time is up
                if (quizState.timeLeft === 0) {
                    clearInterval(quizState.timer);
                    submitQuiz();
                }
            }
        }, 1000);
    }

    // Update Timer Display
    function updateTimerDisplay() {
        const timeString = formatTime(quizState.timeLeft);
        if (timerDisplay) timerDisplay.textContent = timeString;
        if (timerText) timerText.textContent = timeString;
        
        // Add warning/danger classes based on time left
        if (timerText) {
            timerText.classList.remove('warning', 'danger');
            if (quizState.timeLeft <= 300) {
                timerText.classList.add('danger');
            } else if (quizState.timeLeft <= 600) {
                timerText.classList.add('warning');
            }
        }
    }

    // Load Question (during quiz)
    function loadQuestion(questionIndex) {
        // Check if we have questions
        if (!quizData.questions || quizData.questions.length === 0) {
            console.error('No questions loaded');
            if (questionText) {
                questionText.textContent = 'Error: No questions loaded. Please try restarting the quiz.';
            }
            return;
        }
        
        // Check if index is valid
        if (questionIndex < 0 || questionIndex >= quizData.questions.length) {
            console.error(`Invalid question index: ${questionIndex}`);
            return;
        }
        
        const question = quizData.questions[questionIndex];
        
        // Update question number and text
        if (questionNumber) questionNumber.textContent = `Question ${questionIndex + 1}`;
        if (questionText) questionText.textContent = question.text;
        
        // Update difficulty
        if (questionDifficulty) {
            questionDifficulty.textContent = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
            questionDifficulty.className = `question-difficulty difficulty-${question.difficulty}`;
        }
        
        // Clear options container
        if (optionsContainer) {
            optionsContainer.innerHTML = '';
        } else {
            return;
        }
        
        // Create options
        const optionLabels = ['A', 'B', 'C', 'D'];
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            
            // Only add 'selected' class if this option was selected
            if (quizState.userAnswers[questionIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            optionElement.innerHTML = `
                <div class="option-label">${optionLabels[index]}</div>
                <div class="option-text">${option}</div>
            `;
            
            optionElement.addEventListener('click', () => {
                // Toggle selection: if already selected, unselect it
                if (quizState.userAnswers[questionIndex] === index) {
                    // Unselect the option
                    quizState.userAnswers[questionIndex] = null;
                    optionElement.classList.remove('selected');
                } else {
                    // Remove selected class from all options first
                    document.querySelectorAll('.option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    
                    // Select the new option
                    quizState.userAnswers[questionIndex] = index;
                    optionElement.classList.add('selected');
                }
                
                // Update stats and palette
                updateStatsDuringQuiz();
                updateQuestionPalette(questionIndex);
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Update current question display
        if (currentQuestionDisplay) currentQuestionDisplay.textContent = questionIndex + 1;
        
        // Update progress
        updateProgress(questionIndex);
        
        // Update action buttons
        updateActionButtons(questionIndex);
        
        // Update question palette
        updateQuestionPalette(questionIndex);
        
        // Update navigation buttons
        updateNavigationButtons();
    }

    // Load Review Question (after submission)
    function loadReviewQuestion(questionIndex) {
        // Check if we have questions
        if (!quizData.questions || quizData.questions.length === 0) {
            return;
        }
        
        const question = quizData.questions[questionIndex];
        const userAnswer = quizState.userAnswers[questionIndex];
        const isCorrect = userAnswer === question.correctAnswer;
        
        // Update question number and text
        if (reviewQuestionNumber) reviewQuestionNumber.textContent = `Question ${questionIndex + 1}`;
        if (reviewQuestionText) reviewQuestionText.textContent = question.text;
        
        // Set status indicator
        let statusText = '';
        let statusClass = '';
        
        if (userAnswer === null) {
            statusText = 'Not Answered';
            statusClass = 'review-unanswered-status';
        } else if (isCorrect) {
            statusText = 'Correct';
            statusClass = 'review-correct-status';
        } else {
            statusText = 'Incorrect';
            statusClass = 'review-incorrect-status';
        }
        
        if (reviewQuestionText) {
            reviewQuestionText.setAttribute('data-status', statusText);
            reviewQuestionText.className = `question-text ${statusClass}`;
        }
        
        // Update difficulty
        if (reviewQuestionDifficulty) {
            reviewQuestionDifficulty.textContent = question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1);
            reviewQuestionDifficulty.className = `question-difficulty difficulty-${question.difficulty}`;
        }
        
        // Clear options container
        if (reviewOptionsContainer) {
            reviewOptionsContainer.innerHTML = '';
        } else {
            return;
        }
        
        // Create options with correct/incorrect highlighting
        const optionLabels = ['A', 'B', 'C', 'D'];
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            
            // Show user's answer
            if (userAnswer === index) {
                optionElement.classList.add('selected');
            }
            
            // Show correct answer
            if (index === question.correctAnswer) {
                optionElement.classList.add('review-correct-answer');
            }
            
            // Add correctness classes
            if (userAnswer === index) {
                if (index === question.correctAnswer) {
                    optionElement.classList.add('review-correct');
                } else {
                    optionElement.classList.add('review-incorrect');
                }
            }
            
            // Add icons for correct/incorrect
            optionElement.innerHTML = `
                <div class="option-label">${optionLabels[index]}</div>
                <div class="option-text">${option}</div>
                ${index === question.correctAnswer ? '<div class="option-icon"><i class="fas fa-check"></i></div>' : ''}
                ${userAnswer === index && index !== question.correctAnswer ? '<div class="option-icon"><i class="fas fa-times"></i></div>' : ''}
            `;
            
            reviewOptionsContainer.appendChild(optionElement);
        });
        
        // Update explanation
        if (explanationText) {
            explanationText.textContent = question.explanation || 'No explanation provided for this question.';
        }
        
        // Update review navigation
        if (reviewCurrent) reviewCurrent.textContent = questionIndex + 1;
        if (reviewTotal) reviewTotal.textContent = quizData.totalQuestions;
        
        // Update review navigation buttons
        if (reviewPrevBtn) reviewPrevBtn.disabled = questionIndex === 0;
        
        // Create or update Next button
        let reviewNextBtn = document.getElementById('reviewNextBtn');
        if (!reviewNextBtn) {
            reviewNextBtn = document.createElement('button');
            reviewNextBtn.id = 'reviewNextBtn';
            reviewNextBtn.className = 'review-nav-btn';
            reviewNextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
            if (reviewPrevBtn && reviewPrevBtn.parentNode) {
                reviewPrevBtn.parentNode.insertBefore(reviewNextBtn, reviewPrevBtn.nextSibling);
            }
        }
        
        if (reviewNextBtn) {
            reviewNextBtn.disabled = questionIndex === quizData.totalQuestions - 1;
        }
    }

    // Enter Review Mode
    function enterReviewMode() {
        quizState.isReviewMode = true;
        quizState.reviewQuestionIndex = 0;
        
        // Hide quiz container, show review container
        const quizContent = document.querySelector('.quiz-content');
        const quizProgress = document.querySelector('.quiz-progress');
        const quizFooter = document.querySelector('.quiz-footer');
        const quizHeader = document.querySelector('.quiz-header');
        
        if (quizContent) quizContent.style.display = 'none';
        if (quizProgress) quizProgress.style.display = 'none';
        if (quizFooter) quizFooter.style.display = 'none';
        if (quizHeader) quizHeader.style.display = 'none';
        
        if (reviewContainer) {
            reviewContainer.style.display = 'block';
        }
        
        // Setup review navigation
        const reviewNextBtn = document.getElementById('reviewNextBtn');
        if (reviewNextBtn) {
            reviewNextBtn.onclick = () => {
                if (quizState.reviewQuestionIndex < quizData.totalQuestions - 1) {
                    quizState.reviewQuestionIndex++;
                    loadReviewQuestion(quizState.reviewQuestionIndex);
                }
            };
        }
        
        if (reviewPrevBtn) {
            reviewPrevBtn.onclick = () => {
                if (quizState.reviewQuestionIndex > 0) {
                    quizState.reviewQuestionIndex--;
                    loadReviewQuestion(quizState.reviewQuestionIndex);
                }
            };
        }
        
        // Load first review question
        loadReviewQuestion(quizState.reviewQuestionIndex);
    }

    // Exit Review Mode
    function exitReviewMode() {
        quizState.isReviewMode = false;
        
        // Show quiz container, hide review container
        const quizContent = document.querySelector('.quiz-content');
        const quizProgress = document.querySelector('.quiz-progress');
        const quizFooter = document.querySelector('.quiz-footer');
        const quizHeader = document.querySelector('.quiz-header');
        
        if (quizContent) quizContent.style.display = 'grid';
        if (quizProgress) quizProgress.style.display = 'block';
        if (quizFooter) quizFooter.style.display = 'block';
        if (quizHeader) quizHeader.style.display = 'flex';
        
        if (reviewContainer) {
            reviewContainer.style.display = 'none';
        }
        
        // Go back to results
        if (resultModal) {
            resultModal.classList.add('active');
        }
    }

    // Update Progress
    function updateProgress(questionIndex) {
        const progress = ((questionIndex + 1) / quizData.totalQuestions) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressPercent) progressPercent.textContent = progress.toFixed(2);
        if (progressText) progressText.textContent = `${questionIndex + 1} of ${quizData.totalQuestions} questions`;
    }

    // Update Navigation Buttons
    function updateNavigationButtons() {
        if (prevBtn) prevBtn.disabled = quizState.currentQuestion === 0;
        if (nextBtn) nextBtn.disabled = quizState.currentQuestion === quizData.totalQuestions - 1;
    }

    // Update Action Buttons
    function updateActionButtons(questionIndex) {
        // Update bookmark button
        if (bookmarkBtn) {
            if (quizState.bookmarkedQuestions.includes(questionIndex)) {
                bookmarkBtn.classList.add('active');
                bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked';
            } else {
                bookmarkBtn.classList.remove('active');
                bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i> Bookmark';
            }
        }
        
        // Update flag button
        if (flagBtn) {
            if (quizState.flaggedQuestions.includes(questionIndex)) {
                flagBtn.classList.add('active');
                flagBtn.innerHTML = '<i class="fas fa-flag"></i> Flagged';
            } else {
                flagBtn.classList.remove('active');
                flagBtn.innerHTML = '<i class="far fa-flag"></i> Flag';
            }
        }
        
        // Update hint button
        if (hintBtn) {
            if (quizState.hintsUsed.includes(questionIndex)) {
                hintBtn.classList.add('active');
            } else {
                hintBtn.classList.remove('active');
            }
        }
    }

    // Generate Question Palette
    function generateQuestionPalette() {
        if (!paletteGrid) return;
        
        paletteGrid.innerHTML = '';
        
        for (let i = 0; i < quizData.totalQuestions; i++) {
            const numberElement = document.createElement('div');
            numberElement.className = 'palette-number';
            numberElement.textContent = i + 1;
            
            // Set initial classes
            if (i === quizState.currentQuestion) {
                numberElement.classList.add('current');
            }
            
            if (quizState.userAnswers[i] !== null) {
                numberElement.classList.add('answered');
            }
            
            if (quizState.bookmarkedQuestions.includes(i)) {
                numberElement.classList.add('bookmarked');
            }
            
            if (quizState.flaggedQuestions.includes(i)) {
                numberElement.classList.add('flagged');
            }
            
            numberElement.addEventListener('click', () => {
                if (!quizState.isReviewMode) {
                    quizState.currentQuestion = i;
                    loadQuestion(i);
                    updateNavigationButtons();
                }
            });
            
            paletteGrid.appendChild(numberElement);
        }
    }

    // Update Question Palette
    function updateQuestionPalette(questionIndex) {
        const numbers = document.querySelectorAll('.palette-number');
        numbers.forEach((number, index) => {
            number.classList.remove('current', 'answered', 'bookmarked', 'flagged');
            
            if (index === questionIndex) {
                number.classList.add('current');
            }
            
            if (quizState.userAnswers[index] !== null) {
                number.classList.add('answered');
            }
            
            if (quizState.bookmarkedQuestions.includes(index)) {
                number.classList.add('bookmarked');
            }
            
            if (quizState.flaggedQuestions.includes(index)) {
                number.classList.add('flagged');
            }
        });
    }

    // Update Stats DURING QUIZ
    function updateStatsDuringQuiz() {
        let unanswered = 0;
        
        // Count unanswered questions
        quizState.userAnswers.forEach((answer) => {
            if (answer === null) {
                unanswered++;
            }
        });
        
        // Update score display (only during quiz, not actual score)
        const answered = quizData.totalQuestions - unanswered;
        if (scoreDisplay) scoreDisplay.textContent = answered;
        
        // Update stats
        if (unansweredCount) unansweredCount.textContent = unanswered;
        if (bookmarkedCount) bookmarkedCount.textContent = quizState.bookmarkedQuestions.length;
        if (flaggedCount) flaggedCount.textContent = quizState.flaggedQuestions.length;
        
        // Hide correct/incorrect stats during quiz
        if (correctCount && correctCount.parentElement) {
            correctCount.parentElement.style.display = 'none';
        }
        if (incorrectCount && incorrectCount.parentElement) {
            incorrectCount.parentElement.style.display = 'none';
        }
    }

    // Calculate Final Results
    function calculateFinalResults() {
        let correct = 0;
        let incorrect = 0;
        let unanswered = 0;
        
        quizState.userAnswers.forEach((answer, index) => {
            if (answer === null) {
                unanswered++;
            } else if (answer === quizData.questions[index].correctAnswer) {
                correct++;
            } else {
                incorrect++;
            }
        });
        
        return { correct, incorrect, unanswered };
    }

    // Toggle Bookmark
    function toggleBookmark() {
        const currentIndex = quizState.currentQuestion;
        const bookmarkIndex = quizState.bookmarkedQuestions.indexOf(currentIndex);
        
        if (bookmarkIndex === -1) {
            quizState.bookmarkedQuestions.push(currentIndex);
        } else {
            quizState.bookmarkedQuestions.splice(bookmarkIndex, 1);
        }
        
        updateActionButtons(currentIndex);
        updateQuestionPalette(currentIndex);
        updateStatsDuringQuiz();
    }

    // Toggle Flag
    function toggleFlag() {
        const currentIndex = quizState.currentQuestion;
        const flagIndex = quizState.flaggedQuestions.indexOf(currentIndex);
        
        if (flagIndex === -1) {
            quizState.flaggedQuestions.push(currentIndex);
        } else {
            quizState.flaggedQuestions.splice(flagIndex, 1);
        }
        
        updateActionButtons(currentIndex);
        updateQuestionPalette(currentIndex);
        updateStatsDuringQuiz();
    }

    // Show Hint
    function showHint() {
        const currentIndex = quizState.currentQuestion;
        const question = quizData.questions[currentIndex];
        
        if (!quizState.hintsUsed.includes(currentIndex)) {
            quizState.hintsUsed.push(currentIndex);
            updateActionButtons(currentIndex);
        }
        
        if (hintText) {
            hintText.textContent = question.hint || 'No hint available for this question.';
        }
        
        if (hintModal) {
            hintModal.classList.add('active');
        }
    }

    // Submit Quiz - FIXED TIME CALCULATION
    function submitQuiz() {
        console.log('Submitting quiz...');
        
        // Stop the timer
        clearInterval(quizState.timer);
        
        // Ensure end time is set
        quizState.endTime = new Date();
        
        // Log times for debugging
        console.log('Start time:', quizState.startTime);
        console.log('End time:', quizState.endTime);
        console.log('Time left:', quizState.timeLeft);
        console.log('Time limit:', quizData.timeLimit);
        
        // Calculate final results
        const results = calculateFinalResults();
        
        const accuracyPercent = quizData.totalQuestions > 0 ? 
            ((results.correct / quizData.totalQuestions) * 100).toFixed(1) : '0.0';
        
        // Calculate time taken - FIXED LOGIC
        let timeTakenSeconds = 0;
        
        // Method 1: Calculate from time spent (most reliable)
        timeTakenSeconds = quizData.timeLimit - quizState.timeLeft;
        console.log('Time taken (calculated from time left):', timeTakenSeconds, 'seconds');
        
        // Format time for display
        const formattedTime = formatTime(timeTakenSeconds);
        
        console.log('Formatted time:', formattedTime);
        console.log('Results:', results);
        
        // Update result modal
        if (finalScore) finalScore.textContent = results.correct;
        if (finalCorrect) finalCorrect.textContent = results.correct;
        if (finalIncorrect) finalIncorrect.textContent = results.incorrect;
        
        // Update time display
        if (timeTaken) {
            timeTaken.textContent = formattedTime;
        }
        
        if (accuracy) accuracy.textContent = `${accuracyPercent}%`;
        
        // Set result message based on score
        let title = '';
        let message = '';
        
        if (accuracyPercent >= 90) {
            title = 'Outstanding Performance!';
            message = 'You have demonstrated exceptional knowledge!';
        } else if (accuracyPercent >= 75) {
            title = 'Excellent Work!';
            message = 'You have a strong understanding of the subject!';
        } else if (accuracyPercent >= 60) {
            title = 'Good Job!';
            message = 'You have a solid foundation!';
        } else if (accuracyPercent >= 40) {
            title = 'Keep Practicing!';
            message = 'You have some understanding but need more practice.';
        } else {
            title = 'Needs Improvement';
            message = 'Review the topics and try again.';
        }
        
        if (resultTitle) resultTitle.textContent = title;
        if (resultMessage) resultMessage.textContent = message;
        
        // Show correct/incorrect stats in footer AFTER submission
        if (correctCount && correctCount.parentElement) {
            correctCount.parentElement.style.display = 'flex';
            correctCount.textContent = results.correct;
        }
        if (incorrectCount && incorrectCount.parentElement) {
            incorrectCount.parentElement.style.display = 'flex';
            incorrectCount.textContent = results.incorrect;
        }
        
        // Show result modal
        if (resultModal) {
            resultModal.classList.add('active');
        }
        
        console.log('Quiz submitted successfully');
    }

    // Restart Quiz
    function restartQuiz() {
        if (confirm('Are you sure you want to restart the quiz? All progress will be lost.')) {
            // Reset quiz state
            quizState = {
                currentQuestion: 0,
                score: 0,
                timeLeft: quizData.timeLimit,
                timer: null,
                isPaused: false,
                userAnswers: new Array(quizData.totalQuestions).fill(null),
                bookmarkedQuestions: [],
                flaggedQuestions: [],
                hintsUsed: [],
                startTime: null,
                endTime: null,
                isReviewMode: false,
                reviewQuestionIndex: 0
            };
            
            // Clear timer
            clearInterval(quizState.timer);
            
            // Close modals
            if (resultModal) resultModal.classList.remove('active');
            if (hintModal) hintModal.classList.remove('active');
            
            // Show quiz interface
            const quizContent = document.querySelector('.quiz-content');
            const quizProgress = document.querySelector('.quiz-progress');
            const quizFooter = document.querySelector('.quiz-footer');
            const quizHeader = document.querySelector('.quiz-header');
            
            if (quizContent) quizContent.style.display = 'grid';
            if (quizProgress) quizProgress.style.display = 'block';
            if (quizFooter) quizFooter.style.display = 'block';
            if (quizHeader) quizHeader.style.display = 'flex';
            
            if (reviewContainer) {
                reviewContainer.style.display = 'none';
            }
            
            // Hide correct/incorrect stats again
            if (correctCount && correctCount.parentElement) {
                correctCount.parentElement.style.display = 'none';
            }
            if (incorrectCount && incorrectCount.parentElement) {
                incorrectCount.parentElement.style.display = 'none';
            }
            
            // Set new start time
            quizState.startTime = new Date();
            
            // Reinitialize UI
            initializeUI();
            
            // Start timer
            startTimer();
            
            // Load first question
            loadQuestion(quizState.currentQuestion);
            
            // Generate question palette
            generateQuestionPalette();
            
            // Update stats
            updateStatsDuringQuiz();
        }
    }

    // Exit Quiz
    function exitQuiz() {
        if (exitModal) {
            exitModal.classList.add('active');
        }
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (quizState.currentQuestion > 0) {
                    quizState.currentQuestion--;
                    loadQuestion(quizState.currentQuestion);
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (quizState.currentQuestion < quizData.totalQuestions - 1) {
                    quizState.currentQuestion++;
                    loadQuestion(quizState.currentQuestion);
                }
            });
        }
        
        // Action buttons
        if (hintBtn) hintBtn.addEventListener('click', showHint);
        if (bookmarkBtn) bookmarkBtn.addEventListener('click', toggleBookmark);
        if (flagBtn) flagBtn.addEventListener('click', toggleFlag);
        
        // Quiz controls
        if (submitQuizBtn) submitQuizBtn.addEventListener('click', submitQuiz);
        if (restartBtn) restartBtn.addEventListener('click', restartQuiz);
        if (exitBtn) exitBtn.addEventListener('click', exitQuiz);
        
        // Review navigation
        if (reviewFinishBtn) {
            reviewFinishBtn.addEventListener('click', exitReviewMode);
        }
        
        // Modal controls
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                if (resultModal) resultModal.classList.remove('active');
            });
        }
        
        if (hintModalClose) {
            hintModalClose.addEventListener('click', () => {
                if (hintModal) hintModal.classList.remove('active');
            });
        }
        
        if (exitConfirmBtn) {
            exitConfirmBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        if (exitCancelBtn) {
            exitCancelBtn.addEventListener('click', () => {
                if (exitModal) exitModal.classList.remove('active');
            });
        }
        
        // Result modal buttons
        if (reviewBtn) {
            reviewBtn.addEventListener('click', () => {
                if (resultModal) resultModal.classList.remove('active');
                enterReviewMode();
            });
        }
        
        if (retryBtn) retryBtn.addEventListener('click', restartQuiz);
        if (homeBtn) homeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Close modals when clicking outside
        [resultModal, hintModal, exitModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                    }
                });
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Number keys 1-4 for selecting options
            if (!quizState.isReviewMode && e.key >= '1' && e.key <= '4') {
                const optionIndex = parseInt(e.key) - 1;
                if (optionIndex < quizData.questions[quizState.currentQuestion].options.length) {
                    // Toggle selection
                    if (quizState.userAnswers[quizState.currentQuestion] === optionIndex) {
                        quizState.userAnswers[quizState.currentQuestion] = null;
                    } else {
                        quizState.userAnswers[quizState.currentQuestion] = optionIndex;
                    }
                    loadQuestion(quizState.currentQuestion);
                }
            }
            
            // Arrow keys for navigation
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (quizState.isReviewMode && quizState.reviewQuestionIndex > 0) {
                    quizState.reviewQuestionIndex--;
                    loadReviewQuestion(quizState.reviewQuestionIndex);
                } else if (!quizState.isReviewMode && quizState.currentQuestion > 0) {
                    quizState.currentQuestion--;
                    loadQuestion(quizState.currentQuestion);
                }
            }
            
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (quizState.isReviewMode && quizState.reviewQuestionIndex < quizData.totalQuestions - 1) {
                    quizState.reviewQuestionIndex++;
                    loadReviewQuestion(quizState.reviewQuestionIndex);
                } else if (!quizState.isReviewMode && quizState.currentQuestion < quizData.totalQuestions - 1) {
                    quizState.currentQuestion++;
                    loadQuestion(quizState.currentQuestion);
                }
            }
            
            // B for bookmark
            if (e.key === 'b' || e.key === 'B') {
                e.preventDefault();
                toggleBookmark();
            }
            
            // F for flag
            if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                toggleFlag();
            }
            
            // H for hint
            if (e.key === 'h' || e.key === 'H') {
                e.preventDefault();
                showHint();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                if (resultModal) resultModal.classList.remove('active');
                if (hintModal) hintModal.classList.remove('active');
                if (exitModal) exitModal.classList.remove('active');
            }
            
            // Ctrl+Enter to submit
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                submitQuiz();
            }
        });
    }

    // Initialize the quiz
    initQuiz();
});