const leaderboard = document.getElementById('leaderboard');
let players = JSON.parse(localStorage.getItem("leaderboardPlayers")) || [];

const currentUser = localStorage.getItem("username") || "Người chơi";
const currentScore = parseInt(localStorage.getItem("currentScore")) || 0;
const currentCorrect = parseInt(localStorage.getItem("correctAnswers")) || 0;
const currentAvatar = localStorage.getItem("avatar") || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;

// Nếu người chơi vừa chơi xong và có điểm
if (currentScore > 0) {
  const existingIndex = players.findIndex(p => p.name === currentUser);

  if (existingIndex !== -1) {
    if (currentScore > players[existingIndex].score) {
      players[existingIndex].score = currentScore;
      players[existingIndex].correct = currentCorrect;
    }
  } else {
    players.push({
      name: currentUser,
      score: currentScore,
      correct: currentCorrect,
      img: currentAvatar
    });
  }

  localStorage.setItem("leaderboardPlayers", JSON.stringify(players));

  localStorage.removeItem("currentScore");
  localStorage.removeItem("correctAnswers");
}

// Nếu không có người chơi nào, sinh mẫu
if (players.length === 0) {
  const names = [
    "An", "Bình", "Châu", "Duy", "Dung", "Hà", "Hiếu", "Hương", "Khánh", "Lan",
    "Long", "Minh", "Nam", "Ngọc", "Phát", "Quân", "Thảo", "Trang", "Tú", "Vũ"
  ];

  const players = [];

  for (let i = 0; i < 20; i++) {
    const randomScore = Math.floor(Math.random() * 100); // 0 - 99
    const randomCorrect = Math.floor(Math.random() * 30); // 0 - 29
    const randomAvatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`;
    
    players.push({
      name: sampleNames[i],
      score: randomScore,
      correct: randomCorrect,
      img: randomAvatar
    });
  }

  localStorage.setItem("leaderboardPlayers", JSON.stringify(players));
}

players
  .sort((a, b) => b.score - a.score)
  .slice(0, 10)
  .forEach((player, index) => {
    const entry = document.createElement("div");
    entry.className = "entry";
    entry.innerHTML = `
      <div class="rank">#${index + 1}</div>
      <img class="avatar" src="${player.img}" alt="${player.name}">
      <div class="info">
        <div class="name">${player.name}</div>
        <div class="score">${player.score} điểm</div>
        <div class="correct">🎯 ${player.correct || 0} câu đúng</div>
      </div>
    `;
    leaderboard.appendChild(entry);
  });
