function showHeroSelect() {
  const heroList = document.getElementById("heroList");
  heroList.innerHTML = "";

  for (let i = 0; i < heroes.length; i++) {
    const hero = heroes[i];

    const div = document.createElement("div");
    div.className = "hero-card";

    div.innerHTML = `
      <img src="${hero.image}">
      <h2>${hero.name}</h2>
      <p>HP：${hero.hp}</p>
      <p>MP：${hero.mp}</p>
      <p>攻撃力：${hero.attack}</p>
      <p>${hero.ability}</p>
      <button onclick="selectHero(${i})">選択</button>
    `;

    heroList.appendChild(div);
  }
}

function updateBattleUI() {
  document.getElementById("heroName").textContent = player.name;
  document.getElementById("heroImage").src = player.image;

  document.getElementById("heroHpText").textContent =
    player.hp + " / " + player.maxHp;

  document.getElementById("heroMpText").textContent =
    player.mp + " / " + player.maxMp;

  document.getElementById("heroAttackText").textContent =
    player.attack + attackBuff;

  document.getElementById("enemyName").textContent = enemy.name;
  document.getElementById("enemyImage").src = enemy.image;

  document.getElementById("enemyHpText").textContent =
    enemy.hp + " / " + enemy.maxHp;

  document.getElementById("heroHpBar").style.width =
    Math.max(0, player.hp / player.maxHp * 100) + "%";

  document.getElementById("heroMpBar").style.width =
    Math.max(0, player.mp / player.maxMp * 100) + "%";

  document.getElementById("enemyHpBar").style.width =
    Math.max(0, enemy.hp / enemy.maxHp * 100) + "%";

  drawSkillButtons();
}

function drawSkillButtons() {
  const area = document.getElementById("skillButtons");
  area.innerHTML = "";

  if (!player || !player.skills || gameOver || waiting) {
    return;
  }

  for (let i = 0; i < player.skills.length; i++) {
    const skill = player.skills[i];

    const button = document.createElement("button");

    button.innerHTML =
      skill.name +
      "<br>MP：" + skill.mp +
      "<br>" + skill.text;

    button.onclick = function() {
      useSkill(i);
    };

    area.appendChild(button);
  }
}

function showMessage(text) {
  document.getElementById("message").innerHTML = text;
}