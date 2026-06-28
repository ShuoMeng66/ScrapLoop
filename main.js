const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const titleScreen = document.getElementById("titleScreen");
const modal = document.getElementById("modal");
const toastEl = document.getElementById("toast");
const hpText = document.getElementById("hpText");
const hpFill = document.getElementById("hpFill");
const shieldText = document.getElementById("shieldText");
const shieldFill = document.getElementById("shieldFill");
const pointText = document.getElementById("pointText");
const printText = document.getElementById("printText");
const scrapRow = document.getElementById("scrapRow");

const W = canvas.width;
const H = canvas.height;
const SAVE_KEY = "green-loop-quest-save-v2";
ctx.imageSmoothingEnabled = false;

const imagePaths = {
  bgHub: "assets/generated/hub.png",
  bgArena: "assets/generated/arena.png",
  bgLab: "assets/generated/lab.png",
  bgMarket: "assets/generated/market.png",
  bossCat: "assets/sprites/boss_cat.png",
  heroFront: "assets/sprites/hero_idle_front.png",
  heroBack: "assets/sprites/hero_idle_back.png",
  heroWalkFront1: "assets/sprites/hero_walk_front_1.png",
  heroWalkFront2: "assets/sprites/hero_walk_front_2.png",
  heroWalkBack1: "assets/sprites/hero_walk_back_1.png",
  heroWalkBack2: "assets/sprites/hero_walk_back_2.png",
  heroWalkRight1: "assets/sprites/hero_walk_right_1.png",
  heroWalkRight2: "assets/sprites/hero_walk_right_2.png",
  portal0: "assets/sprites/portal_frame_0.png",
  portal1: "assets/sprites/portal_frame_1.png",
  portal2: "assets/sprites/portal_frame_2.png",
  portal3: "assets/sprites/portal_frame_3.png",
  portal4: "assets/sprites/portal_frame_4.png",
  portal5: "assets/sprites/portal_frame_5.png",
  portal6: "assets/sprites/portal_frame_6.png",
  portal7: "assets/sprites/portal_frame_7.png",
  facilityWorkbench: "assets/sprites/facility_workbench.png",
  facilityPortal: "assets/sprites/facility_portal.png",
  facilityLocker: "assets/sprites/facility_locker.png",
  facilityMedbay: "assets/sprites/facility_medbay.png",
  facilityRecycler: "assets/sprites/facility_recycler.png",
  facilityBoard: "assets/sprites/facility_board.png",
  facilityExchange: "assets/sprites/facility_exchange.png",
  facilityTerminal: "assets/sprites/facility_terminal.png",
  enemyBinbot: "assets/sprites/enemy_binbot.png",
  enemySludge: "assets/sprites/enemy_sludge.png",
  enemyEye: "assets/sprites/enemy_eye.png",
  enemyMimic: "assets/sprites/enemy_mimic.png",
  enemyGuard: "assets/sprites/enemy_guard.png",
  trapSpikes: "assets/sprites/trap_spikes.png",
  trapSaw: "assets/sprites/trap_saw.png",
  trapVent: "assets/sprites/trap_vent.png",
  itemPlastic: "assets/sprites/item_plastic.png",
  itemGlass: "assets/sprites/item_glass.png",
  itemCircuit: "assets/sprites/item_circuit.png",
  itemCoil: "assets/sprites/item_coil.png",
  itemGear: "assets/sprites/item_gear.png",
  itemMetal: "assets/sprites/item_metal.png",
  itemToken: "assets/sprites/item_token.png",
  itemBattery: "assets/sprites/item_battery.png",
  itemHeart: "assets/sprites/item_heart.png",
  itemShield: "assets/sprites/item_shield.png",
  itemSpeed: "assets/sprites/item_speed.png",
  itemMagnet: "assets/sprites/item_magnet.png",
  itemPower: "assets/sprites/item_power.png",
  itemCooldown: "assets/sprites/item_cooldown.png",
  equipWrenchBasic: "assets/sprites/equip_wrench_basic.png",
  equipWrenchGreen: "assets/sprites/equip_wrench_green.png",
  equipWrenchBlue: "assets/sprites/equip_wrench_blue.png",
  equipWrenchGold: "assets/sprites/equip_wrench_gold.png",
  equipHelmetBasic: "assets/sprites/equip_helmet_basic.png",
  equipHelmetBlue: "assets/sprites/equip_helmet_blue.png",
  equipArmorBasic: "assets/sprites/equip_armor_basic.png",
  equipArmorGreen: "assets/sprites/equip_armor_green.png",
  equipArmorGold: "assets/sprites/equip_armor_gold.png",
  equipBootsBasic: "assets/sprites/equip_boots_basic.png",
};

const imgs = {};
let assetsReady = false;

const scrapTypes = [
  ["plastic", "塑料带", "itemPlastic"],
  ["glass", "玻璃片", "itemGlass"],
  ["metal", "金属板", "itemMetal"],
  ["circuit", "电路板", "itemCircuit"],
  ["coil", "铜线圈", "itemCoil"],
  ["gear", "齿轮", "itemGear"],
  ["battery", "电池芯", "itemBattery"],
  ["token", "回收章", "itemToken"],
];

const buffs = {
  heart: { name: "修复心", img: "itemHeart", apply: () => heal(26) },
  shield: { name: "护盾", img: "itemShield", apply: () => addShield(22) },
  speed: { name: "疾行鞋", img: "itemSpeed", apply: () => addBuff("speed", 9) },
  magnet: { name: "磁力", img: "itemMagnet", apply: () => addBuff("magnet", 10) },
  power: { name: "强化", img: "itemPower", apply: () => addBuff("power", 8) },
  cooldown: { name: "冷却", img: "itemCooldown", apply: () => addBuff("cooldown", 8) },
};

const equipments = [
  {
    id: "wrench_basic",
    slot: "weapon",
    name: "环形修补扳手",
    img: "equipWrenchBasic",
    desc: "圆圈震荡攻击，范围稳定，适合新手清怪。",
    attackType: "circle",
    damage: 18,
    cooldown: 0.44,
    reach: 84,
    cost: {},
  },
  {
    id: "wrench_green",
    slot: "weapon",
    name: "绿环挥砍钳",
    img: "equipWrenchGreen",
    desc: "前方扇形挥砍，伤害更集中，打 Boss 更舒服。",
    attackType: "slash",
    damage: 30,
    cooldown: 0.36,
    reach: 122,
    cost: { plastic: 8, metal: 6, gear: 2 },
  },
  {
    id: "wrench_blue",
    slot: "weapon",
    name: "追踪电磁钳",
    img: "equipWrenchBlue",
    desc: "发射追踪子弹，自动锁定最近敌人或 Boss。",
    attackType: "homing",
    damage: 24,
    cooldown: 0.32,
    reach: 520,
    cost: { circuit: 7, coil: 5, battery: 2 },
  },
  {
    id: "wrench_gold",
    slot: "weapon",
    name: "公益光束钳",
    img: "equipWrenchGold",
    desc: "挥砍加追踪弹的混合高阶武器。",
    attackType: "hybrid",
    damage: 38,
    cooldown: 0.28,
    reach: 150,
    cost: { token: 5, circuit: 9, coil: 7 },
  },
  {
    id: "helmet_basic",
    slot: "helmet",
    name: "分拣头盔",
    img: "equipHelmetBasic",
    desc: "进入战斗时提供少量护盾。",
    shield: 10,
    cost: {},
  },
  {
    id: "helmet_blue",
    slot: "helmet",
    name: "蓝屏护目盔",
    img: "equipHelmetBlue",
    desc: "减少陷阱和 Boss 弹幕伤害。",
    shield: 24,
    trapResist: 0.35,
    cost: { glass: 7, circuit: 5, token: 2 },
  },
  {
    id: "armor_basic",
    slot: "armor",
    name: "旧料护甲",
    img: "equipArmorBasic",
    desc: "基础防护，增加生命上限。",
    hp: 18,
    defense: 1,
    cost: {},
  },
  {
    id: "armor_green",
    slot: "armor",
    name: "绿环背心",
    img: "equipArmorGreen",
    desc: "提高生命，并提升碎片拾取范围。",
    hp: 34,
    defense: 3,
    pickup: 18,
    cost: { plastic: 6, glass: 4, metal: 6 },
  },
  {
    id: "armor_gold",
    slot: "armor",
    name: "纪念站白金甲",
    img: "equipArmorGold",
    desc: "高阶护甲，承受 Boss 弹幕更稳。",
    hp: 56,
    defense: 6,
    pickup: 28,
    cost: { token: 6, metal: 10, battery: 3 },
  },
  {
    id: "boots_basic",
    slot: "boots",
    name: "分拣靴",
    img: "equipBootsBasic",
    desc: "提高移动速度，减少被包围风险。",
    speed: 20,
    cost: {},
  },
];

const recipes = [
  {
    id: "ocean_charm",
    name: "海洋瓶片挂件",
    img: "itemGlass",
    desc: "用玻璃片和塑料带做成的蓝绿挂件。",
    cost: { plastic: 4, glass: 4, token: 1 },
    points: 14,
  },
  {
    id: "circuit_flower",
    name: "电路花纪念牌",
    img: "itemCircuit",
    desc: "电子废物再设计，适合公益展台展示。",
    cost: { circuit: 5, coil: 3, gear: 2 },
    points: 20,
  },
  {
    id: "clean_medal",
    name: "绿环行动徽章",
    img: "itemToken",
    desc: "把金属板压制成可兑换徽章。",
    cost: { metal: 6, gear: 3, token: 2 },
    points: 24,
  },
];

const printRewards = [
  {
    id: "blue_cat_print",
    name: "蓝猫双层 3D 打印摆件券",
    img: "bossCat",
    desc: "Boss 掉落的打印碎片可兑换 3D 废物打印纪念品预约券。",
    cost: { printShard: 8 },
    points: 60,
  },
  {
    id: "recycle_core_print",
    name: "回收核心钥匙扣券",
    img: "itemToken",
    desc: "适合低门槛兑换的 3D 打印公益纪念品。",
    cost: { printShard: 4, token: 2 },
    points: 34,
  },
];

const backgrounds = [
  { id: "hub", name: "绿环主页", img: "bgHub", cost: {}, desc: "默认公益基地背景。" },
  { id: "arena", name: "清洁废料场", img: "bgArena", cost: { plastic: 5, metal: 5 }, desc: "适合战斗感更强的主页展示。" },
  { id: "lab", name: "电子再生实验室", img: "bgLab", cost: { circuit: 5, coil: 4 }, desc: "电子废弃物主题背景。" },
  { id: "market", name: "公益兑换市场", img: "bgMarket", cost: { token: 3 }, desc: "更适合兑换和活动展示。" },
  { id: "boss", name: "蓝猫打印核心", img: "bgMarket", cost: { printShard: 3 }, desc: "击败 Boss 后可解锁的纪念品主题背景。" },
];

