let player = null;
let enemy = null;
let enemyIndex = 0;

let enemyTurnCount = 0;
let enemySleep = false;
let playerStop = false;
let gameOver = false;

let buffTurn = 0;
let attackBuff = 0;
let waiting = false;

let battleBGM = null;
let bossBGM = null;

function selectHero(index) {
  battleBGM = document.getElementById("battleBGM");
  bossBGM = document.getElementById("bossBGM");

  const selected = heroes[index];

  player = {
    name: selected.name,
    image: selected.image,
    hp: selected.hp,
    maxHp: selected.hp,
    mp: selected.mp,
    maxMp: selected.mp,
    attack: selected.attack,
    ability: selected.ability,
    sleepRate: selected.sleepRate || 0,
    skills: selected.skills
  };

  enemyIndex = 0;
  enemySleep = false;
  playerStop = false;
  gameOver = false;
  waiting = false;
  buffTurn = 0;
  attackBuff = 0;

  document.getElementById("selectScreen").classList.add("hidden");
  document.getElementById("battleScreen").classList.remove("hidden");

  startEnemy();
}

function startEnemy() {
  const e = enemies[enemyIndex];

  const enemyHp = Math.floor(e.hp * currentDifficulty.hpRate);
  const enemyAttack = Math.floor(e.attack * currentDifficulty.attackRate);

  enemy = {
    name: e.name,
    image: e.image,
    hp: enemyHp,
    maxHp: enemyHp,
    attack: enemyAttack,
    ability: e.ability,
    skills: e.skills
  };

  enemyTurnCount = 0;
  enemySleep = false;
  playerStop = false;
  waiting = true;

  updateBattleUI();
  playEnterAnimation();

  showMessage(enemy.name + " が現れた！");

  if (enemy.name === "なべふた") {
    playBossBGM();
  } else {
    playBattleBGM();
  }

  setTimeout(function() {
    waiting = false;
    updateBattleUI();
  }, 900);
}

function useSkill(index) {
  if (gameOver) return;
  if (waiting) return;

  if (playerStop) {
    playerStop = false;
    waiting = true;
    showMessage(player.name + " は行動できない！<br>");
    setTimeout(enemyAttack, 900);
    return;
  }

  const skill = player.skills[index];

  if (player.mp < skill.mp) {
    showMessage("MPが足りない！");
    return;
  }

  waiting = true;
  player.mp -= skill.mp;

  let message = "";
  const currentAttack = player.attack + attackBuff;

  if (skill.type === "attack") {
    const damage = Math.floor(currentAttack * skill.power);
    const repeat = skill.repeat || 1;

    message += player.name + " の " + skill.name + "！<br>";

    for (let i = 0; i < repeat; i++) {
      enemy.hp -= damage;
      message += enemy.name + " に " + damage + " ダメージ！<br>";
    }
  }

  if (skill.type === "fixedAttack") {
    const repeat = skill.repeat || 1;

    message += player.name + " の " + skill.name + "！<br>";

    for (let i = 0; i < repeat; i++) {
      enemy.hp -= skill.damage;
      message += enemy.name + " に " + skill.damage + " ダメージ！<br>";
    }
  }

  if (skill.type === "heal") {
    player.hp += skill.heal;
    if (player.hp > player.maxHp) player.hp = player.maxHp;

    message += player.name + " の " + skill.name + "！<br>";
    message += "HPを " + skill.heal + " 回復！<br>";
  }

  if (skill.type === "drain") {
    enemy.hp -= skill.damage;
    player.hp += skill.heal;
    if (player.hp > player.maxHp) player.hp = player.maxHp;

    message += player.name + " の " + skill.name + "！<br>";
    message += enemy.name + " に " + skill.damage + " ダメージ！<br>";
    message += "HPを " + skill.heal + " 回復！<br>";
  }

  if (skill.type === "mpHeal") {
    player.mp += skill.healMp;
    if (player.mp > player.maxMp) player.mp = player.maxMp;

    message += player.name + " の " + skill.name + "！<br>";
    message += "MPを " + skill.healMp + " 回復！<br>";
  }

  if (skill.type === "buff") {
    attackBuff = skill.up;
    buffTurn = skill.turn;

    message += player.name + " の " + skill.name + "！<br>";
    message += skill.turn + "ターン攻撃力が " + skill.up + " 上がった！<br>";
  }

  if (player.sleepRate > 0 && Math.random() < player.sleepRate) {
    enemySleep = true;
    message += enemy.name + " は眠ってしまった！<br>";
  }

  if (enemy.hp < 0) enemy.hp = 0;

  updateBattleUI();
  showMessage(message);

  if (enemy.hp <= 0) {
    setTimeout(nextEnemy, 1000);
    return;
  }

  setTimeout(enemyAttack, 1000);
}

