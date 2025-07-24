    const allQuestions = [
    {
        question: "CPU là viết tắt của cụm từ nào?",
        choices: ["Central Program Unit", "Central Processing Unit", "Control Processing Unit", "Central Peripheral Unit"],
        answer: 1
    },
    {
        question: "Thiết bị nào sau đây là thiết bị đầu vào?",
        choices: ["Màn hình", "Máy in", "Chuột", "Loa"],
        answer: 2
    },
    {
        question: "RAM dùng để làm gì?",
        choices: ["Lưu dữ liệu tạm thời", "Lưu trữ vĩnh viễn", "Kết nối mạng", "Xử lý đồ họa"],
        answer: 0
    },
    {
        question: "DNS có chức năng:",
        choices: ["Chặn virus", "Dịch tên miền thành địa chỉ IP", "Lưu file văn bản", "Tạo cơ sở dữ liệu"],
        answer: 1
    },
    {
        question: "HTML là viết tắt của:",
        choices: ["HyperText Markup Language", "HighText Machine Language", "HyperTool Multi Language", "None of the above"],
        answer: 0
    },
    ];
   

const questions = allQuestions.sort(() => Math.random() - 0.5).slice(0, 30);
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question");
const choicesContainer = document.getElementById("choices");
const scoreElement = document.getElementById("score");
const questionNumberElement = document.getElementById("question-number");
const timerText = document.getElementById("timer-text");
const progressCircle = document.querySelector(".progress");

// Đọc cài đặt từ localStorage
const musicEnabled = localStorage.getItem("musicEnabled") === "true";
const sfxEnabled = localStorage.getItem("sfxEnabled") === "true";

// Nhạc nền và hiệu ứng âm thanh
const backgroundMusic = new Audio("audio/bg.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

const correctSound = new Audio("audio/correct.mp3");
const wrongSound = new Audio("audio/wrong.mp3");

// Phát nhạc nếu được bật
document.addEventListener("click", () => {
  if (musicEnabled) {
    backgroundMusic.play().catch(() => {});
  }
}, { once: true });

const totalTime = 300;
let timeLeft = totalTime;
const radius = 45;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `0`;

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  questionNumberElement.innerText = currentQuestionIndex + 1;
  choicesContainer.innerHTML = "";

  const labels = ["A", "B", "C", "D"];
  currentQuestion.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.innerText = `${labels[index]}. ${choice}`;
    button.classList.add("choice-btn");
    button.dataset.number = index;
    button.addEventListener("click", selectAnswer);
    choicesContainer.appendChild(button);
  });
}

function selectAnswer(e) {
  const selected = parseInt(e.target.dataset.number);
  const correct = questions[currentQuestionIndex].answer;

  if (selected === correct) {
    score += 1;
    e.target.style.backgroundColor = "#2ecc71";
    if (sfxEnabled) correctSound.play();
  } else {
    e.target.style.backgroundColor = "#e74c3c";
    const buttons = document.querySelectorAll(".choice-btn");
    buttons[correct].style.backgroundColor = "#2ecc71";
    if (sfxEnabled) wrongSound.play();
  }

  document.querySelectorAll(".choice-btn").forEach(btn => btn.disabled = true);

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showFinalScore();
      saveToLeaderboard(score, score);
    }
    updateScore();
  }, 1000);
}

function updateScore() {
  scoreElement.innerText = `Điểm: ${score}`;
}

function showFinalScore() {
  questionElement.innerText = `Hoàn thành! Bạn được ${score} / ${questions.length} điểm.`;
  choicesContainer.innerHTML = `
    <button class="choice-btn" onclick="location.reload()">Chơi lại</button>
    <button class="choice-btn" onclick="window.location.href='index.html'">Thoát</button>
  `;
  document.getElementById("progress").style.display = "none";
  backgroundMusic.pause();
}

function saveToLeaderboard(score, correctAnswers) {
  const leaderboardKey = "quizLeaderboard";
  const name = localStorage.getItem("username") || prompt("Nhập tên của bạn:") || "Người chơi";
  const avatar = localStorage.getItem("avatar") || "img/default-avatar.png";
  localStorage.setItem("username", name);

  const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
  const existing = leaderboard.find(player => player.name === name);

  if (existing) {
    if (score > existing.score) {
      existing.score = score;
      existing.correct = correctAnswers;
      existing.img = avatar;
    }
  } else {
    leaderboard.push({ name, score, correct: correctAnswers, img: avatar });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard.splice(10);
  localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const offset = circumference * (1 - timeLeft / totalTime);
  progressCircle.style.strokeDashoffset = offset;

  const percent = 1 - timeLeft / totalTime;
  const colorValue = Math.floor(255 * percent);
  progressCircle.style.stroke = `rgb(${colorValue},${colorValue},${colorValue})`;
}

function startTimer() {
  updateTimer();
  const timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerText.textContent = "00:00";
      progressCircle.style.stroke = "#fff";
      endGameByTimeout();
    }
  }, 1000);
}

function endGameByTimeout() {
  backgroundMusic.pause();
  questionElement.innerText = `Hết giờ! Bạn được ${score} / ${questions.length} điểm.`;
  choicesContainer.innerHTML = `<button class="choice-btn" onclick="location.reload()">Chơi lại</button>`;
  document.getElementById("score").style.display = "none";
  document.getElementById("progress").style.display = "none";
  timerText.style.color = "red";
  saveToLeaderboard(score, score);
}

document.addEventListener("DOMContentLoaded", () => {
  startTimer();
  showQuestion();
  updateScore();
  console.log("game.js đã load");
});


 