const enemyDeck = [
  { name: "履带垃圾桶", img: "enemyBinbot", hp: 38, speed: 58, damage: 6, drop: ["plastic", "metal"] },
  { name: "酸液团", img: "enemySludge", hp: 30, speed: 48, damage: 8, drop: ["glass", "battery"] },
  { name: "监测眼", img: "enemyEye", hp: 28, speed: 72, damage: 6, drop: ["circuit", "coil"] },
  { name: "伪装回收箱", img: "enemyMimic", hp: 52, speed: 44, damage: 10, drop: ["gear", "token"] },
  { name: "清障机", img: "enemyGuard", hp: 68, speed: 48, damage: 12, drop: ["metal", "battery", "token"] },
];

const state = {
  scene: "title",
  battleMap: "arena",
  paused: false,
  last: 0,
  keys: new Set(),
  pad: new Set(),
  mouse: { x: W / 2, y: H / 2 },
  nearby: null,
  attacks: [],
  projectiles: [],
  enemyShots: [],
  shockwaves: [],
  enemies: [],
  pickups: [],
  traps: [],
  obstacles: [],
  battlePortal: null,
  boss: null,
  wave: 1,
  hordeTime: 0,
  hordeKills: 0,
  hordeSpawnTimer: 0,
  puzzle: null,
  prompt: "",
  toastTimer: 0,
  buffTimer: 0,
  bossDamageFloaters: [],
};

const player = {
  x: 640,
  y: 488,
  w: 46,
  h: 58,
  dir: "down",
  faceX: 1,
  faceY: 0,
  hp: 118,
  maxHp: 118,
  shield: 10,
  attackCd: 0,
  hurtCd: 0,
  frame: 0,
  buffs: {},
};

let save = loadSave();

const hubFacilities = [
  { id: "workbench", name: "纪念品工坊", hint: "Enter 合成收藏品", img: "facilityWorkbench", x: 388, y: 288, w: 138, h: 82, action: showCraft },
  { id: "locker", name: "装备间", hint: "Enter 穿脱装备", img: "facilityLocker", x: 548, y: 286, w: 118, h: 88, action: showInventory },
  { id: "portal", name: "战斗传送门", hint: "Enter 选择小怪或 Boss", img: "facilityPortal", x: 704, y: 286, w: 126, h: 112, action: showPortalMenu },
  { id: "exchange", name: "实物兑换台", hint: "Enter 兑换实物券", img: "facilityExchange", x: 860, y: 286, w: 136, h: 88, action: showExchange },
  { id: "medbay", name: "修复站", hint: "Enter 恢复状态", img: "facilityMedbay", x: 392, y: 424, w: 110, h: 98, action: useMedbay },
  { id: "recycler", name: "材料精炼机", hint: "Enter 碎片换回收章", img: "facilityRecycler", x: 548, y: 424, w: 112, h: 106, action: useRecycler },
  { id: "board", name: "公益任务板", hint: "Enter 查看攻略任务", img: "facilityBoard", x: 704, y: 424, w: 132, h: 88, action: showMissions },
  { id: "terminal", name: "背景终端", hint: "Enter 切换背景", img: "facilityTerminal", x: 860, y: 424, w: 134, h: 82, action: showBackgrounds },
];

const safeHubSpawnPoints = [
  { x: 640, y: 570 },
  { x: 640, y: 520 },
  { x: 250, y: 520 },
  { x: 1030, y: 520 },
  { x: 250, y: 350 },
  { x: 1030, y: 350 },
];

function defaultSave() {
  return {
    scraps: Object.fromEntries(scrapTypes.map(([id]) => [id, id === "token" ? 1 : 2])),
    printShard: 0,
    souvenirs: {},
    printTickets: {},
    points: 0,
    redeemed: [],
    unlocked: ["wrench_basic", "helmet_basic", "armor_basic", "boots_basic"],
    equipped: { weapon: "wrench_basic", helmet: "helmet_basic", armor: "armor_basic", boots: "boots_basic" },
    unlockedBackgrounds: ["hub"],
    currentBackground: "hub",
    stats: { collected: 0, defeated: 0, crafted: 0, bestWave: 1, bossDefeated: 0 },
    claimed: {},
  };
}

function migrateSave(raw) {
  const base = defaultSave();
  const old = raw || {};
  return {
    ...base,
    ...old,
    scraps: { ...base.scraps, ...(old.scraps || {}) },
    souvenirs: { ...base.souvenirs, ...(old.souvenirs || {}) },
    printTickets: { ...base.printTickets, ...(old.printTickets || {}) },
    equipped: { ...base.equipped, ...(old.equipped || {}) },
    stats: { ...base.stats, ...(old.stats || {}) },
    claimed: { ...base.claimed, ...(old.claimed || {}) },
    unlockedBackgrounds: old.unlockedBackgrounds || base.unlockedBackgrounds,
    currentBackground: old.currentBackground || "hub",
    printShard: old.printShard || 0,
  };
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem("green-loop-quest-save-v1");
    return raw ? migrateSave(JSON.parse(raw)) : defaultSave();
  } catch {
    return defaultSave();
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

function loadImages() {
  return Promise.all(
    Object.entries(imagePaths).map(
      ([key, src]) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            imgs[key] = img;
            resolve();
          };
          img.onerror = () => {
            console.warn(`Missing image: ${src}`);
            resolve();
          };
          img.src = src;
        }),
    ),
  ).then(() => {
    assetsReady = true;
    recomputePlayerStats();
    updateHud();
    draw();
  });
}

function getEquip(id) {
  return equipments.find((item) => item.id === id);
}

function recomputePlayerStats() {
  const armor = getEquip(save.equipped.armor);
  const helmet = getEquip(save.equipped.helmet);
  player.maxHp = 100 + (armor?.hp || 0);
  player.hp = Math.min(player.hp || player.maxHp, player.maxHp);
  player.shield = Math.max(player.shield || 0, helmet?.shield || 0);
}

function currentStats() {
  const weapon = getEquip(save.equipped.weapon);
  const armor = getEquip(save.equipped.armor);
  const helmet = getEquip(save.equipped.helmet);
  const boots = getEquip(save.equipped.boots);
  return {
    weapon,
    damage: (weapon?.damage || 16) + (player.buffs.power ? 8 : 0),
    cooldown: Math.max(0.18, (weapon?.cooldown || 0.45) - (player.buffs.cooldown ? 0.11 : 0)),
    reach: weapon?.reach || 84,
    defense: armor?.defense || 0,
    speed: 190 + (boots?.speed || 0) + (player.buffs.speed ? 64 : 0),
    pickup: 44 + (armor?.pickup || 0) + (player.buffs.magnet ? 110 : 0),
    trapResist: helmet?.trapResist || 0,
  };
}

function startNew() {
  save = defaultSave();
  player.hp = 118;
  player.shield = 10;
  saveGame();
  enterHub("欢迎来到绿环纪念站。靠近传送门按 Enter 选择模式。");
}

function continueGame() {
  enterHub("存档已载入。传送门可选择小怪清理或 Boss 模式。");
}

function resetRuntimeLists() {
  state.enemies = [];
  state.pickups = [];
  state.traps = [];
  state.attacks = [];
  state.projectiles = [];
  state.enemyShots = [];
  state.shockwaves = [];
  state.bossDamageFloaters = [];
  state.buffTimer = 0;
  state.boss = null;
  state.battlePortal = null;
  state.hordeTime = 0;
  state.hordeKills = 0;
  state.hordeSpawnTimer = 0;
  state.puzzle = null;
}

function enterHub(message) {
  titleScreen.classList.add("hidden");
  closeModal();
  state.scene = "hub";
  state.paused = false;
  state.wave = Math.max(1, save.stats.bestWave || 1);
  resetRuntimeLists();
  state.obstacles = hubFacilities.map((f) => facilityRect(f));
  player.x = safeHubSpawnPoints[0].x;
  player.y = safeHubSpawnPoints[0].y;
  snapToSafeHubPoint();
  player.dir = "down";
  player.faceX = 1;
  player.faceY = 0;
  recomputePlayerStats();
  toast(message || "回到主页。");
  saveGame();
}

function snapToSafeHubPoint() {
  const current = { x: player.x, y: player.y };
  const candidates = safeHubSpawnPoints
    .map((point) => ({ ...point, score: distance(point, current) }))
    .sort((a, b) => a.score - b.score);
  const safe = candidates.find((point) => isPlayerPointSafe(point)) || candidates[0];
  player.x = safe.x;
  player.y = safe.y;
}

function isPlayerPointSafe(point) {
  const rect = entityRect({ ...player, x: point.x, y: point.y });
  return !state.obstacles.some((o) => rectsOverlap(rect, o));
}

function showPortalMenu() {
  showModal(
    `
    <div class="modal-header">
      <div>
        <h2>传送门模式选择</h2>
        <p>小怪模式刷通用碎片升级装备；Boss 模式掉落 3D 打印兑换碎片。</p>
      </div>
      <button class="quiet" data-action="close">关闭 Esc</button>
    </div>
    <div class="modal-grid">
      <article class="card good">
        <div class="card-title"><img src="${imagePaths.facilityPortal}" alt="" /><span>小怪清理</span></div>
        <p>击败污染机械，收集塑料、金属、电路、齿轮等碎片，用于升级武器和护具。</p>
        <button class="primary" data-action="startMob">进入小怪模式</button>
      </article>
      <article class="card warn">
        <div class="card-title"><img src="${imagePaths.bossCat}" alt="" /><span>Boss：蓝猫回收守卫</span></div>
        <p>参考 3D 打印纪念品设计的 Boss。击败后获得“打印碎片”，可兑换 3D 废物打印实物券。</p>
        <button class="primary" data-action="startBoss">挑战 Boss</button>
      </article>
      <article class="card warn">
        <div class="card-title"><img src="${imagePaths.enemyGuard}" alt="" /><span>尸潮防守</span></div>
        <p>连续防守 60 秒，敌人会分批涌入。场地 buff 定时刷新，适合测试追踪弹、挥砍和范围武器。</p>
        <button class="primary" data-action="startHorde">进入尸潮</button>
      </article>
      <article class="card good">
        <div class="card-title"><img src="${imagePaths.facilityRecycler}" alt="" /><span>解密回收站</span></div>
        <p>按提示收集并投放正确材料，完成分拣链路。奖励回收章和背景解锁材料，节奏比战斗更轻。</p>
        <button class="primary" data-action="startPuzzle">进入解密</button>
      </article>
    </div>
    <div class="modal-footer">快捷键：Enter 靠近传送门打开，Esc 返回主页。</div>
  `,
    "bgMarket",
  );
}