function enemyAttack() {
  if (gameOver) return;

  let message = "";

  if (enemySleep) {
    message += enemy.name + " は眠っていて動けない！<br>";
    enemySleep = false;

    afterTurn();
    waiting = false;

    updateBattleUI();
    showMessage(message);
    return;
  }

  enemyTurnCount++;

  const skill = chooseEnemySkill();

  message += enemy.name + " の " + skill.name + "！<br>";

  if (skill.type === "attack") {
    const damage = Math.floor(skill.damage * currentDifficulty.attackRate);
    player.hp -= damage;

    message += player.name + " は " + damage + " ダメージを受けた！<br>";
  }

  if (skill.type === "heal") {
    enemy.hp += skill.heal;

    if (enemy.hp > enemy.maxHp) {
      enemy.hp = enemy.maxHp;
    }

    message += enemy.name + " は " + skill.heal + " 回復した！<br>";
  }

  if (skill.type === "stun") {
    const damage = Math.floor(skill.damage * currentDifficulty.attackRate);
    const rate = Math.min(0.65, skill.rate * currentDifficulty.skillRate);

    player.hp -= damage;

    message += player.name + " は " + damage + " ダメージを受けた！<br>";

    if (Math.random() < rate) {
      playerStop = true;

      message += enemy.name + "「このテストの状況だと単位は取れないぞー」<br>";
      message += player.name + " は次のターン行動できなくなった！<br>";
    }
  }

  if (enemy.name === "なべふた" && enemyTurnCount % 2 === 0) {
    enemy.hp += 10;
    if (enemy.hp > enemy.maxHp) enemy.hp = enemy.maxHp;
    message += enemy.name + " の特性で10回復した！<br>";
  }

  if (player.hp < 0) player.hp = 0;

  if (player.hp <= 0) {
    stopAllBGM();
    gameOver = true;
    waiting = true;
    message += player.name + " は倒れた……<br>単位を落としてしまった、、、";
  } else {
    afterTurn();
    waiting = false;
  }

  updateBattleUI();
  showMessage(message);
}

function chooseEnemySkill() {
  const skills = enemy.skills;

  const attackSkills = skills.filter(skill => skill.type === "attack");
  const healSkills = skills.filter(skill => skill.type === "heal");
  const stunSkills = skills.filter(skill => skill.type === "stun");

  const playerHpRate = player.hp / player.maxHp;
  const enemyHpRate = enemy.hp / enemy.maxHp;

  if (playerHpRate <= 0.3 && attackSkills.length > 0) {
    return getStrongestAttack(attackSkills);
  }

  if (enemyHpRate <= 0.3 && healSkills.length > 0) {
    return healSkills[0];
  }

  if (!playerStop && stunSkills.length > 0 && Math.random() < 0.35) {
    return stunSkills[0];
  }

  if (attackSkills.length > 0) {
    return getStrongestAttack(attackSkills);
  }

  return skills[Math.floor(Math.random() * skills.length)];
}

function getStrongestAttack(skills) {
  let best = skills[0];

  for (const skill of skills) {
    if (skill.damage > best.damage) {
      best = skill;
    }
  }

  return best;
}

function afterTurn() {
  if (buffTurn > 0) {
    buffTurn--;

    if (buffTurn === 0) {
      attackBuff = 0;
    }
  }
}

function nextEnemy() {
  enemyIndex++;

  if (enemyIndex >= enemies.length) {
    stopAllBGM();

    gameOver = true;
    waiting = true;

    updateBattleUI();
    showMessage("すべての敵を倒した！<br>単位を取得した！");
    return;
  }

  startEnemy();
}

function playEnterAnimation() {
  const heroImage = document.getElementById("heroImage");
  const enemyImage = document.getElementById("enemyImage");

  heroImage.classList.remove("enter-hero");
  enemyImage.classList.remove("enter-enemy");

  void heroImage.offsetWidth;
  void enemyImage.offsetWidth;

  heroImage.classList.add("enter-hero");
  enemyImage.classList.add("enter-enemy");
}

function stopAllBGM() {
  if (!battleBGM || !bossBGM) return;

  battleBGM.pause();
  bossBGM.pause();

  battleBGM.currentTime = 0;
  bossBGM.currentTime = 0;
}

function playBattleBGM() {
  stopAllBGM();

  battleBGM.volume = 0.35;
  battleBGM.play();
}

function playBossBGM() {
  stopAllBGM();

  bossBGM.volume = 0.35;
  bossBGM.play();
}