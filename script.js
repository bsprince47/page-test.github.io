let quizData = [
   
    {
        question: "Number from 1 to 10",
        options: ["3", "5", "9", "10"],
        correct: "3",
    },
    {
        question: "Number from 11 to 20",
        options: ["11", "15", "19", "19.5"],
        correct: "15",
    },
    {
        question: "Number from 21 to 30",
        options: ["22", "25", "26", "29"],
        correct: "26",
    },
    {
        question: "Number from 31 to 40",
        options: ["43", "44", "48", "49"],
        correct: "49",
    },
    {
        question: "Number fro 41 to 50",
        options: ["41", "43", "44", "46"],
        correct: "41",
    },
    {
        question: "Which bird has a beard, wattle, and snood?",
        options: ["turkey", "eagle", "pigeon", "duck"],
        correct: "turkey",
    },
    {
        question: "Which of these birds can also be called a pigeon?",
        options: ["pheasant", "crow", "bulbul", "dove"],
        correct: "dove",
    },
    {
        question: "Roughly the size of a chicken, which bird lays the largest egg relative to its size?",
        options: ["oriole", "ostrich0", "kiwi", "albatross"],
        correct: "kiwi",
    },
    {
        question: "What bird was used by ancient Egyptians for the hieroglyphic for “red”?",
        options: ["osprey", "raven", "peacock", "flamingo"],
        correct: "flamingo",
    },
    {
        question: "Which of these birds is able to turn its head 270 degrees?",
        options: ["owl", "cardinal", "parrot", "hummingbird"],
        correct: "owl",
    },
    {
        question: "Which bird has stomach acid more potent than the acid found in car batteries?",
        options: ["great blue heron", "turkey vulture", "bald", "chicken"],
        correct: "turkey vulture",
    },
];


const quizContainer = document.querySelector(".quiz-container");
const question = document.querySelector(".quiz-container .question"); 
const options = document.querySelector(".quiz-container .options"); 
const nextBtn = document.querySelector(".quiz-container .next-btn");
const quizResult = document.querySelector(".quiz-result");
const startBtnContainer = document.querySelector(".start-btn-container");
const startBtn = document.querySelector(".start-btn-container .start-btn"); 

let questionNumber = 0;
let score = 0;
const MAX_QUESTTIONS = 5;
let timerInterval;

const ShuffleArray = (array) => {
    return array.slice().sort(() => Math.random() - 0.5);
};

quizData = ShuffleArray(quizData);

const resetLocalStorage = () => {
    for(i = 0; i < MAX_QUESTTIONS; i++) {
        localStorage.removeItem(`userAnswer_${i}`);
    }
};

resetLocalStorage();

const checkAnswer = (e) => {
    let userAnswer = e.target.textContent;
    if (userAnswer === quizData[questionNumber].correct) {
        score++;
        e.target.classList.add("correct");

    } else {
        e.target.classList.add("incorrect");
    }

    localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer);


    let allOptions = document.querySelectorAll(".quiz-container .option");

    allOptions.forEach(o => {
        o.classList.add("disabled");
    })
}

const createQuestion = () => {
    clearInterval(timerInterval);

    let secondsLeft = 9;
    const timerDisplay = document.querySelector(".quiz-container .timer");
    timerDisplay.classList.remove("danger");  

    timerDisplay.textContent = 'Time Left: 10 seconds';

    timerInterval = setInterval(() => {
        timerDisplay.textContent = `Time Left: ${secondsLeft.toString().padStart(2, 0)} seconds`;
        secondsLeft--;

        if (secondsLeft < 3) {
            timerDisplay.classList.add("danger");
        }

        if ( secondsLeft < 0) {
            clearInterval(timerInterval);
            displayNextQuestion();
        }
    }, 1000);

    options.innerHTML = '';
 question.innerHTML = `<span class='question-number'>${questionNumber + 1}/${MAX_QUESTTIONS}</span>${quizData[questionNumber].question}`;

  const shuffleOptions = ShuffleArray(quizData[questionNumber].options);

 shuffleOptions.forEach((o) => {
    const option = document.createElement("button");
    option.classList.add("option");
    option.innerHTML = o;
    option.addEventListener("click", (e) => {
        checkAnswer(e);
    })
    options.appendChild(option);
 });
};

const retakeQuiz = () => {
    questionNumber = 0;
    score = 0;
    quizData = ShuffleArray(quizData);
    resetLocalStorage();

    createQuestion();
    quizResult.style.display = "none";
    quizContainer.style.display = "block";
}


const displayQuizResult = () => {
    quizResult.style.display = "flex";
    quizContainer.style.display = "none";
    quizResult.innerHTML = "";
    
    
    const resultHeading = document.createElement("h2");
    resultHeading.innerHTML = `You have scored ${score} out of ${MAX_QUESTTIONS}`
    quizResult.appendChild(resultHeading);


    for (let i = 0; i < MAX_QUESTTIONS; i++) {
        const resultItem = document.createElement("div");
        resultItem.classList.add("question-container");

        const userAnswer = localStorage.getItem(`userAnswer_${i}`);
        const correctAnswer = quizData[i].correct;

        let answeredCorrectly = userAnswer === correctAnswer;

        if (!answeredCorrectly) {
            resultItem.classList.add("incorrect");
        }

         resultItem.innerHTML = ` <div class="question">${i + 1}: ${quizData[i].question}</div>
         <div class="user-answer">Your answer: ${userAnswer || "Not Answered"}</div>
         <div class="correct-answer">Correct-answer: ${correctAnswer}</div>`;

         quizResult.appendChild(resultItem);
    }

    const retakeBtn = document.createElement("button");
    retakeBtn.classList.add("retake-btn");
    retakeBtn.innerHTML = 'Retake Quiz';
    retakeBtn.addEventListener("click", retakeQuiz);
    quizResult.appendChild(retakeBtn);
};



const displayNextQuestion = () => {
    if (questionNumber >=  MAX_QUESTTIONS - 1) {
        displayQuizResult();
        return;
    }

    questionNumber++;
    createQuestion();
};
 

nextBtn.addEventListener("click", displayNextQuestion) ;


startBtn.addEventListener("click", () => {
    startBtnContainer.style.display = "none";
    quizContainer.style.display= "block";
    createQuestion(); 
})