function startBattle() {
  closeModal();
  state.scene = "battle";
  state.battleMap = state.wave % 2 === 0 ? "lab" : "arena";
  resetRuntimeLists();
  state.buffTimer = 2.2;
  state.traps = createTraps();
  state.obstacles = createBattleObstacles();
  player.x = 170;
  player.y = 360;
  player.hp = Math.max(player.hp, Math.floor(player.maxHp * 0.75));
  player.shield = Math.max(player.shield, (getEquip(save.equipped.helmet)?.shield || 0) + 12);
  player.hurtCd = 1.2;
  spawnWave();
  toast(`第 ${state.wave} 波：小怪模式会掉落装备升级碎片。`);
}

function startBoss() {
  closeModal();
  state.scene = "boss";
  resetRuntimeLists();
  state.buffTimer = 2.6;
  state.battleMap = "boss";
  state.obstacles = [
    { x: 118, y: 110, w: 138, h: 84 },
    { x: 1010, y: 130, w: 150, h: 84 },
    { x: 168, y: 554, w: 150, h: 70 },
    { x: 978, y: 552, w: 160, h: 72 },
  ];
  player.x = 198;
  player.y = 360;
  player.hp = Math.max(player.hp, Math.floor(player.maxHp * 0.9));
  player.shield = Math.max(player.shield, (getEquip(save.equipped.helmet)?.shield || 0) + 20);
  player.hurtCd = 1.4;
  const bossMaxHp = 480 + save.stats.bossDefeated * 45;
  state.boss = {
    name: "蓝猫回收守卫",
    x: 840,
    y: 348,
    w: 250,
    h: 260,
    hp: bossMaxHp,
    maxHp: bossMaxHp,
    phase: 1,
    shotTimer: 0.8,
    ringTimer: 2.5,
    summonTimer: 5,
    hitCd: 0,
    defeated: false,
  };
  toast("Boss 模式：击败蓝猫回收守卫，获得 3D 打印兑换碎片。");
}

function startHorde() {
  closeModal();
  state.scene = "horde";
  state.battleMap = "arena";
  resetRuntimeLists();
  state.buffTimer = 1.8;
  state.hordeTime = 60;
  state.hordeKills = 0;
  state.hordeSpawnTimer = 0.2;
  state.traps = createTraps();
  state.obstacles = createBattleObstacles();
  player.x = 170;
  player.y = 360;
  player.hp = Math.max(player.hp, Math.floor(player.maxHp * 0.85));
  player.shield = Math.max(player.shield, (getEquip(save.equipped.helmet)?.shield || 0) + 16);
  player.hurtCd = 1.2;
  spawnHordePack(3);
  toast("尸潮防守：坚持 60 秒，buff 会在场地内刷新。");
}

function startPuzzle() {
  closeModal();
  state.scene = "puzzle";
  state.battleMap = "lab";
  resetRuntimeLists();
  state.obstacles = [
    { x: 204, y: 120, w: 122, h: 74 },
    { x: 972, y: 124, w: 132, h: 76 },
    { x: 212, y: 568, w: 132, h: 70 },
    { x: 960, y: 560, w: 146, h: 72 },
  ];
  state.puzzle = {
    order: ["plastic", "metal", "circuit", "battery"],
    step: 0,
    held: {},
    stations: [
      { id: "plastic", name: "塑料压缩台", x: 350, y: 210, img: "facilityRecycler" },
      { id: "metal", name: "金属磁选机", x: 930, y: 210, img: "itemMagnet" },
      { id: "circuit", name: "电路检测台", x: 350, y: 520, img: "facilityTerminal" },
      { id: "battery", name: "电池封存箱", x: 930, y: 520, img: "facilityLocker" },
    ],
  };
  player.x = 640;
  player.y = 360;
  spawnPuzzleItems();
  toast("解密回收：按底部提示收集材料，再靠近对应设备按 Enter 投放。");
}

function spawnHordePack(count) {
  for (let i = 0; i < count; i += 1) {
    const def = enemyDeck[Math.floor(Math.random() * enemyDeck.length)];
    const edge = Math.floor(Math.random() * 4);
    const ranges = [
      { minX: 80, maxX: 180, minY: 90, maxY: 620 },
      { minX: 1100, maxX: 1190, minY: 90, maxY: 620 },
      { minX: 220, maxX: 1060, minY: 90, maxY: 150 },
      { minX: 220, maxX: 1060, minY: 560, maxY: 630 },
    ][edge];
    const pos = randomOpenPoint(ranges.minX, ranges.maxX, ranges.minY, ranges.maxY, 68, 64);
    const scale = 1 + Math.max(0, 60 - state.hordeTime) * 0.008;
    state.enemies.push({
      ...def,
      id: `horde-${Date.now()}-${i}`,
      x: pos.x,
      y: pos.y,
      w: def.img === "enemyGuard" ? 76 : 66,
      h: def.img === "enemyGuard" ? 78 : 66,
      maxHp: Math.floor(def.hp * scale),
      hp: Math.floor(def.hp * scale),
      speed: def.speed + Math.max(0, 60 - state.hordeTime) * 0.45,
      hitCd: 0,
    });
  }
}

function spawnPuzzleItems() {
  const ids = ["plastic", "metal", "circuit", "battery", "glass", "gear", "coil"];
  for (let i = 0; i < 16; i += 1) {
    const id = ids[i % ids.length];
    const point = randomOpenPoint(250, 1030, 145, 590, 40, 40);
    spawnPickup(point.x, point.y, "puzzle", id);
  }
}

function spawnWave() {
  const count = Math.min(2 + Math.floor(state.wave * 1.1), 8);
  for (let i = 0; i < count; i += 1) {
    const def = enemyDeck[(i + state.wave) % enemyDeck.length];
    const pos = randomOpenPoint(500, 1160, 120, 620, 76, 56);
    state.enemies.push({
      ...def,
      id: `${Date.now()}-${i}`,
      x: pos.x,
      y: pos.y,
      w: def.img === "enemyGuard" ? 76 : 66,
      h: def.img === "enemyGuard" ? 78 : 66,
      maxHp: Math.floor(def.hp + state.wave * 8),
      hp: Math.floor(def.hp + state.wave * 8),
      hitCd: 0,
    });
  }
}

function createBattleObstacles() {
  return [
    { x: 342, y: 138, w: 96, h: 76 },
    { x: 624, y: 72, w: 152, h: 68 },
    { x: 868, y: 176, w: 116, h: 72 },
    { x: 410, y: 560, w: 124, h: 76 },
    { x: 790, y: 548, w: 130, h: 74 },
  ];
}

function createTraps() {
  return [
    { kind: "spikes", img: "trapSpikes", x: 530, y: 390, w: 82, h: 58, damage: 12, cd: 0 },
    { kind: "saw", img: "trapSaw", x: 882, y: 382, w: 82, h: 70, damage: 14, cd: 0 },
    { kind: "vent", img: "trapVent", x: 680, y: 222, w: 72, h: 72, damage: 9, cd: 0 },
  ];
}

function facilityRect(f) {
  return { x: f.x - f.w / 2, y: f.y - f.h / 2 + f.h * 0.28, w: f.w, h: f.h * 0.62 };
}

function randomOpenPoint(minX, maxX, minY, maxY, w, h) {
  for (let i = 0; i < 120; i += 1) {
    const point = { x: rand(minX, maxX), y: rand(minY, maxY) };
    const rect = entityRect({ ...point, w, h });
    if (!state.obstacles.some((o) => rectsOverlap(rect, o)) && distance(point, player) > 240) return point;
  }
  return { x: rand(minX, maxX), y: rand(minY, maxY) };
}

function update(dt) {
  if (!assetsReady || state.scene === "title" || state.paused) return;
  updateTimers(dt);
  movePlayer(dt);
  if (state.scene === "hub") updateHub();
  if (state.scene === "battle") updateBattle(dt);
  if (state.scene === "boss") updateBoss(dt);
  if (state.scene === "horde") updateHorde(dt);
  if (state.scene === "puzzle") updatePuzzle(dt);
  updateProjectiles(dt);
  updateHud();
}

function updateTimers(dt) {
  player.attackCd = Math.max(0, player.attackCd - dt);
  player.hurtCd = Math.max(0, player.hurtCd - dt);
  player.frame += dt;
  for (const key of Object.keys(player.buffs)) {
    player.buffs[key] -= dt;
    if (player.buffs[key] <= 0) delete player.buffs[key];
  }
  for (const a of state.attacks) a.ttl -= dt;
  state.attacks = state.attacks.filter((a) => a.ttl > 0);
  for (const floater of state.bossDamageFloaters) {
    floater.y -= 28 * dt;
    floater.ttl -= dt;
  }
  state.bossDamageFloaters = state.bossDamageFloaters.filter((f) => f.ttl > 0);
  state.toastTimer -= dt;
  if (state.toastTimer <= 0) toastEl.classList.add("hidden");
}

function movementVector() {
  let dx = 0;
  let dy = 0;
  if (state.keys.has("arrowleft") || state.keys.has("a") || state.pad.has("left")) dx -= 1;
  if (state.keys.has("arrowright") || state.keys.has("d") || state.pad.has("right")) dx += 1;
  if (state.keys.has("arrowup") || state.keys.has("w") || state.pad.has("up")) dy -= 1;
  if (state.keys.has("arrowdown") || state.keys.has("s") || state.pad.has("down")) dy += 1;
  if (dx || dy) {
    const len = Math.hypot(dx, dy);
    dx /= len;
    dy /= len;
    player.faceX = dx;
    player.faceY = dy;
    player.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
  }
  return { dx, dy };
}

function movePlayer(dt) {
  const { dx, dy } = movementVector();
  if (!dx && !dy) return;
  const stats = currentStats();
  moveEntity(player, dx * stats.speed * dt, dy * stats.speed * dt, state.obstacles);
  player.x = clamp(player.x, 38, W - 38);
  player.y = clamp(player.y, 74, H - 40);
}

function moveEntity(entity, dx, dy, obstacles) {
  entity.x += dx;
  let rect = entityRect(entity);
  if (obstacles.some((o) => rectsOverlap(rect, o))) entity.x -= dx;
  entity.y += dy;
  rect = entityRect(entity);
  if (obstacles.some((o) => rectsOverlap(rect, o))) entity.y -= dy;
}

function updateHub() {
  state.nearby = null;
  for (const f of hubFacilities) {
    if (distance(player, f) < 112) {
      state.nearby = f;
      break;
    }
  }
  state.prompt = state.nearby
    ? `${state.nearby.name}：${state.nearby.hint}`
    : "WASD 移动 · Enter 互动 · E 装备 · C 合成 · X 兑换 · B 背景 · M 任务";
}

