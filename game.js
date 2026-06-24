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

// ==============================
// けいたい進化管理
// 0：けいたい（昔の姿）
// 1：けいたい
// 2：教授特効けいたい
// ==============================
let playerEvolution = 0;

const keitaiForms = [
  {
    name: "けいたい（昔の姿）",
    image: "images/keitai1.png",
    hp: 100,
    mp: 40,
    attack: 25
  },
  {
    name: "けいたい",
    image: "images/keitai2.png",
    hp: 140,
    mp: 55,
    attack: 30
  },
  {
    name: "教授特効けいたい",
    image: "images/keitai3.png",
    hp: 220,
    mp: 75,
    attack: 45
  }
];

// ==============================
// けいたいだけ進化させる関数
// 注意：ここでは updateBattleUI() を呼ばない
// enemy がまだ null の時に落ちるのを防ぐため
// ==============================
function evolvePlayer(stage, showAlert = true) {
  playerEvolution = stage;

  const form = keitaiForms[stage];

  player.name = form.name;
  player.image = form.image;

  player.formName = form.name;
  player.typeText = form.typeText;

  player.maxHp = form.hp;
  player.hp = form.hp;

  player.maxMp = form.mp;
  player.mp = form.mp;

  player.attack = form.attack;

  const formText = document.getElementById("heroFormText");
  const typeText = document.getElementById("heroTypeText");

  if (formText) {
    formText.textContent = "形態：" + form.name;
  }

  if (typeText) {
    typeText.textContent = "タイプ：" + form.typeText;
  }

  if (showAlert) {
    showMessage(form.name + " に進化した！<br>");
  }
}

// ==============================
// 教授特効ダメージ
// 最終形態だけダメージ1.5倍
// ==============================
function calcPlayerDamage(baseDamage) {
  if (playerEvolution === 2 && player.name === "教授特効けいたい") {
    return Math.floor(baseDamage * 1.5);
  }

  return baseDamage;
}

function selectHero(index) {
  battleBGM = document.getElementById("battleBGM");
  bossBGM = document.getElementById("bossBGM");

  const selected = heroes[index];

  player = {
    baseName: selected.name,
    name: selected.name,
    image: selected.image,
    hp: selected.hp,
    maxHp: selected.hp,
    mp: selected.mp,
    maxMp: selected.mp,
    attack: selected.attack,
    ability: selected.ability,
    sleepRate: selected.sleepRate || 0,
    skills: selected.skills,
    formName: selected.name,
    typeText: selected.ability
  };

  // けいたいを選んだ時だけ進化システムを使う
  if (selected.name === "けいたい") {
    playerEvolution = 0;
    evolvePlayer(0, false);
  } else {
    playerEvolution = -1;
  }

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
    const baseDamage = Math.floor(currentAttack * skill.power);
    const damage = calcPlayerDamage(baseDamage);
    const repeat = skill.repeat || 1;

    message += player.name + " の " + skill.name + "！<br>";

    for (let i = 0; i < repeat; i++) {
      enemy.hp -= damage;
      message += enemy.name + " に " + damage + " ダメージ！<br>";
    }
  }

  if (skill.type === "fixedAttack") {
    const repeat = skill.repeat || 1;
    const damage = calcPlayerDamage(skill.damage);

    message += player.name + " の " + skill.name + "！<br>";

    for (let i = 0; i < repeat; i++) {
      enemy.hp -= damage;
      message += enemy.name + " に " + damage + " ダメージ！<br>";
    }
  }

  if (skill.type === "heal") {
    player.hp += skill.heal;
    if (player.hp > player.maxHp) player.hp = player.maxHp;

    message += player.name + " の " + skill.name + "！<br>";
    message += "HPを " + skill.heal + " 回復！<br>";
  }

  if (skill.type === "drain") {
    const damage = calcPlayerDamage(skill.damage);

    enemy.hp -= damage;
    player.hp += skill.heal;
    if (player.hp > player.maxHp) player.hp = player.maxHp;

    message += player.name + " の " + skill.name + "！<br>";
    message += enemy.name + " に " + damage + " ダメージ！<br>";
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
    showMessage("すべての教授を倒した！<br>単位を取得した！");
    return;
  }

  // けいたいを選んでいる時だけ進化する
  if (playerEvolution !== -1) {
    if (enemyIndex === 1) {
      evolvePlayer(1, true);
    }

    if (enemyIndex === 2) {
      evolvePlayer(2, true);
    }
  }

  setTimeout(startEnemy, 1000);
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
