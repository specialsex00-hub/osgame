const heroes = [
  {
    name: "dd と そ",
    image: "dd.png",
    hp: 110,
    mp: 55,
    attack: 18,
    ability: "攻撃技が2回当たる",
    sleepRate: 0,
    skills: [
      {
        name: "変顔",
        mp: 0,
        type: "attack",
        power: 1,
        repeat: 2,
        text: "2回攻撃"
      },
      {
        name: "勉強",
        mp: 8,
        type: "buff",
        turn: 3,
        up: 8,
        text: "3ターン攻撃力+8"
      },
      {
        name: "睡眠",
        mp: 12,
        type: "heal",
        heal: 25,
        text: "HP25回復"
      },
      {
        name: "過去問",
        mp: 15,
        type: "fixedAttack",
        damage: 42,
        repeat: 1,
        text: "42ダメージ"
      }
    ]
  },

  {
    name: "デブ",
    image: "debu.png",
    hp: 330,
    mp: 45,
    attack: 42,
    ability: "高HP・高火力",
    sleepRate: 0,
    skills: [
      {
        name: "睡眠",
        mp: 12,
        type: "heal",
        heal: 45,
        text: "HP45回復"
      },
      {
        name: "食べる",
        mp: 0,
        type: "drain",
        damage: 16,
        heal: 16,
        text: "16ダメージ+16回復"
      },
      {
        name: "のしかかる",
        mp: 0,
        type: "attack",
        power: 1.2,
        repeat: 1,
        text: "攻撃力1.2倍"
      },
      {
        name: "過去問を集める",
        mp: 0,
        type: "mpHeal",
        healMp: 15,
        text: "MP15回復"
      }
    ]
  },

  {
    name: "眠り姫",
    image: "nemuri.png",
    hp: 95,
    mp: 80,
    attack: 24,
    ability: "30%で敵を眠らせる",
    sleepRate: 0.3,
    skills: [
      {
        name: "睡眠",
        mp: 6,
        type: "heal",
        heal: 24,
        text: "HP24回復"
      },
      {
        name: "太鼓",
        mp: 0,
        type: "attack",
        power: 1,
        repeat: 1,
        text: "通常攻撃"
      },
      {
        name: "未定A",
        mp: 18,
        type: "fixedAttack",
        damage: 40,
        repeat: 1,
        text: "40ダメージ"
      },
      {
        name: "未定B",
        mp: 0,
        type: "mpHeal",
        healMp: 25,
        text: "MP25回復"
      }
    ]
  },

  {
    name: "けいたい",
    image: "keitai1.png",
    selectImage: "images/keitai3.png",

    hp: 100,
    mp: 40,
    attack: 25,

    ability: "教授を倒すたびに進化する",

    sleepRate: 0,

    skills: [
      {
        name: "舌打ち",
        mp: 0,
        type: "attack",
        power: 1.2,
        repeat: 1,
        text: "攻撃力1.2倍"
      },
      {
        name: "徹夜勉強",
        mp: 8,
        type: "buff",
        turn: 3,
        up: 10,
        text: "3ターン攻撃力+10"
      },
      {
        name: "栄養ドリンク",
        mp: 10,
        type: "heal",
        heal: 35,
        text: "HP35回復"
      },
      {
        name: "過去問無双",
        mp: 18,
        type: "fixedAttack",
        damage: 50,
        repeat: 1,
        text: "50固定ダメージ"
      }
    ]
  }
];

const enemies = [
  {
    name: "くま",
    image: "kuma.png",
    hp: 110,
    attack: 15,
    ability: "序盤の門番",
    skills: [
      { name: "技1", type: "attack", damage: 14 },
      { name: "技2", type: "attack", damage: 24 },
      { name: "技3", type: "heal", heal: 18 },
      { name: "技4", type: "stun", damage: 8, rate: 0.18 }
    ]
  },

  {
    name: "ウナちんぽ",
    image: "unachin.png",
    hp: 170,
    attack: 24,
    ability: "妨害型",
    skills: [
      { name: "技1", type: "attack", damage: 22 },
      { name: "技2", type: "attack", damage: 38 },
      { name: "技3", type: "stun", damage: 14, rate: 0.28 },
      { name: "技4", type: "heal", heal: 28 }
    ]
  },

  {
    name: "なべふた",
    image: "nabe.png",
    hp: 250,
    attack: 35,
    ability: "ボス",
    skills: [
      { name: "技1", type: "attack", damage: 32 },
      { name: "技2", type: "attack", damage: 55 },
      { name: "技3", type: "heal", heal: 40 },
      { name: "技4", type: "stun", damage: 18, rate: 0.35 }
    ]
  }
];