function updateBattle(dt) {
  updateTraps(dt);
  updateBuffSpawner(dt);
  for (const enemy of state.enemies) {
    enemy.hitCd = Math.max(0, enemy.hitCd - dt);
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const len = Math.hypot(dx, dy) || 1;
    moveEntity(enemy, (dx / len) * enemy.speed * dt, (dy / len) * enemy.speed * dt, state.obstacles);
    if (rectsOverlap(entityRect(player), entityRect(enemy)) && enemy.hitCd <= 0) {
      hurtPlayer(enemy.damage, `${enemy.name} 撞击了你。`);
      enemy.hitCd = 0.85;
    }
  }
  collectPickups();
  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.hp > 0) return true;
    dropLoot(enemy);
    save.stats.defeated += 1;
    return false;
  });
  if (!state.enemies.length && !state.battlePortal) {
    state.battlePortal = { x: 1088, y: 358, r: 64, mode: "home" };
    save.stats.bestWave = Math.max(save.stats.bestWave, state.wave);
    saveGame();
    toast("小怪清理完成。Enter 回主页，N 继续下一波。");
  }
  state.prompt =
    state.battlePortal && distance(player, state.battlePortal) < 90
      ? "传送门：Enter 回主页并保存 · N 继续下一波"
    : `小怪模式：Space/点击攻击 · 剩余 ${state.enemies.length} 个 · Esc 回主页`;
}

function updateHorde(dt) {
  updateTraps(dt);
  updateBuffSpawner(dt);
  state.hordeTime = Math.max(0, state.hordeTime - dt);
  state.hordeSpawnTimer -= dt;
  if (state.hordeSpawnTimer <= 0 && !state.battlePortal) {
    const intensity = 2 + Math.floor((60 - state.hordeTime) / 14);
    spawnHordePack(intensity);
    state.hordeSpawnTimer = Math.max(1.05, 2.8 - (60 - state.hordeTime) * 0.025);
  }
  for (const enemy of state.enemies) {
    enemy.hitCd = Math.max(0, enemy.hitCd - dt);
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const len = Math.hypot(dx, dy) || 1;
    moveEntity(enemy, (dx / len) * enemy.speed * dt, (dy / len) * enemy.speed * dt, state.obstacles);
    if (rectsOverlap(entityRect(player), entityRect(enemy)) && enemy.hitCd <= 0) {
      hurtPlayer(enemy.damage, `${enemy.name} 冲撞了你。`);
      enemy.hitCd = 0.8;
    }
  }
  collectPickups();
  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.hp > 0) return true;
    dropLoot(enemy);
    state.hordeKills += 1;
    save.stats.defeated += 1;
    return false;
  });
  if ((state.hordeTime <= 0 || state.hordeKills >= 36) && !state.battlePortal) {
    addReward({ token: 2, metal: 4, plastic: 4 });
    save.stats.bestWave = Math.max(save.stats.bestWave, state.wave);
    state.battlePortal = { x: 1088, y: 358, r: 64, mode: "home" };
    saveGame();
    toast("尸潮防守完成：获得回收章和基础材料奖励。");
  }
  state.prompt =
    state.battlePortal && distance(player, state.battlePortal) < 90
      ? "尸潮完成：Enter 回主页 · N 再来一轮"
      : `尸潮防守：剩余 ${Math.ceil(state.hordeTime)}s · 击败 ${state.hordeKills}/36 · Space 攻击 · 场地刷新 buff`;
}

function updatePuzzle() {
  collectPickups();
  const puzzle = state.puzzle;
  if (!puzzle) return;
  puzzle.nearby = puzzle.stations.find((station) => distance(player, station) < 86) || null;
  const next = puzzle.order[puzzle.step];
  const nextName = resourceName(next);
  state.prompt = puzzle.nearby
    ? `${puzzle.nearby.name}：Enter 投放 · 当前目标 ${nextName} · 已携带 ${puzzle.held[next] || 0}`
    : `解密回收：目标 ${puzzle.step + 1}/${puzzle.order.length} ${nextName} · 收集材料并按顺序投放`;
}

function updateBoss(dt) {
  const boss = state.boss;
  if (!boss) return;
  boss.hitCd = Math.max(0, boss.hitCd - dt);
  updateBuffSpawner(dt);
  if (boss.hp <= boss.maxHp * 0.62) boss.phase = 2;
  if (boss.hp <= boss.maxHp * 0.32) boss.phase = 3;

  boss.x += Math.sin(performance.now() / 900) * dt * 30;
  boss.shotTimer -= dt;
  boss.ringTimer -= dt;
  boss.summonTimer -= dt;
  if (boss.shotTimer <= 0) {
    fireBossBurst(boss, boss.phase >= 3 ? 12 : boss.phase >= 2 ? 9 : 6);
    boss.shotTimer = boss.phase >= 3 ? 1.1 : boss.phase >= 2 ? 1.45 : 1.9;
  }
  if (boss.ringTimer <= 0) {
    state.shockwaves.push({ x: boss.x, y: boss.y + 70, r: 18, speed: 230, ttl: 2.2, damage: boss.phase >= 2 ? 15 : 11, hit: false });
    boss.ringTimer = boss.phase >= 3 ? 2.4 : 3.2;
  }
  if (boss.summonTimer <= 0 && boss.phase >= 2 && state.enemies.length < 3) {
    const def = enemyDeck[Math.floor(Math.random() * 3)];
    const pos = randomOpenPoint(260, 1060, 130, 600, 64, 64);
    state.enemies.push({ ...def, id: `boss-add-${Date.now()}`, x: pos.x, y: pos.y, w: 64, h: 64, hp: 42, maxHp: 42, hitCd: 0 });
    boss.summonTimer = 6;
  }

  for (const enemy of state.enemies) {
    enemy.hitCd = Math.max(0, enemy.hitCd - dt);
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const len = Math.hypot(dx, dy) || 1;
    moveEntity(enemy, (dx / len) * enemy.speed * dt, (dy / len) * enemy.speed * dt, state.obstacles);
    if (rectsOverlap(entityRect(player), entityRect(enemy)) && enemy.hitCd <= 0) {
      hurtPlayer(enemy.damage, `${enemy.name} 干扰了你。`);
      enemy.hitCd = 0.9;
    }
  }
  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.hp > 0) return true;
    dropLoot(enemy);
    save.stats.defeated += 1;
    return false;
  });

  updateEnemyShots(dt);
  updateShockwaves(dt);
  collectPickups();

  if (boss.hp <= 0 && !boss.defeated) {
    boss.defeated = true;
    const reward = 5 + boss.phase;
    save.printShard += reward;
    save.stats.bossDefeated += 1;
    if (!save.unlockedBackgrounds.includes("boss")) save.unlockedBackgrounds.push("boss");
    state.battlePortal = { x: 1088, y: 358, r: 64, mode: "home" };
    saveGame();
    toast(`蓝猫回收守卫已净化！获得打印碎片 ×${reward}，已解锁 Boss 背景。`);
  }

  state.prompt =
    state.battlePortal && distance(player, state.battlePortal) < 90
      ? "Boss 已净化：Enter 回主页 · X 可兑换 3D 打印实物券"
      : "Boss 模式：躲避弹幕与震荡波，使用追踪弹或挥砍更有效";
}

function updateTraps(dt) {
  for (const trap of state.traps) {
    trap.cd = Math.max(0, trap.cd - dt);
    if (rectsOverlap(entityRect(player), trapRect(trap)) && trap.cd <= 0) {
      const stats = currentStats();
      hurtPlayer(Math.max(2, Math.round(trap.damage * (1 - stats.trapResist))), "陷阱已触发，注意地面标识。");
      trap.cd = 0.9;
    }
  }
}

function fireBossBurst(boss, count) {
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + performance.now() / 1000;
    state.enemyShots.push({
      x: boss.x,
      y: boss.y + 18,
      vx: Math.cos(angle) * 150,
      vy: Math.sin(angle) * 150,
      r: 9,
      damage: boss.phase >= 3 ? 13 : 10,
      ttl: 4.2,
    });
  }
  const dx = player.x - boss.x;
  const dy = player.y - boss.y;
  const len = Math.hypot(dx, dy) || 1;
  state.enemyShots.push({ x: boss.x, y: boss.y + 16, vx: (dx / len) * 230, vy: (dy / len) * 230, r: 12, damage: 16, ttl: 3.3 });
}

function updateEnemyShots(dt) {
  state.enemyShots = state.enemyShots.filter((shot) => {
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.ttl -= dt;
    if (distance(player, shot) < shot.r + 24) {
      hurtPlayer(shot.damage, "被 Boss 回收能量弹命中。");
      return false;
    }
    return shot.ttl > 0 && shot.x > -40 && shot.x < W + 40 && shot.y > -40 && shot.y < H + 40;
  });
}

function updateShockwaves(dt) {
  state.shockwaves = state.shockwaves.filter((wave) => {
    wave.r += wave.speed * dt;
    wave.ttl -= dt;
    const d = distance(player, wave);
    if (!wave.hit && Math.abs(d - wave.r) < 24) {
      hurtPlayer(wave.damage, "震荡波命中，Boss 正在过载。");
      wave.hit = true;
    }
    return wave.ttl > 0;
  });
}

