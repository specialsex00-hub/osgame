const difficulties = {
  easy: {
    name: "やさしい",
    hpRate: 0.75,
    attackRate: 0.65,
    skillRate: 0.75
  },
  normal: {
    name: "普通",
    hpRate: 0.9,
    attackRate: 0.85,
    skillRate: 0.9
  },
  hard: {
    name: "難しい",
    hpRate: 1.1,
    attackRate: 1.05,
    skillRate: 1.05
  },
  hell: {
    name: "地獄",
    hpRate: 1.35,
    attackRate: 1.25,
    skillRate: 1.2
  }
};

let currentDifficulty = difficulties.normal;

function selectDifficulty(level) {
  currentDifficulty = difficulties[level];

  document.getElementById("difficultyScreen").classList.add("hidden");
  document.getElementById("selectScreen").classList.remove("hidden");

  document.getElementById("selectedDifficultyText").textContent =
    "選択中の難易度：" + currentDifficulty.name;

  showHeroSelect();
}