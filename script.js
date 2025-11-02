// 4. Use an array to store the questions, options, and correct answers.
const quizData = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correct: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Venus", "Jupiter"],
        correct: "Mars"
    },
    {
        question: "What is 7 + 8?",
        options: ["14", "15", "16", "17"],
        correct: "15"
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: "Pacific"
    },
    {
        question: "Which one is the smallest province of Pakistan?",
        options: ["Balochistan", "Sindh", "Khyber Pakhtunkhwa", "Punjab"],  
        correct: "Sindh"
    }
]; // Total of 5 questions

// State variables
let currentQuestionIndex = 0;
// Stores user's selected answer for each question index
const userAnswers = {}; 

// DOM Elements
const quizContainer = document.getElementById('quiz');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const resultsDiv = document.getElementById('results');

// --- Core Functions ---

// 3. Display the questions and options one at a time.
function loadQuestion() {
    // Hide results section
    resultsDiv.classList.add('hidden');
    
    // Get the current question object
    const currentQuiz = quizData[currentQuestionIndex];

    // Build the HTML for the question
    let questionHTML = `<div class="question-text">${currentQuestionIndex + 1}. ${currentQuiz.question}</div>`;
    questionHTML += `<ul class="options-list">`;
    
    // Use a loop to iterate through the options and display them.
    currentQuiz.options.forEach((option, index) => {
        const optionId = `q${currentQuestionIndex}-opt${index}`;
        // Check if the current option was the user's previously selected answer
        const checked = userAnswers[currentQuestionIndex] === option ? 'checked' : '';

        questionHTML += `
            <li class="option-item">
                <input type="radio" 
                       id="${optionId}" 
                       name="question${currentQuestionIndex}" 
                       value="${option}" 
                       ${checked}>
                <label for="${optionId}">${option}</label>
            </li>
        `;
    });
    
    questionHTML += `</ul>`;

    // Inject the HTML into the quiz container
    quizContainer.innerHTML = questionHTML;

    // Attach event listeners to the new radio buttons
    document.querySelectorAll(`input[name="question${currentQuestionIndex}"]`).forEach(radio => {
        radio.addEventListener('change', handleOptionSelect);
    });

    // Update button visibility and state
    updateNavigationButtons();
}

// 3. Handle the user's selection of an option & 3. Store the user's answers.
function handleOptionSelect(event) {
    const selectedValue = event.target.value;
    
    // Store the selected answer for the current question
    userAnswers[currentQuestionIndex] = selectedValue;

    // Enable the Next/Submit button since an option is selected
    updateNavigationButtons();
}

// Helper to manage button state
function updateNavigationButtons() {
    // Check if the current question has an answer stored
    const hasAnswer = userAnswers.hasOwnProperty(currentQuestionIndex);
    nextButton.disabled = !hasAnswer;

    // Check if it's the last question
    const isLastQuestion = currentQuestionIndex === quizData.length - 1;

    if (isLastQuestion) {
        nextButton.classList.add('hidden');
        submitButton.classList.remove('hidden');
    } else {
        nextButton.classList.remove('hidden');
        submitButton.classList.add('hidden');
    }
}

// 3. Move to the next question when the "Next" button is clicked.
function handleNextClick() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    }
}

// **NEW FUNCTION:** Generates the detailed HTML table for the review
function showDetailedReview() {
    let reviewHTML = '<h3>Detailed Review</h3>';
    reviewHTML += '<table border="1" style="width: 100%; border-collapse: collapse; text-align: left; margin-top: 15px;">';
    reviewHTML += '<thead><tr><th>Question</th><th>Your Selection</th><th>Correct Answer</th><th>Status</th></tr></thead><tbody>';

    quizData.forEach((quizItem, index) => {
        // Handle skipped questions
        const userAnswer = userAnswers[index] || 'No Answer'; 
        const correctAnswer = quizItem.correct;
        const isCorrect = userAnswer === correctAnswer;
        
        // Define styling classes for visual feedback
        const statusText = isCorrect ? '✅ Correct' : '❌ Incorrect';
        const rowStyle = isCorrect ? 'background-color: #e9f7ef;' : 'background-color: #fcebeb;';

        reviewHTML += `
            <tr style="${rowStyle}">
                <td style="padding: 8px;">${index + 1}. ${quizItem.question}</td>
                <td style="padding: 8px; font-weight: bold;">${userAnswer}</td>
                <td style="padding: 8px; font-weight: bold; color: green;">${correctAnswer}</td>
                <td style="padding: 8px;">${statusText}</td>
            </tr>
        `;
    });

    reviewHTML += '</tbody></table>';
    
    return reviewHTML;
}

// 3. Display the results when the "Submit" button is clicked.
function handleSubmitClick() {
    let score = 0;
    
    // Calculate the score
    quizData.forEach((quizItem, index) => {
        // Compare the stored user answer with the correct answer
        if (userAnswers[index] === quizItem.correct) {
            score++;
        }
    });

    // Display the final score
    resultsDiv.innerHTML = `<h2>Quiz Completed!</h2><p>You scored **${score}** out of **${quizData.length}**!</p>`;
    resultsDiv.classList.remove('hidden');

    // Append the detailed review of answers
    resultsDiv.innerHTML += showDetailedReview(); 

    // Hide the quiz content and buttons
    quizContainer.innerHTML = ''; // Clear the question
    nextButton.classList.add('hidden');
    submitButton.classList.add('hidden');
}

// --- Event Listeners ---
nextButton.addEventListener('click', handleNextClick);
submitButton.addEventListener('click', handleSubmitClick);

// Initial call to start the quiz
loadQuestion();