function updateProjectiles(dt) {
  state.projectiles = state.projectiles.filter((p) => {
    const target = findTarget(p);
    if (target) {
      const dx = target.x - p.x;
      const dy = target.y - p.y;
      const len = Math.hypot(dx, dy) || 1;
      p.vx = p.vx * 0.88 + (dx / len) * p.speed * 0.12;
      p.vy = p.vy * 0.88 + (dy / len) * p.speed * 0.12;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.ttl -= dt;
    for (const enemy of state.enemies) {
      if (enemy.hp > 0 && circleHitsRect({ x: p.x, y: p.y, r: p.r }, entityRect(enemy))) {
        damageTarget(enemy, p.damage);
        return false;
      }
    }
    if (state.boss && !state.boss.defeated && circleHitsRect({ x: p.x, y: p.y, r: p.r }, bossRect(state.boss))) {
      damageTarget(state.boss, p.damage);
      return false;
    }
    return p.ttl > 0 && p.x > -30 && p.x < W + 30 && p.y > -30 && p.y < H + 30;
  });
}

function findTarget(p) {
  const candidates = [...state.enemies.filter((e) => e.hp > 0)];
  if (state.boss && !state.boss.defeated) candidates.push(state.boss);
  candidates.sort((a, b) => distance(p, a) - distance(p, b));
  return candidates[0];
}

function triggerAttack() {
  if (!["battle", "boss", "horde"].includes(state.scene) || player.attackCd > 0 || modalOpen()) return;
  const stats = currentStats();
  const weapon = stats.weapon || equipments[0];
  player.attackCd = stats.cooldown;
  if (weapon.attackType === "circle") doCircleAttack(stats);
  if (weapon.attackType === "slash") doSlashAttack(stats);
  if (weapon.attackType === "homing") doHomingAttack(stats, 1);
  if (weapon.attackType === "hybrid") {
    doSlashAttack(stats);
    doHomingAttack(stats, 2);
  }
}

function doCircleAttack(stats) {
  const attack = { type: "circle", x: player.x, y: player.y, r: stats.reach, ttl: 0.16 };
  state.attacks.push(attack);
  damageInCircle(attack, stats.damage);
}

function doSlashAttack(stats) {
  const len = Math.hypot(player.faceX, player.faceY) || 1;
  const nx = player.faceX / len;
  const ny = player.faceY / len;
  const attack = { type: "slash", x: player.x + nx * 68, y: player.y + ny * 52, nx, ny, r: stats.reach, ttl: 0.18 };
  state.attacks.push(attack);
  for (const target of activeTargets()) {
    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const dist = Math.hypot(dx, dy);
    const dot = (dx / (dist || 1)) * nx + (dy / (dist || 1)) * ny;
    if (dist <= stats.reach && dot > 0.28) damageTarget(target, stats.damage + 5);
  }
}

function doHomingAttack(stats, count) {
  const len = Math.hypot(player.faceX, player.faceY) || 1;
  const nx = player.faceX / len;
  const ny = player.faceY / len;
  for (let i = 0; i < count; i += 1) {
    const spread = (i - (count - 1) / 2) * 0.32;
    state.projectiles.push({
      x: player.x + nx * 42,
      y: player.y + ny * 42,
      vx: (nx * Math.cos(spread) - ny * Math.sin(spread)) * 360,
      vy: (ny * Math.cos(spread) + nx * Math.sin(spread)) * 360,
      speed: 430,
      r: 11,
      damage: stats.damage,
      ttl: 2.6,
    });
  }
  state.attacks.push({ type: "muzzle", x: player.x + nx * 48, y: player.y + ny * 48, r: 34, ttl: 0.12 });
}

function activeTargets() {
  const list = [...state.enemies.filter((e) => e.hp > 0)];
  if (state.boss && !state.boss.defeated) list.push(state.boss);
  return list;
}

function damageInCircle(circle, damage) {
  for (const target of activeTargets()) {
    const rect = target === state.boss ? bossRect(target) : entityRect(target);
    if (circleHitsRect(circle, rect)) damageTarget(target, damage);
  }
}

function damageTarget(target, damage) {
  const finalDamage = Math.max(1, Math.round(damage));
  target.hp -= finalDamage;
  target.hitCd = 0.18;
  if (target === state.boss) {
    state.bossDamageFloaters.push({
      x: target.x + rand(-36, 36),
      y: target.y - target.h * 0.42,
      value: finalDamage,
      ttl: 0.72,
    });
  }
}

function collectPickups() {
  const stats = currentStats();
  state.pickups = state.pickups.filter((p) => {
    if (distance(player, p) > stats.pickup) return true;
    if (p.kind === "scrap") {
      save.scraps[p.id] = (save.scraps[p.id] || 0) + p.amount;
      save.stats.collected += p.amount;
      toast(`获得 ${p.name} ×${p.amount}`);
    } else if (p.kind === "puzzle") {
      if (state.puzzle) {
        state.puzzle.held[p.id] = (state.puzzle.held[p.id] || 0) + 1;
        toast(`拾取分拣样本：${p.name}`);
      }
    } else {
      buffs[p.id]?.apply();
      toast(`获得增益：${buffs[p.id]?.name || "临时增益"}`);
    }
    saveGame();
    return false;
  });
}

function dropLoot(enemy) {
  const count = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i += 1) {
    const id = enemy.drop[Math.floor(Math.random() * enemy.drop.length)];
    spawnPickup(enemy.x + rand(-22, 22), enemy.y + rand(-20, 20), "scrap", id);
  }
}

function updateBuffSpawner(dt) {
  state.buffTimer -= dt;
  if (state.buffTimer > 0) return;
  state.buffTimer = state.scene === "boss" ? 5.4 : 6.4;
  const activeBuffs = state.pickups.filter((p) => p.kind === "buff").length;
  if (activeBuffs >= 3) return;
  const point = randomBuffPoint();
  spawnPickup(point.x, point.y, "buff", randomKey(buffs));
}

function randomBuffPoint() {
  const area = state.scene === "boss"
    ? { minX: 250, maxX: 1040, minY: 150, maxY: 590 }
    : { minX: 210, maxX: 1060, minY: 130, maxY: 600 };
  for (let i = 0; i < 100; i += 1) {
    const point = { x: rand(area.minX, area.maxX), y: rand(area.minY, area.maxY) };
    const rect = { x: point.x - 22, y: point.y - 22, w: 44, h: 44 };
    const blocked = state.obstacles.some((o) => rectsOverlap(rect, o));
    if (!blocked && distance(point, player) > 120) return point;
  }
  return { x: 640, y: 520 };
}

function spawnPickup(x, y, kind, id) {
  const scrap = scrapTypes.find((s) => s[0] === id);
  state.pickups.push({
    x,
    y,
    kind,
    id,
    amount: kind === "scrap" ? 1 : 0,
    name: scrap?.[1] || buffs[id]?.name || id,
    img: kind === "scrap" ? scrap?.[2] : buffs[id]?.img,
    bob: Math.random() * Math.PI * 2,
  });
}

function hurtPlayer(amount, message) {
  if (player.hurtCd > 0) return;
  const stats = currentStats();
  let damage = Math.max(1, Math.round(amount - stats.defense));
  if (player.shield > 0) {
    const blocked = Math.min(player.shield, damage);
    player.shield -= blocked;
    damage -= blocked;
  }
  player.hp -= damage;
  player.hurtCd = 0.55;
  if (damage > 0) toast(message);
  if (player.hp <= 0) {
    player.hp = Math.ceil(player.maxHp * 0.55);
    state.wave = 1;
    enterHub("生命过低，修复站把你拉回主页。碎片已保留，重新整备再出发。");
  }
}

function heal(amount) {
  player.hp = Math.min(player.maxHp, player.hp + amount);
}

function addShield(amount) {
  player.shield = Math.min(90, player.shield + amount);
}

function addBuff(id, seconds) {
  player.buffs[id] = Math.max(player.buffs[id] || 0, seconds);
}

function interact() {
  if (state.scene === "title") {
    continueGame();
    return;
  }
  if (modalOpen()) return;
  if (state.scene === "hub" && state.nearby) {
    state.nearby.action();
    return;
  }
  if (state.scene === "puzzle") {
    interactPuzzle();
    return;
  }
  if ((state.scene === "battle" || state.scene === "boss" || state.scene === "horde") && state.battlePortal && distance(player, state.battlePortal) < 92) {
    if (state.scene === "battle") state.wave += 1;
    enterHub("战斗奖励已保存，已回到主页。");
  }
}

function interactPuzzle() {
  const puzzle = state.puzzle;
  if (!puzzle || !puzzle.nearby) return;
  const expected = puzzle.order[puzzle.step];
  if (puzzle.nearby.id !== expected) {
    hurtPlayer(5, "投放顺序错误，分拣机触发了轻微电击。");
    toast(`顺序不对：当前应先处理 ${resourceName(expected)}。`);
    return;
  }
  if ((puzzle.held[expected] || 0) <= 0) {
    toast(`还缺 ${resourceName(expected)} 样本，先去场地里收集。`);
    return;
  }
  puzzle.held[expected] -= 1;
  puzzle.step += 1;
  addShield(8);
  if (puzzle.step >= puzzle.order.length) {
    addReward({ token: 2, circuit: 2, coil: 2 });
    save.stats.collected += 4;
    saveGame();
    enterHub("解密回收完成：获得回收章、电路与线圈奖励。");
  } else {
    toast(`投放成功，下一步：${resourceName(puzzle.order[puzzle.step])}。`);
  }
}

function nextWave() {
  if (state.scene === "battle" && state.battlePortal && distance(player, state.battlePortal) < 120) {
    state.wave += 1;
    startBattle();
  }
  if (state.scene === "horde" && state.battlePortal && distance(player, state.battlePortal) < 120) startHorde();
}

function useMedbay() {
  if ((save.scraps.token || 0) <= 0 && player.hp < player.maxHp) {
    toast("修复站需要 1 枚回收章。");
    return;
  }
  if (player.hp < player.maxHp) save.scraps.token = Math.max(0, (save.scraps.token || 0) - 1);
  player.hp = player.maxHp;
  addShield(12);
  saveGame();
  toast("修复完成，并获得临时护盾。");
}

function useRecycler() {
  const candidates = scrapTypes.map(([id]) => id).filter((id) => id !== "token" && (save.scraps[id] || 0) >= 3);
  if (!candidates.length) {
    toast("至少需要任意同类碎片 ×3 才能精炼。");
    return;
  }
  const from = candidates[Math.floor(Math.random() * candidates.length)];
  save.scraps[from] -= 3;
  save.scraps.token = (save.scraps.token || 0) + 1;
  saveGame();
  toast("精炼成功：消耗 3 个碎片，获得 1 枚回收章。");
}

function showInventory() {
  const stats = currentStats();
  const equippedHtml = ["weapon", "helmet", "armor", "boots"]
    .map((slot) => {
      const item = getEquip(save.equipped[slot]);
      return `<div class="slot-pill">${slotName(slot)}：${item ? item.name : "未装备"}</div>`;
    })
    .join("");
  const cards = equipments
    .map((item) => {
      const unlocked = save.unlocked.includes(item.id);
      const equipped = save.equipped[item.slot] === item.id;
      return `
        <article class="card ${unlocked ? "good" : "locked"}">
          <div class="card-title"><img src="${imagePaths[item.img]}" alt="" /><span>${item.name}</span></div>
          <p>${item.desc}</p>
          <div class="cost-row">${costHtml(item.cost) || '<span class="cost">基础装备</span>'}</div>
          <button class="${equipped ? "quiet" : "primary"}" data-action="${unlocked ? "equip" : "unlock"}" data-id="${item.id}">
            ${equipped ? "已穿戴" : unlocked ? "穿戴" : "解锁"}
          </button>
          ${equipped && item.slot !== "weapon" ? `<button class="quiet" data-action="unequip" data-slot="${item.slot}">脱下</button>` : ""}
        </article>`;
    })
    .join("");
  showModal(
    `
    <div class="modal-header">
      <div>
        <h2>装备间</h2>
        <p>独立穿戴界面。武器决定攻击方式：圆圈震荡、前方挥砍、追踪子弹或混合攻击。</p>
      </div>
      <button class="quiet" data-action="close">关闭 Esc</button>
    </div>
    <div class="equip-layout">
      <aside class="equip-paperdoll">
        ${paperdollHtml()}
        <div class="slot-row">${equippedHtml}</div>
        <p>当前：伤害 ${stats.damage} · 冷却 ${stats.cooldown.toFixed(2)}s · 移速 ${Math.round(stats.speed)} · 拾取 ${stats.pickup}</p>
      </aside>
      <div class="modal-grid">${cards}</div>
    </div>
    <div class="modal-footer">快捷键：E 打开装备间。小怪碎片主要用于解锁装备，Boss 碎片用于兑换 3D 打印实物。</div>
  `,
    "bgLab",
  );
}

function paperdollHtml() {
  const weapon = getEquip(save.equipped.weapon);
  const helmet = getEquip(save.equipped.helmet);
  const armor = getEquip(save.equipped.armor);
  const boots = getEquip(save.equipped.boots);
  return `
    <div class="paperdoll-stack">
      <img class="hero-base" src="${imagePaths.heroFront}" alt="" />
      ${armor ? `<img class="paper-armor" src="${imagePaths[armor.img]}" alt="" />` : ""}
      ${helmet ? `<img class="paper-helmet" src="${imagePaths[helmet.img]}" alt="" />` : ""}
      ${boots ? `<img class="paper-boots" src="${imagePaths[boots.img]}" alt="" />` : ""}
      ${weapon ? `<img class="paper-weapon" src="${imagePaths[weapon.img]}" alt="" />` : ""}
    </div>
  `;
}

function showCraft() {
  const cards = recipes
    .map((recipe) => `
      <article class="card">
        <div class="card-title"><img src="${imagePaths[recipe.img]}" alt="" /><span>${recipe.name}</span></div>
        <p>${recipe.desc}</p>
        <div class="cost-row">${costHtml(recipe.cost)}</div>
        <p>库存：${save.souvenirs[recipe.id] || 0} · 可兑换公益点：${recipe.points}</p>
        <button class="primary" data-action="craft" data-id="${recipe.id}">合成</button>
      </article>`)
    .join("");
  showModal(`
    <div class="modal-header">
      <div><h2>收藏品合成</h2><p>小怪模式获得的通用碎片可合成普通纪念品，再兑换公益点。</p></div>
      <button class="quiet" data-action="close">关闭 Esc</button>
    </div>
    <div class="modal-grid">${cards}</div>
    <div class="modal-footer">快捷键：C 打开合成。</div>
  `, "bgMarket");
}

function showExchange() {
  const normal = recipes
    .map((recipe) => {
      const owned = save.souvenirs[recipe.id] || 0;
      return `
        <article class="card ${owned ? "good" : "locked"}">
          <div class="card-title"><img src="${imagePaths[recipe.img]}" alt="" /><span>${recipe.name}</span></div>
          <p>普通纪念品兑换公益点 +${recipe.points}。</p>
          <p>库存：${owned}</p>
          <button class="primary" data-action="exchange" data-id="${recipe.id}" ${owned ? "" : "disabled"}>兑换</button>
        </article>`;
    })
    .join("");
  const prints = printRewards
    .map((reward) => `
      <article class="card warn">
        <div class="card-title"><img src="${imagePaths[reward.img]}" alt="" /><span>${reward.name}</span></div>
        <p>${reward.desc}</p>
        <div class="cost-row">${costHtml(reward.cost)}</div>
        <p>已兑换：${save.printTickets[reward.id] || 0}</p>
        <button class="primary" data-action="exchangePrint" data-id="${reward.id}">兑换 3D 打印券</button>
      </article>`)
    .join("");
  const log = save.redeemed.slice(-5).reverse().map((r) => `<span class="cost">${r}</span>`).join("");
  showModal(`
    <div class="modal-header">
      <div><h2>实物兑换台</h2><p>Boss 模式掉落“打印碎片”，可兑换 3D 废物打印纪念品预约券。</p></div>
      <button class="quiet" data-action="close">关闭 Esc</button>
    </div>
    <h3>3D 废物打印兑换</h3>
    <div class="modal-grid">${prints}</div>
    <h3>普通纪念品兑换</h3>
    <div class="modal-grid">${normal}</div>
    <h3>最近记录</h3>
    <div class="cost-row">${log || '<span class="cost">还没有兑换记录</span>'}</div>
    <div class="modal-footer">快捷键：X 打开兑换。当前打印碎片：${save.printShard} · 公益点：${save.points}</div>
  `, "bgMarket");
}

function showBackgrounds() {
  const cards = backgrounds
    .map((bg) => {
      const unlocked = save.unlockedBackgrounds.includes(bg.id);
      const active = save.currentBackground === bg.id;
      return `
        <article class="card ${unlocked ? "good" : "locked"}">
          <div class="card-title"><img src="${imagePaths[bg.img]}" alt="" /><span>${bg.name}</span></div>
          <p>${bg.desc}</p>
          <div class="cost-row">${costHtml(bg.cost) || '<span class="cost">默认解锁</span>'}</div>
          <button class="${active ? "quiet" : "primary"}" data-action="${unlocked ? "selectBg" : "unlockBg"}" data-id="${bg.id}">
            ${active ? "使用中" : unlocked ? "切换" : "解锁"}
          </button>
        </article>`;
    })
    .join("");
  showModal(`
    <div class="modal-header">
      <div><h2>背景终端</h2><p>用碎片解锁主页背景，让装备、兑换等界面也带主题氛围。</p></div>
      <button class="quiet" data-action="close">关闭 Esc</button>
    </div>
    <div class="modal-grid">${cards}</div>
    <div class="modal-footer">快捷键：B 打开背景选择。Boss 背景需要打印碎片解锁。</div>
  `, "bgHub");
}

function showMissions() {
  const missions = [
    { id: "collect12", name: "碎片回收员", target: 12, value: save.stats.collected, reward: { token: 2 } },
    { id: "defeat6", name: "污染清障", target: 6, value: save.stats.defeated, reward: { metal: 4, token: 1 } },
    { id: "craft1", name: "第一件纪念品", target: 1, value: save.stats.crafted, reward: { battery: 2, coil: 2 } },
    { id: "boss1", name: "蓝猫守卫净化", target: 1, value: save.stats.bossDefeated, reward: { printShard: 2 } },
  ];
  const cards = missions
    .map((m) => {
      const done = m.value >= m.target;
      const claimed = save.claimed[m.id];
      return `
        <article class="card ${done ? "good" : "warn"}">
          <div class="card-title"><img src="${m.id === "boss1" ? imagePaths.bossCat : imagePaths.itemToken}" alt="" /><span>${m.name}</span></div>
          <p>进度：${Math.min(m.value, m.target)} / ${m.target}</p>
          <div class="cost-row">${costHtml(m.reward, "奖励")}</div>
          <button class="primary" data-action="claim" data-id="${m.id}" ${done && !claimed ? "" : "disabled"}>${claimed ? "已领取" : done ? "领取" : "进行中"}</button>
        </article>`;
    })
    .join("");
  showModal(`
    <div class="modal-header">
      <div><h2>公益任务板</h2><p>任务奖励帮助玩家更快升级装备、解锁背景、兑换 3D 打印纪念品。</p></div>
      <button class="quiet" data-action="close">关闭 Esc</button>
    </div>
    <div class="modal-grid">${cards}</div>
    <div class="modal-footer">快捷键：M 打开任务。</div>
  `, "bgHub");
}

function claimMission(id) {
  const map = {
    collect12: { ok: save.stats.collected >= 12, reward: { token: 2 } },
    defeat6: { ok: save.stats.defeated >= 6, reward: { metal: 4, token: 1 } },
    craft1: { ok: save.stats.crafted >= 1, reward: { battery: 2, coil: 2 } },
    boss1: { ok: save.stats.bossDefeated >= 1, reward: { printShard: 2 } },
  };
  const m = map[id];
  if (!m || !m.ok || save.claimed[id]) return;
  addReward(m.reward);
  save.claimed[id] = true;
  saveGame();
  showMissions();
  toast("任务奖励已入库。");
}

function tryUnlock(id) {
  const item = getEquip(id);
  if (!item || save.unlocked.includes(id)) return;
  if (!canAfford(item.cost)) return toast("材料不足，先去小怪模式收集碎片。");
  consume(item.cost);
  save.unlocked.push(id);
  save.equipped[item.slot] = id;
  recomputePlayerStats();
  saveGame();
  showInventory();
  toast(`${item.name} 已解锁并穿戴。`);
}

function equip(id) {
  const item = getEquip(id);
  if (!item || !save.unlocked.includes(id)) return;
  save.equipped[item.slot] = id;
  recomputePlayerStats();
  saveGame();
  showInventory();
}

function unequip(slot) {
  if (slot === "weapon") return;
  save.equipped[slot] = "";
  recomputePlayerStats();
  saveGame();
  showInventory();
}

function craft(id) {
  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) return;
  if (!canAfford(recipe.cost)) return toast("碎片不足，无法合成。");
  consume(recipe.cost);
  save.souvenirs[id] = (save.souvenirs[id] || 0) + 1;
  save.stats.crafted += 1;
  saveGame();
  showCraft();
  toast(`${recipe.name} 合成完成。`);
}

function exchange(id) {
  const recipe = recipes.find((r) => r.id === id);
  if (!recipe || (save.souvenirs[id] || 0) <= 0) return;
  save.souvenirs[id] -= 1;
  save.points += recipe.points;
  save.redeemed.push(`${recipe.name} -> 公益点 +${recipe.points}`);
  saveGame();
  showExchange();
  toast("普通纪念品兑换完成。");
}

function exchangePrint(id) {
  const reward = printRewards.find((r) => r.id === id);
  if (!reward) return;
  if (!canAfford(reward.cost)) return toast("打印碎片不足，挑战 Boss 可获得。");
  consume(reward.cost);
  save.printTickets[id] = (save.printTickets[id] || 0) + 1;
  save.points += reward.points;
  save.redeemed.push(`${reward.name} -> 3D 打印券 +1`);
  saveGame();
  showExchange();
  toast("3D 废物打印兑换券已生成。");
}

function unlockBg(id) {
  const bg = backgrounds.find((b) => b.id === id);
  if (!bg || save.unlockedBackgrounds.includes(id)) return;
  if (!canAfford(bg.cost)) return toast("解锁背景的碎片不足。");
  consume(bg.cost);
  save.unlockedBackgrounds.push(id);
  save.currentBackground = id;
  saveGame();
  showBackgrounds();
  toast(`${bg.name} 已解锁并切换。`);
}

function selectBg(id) {
  if (!save.unlockedBackgrounds.includes(id)) return;
  save.currentBackground = id;
  saveGame();
  showBackgrounds();
  toast("主页背景已切换。");
}

function canAfford(cost) {
  return Object.entries(cost || {}).every(([key, val]) => getResource(key) >= val);
}

function consume(cost) {
  for (const [key, val] of Object.entries(cost || {})) {
    if (key === "printShard") save.printShard -= val;
    else save.scraps[key] -= val;
  }
}

function addReward(reward) {
  for (const [key, val] of Object.entries(reward || {})) {
    if (key === "printShard") save.printShard += val;
    else save.scraps[key] = (save.scraps[key] || 0) + val;
  }
}

function getResource(key) {
  if (key === "printShard") return save.printShard || 0;
  return save.scraps[key] || 0;
}

function costHtml(cost, label = "") {
  return Object.entries(cost || {})
    .map(([key, val]) => `<span class="cost">${label ? `${label}: ` : ""}${resourceName(key)} ×${val}</span>`)
    .join("");
}

function resourceName(key) {
  if (key === "printShard") return "打印碎片";
  return scrapTypes.find((s) => s[0] === key)?.[1] || key;
}

function slotName(slot) {
  return { weapon: "武器", helmet: "头盔", armor: "护甲", boots: "靴子" }[slot] || slot;
}

function showModal(html, bgKey = "bgHub") {
  state.paused = true;
  modal.innerHTML = html;
  const bg = imagePaths[bgKey] || imagePaths.bgHub;
  modal.style.backgroundImage = `linear-gradient(135deg, rgba(247,255,238,0.97), rgba(222,255,240,0.94)), url("${bg}")`;
  modal.classList.remove("hidden");
}

function closeModal() {
  state.paused = false;
  modal.classList.add("hidden");
  modal.innerHTML = "";
}

function modalOpen() {
  return !modal.classList.contains("hidden");
}

function updateHud() {
  hpText.textContent = `HP ${Math.ceil(player.hp)}/${player.maxHp}`;
  if (hpFill) hpFill.style.width = `${clamp(player.hp / player.maxHp, 0, 1) * 100}%`;
  shieldText.textContent = `护盾 ${Math.ceil(player.shield)}/90`;
  if (shieldFill) shieldFill.style.width = `${clamp(player.shield / 90, 0, 1) * 100}%`;
  pointText.textContent = `公益点 ${save.points}`;
  printText.textContent = `打印碎片 ${save.printShard}`;
  scrapRow.innerHTML = scrapTypes
    .map(([id, name, img]) => `<span class="scrap-chip"><img src="${imagePaths[img]}" alt="" />${name} ${save.scraps[id] || 0}</span>`)
    .join("");
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  if (!assetsReady) return drawLoading();
  if (state.scene === "title") {
    drawBg(imgs.bgHub);
    return;
  }
  if (state.scene === "hub") drawHub();
  if (state.scene === "battle") drawBattle();
  if (state.scene === "boss") drawBossBattle();
  if (state.scene === "horde") drawHorde();
  if (state.scene === "puzzle") drawPuzzle();
  drawPrompt();
}

function drawLoading() {
  ctx.fillStyle = "#dff7ff";
  ctx.fillRect(0, 0, W, H);
  drawGameText("正在整理回收站素材...", 420, 350, 34, "#10232d");
}

function currentHubBg() {
  const bg = backgrounds.find((b) => b.id === save.currentBackground) || backgrounds[0];
  return imgs[bg.img] || imgs.bgHub;
}

function drawHub() {
  drawBg(currentHubBg());
  drawWalkableGlow();
  for (const f of hubFacilities) drawFacility(f);
  drawPlayer();
  if (state.nearby) drawMarker(state.nearby.x, state.nearby.y - state.nearby.h / 2 - 18, "Enter");
}

function drawBattle() {
  drawBg(state.battleMap === "lab" ? imgs.bgLab : imgs.bgArena);
  drawArenaBounds("#ffd861");
  for (const obstacle of state.obstacles) drawObstacle(obstacle);
  for (const trap of state.traps) drawTrap(trap);
  drawPickupsAndCombat();
  if (state.battlePortal) drawBattlePortal();
  for (const enemy of state.enemies) drawEnemy(enemy);
  drawPlayer();
}

function drawHorde() {
  drawBattle();
  ctx.save();
  ctx.fillStyle = "rgba(9, 27, 38, 0.78)";
  ctx.strokeStyle = "#ffd861";
  ctx.lineWidth = 3;
  roundedRect(470, 170, 340, 54, 8, true);
  roundedRect(470, 170, 340, 54, 8, false);
  drawGameText(`尸潮 ${Math.ceil(state.hordeTime)}s  击败 ${state.hordeKills}/36`, 492, 205, 22, "#f7fff1", false);
  ctx.restore();
}

function drawPuzzle() {
  drawBg(imgs.bgLab);
  drawArenaBounds("#75ff9f");
  for (const obstacle of state.obstacles) drawObstacle(obstacle);
  drawPickupsAndCombat();
  const puzzle = state.puzzle;
  if (puzzle) {
    for (const station of puzzle.stations) drawPuzzleStation(station, station.id === puzzle.order[puzzle.step]);
    drawPuzzleHud(puzzle);
  }
  drawPlayer();
}

function drawPuzzleStation(station, active) {
  drawSprite(imgs[station.img], station.x, station.y, active ? 84 : 72, active ? 84 : 72);
  ctx.save();
  ctx.strokeStyle = active ? "#ffd861" : "rgba(117,255,159,0.55)";
  ctx.lineWidth = active ? 5 : 3;
  ctx.beginPath();
  ctx.arc(station.x, station.y, active ? 56 : 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  if (distance(player, station) < 86) drawMarker(station.x, station.y - 70, "Enter");
}

function drawPuzzleHud(puzzle) {
  const next = puzzle.order[puzzle.step];
  ctx.save();
  ctx.fillStyle = "rgba(9, 27, 38, 0.8)";
  ctx.strokeStyle = "#75ff9f";
  ctx.lineWidth = 3;
  roundedRect(390, 170, 500, 58, 8, true);
  roundedRect(390, 170, 500, 58, 8, false);
  drawGameText(`解密 ${puzzle.step + 1}/${puzzle.order.length}: ${resourceName(next)}  携带 ${puzzle.held[next] || 0}`, 416, 208, 22, "#f7fff1", false);
  ctx.restore();
}

function drawBossBattle() {
  drawBg(imgs.bgMarket);
  ctx.fillStyle = "rgba(6, 20, 31, 0.28)";
  ctx.fillRect(0, 0, W, H);
  drawArenaBounds("#30e4e0");
  drawBossFloor();
  for (const obstacle of state.obstacles) drawObstacle(obstacle);
  drawPickupsAndCombat();
  for (const enemy of state.enemies) drawEnemy(enemy);
  if (state.boss) drawBoss(state.boss);
  if (state.battlePortal) drawBattlePortal();
  drawPlayer();
  if (state.boss && !state.boss.defeated) drawBossHud(state.boss);
  drawBossDamageFloaters();
}

function drawPickupsAndCombat() {
  for (const pickup of state.pickups) drawPickup(pickup);
  for (const shot of state.enemyShots) drawEnemyShot(shot);
  for (const wave of state.shockwaves) drawShockwave(wave);
  for (const projectile of state.projectiles) drawProjectile(projectile);
  for (const attack of state.attacks) drawAttack(attack);
}

function drawBg(img) {
  ctx.fillStyle = "#c9eddc";
  ctx.fillRect(0, 0, W, H);
  if (!img) return;
  const scale = Math.max(W / img.width, H / img.height);
  const sw = W / scale;
  const sh = H / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, 0, W, H);
}

function drawWalkableGlow() {
  ctx.fillStyle = "rgba(229,255,240,0.36)";
  roundedRect(86, 256, 1096, 382, 18, true);
}

function drawArenaBounds(color) {
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 68, W - 88, H - 104);
  ctx.globalAlpha = 1;
}

function drawBossFloor() {
  ctx.save();
  ctx.translate(840, 365);
  for (let i = 0; i < 4; i += 1) {
    ctx.strokeStyle = i % 2 ? "rgba(48,228,224,0.28)" : "rgba(70,213,122,0.32)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 108 + i * 42 + Math.sin(performance.now() / 420) * 8, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFacility(f) {
  drawSprite(imgs[f.img], f.x, f.y, f.w, f.h);
}

function drawObstacle(o) {
  ctx.fillStyle = "rgba(15, 35, 45, 0.22)";
  ctx.fillRect(o.x, o.y, o.w, o.h);
  ctx.strokeStyle = "rgba(255,216,97,0.86)";
  ctx.lineWidth = 3;
  ctx.strokeRect(o.x, o.y, o.w, o.h);
}

function drawTrap(t) {
  drawSprite(imgs[t.img], t.x, t.y, t.w, t.h);
  if (t.cd > 0) {
    ctx.fillStyle = "rgba(240,82,95,0.24)";
    const r = trapRect(t);
    ctx.fillRect(r.x, r.y, r.w, r.h);
  }
}

function drawPickup(p) {
  const y = p.y + Math.sin(performance.now() / 240 + p.bob) * 5;
  drawSprite(imgs[p.img], p.x, y, p.kind === "buff" ? 42 : 36, p.kind === "buff" ? 42 : 36);
}

function drawBattlePortal() {
  const idx = Math.floor(performance.now() / 120) % 8;
  drawSprite(imgs[`portal${idx}`], state.battlePortal.x, state.battlePortal.y, 128, 128);
}

function drawEnemy(enemy) {
  if (enemy.hitCd > 0) ctx.globalAlpha = 0.72;
  drawSprite(imgs[enemy.img], enemy.x, enemy.y, enemy.w, enemy.h);
  ctx.globalAlpha = 1;
  drawBar(enemy.x - 34, enemy.y - enemy.h / 2 - 14, 68, 8, enemy.hp / enemy.maxHp, "#f0525f");
}

function drawBoss(boss) {
  const pulse = Math.sin(performance.now() / 180) * 7;
  if (boss.hitCd > 0) ctx.globalAlpha = 0.7;
  drawSprite(imgs.bossCat, boss.x, boss.y + pulse * 0.2, boss.w, boss.h);
  ctx.globalAlpha = 1;
}

function drawBossHud(boss) {
  const pct = clamp(boss.hp / boss.maxHp, 0, 1);
  const portraitUi = canvas.clientHeight > canvas.clientWidth * 1.3;
  const w = 590;
  const h = 54;
  const x = W / 2 - w / 2;
  const y = portraitUi ? 416 : 478;
  ctx.save();
  ctx.fillStyle = "rgba(9, 27, 38, 0.86)";
  ctx.strokeStyle = "#f7fff1";
  ctx.lineWidth = 3;
  roundedRect(x, y, w, h, 8, true);
  roundedRect(x, y, w, h, 8, false);
  drawGameText(`${boss.name}  Phase ${boss.phase}  ${Math.ceil(pct * 100)}%`, x + 18, y + 22, 18, "#f7fff1", false);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  roundedRect(x + 18, y + 30, w - 36, 14, 5, true);
  const grd = ctx.createLinearGradient(x + 18, y, x + w - 18, y);
  grd.addColorStop(0, boss.phase >= 3 ? "#f0525f" : "#30e4e0");
  grd.addColorStop(1, boss.phase >= 3 ? "#ffd861" : "#75ff9f");
  ctx.fillStyle = grd;
  roundedRect(x + 18, y + 30, (w - 36) * pct, 14, 5, true);
  ctx.restore();
}

function drawBossDamageFloaters() {
  for (const floater of state.bossDamageFloaters) {
    ctx.globalAlpha = clamp(floater.ttl / 0.72, 0, 1);
    drawGameText(`-${floater.value}`, floater.x, floater.y, 22, "#ffd861");
    ctx.globalAlpha = 1;
  }
}

function drawEnemyShot(shot) {
  ctx.fillStyle = "#33f1ff";
  ctx.strokeStyle = "#10232d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(shot.x, shot.y, shot.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawShockwave(wave) {
  ctx.strokeStyle = "rgba(255,216,97,0.8)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawProjectile(p) {
  ctx.fillStyle = "#75ff9f";
  ctx.strokeStyle = "#10232d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawAttack(a) {
  if (a.type === "circle" || a.type === "muzzle") {
    ctx.strokeStyle = a.type === "muzzle" ? "rgba(117,255,159,0.9)" : "rgba(48,228,224,0.9)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.r * (0.8 + a.ttl), 0, Math.PI * 2);
    ctx.stroke();
  }
  if (a.type === "slash") {
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(Math.atan2(a.ny, a.nx));
    const grd = ctx.createLinearGradient(-20, -45, 130, 45);
    grd.addColorStop(0, "rgba(255,255,255,0)");
    grd.addColorStop(0.35, "rgba(255,216,97,0.92)");
    grd.addColorStop(1, "rgba(48,228,224,0.62)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(-24, -54);
    ctx.quadraticCurveTo(102, -74, 150, 0);
    ctx.quadraticCurveTo(102, 74, -24, 54);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawPlayer() {
  let img = imgs.heroFront;
  const moving = Boolean(movementVector().dx || movementVector().dy);
  if (player.dir === "up") img = moving ? (Math.floor(player.frame * 8) % 2 ? imgs.heroWalkBack1 : imgs.heroWalkBack2) : imgs.heroBack;
  if (player.dir === "down") img = moving ? (Math.floor(player.frame * 8) % 2 ? imgs.heroWalkFront1 : imgs.heroWalkFront2) : imgs.heroFront;
  if (player.dir === "right" || player.dir === "left") img = Math.floor(player.frame * 8) % 2 ? imgs.heroWalkRight1 : imgs.heroWalkRight2;
  if (player.hurtCd > 0 && Math.floor(player.hurtCd * 20) % 2 === 0) ctx.globalAlpha = 0.5;
  ctx.save();
  if (player.dir === "left") {
    ctx.translate(player.x, player.y);
    ctx.scale(-1, 1);
    drawSprite(img, 0, 0, 58, 64);
  } else {
    drawSprite(img, player.x, player.y, 58, 64);
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  drawPlayerEquipment();
  const weapon = getEquip(save.equipped.weapon);
  if (weapon) drawSprite(imgs[weapon.img], player.x + 34, player.y + 12, 32, 32);
  drawBar(player.x - 36, player.y - 48, 72, 8, player.hp / player.maxHp, "#46d57a");
}

function drawPlayerEquipment() {
  const helmet = getEquip(save.equipped.helmet);
  const armor = getEquip(save.equipped.armor);
  const boots = getEquip(save.equipped.boots);
  if (armor) {
    ctx.globalAlpha = 0.82;
    drawSprite(imgs[armor.img], player.x, player.y + 6, 34, 26);
  }
  if (helmet) {
    ctx.globalAlpha = 0.9;
    drawSprite(imgs[helmet.img], player.x, player.y - 22, 30, 24);
  }
  if (boots) {
    ctx.globalAlpha = 0.86;
    drawSprite(imgs[boots.img], player.x, player.y + 28, 32, 18);
  }
  ctx.globalAlpha = 1;
}

function drawSprite(img, x, y, w, h) {
  if (!img) return;
  ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
}

function drawPrompt() {
  const text = state.prompt || "WASD 移动 · Enter 互动";
  const portraitUi = canvas.clientHeight > canvas.clientWidth * 1.3;
  const y = portraitUi ? H - 178 : H - 58;
  ctx.save();
  ctx.font = "950 20px 'Microsoft YaHei UI', sans-serif";
  const pad = 18;
  const width = Math.min(980, ctx.measureText(text).width + pad * 2);
  const x = W / 2 - width / 2;
  const grd = ctx.createLinearGradient(x, y, x + width, y + 40);
  grd.addColorStop(0, "rgba(250,255,238,0.95)");
  grd.addColorStop(1, "rgba(207,250,255,0.95)");
  ctx.fillStyle = grd;
  ctx.strokeStyle = "#10232d";
  ctx.lineWidth = 4;
  roundedRect(x, y, width, 42, 8, true);
  roundedRect(x, y, width, 42, 8, false);
  drawGameText(text, x + pad, y + 28, 20, "#10232d", false);
  ctx.restore();
}

function drawGameText(text, x, y, size, color, shadow = true) {
  ctx.save();
  ctx.font = `950 ${size}px 'Microsoft YaHei UI', 'PingFang SC', sans-serif`;
  if (shadow) {
    ctx.fillStyle = "rgba(48,228,224,0.6)";
    ctx.fillText(text, x + 2, y + 2);
  }
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawMarker(x, y, text) {
  ctx.save();
  ctx.font = "950 18px 'Microsoft YaHei UI', sans-serif";
  const width = ctx.measureText(text).width + 24;
  ctx.fillStyle = "#ffd861";
  ctx.strokeStyle = "#10232d";
  ctx.lineWidth = 4;
  roundedRect(x - width / 2, y - 18, width, 34, 6, true);
  roundedRect(x - width / 2, y - 18, width, 34, 6, false);
  ctx.fillStyle = "#10232d";
  ctx.fillText(text, x - width / 2 + 12, y + 6);
  ctx.restore();
}

function drawBar(x, y, w, h, pct, color) {
  ctx.fillStyle = "#10232d";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(x + 2, y + 2, Math.max(0, w - 4) * clamp(pct, 0, 1), h - 4);
}

function roundedRect(x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  if (fill) ctx.fill();
  else ctx.stroke();
}

function entityRect(e) {
  return { x: e.x - e.w * 0.36, y: e.y - e.h * 0.22, w: e.w * 0.72, h: e.h * 0.52 };
}

function bossRect(b) {
  return { x: b.x - b.w * 0.34, y: b.y - b.h * 0.34, w: b.w * 0.68, h: b.h * 0.68 };
}

function trapRect(t) {
  return { x: t.x - t.w * 0.38, y: t.y - t.h * 0.28, w: t.w * 0.76, h: t.h * 0.56 };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function circleHitsRect(c, r) {
  const nx = clamp(c.x, r.x, r.x + r.w);
  const ny = clamp(c.y, r.y, r.y + r.h);
  return Math.hypot(c.x - nx, c.y - ny) <= c.r;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function randomKey(obj) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  state.toastTimer = 2.7;
}

function loop(now) {
  const dt = Math.min(0.033, (now - state.last) / 1000 || 0);
  state.last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function bindEvents() {
  document.getElementById("startBtn").addEventListener("click", startNew);
  document.getElementById("continueBtn").addEventListener("click", continueGame);
  document.getElementById("resetBtn").addEventListener("click", () => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem("green-loop-quest-save-v1");
    save = defaultSave();
    toast("存档已重置。");
  });

  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    state.keys.add(key);
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) e.preventDefault();
    if (e.repeat) return;
    if (key === "enter") interact();
    if (key === " ") triggerAttack();
    if (key === "e" && state.scene !== "title") showInventory();
    if (key === "c" && state.scene !== "title") showCraft();
    if (key === "x" && state.scene !== "title") showExchange();
    if (key === "b" && state.scene !== "title") showBackgrounds();
    if (key === "m" && state.scene !== "title") showMissions();
    if (key === "escape") {
      if (modalOpen()) closeModal();
      else if (state.scene === "battle" || state.scene === "boss" || state.scene === "horde" || state.scene === "puzzle") enterHub("已退出关卡，角色已回到主页安全区。");
    }
    if (key === "n") nextWave();
  });

  window.addEventListener("keyup", (e) => state.keys.delete(e.key.toLowerCase()));
  canvas.addEventListener("mousemove", (e) => (state.mouse = canvasPoint(e)));
  canvas.addEventListener("click", (e) => {
    const p = canvasPoint(e);
    state.mouse = p;
    player.faceX = p.x - player.x;
    player.faceY = p.y - player.y;
    if (state.scene === "hub") {
      const target = hubFacilities.find((f) => Math.abs(p.x - f.x) < f.w / 2 && Math.abs(p.y - f.y) < f.h / 2);
      if (target) return target.action();
    }
    triggerAttack();
  });

  modal.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (action === "close") closeModal();
    if (action === "startMob") startBattle();
    if (action === "startBoss") startBoss();
    if (action === "startHorde") startHorde();
    if (action === "startPuzzle") startPuzzle();
    if (action === "unlock") tryUnlock(id);
    if (action === "equip") equip(id);
    if (action === "unequip") unequip(button.dataset.slot);
    if (action === "craft") craft(id);
    if (action === "exchange") exchange(id);
    if (action === "exchangePrint") exchangePrint(id);
    if (action === "unlockBg") unlockBg(id);
    if (action === "selectBg") selectBg(id);
    if (action === "claim") claimMission(id);
  });

  document.querySelectorAll("[data-pad]").forEach((btn) => {
    const dir = btn.dataset.pad;
    btn.addEventListener("pointerdown", () => state.pad.add(dir));
    btn.addEventListener("pointerup", () => state.pad.delete(dir));
    btn.addEventListener("pointerleave", () => state.pad.delete(dir));
  });
  document.querySelector('[data-action="attack"]').addEventListener("click", triggerAttack);
  document.querySelector('[data-action="interact"]').addEventListener("click", interact);
}

function canvasPoint(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
}

bindEvents();
loadImages();
requestAnimationFrame(loop);
