    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const postFxCanvas = document.createElement('canvas');
    const postFxCtx = postFxCanvas.getContext('2d');
    const edgeFxCanvas = document.createElement('canvas');
    const edgeFxCtx = edgeFxCanvas.getContext('2d');

    const ui = {
      points: document.getElementById('points'),
      lives: document.getElementById('lives'),
      wave: document.getElementById('wave'),
      waveBadge: document.getElementById('waveBadge'),
      aliveEnemies: document.getElementById('aliveEnemies'),
      earlyChip: document.getElementById('earlyChip'),
      earlyBonus: document.getElementById('earlyBonus'),
      defenseMenu: document.getElementById('defenseMenu'),
      defenseToggle: document.getElementById('defenseToggle'),
      buyMinigun: document.getElementById('buyMinigun'),
      buyMinigunMk2: document.getElementById('buyMinigunMk2'),
      buyCannon: document.getElementById('buyCannon'),
      buyFlamethrower: document.getElementById('buyFlamethrower'),
      buyMine: document.getElementById('buyMine'),
      buyPlaceholder: document.getElementById('buyPlaceholder'),
      playWaveBtn: document.getElementById('playWaveBtn'),
      resetBtn: document.getElementById('resetBtn'),
      selectionHud: document.getElementById('selectionHud'),
      selectedInfo: document.getElementById('selectedInfo'),
      upgradeBtn: document.getElementById('upgradeBtn'),
      upgradeRangeBtn: document.getElementById('upgradeRangeBtn'),
      upgradeRateBtn: document.getElementById('upgradeRateBtn'),
      upgradeDamageBtn: document.getElementById('upgradeDamageBtn'),
      toast: document.getElementById('toast'),
    };

    const MAP_WIDTH = 2048;
    const MAP_HEIGHT = 1155;
    const GOAL = { x: 896, y: 402, radius: 24 };

    const SHARED_RED_PATH = [
      { x: 1036, y: 529 },
      { x: 1022, y: 592 },
      { x: 999, y: 662 },
      { x: 968, y: 726 },
      { x: 928, y: 783 },
      { x: 878, y: 826 },
      { x: 820, y: 848 },
      { x: 760, y: 848 },
      { x: 708, y: 832 },
      { x: 670, y: 794 },
      { x: 658, y: 738 },
      { x: 676, y: 676 },
      { x: 716, y: 616 },
      { x: 770, y: 564 },
      { x: 812, y: 528 },
      { x: 778, y: 494 },
      { x: 724, y: 466 },
      { x: 660, y: 444 },
      { x: 592, y: 424 },
      { x: 538, y: 410 },
      { x: 616, y: 404 },
      { x: 704, y: 402 },
      { x: 800, y: 401 },
      { x: 874, y: 401 },
      { x: GOAL.x, y: GOAL.y }
    ];

    const SHARED_RED_PATH_FROM_LOWER = SHARED_RED_PATH.slice(2);

    const PATH_VARIANTS = {
      A_main: [
        { x: 833, y: 139 },
        { x: 858, y: 195 },
        { x: 908, y: 274 },
        { x: 961, y: 355 },
        { x: 1002, y: 433 },
        ...SHARED_RED_PATH
      ],
      B_main: [
        { x: 2047, y: 205 },
        { x: 1948, y: 264 },
        { x: 1804, y: 282 },
        { x: 1660, y: 314 },
        { x: 1514, y: 350 },
        { x: 1368, y: 392 },
        { x: 1226, y: 432 },
        { x: 1112, y: 468 },
        ...SHARED_RED_PATH
      ],
      B_upper: [
        { x: 2047, y: 205 },
        { x: 1948, y: 264 },
        { x: 1804, y: 282 },
        { x: 1660, y: 314 },
        { x: 1514, y: 350 },
        { x: 1368, y: 392 },
        { x: 1260, y: 426 },
        { x: 1180, y: 432 },
        { x: 1098, y: 446 },
        ...SHARED_RED_PATH
      ],
      A_loop: [
        { x: 833, y: 139 },
        { x: 858, y: 195 },
        { x: 908, y: 274 },
        { x: 961, y: 355 },
        { x: 1002, y: 433 },
        ...SHARED_RED_PATH
      ],
      B_loop: [
        { x: 2047, y: 205 },
        { x: 1948, y: 264 },
        { x: 1804, y: 282 },
        { x: 1660, y: 314 },
        { x: 1514, y: 350 },
        { x: 1368, y: 392 },
        { x: 1226, y: 432 },
        { x: 1112, y: 468 },
        ...SHARED_RED_PATH
      ],
      B_lower: [
        { x: 2047, y: 205 },
        { x: 1948, y: 264 },
        { x: 1804, y: 282 },
        { x: 1660, y: 314 },
        { x: 1514, y: 350 },
        { x: 1368, y: 392 },
        { x: 1226, y: 432 },
        { x: 1112, y: 468 },
        { x: 1036, y: 529 },
        { x: 995, y: 612 },
        { x: 964, y: 712 },
        ...SHARED_RED_PATH_FROM_LOWER
      ],
      P_upper: [
        { x: 1498, y: 384 },
        { x: 1384, y: 405 },
        { x: 1268, y: 420 },
        { x: 1162, y: 436 },
        { x: 1088, y: 458 },
        { x: 1036, y: 529 },
        ...SHARED_RED_PATH.slice(1)
      ],
      P_lower: [
        { x: 1494, y: 712 },
        { x: 1362, y: 708 },
        { x: 1236, y: 714 },
        { x: 1106, y: 726 },
        { x: 984, y: 734 },
        { x: 904, y: 716 },
        { x: 822, y: 676 },
        { x: 778, y: 610 },
        { x: 808, y: 556 },
        { x: 1036, y: 529 },
        ...SHARED_RED_PATH.slice(1)
      ]
    };

    const placementMaskCanvas = document.createElement('canvas');
    const placementMaskCtx = placementMaskCanvas.getContext('2d', { willReadFrequently: true });
    let placementMaskPixels = null;

    const towerDefs = {
      minigun: {
        name: 'Minigun',
        cost: 120,
        baseRange: 170,
        baseFireRate: 0.14,
        baseDamage: 7,
        projectileSpeed: 580,
        color: '#60a5fa',
        upgradeBase: 90,
      },
      minigunMk2: {
        name: 'Minigun Mk2',
        cost: 145,
        baseRange: 165,
        baseFireRate: 0.14,
        baseDamage: 7,
        projectileSpeed: 580,
        color: '#93c5fd',
        upgradeBase: 95,
      },
      cannon: {
        name: 'Cannon',
        cost: 160,
        baseRange: 185,
        baseFireRate: 1.15,
        baseDamage: 28,
        projectileSpeed: 340,
        splashRadius: 72,
        color: '#f59e0b',
        upgradeBase: 110,
      },
      flamethrower: {
        name: 'Flamethrower',
        cost: 150,
        baseRange: 132,
        baseFireRate: 0.16,
        baseDamage: 4,
        flameAngle: Math.PI / 4.5,
        burnTime: 1.5,
        color: '#f97316',
        upgradeBase: 105,
      },
      mine: {
        name: 'Mine',
        cost: 75,
        baseRange: 0,
        baseFireRate: 0,
        baseDamage: 85,
        splashRadius: 66,
        triggerRadius: 30,
        color: '#eab308',
        upgradeBase: 60,
      },
    };

    const wallDefs = {
      name: 'Barricade',
      segmentLength: 48,
      straightCost: 18,
      gateCost: 34,
      maxSegmentCount: 18,
      straightHp: 120,
      gateHp: 210,
      thickness: 16,
    };

    const state = {
      points: 400,
      lives: 20,
      wave: 0,
      aliveEnemies: 0,
      towers: [],
      enemies: [],
      projectiles: [],
      effects: [],
      decals: [],
      enemyGhosts: [],
      walls: [],
      heldTower: null,
      wallDraft: null,
      selectedTowerId: null,
      spawnQueue: [],
      currentWaveRunning: false,
      earlyStartedThisWave: false,
      lastEarlyBonus: 0,
      gameOver: false,
      nextTowerId: 1,
      nextWallId: 1,
      nextWallChainId: 1,
      mouseScreen: { x: 0, y: 0 },
      mouseWorld: { x: 0, y: 0 },
      camera: { x: 1040, y: 470, zoom: 0.9, targetZoom: 0.9 },
      cameraPan: { x: 0, y: 0 },
      dragCamera: { active: false, startX: 0, startY: 0, camX: 0, camY: 0 },
      keys: {},
      uiHover: false,
      lastWavePulse: 0,
      radialMenuOpen: false,
      upgradeMenuOpen: false,
      selectionUiBounds: null,
      towerRadius: 24,
      pathHalfWidth: 26,
      mineRadius: 18,
      cannonGroundHitCounter: 0,
      nextCannonGroundHitAt: 3,
      nextEnemyDeathVariant: 0,
    };

    const bgImage = new Image();
    bgImage.onerror = () => console.error('Background image failed to load');
    bgImage.src = './assets/map.png';

    const ASSETS = {
      placementMask: './assets/placement-mask.jpg',
      sprites: {
        turret: './assets/sprites/turret.png',
        muzzle: './assets/sprites/muzzle.png',
        shellCasings: './assets/sprites/shell-casings.png',
        minigunFireLeft: './assets/sprites/minigun-fire-left.png',
        minigunSmokeTurn: './assets/sprites/minigun-smoke-turn.png',
        minigunReturn: './assets/sprites/minigun-return.png',
        cannonImpact: './assets/effects/cannon-impact-sheet.png',
        groundFlame: './assets/effects/ground-flame-sheet.png',
        groundFlameAlt: './assets/effects/ground-flame-alt-sheet.png',
        barricade: './assets/sprites/barricade.png',
      },
      mk2: {
        placement: './assets/mk2/placement',
        rotationDry: './assets/mk2/rotation-dry',
        rotationBackDry: './assets/mk2/rotation-back-dry',
        fireStartLeft: './assets/mk2/fire-start-left',
        fireLoopLeft: './assets/mk2/fire-loop-left',
        fireTurnLeftToMid: './assets/mk2/fire-turn-left-to-mid',
        fireLoopCenter: './assets/mk2/fire-loop-center',
        fireLoopRightMid: './assets/mk2/fire-loop-right-mid',
        fireTurnRightMidToRight: './assets/mk2/fire-turn-right-mid-to-right',
        fireLoopRight: './assets/mk2/fire-loop-right',
        fireEndLeftSmoke: './assets/mk2/fire-end-left-smoke',
        returnLeftAfterFiring: './assets/mk2/return-left-after-firing',
      },
      effects: {
        cannonHit: './assets/effects/cannon-hit',
        bulletHitSingle: './assets/effects/bullet-hit-single',
        bulletHits: './assets/effects/bullet-hits',
      },
      enemies: {
        woodwalker: {
          walkLeft: './assets/enemies/woodwalker/walk-left',
          walkTurn: './assets/enemies/woodwalker/walk-turn',
          walkFront: './assets/enemies/woodwalker/walk-front',
          death1: './assets/enemies/woodwalker/death-1',
          death2: './assets/enemies/woodwalker/death-2',
          deathExplosion: './assets/enemies/woodwalker/death-explosion',
        },
      },
    };

    function toAssetSrc(path) {
      return path;
    }

    const placementMaskImage = new Image();
    placementMaskImage.decoding = 'async';
    placementMaskImage.onerror = () => console.error('Placement mask failed to load');
    placementMaskImage.onload = () => {
      placementMaskCanvas.width = MAP_WIDTH;
      placementMaskCanvas.height = MAP_HEIGHT;
      placementMaskCtx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      placementMaskCtx.drawImage(placementMaskImage, 0, 0, MAP_WIDTH, MAP_HEIGHT);
      placementMaskPixels = placementMaskCtx.getImageData(0, 0, MAP_WIDTH, MAP_HEIGHT).data;
    };
    placementMaskImage.src = toAssetSrc(ASSETS.placementMask);

    function loadSpriteSheet(path, cols, rows) {
      const img = new Image();
      img.decoding = 'async';
      img.src = toAssetSrc(path);
      return { img, cols, rows };
    }

    const turretSpriteTypes = new Set(['minigun', 'cannon']);
    const sequencedTurretTypes = new Set(['minigunMk2']);
    const TURRET_PLACE_DURATION = 0.46;
    const TURRET_PLACE_FRAMES = [0, 1, 2, 3, 4];
    const TURRET_AIM_FRAMES = [4, 5, 6, 7, 8, 9, 10, 11];
    const TURRET_SPRITE_SIZE = 68;
    const TURRET_PIVOT = { x: 0.5, y: 0.78 };
    const TURRET_MUZZLE_LENGTH = 44;
    const TURRET_MUZZLE_LIFT = 17;
    const MINIGUN_FIRE_VISUAL_HOLD = 0.13;
    const MINIGUN_SMOKE_DURATION = 3.0;
    const MK2_ARC_LEFT = Math.PI * 0.9305555556;
    const MK2_ARC_RIGHT = Math.PI * 0.0694444444;
    const MK2_ARC_SPAN = MK2_ARC_LEFT - MK2_ARC_RIGHT;
    const MK2_TRACK_SPEED = 0.52;
    const MK2_IDLE_RETURN_SPEED = 0.34;
    const UPGRADE_LOCK_WAVES = [20, 50, 100];
    const MK2_FIRE_ENTRY_FRAME = {
      fireStartLeft: 2,
      fireTurnLeftToMid: 1,
      fireLoopCenter: 0,
      fireLoopRightMid: 1,
      fireTurnRightMidToRight: 1,
      fireLoopRight: 0,
    };

    function loadSequenceFrame(path) {
      const img = new Image();
      img.decoding = 'async';
      img.src = toAssetSrc(path);
      return img;
    }

    function loadFrameSequence(baseDir, prefix, frameIds) {
      return frameIds.map(id => loadSequenceFrame(`${baseDir}/${prefix}${String(id).padStart(5, '0')}.png`));
    }

    function drawSequenceFrame(frames, frameIndex, dx, dy, dw, dh, alpha = 1, blendMode = 'source-over') {
      const img = frames[Math.max(0, Math.min(frames.length - 1, frameIndex))];
      if (!img?.complete || !img.naturalWidth) return;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = blendMode;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    }

    function drawSequenceFrameExt(frames, frameIndex, dx, dy, dw, dh, options = {}) {
      const img = frames[Math.max(0, Math.min(frames.length - 1, frameIndex))];
      if (!img?.complete || !img.naturalWidth) return;
      const {
        alpha = 1,
        blendMode = 'source-over',
        flipX = false,
      } = options;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = blendMode;
      ctx.translate(dx + (flipX ? dw : 0), dy);
      ctx.scale(flipX ? -1 : 1, 1);
      ctx.drawImage(img, 0, 0, dw, dh);
      ctx.restore();
    }

    const spriteSheets = {
      turret: loadSpriteSheet(ASSETS.sprites.turret, 4, 4),
      muzzle: loadSpriteSheet(ASSETS.sprites.muzzle, 4, 4),
      shellCasings: loadSpriteSheet(ASSETS.sprites.shellCasings, 4, 4),
      minigunFireLeft: loadSpriteSheet(ASSETS.sprites.minigunFireLeft, 4, 4),
      minigunSmokeTurn: loadSpriteSheet(ASSETS.sprites.minigunSmokeTurn, 4, 4),
      minigunReturn: loadSpriteSheet(ASSETS.sprites.minigunReturn, 4, 4),
      cannonImpact: loadSpriteSheet(ASSETS.sprites.cannonImpact, 4, 4),
      groundFlame: loadSpriteSheet(ASSETS.sprites.groundFlame, 1, 4),
      groundFlameAlt: loadSpriteSheet(ASSETS.sprites.groundFlameAlt, 6, 6),
      barricade: loadSpriteSheet(ASSETS.sprites.barricade, 1, 1),
    };

    const BARRICADE_SPRITES = {
      gate: { sx: 330, sy: 8, sw: 455, sh: 340 },
      straight: { sx: 8, sy: 342, sw: 782, sh: 316 },
    };

    const mk2Sequences = {
      placement: loadFrameSequence(
        ASSETS.mk2.placement,
        'Turret for game_',
        [0, 1, 2, 3, 4, 5, 6, 7, 8]
      ),
      dryLeftToRight: loadFrameSequence(
        ASSETS.mk2.rotationDry,
        'Turret for game_',
        [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      ),
      dryRightToLeft: loadFrameSequence(
        ASSETS.mk2.rotationBackDry,
        'Turret for game_',
        [30, 32, 34, 37, 40, 43, 45]
      ),
      fireStartLeft: loadFrameSequence(
        ASSETS.mk2.fireStartLeft,
        'Turret for game_',
        [144, 145, 146, 147, 148, 149, 150, 151]
      ),
      fireLoopLeft: loadFrameSequence(
        ASSETS.mk2.fireLoopLeft,
        '0 Degree Fire loop_',
        [152, 154, 156, 157, 159]
      ),
      fireTurnLeftToMid: loadFrameSequence(
        ASSETS.mk2.fireTurnLeftToMid,
        '0 degree to 20 turn while firing_',
        [208, 209, 210, 211, 212, 213, 214]
      ),
      fireLoopCenter: loadFrameSequence(
        ASSETS.mk2.fireLoopCenter,
        'Fire Center_',
        [215, 216, 217]
      ),
      fireLoopRightMid: loadFrameSequence(
        ASSETS.mk2.fireLoopRightMid,
        'Fire Third Quarter_',
        [218, 219, 220, 221]
      ),
      fireTurnRightMidToRight: loadFrameSequence(
        ASSETS.mk2.fireTurnRightMidToRight,
        'Turn to 4 quarter firing_',
        [221, 222, 223, 224, 225, 226]
      ),
      fireLoopRight: loadFrameSequence(
        ASSETS.mk2.fireLoopRight,
        '4 quarter fire loop_',
        [228, 230, 232, 234, 235, 237]
      ),
      fireEndLeftSmoke: loadFrameSequence(
        ASSETS.mk2.fireEndLeftSmoke,
        '0 Degree FIre end with smoke_',
        [178, 180, 182, 183, 185, 187, 188, 190, 192, 194, 195]
      ),
      returnLeftAfterFiring: loadFrameSequence(
        ASSETS.mk2.returnLeftAfterFiring,
        'Return Left After Firing_',
        [235, 237, 239, 240, 241, 243, 245, 247, 249, 250, 251, 253, 255, 257, 260, 263, 266, 270]
      ),
    };

    const cannonGroundHitFrames = loadFrameSequence(
      ASSETS.effects.cannonHit,
      'Cannon Hit_',
      [0, 1, 2, 3, 4, 5, 6, 8, 11, 15, 19, 24, 30, 36, 46]
    );

    const bulletHitSingleFrames = loadFrameSequence(
      ASSETS.effects.bulletHitSingle,
      'Bullet Hit 1 Game_',
      [2, 3, 4, 5, 7, 9, 10]
    );

    const bulletHitUpgradedFrames = loadFrameSequence(
      ASSETS.effects.bulletHits,
      'Turret Gun Bullet Hits_',
      [1, 2, 3, 4, 5, 7, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 54]
    );

    const WALKER_WALK_FRAME_IDS = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 32];
    const WALKER_DEATH_1_FRAME_IDS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 31, 34, 37, 39];
    const WALKER_DEATH_2_FRAME_IDS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 31];
    const WALKER_DEATH_EXPLOSION_FRAME_IDS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const WALKER_WALK_FPS = 12;
    const WALKER_DEATH_FPS = 20;
    const WALKER_EXPLOSION_DEATH_FPS = 18;
    const WALKER_SPRITE_HEIGHT = 100;
    const WALKER_SPRITE_PIVOT = { x: 0.52, y: 0.92 };

    const walkerSequences = {
      walkLeft: loadFrameSequence(
        ASSETS.enemies.woodwalker.walkLeft,
        'Walking left_',
        WALKER_WALK_FRAME_IDS
      ),
      walkTurn: loadFrameSequence(
        ASSETS.enemies.woodwalker.walkTurn,
        'Enemy Walking Turning_',
        WALKER_WALK_FRAME_IDS
      ),
      walkFront: loadFrameSequence(
        ASSETS.enemies.woodwalker.walkFront,
        'Enemy Walking Front_',
        WALKER_WALK_FRAME_IDS
      ),
      death1: loadFrameSequence(
        ASSETS.enemies.woodwalker.death1,
        'Death Anim_',
        WALKER_DEATH_1_FRAME_IDS
      ),
      death2: loadFrameSequence(
        ASSETS.enemies.woodwalker.death2,
        'Death Anim 2_',
        WALKER_DEATH_2_FRAME_IDS
      ),
      deathExplosion: loadFrameSequence(
        ASSETS.enemies.woodwalker.deathExplosion,
        'Death Anim 3_',
        WALKER_DEATH_EXPLOSION_FRAME_IDS
      ),
    };

    function getEnemyWalkSequence(enemy) {
      if (enemy.type !== 'walker') return null;
      if (enemy.facing === 'turnLeft' || enemy.facing === 'turnRight') return walkerSequences.walkTurn;
      if (enemy.facing === 'left' || enemy.facing === 'right') return walkerSequences.walkLeft;
      return walkerSequences.walkFront;
    }

    function getEnemyWalkFlipX(enemy) {
      return enemy.facing === 'right' || enemy.facing === 'turnRight';
    }

    function getEnemyDeathSequence(enemy) {
      if (enemy.type !== 'walker') return null;
      if (enemy.deathAnimName === 'explosion') return walkerSequences.deathExplosion;
      return enemy.deathAnimName === 'death2' ? walkerSequences.death2 : walkerSequences.death1;
    }

    function getEnemyDeathFlipX(enemy) {
      return enemy.type === 'walker' && (enemy.deathFacing === 'right' || enemy.deathFacing === 'turnRight');
    }

    function getWalkerDeathDuration(cause, sequenceName) {
      if (cause === 'explosion' || sequenceName === 'explosion') {
        return walkerSequences.deathExplosion.length / WALKER_EXPLOSION_DEATH_FPS;
      }
      return (sequenceName === 'death2' ? walkerSequences.death2.length : walkerSequences.death1.length) / WALKER_DEATH_FPS;
    }

    function getSheetFrameRect(sheet, frameIndex) {
      const totalFrames = sheet.cols * sheet.rows;
      const clampedIndex = ((frameIndex % totalFrames) + totalFrames) % totalFrames;
      const col = clampedIndex % sheet.cols;
      const row = Math.floor(clampedIndex / sheet.cols);
      const frameW = sheet.img.naturalWidth / sheet.cols;
      const frameH = sheet.img.naturalHeight / sheet.rows;
      return { sx: col * frameW, sy: row * frameH, sw: frameW, sh: frameH };
    }

    function drawSheetFrame(sheet, frameIndex, dx, dy, dw, dh, options = {}) {
      if (!sheet.img.complete || !sheet.img.naturalWidth) return;
      const { alpha = 1, blendMode = 'source-over' } = options;
      const frame = getSheetFrameRect(sheet, frameIndex);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = blendMode;
      ctx.drawImage(sheet.img, frame.sx, frame.sy, frame.sw, frame.sh, dx, dy, dw, dh);
      ctx.restore();
    }

    function drawSheetFrameRotated(sheet, frameIndex, cx, cy, dw, dh, rotation, options = {}) {
      if (!sheet.img.complete || !sheet.img.naturalWidth) return;
      const { alpha = 1, blendMode = 'source-over' } = options;
      const frame = getSheetFrameRect(sheet, frameIndex);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = blendMode;
      ctx.drawImage(sheet.img, frame.sx, frame.sy, frame.sw, frame.sh, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    }

    function getTurretIntroProgress(tower) {
      return Math.min(1, (tower.animTime || 0) / TURRET_PLACE_DURATION);
    }

    function getTurretFrameIndex(tower, held = false) {
      if (held) return 0;
      if (tower.spriteState === 'place') {
        const index = Math.min(
          TURRET_PLACE_FRAMES.length - 1,
          Math.floor(getTurretIntroProgress(tower) * TURRET_PLACE_FRAMES.length)
        );
        return TURRET_PLACE_FRAMES[index];
      }
      return tower.aimFrame ?? TURRET_AIM_FRAMES[Math.floor(TURRET_AIM_FRAMES.length / 2)];
    }

    function getTurretAimProgressForFrame(frameIndex) {
      const aimIndex = TURRET_AIM_FRAMES.indexOf(frameIndex);
      if (aimIndex >= 0 && TURRET_AIM_FRAMES.length > 1) {
        return aimIndex / (TURRET_AIM_FRAMES.length - 1);
      }
      return 0.5;
    }

    function getTurretFacingAngleForFrame(frameIndex) {
      const progress = getTurretAimProgressForFrame(frameIndex);
      return Math.PI - progress * Math.PI;
    }

    function getTurretPivotWorld(tower) {
      return { x: tower.x, y: tower.y - 6 };
    }

    function getTurretSpriteRect(screenX, screenY, size = TURRET_SPRITE_SIZE * state.camera.zoom) {
      return {
        x: screenX - size * TURRET_PIVOT.x,
        y: screenY - size * TURRET_PIVOT.y,
        size,
      };
    }

    function getSequenceSpriteRect(screenX, screenY, frames, height = TURRET_SPRITE_SIZE * state.camera.zoom) {
      const sample = frames?.find(img => img?.naturalWidth && img?.naturalHeight);
      const aspect = sample ? sample.naturalWidth / sample.naturalHeight : 1;
      const width = height * aspect;
      return {
        x: screenX - width * TURRET_PIVOT.x,
        y: screenY - height * TURRET_PIVOT.y,
        width,
        height,
      };
    }

    function getPivotedSequenceRect(screenX, screenY, frames, height, pivot) {
      const sample = frames?.find(img => img?.naturalWidth && img?.naturalHeight);
      const aspect = sample ? sample.naturalWidth / sample.naturalHeight : 1;
      const width = height * aspect;
      return {
        x: screenX - width * pivot.x,
        y: screenY - height * pivot.y,
        width,
        height,
      };
    }

    function getLoopedFrame(frames, time, fps) {
      return frames[Math.floor(time * fps) % frames.length];
    }

    function getMinigunAimBand(tower) {
      const progress = getFrontHemisphereAimProgress(tower.facing || Math.PI);
      if (progress <= 0.26) return 'left';
      if (progress >= 0.74) return 'right';
      return 'mid';
    }

    function getMappedFrame(frames, progress) {
      const idx = Math.min(frames.length - 1, Math.max(0, Math.round(progress * (frames.length - 1))));
      return frames[idx];
    }

    function getMinigunSpriteState(tower) {
      if (tower.spriteState === 'place') {
        return { sheet: spriteSheets.turret, frameIndex: getTurretFrameIndex(tower) };
      }
      const aimProgress = getFrontHemisphereAimProgress(tower.facing || Math.PI);
      const visualBand = tower.minigunVisualBand || getMinigunAimBand(tower);

      if (tower.minigunFireTimer > 0) {
        if (visualBand === 'left') {
          return {
            sheet: spriteSheets.minigunFireLeft,
            frameIndex: Math.floor((tower.minigunAnimTime || 0) * 22) % 16,
          };
        }
        if (visualBand === 'right') {
          return {
            sheet: spriteSheets.minigunReturn,
            frameIndex: getLoopedFrame([0, 1, 2, 3, 4], tower.minigunAnimTime || 0, 18),
          };
        }
        return {
          sheet: spriteSheets.minigunReturn,
          frameIndex: getLoopedFrame([1, 2, 3], tower.minigunAnimTime || 0, 18),
        };
      }

      if (tower.minigunSmokeTimer > 0) {
        if (visualBand === 'right') {
          return {
            sheet: spriteSheets.minigunSmokeTurn,
            frameIndex: getMappedFrame([10, 11, 12, 13, 14, 15], aimProgress),
          };
        }
        if (visualBand === 'mid') {
          return {
            sheet: spriteSheets.minigunSmokeTurn,
            frameIndex: getMappedFrame([6, 7, 8, 9, 10, 11], aimProgress),
          };
        }
        const smokeT = 1 - tower.minigunSmokeTimer / MINIGUN_SMOKE_DURATION;
        return {
          sheet: spriteSheets.minigunSmokeTurn,
          frameIndex: getMappedFrame([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], smokeT),
        };
      }

      return { sheet: spriteSheets.turret, frameIndex: getTurretFrameIndex(tower) };
    }

    function getTurretMuzzleWorld(tower, frameIndex = getTurretFrameIndex(tower)) {
      const pivot = getTurretPivotWorld(tower);
      const angle = getTurretFacingAngleForFrame(frameIndex);
      return {
        x: pivot.x + Math.cos(angle) * TURRET_MUZZLE_LENGTH,
        y: pivot.y + Math.sin(angle) * TURRET_MUZZLE_LENGTH - TURRET_MUZZLE_LIFT,
      };
    }

    function clampAngleToMk2Arc(angle) {
      const wrapped = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      return Math.max(MK2_ARC_RIGHT, Math.min(MK2_ARC_LEFT, wrapped));
    }

    function getMk2AimProgressFromAngle(angle) {
      const clamped = clampAngleToMk2Arc(angle);
      return 1 - (clamped - MK2_ARC_RIGHT) / MK2_ARC_SPAN;
    }

    function getMk2AngleFromProgress(progress) {
      const clamped = Math.max(0, Math.min(1, progress));
      return MK2_ARC_LEFT - clamped * MK2_ARC_SPAN;
    }

    function getMk2AimBand(progress) {
      if (progress <= 0.16) return 'left';
      if (progress <= 0.5) return 'center';
      if (progress <= 0.74) return 'rightMid';
      return 'right';
    }

    function approach(current, target, delta) {
      if (current < target) return Math.min(target, current + delta);
      return Math.max(target, current - delta);
    }

    function setMk2AnimState(tower, stateName, restart = false, startFrame = 0) {
      if (!restart && tower.mk2State === stateName) return;
      tower.mk2State = stateName;
      tower.mk2StateTime = 0;
      tower.mk2StateFrame = startFrame;
    }

    function getMk2FireStartFrame(stateName) {
      return MK2_FIRE_ENTRY_FRAME[stateName] || 0;
    }

    function isMk2FiringState(stateName) {
      return stateName === 'fireStartLeft' ||
        stateName === 'fireLoopLeft' ||
        stateName === 'fireTurnLeftToMid' ||
        stateName === 'fireLoopCenter' ||
        stateName === 'fireLoopRightMid' ||
        stateName === 'fireTurnRightMidToRight' ||
        stateName === 'fireLoopRight';
    }

    function isMk2EndState(stateName) {
      return stateName === 'fireEndLeftSmoke' || stateName === 'returnLeftAfterFiring';
    }

    // Mk2 state chart:
    // placement -> idlePose
    // idlePose/tracking -> fireStartLeft -> fireLoopLeft
    // fireLoopLeft -> fireTurnLeftToMid -> fireLoopCenter
    // fireLoopCenter -> fireLoopRightMid
    // fireLoopRightMid -> fireTurnRightMidToRight -> fireLoopRight
    // fireLoopLeft/fireLoopCenter -> fireEndLeftSmoke -> idlePose
    // fireLoopRightMid/fireLoopRight -> returnLeftAfterFiring -> idlePose
    // Hard rule: when a target is in range, visual ownership belongs to firing states,
    // not dry tracking states. End states may be interrupted immediately by firing states.
    function updateMk2FireVisualState(tower, band) {
      const prevBand = tower.mk2LastFireBand || band;
      if (band === 'left') {
        if (tower.mk2State !== 'fireStartLeft' && tower.mk2State !== 'fireLoopLeft') {
          setMk2AnimState(tower, 'fireStartLeft', true, getMk2FireStartFrame('fireStartLeft'));
        }
      } else if (band === 'center') {
        if ((prevBand === 'left' || tower.mk2State === 'fireStartLeft' || tower.mk2State === 'fireLoopLeft') && tower.mk2State !== 'fireLoopCenter') {
          setMk2AnimState(tower, 'fireTurnLeftToMid', true, getMk2FireStartFrame('fireTurnLeftToMid'));
        } else if (tower.mk2State !== 'fireLoopCenter' && tower.mk2State !== 'fireTurnLeftToMid') {
          setMk2AnimState(tower, 'fireLoopCenter', true, getMk2FireStartFrame('fireLoopCenter'));
        }
      } else if (band === 'rightMid') {
        if (tower.mk2State !== 'fireLoopRightMid' && tower.mk2State !== 'fireTurnRightMidToRight') {
          setMk2AnimState(tower, 'fireLoopRightMid', true, getMk2FireStartFrame('fireLoopRightMid'));
        }
      } else {
        if ((prevBand !== 'right' || tower.mk2State === 'fireLoopRightMid') && tower.mk2State !== 'fireLoopRight') {
          setMk2AnimState(tower, 'fireTurnRightMidToRight', true, getMk2FireStartFrame('fireTurnRightMidToRight'));
        } else if (tower.mk2State !== 'fireLoopRight' && tower.mk2State !== 'fireTurnRightMidToRight') {
          setMk2AnimState(tower, 'fireLoopRight', true, getMk2FireStartFrame('fireLoopRight'));
        }
      }
      tower.mk2LastFireBand = band;
    }

    function finishMk2ReturnToLeft(tower) {
      tower.mk2AimProgress = 0;
      tower.mk2TargetProgress = 0;
      tower.mk2VisualBand = 'left';
      tower.mk2LastFireBand = 'left';
      tower.facing = getMk2AngleFromProgress(0);
      setMk2AnimState(tower, 'idlePose', true);
    }

    function getMk2SequenceFrames(stateName) {
      switch (stateName) {
        case 'placement': return mk2Sequences.placement;
        case 'fireStartLeft': return mk2Sequences.fireStartLeft;
        case 'fireLoopLeft': return mk2Sequences.fireLoopLeft;
        case 'fireTurnLeftToMid': return mk2Sequences.fireTurnLeftToMid;
        case 'fireLoopCenter': return mk2Sequences.fireLoopCenter;
        case 'fireLoopRightMid': return mk2Sequences.fireLoopRightMid;
        case 'fireTurnRightMidToRight': return mk2Sequences.fireTurnRightMidToRight;
        case 'fireLoopRight': return mk2Sequences.fireLoopRight;
        case 'fireEndLeftSmoke': return mk2Sequences.fireEndLeftSmoke;
        case 'returnLeftAfterFiring': return mk2Sequences.returnLeftAfterFiring;
        default: return null;
      }
    }

    function updateMk2SequenceState(tower, dt) {
      tower.mk2StateTime += dt;
      const frames = getMk2SequenceFrames(tower.mk2State);
      if (!frames) return;

      if (tower.mk2State === 'placement') {
        const fps = frames.length / TURRET_PLACE_DURATION;
        tower.mk2StateFrame = Math.min(frames.length - 1, Math.floor(tower.mk2StateTime * fps));
        if (tower.mk2StateTime >= TURRET_PLACE_DURATION) setMk2AnimState(tower, 'idlePose', true);
        return;
      }

      if (tower.mk2State === 'fireStartLeft') {
        const fps = 18;
        tower.mk2StateFrame = Math.min(frames.length - 1, Math.floor(tower.mk2StateTime * fps));
        if (tower.mk2StateFrame >= frames.length - 1) setMk2AnimState(tower, 'fireLoopLeft', true);
        return;
      }

      if (tower.mk2State === 'fireTurnLeftToMid' || tower.mk2State === 'fireTurnRightMidToRight') {
        const fps = Math.max(10, frames.length / Math.max(0.08, tower.mk2ShotCycle));
        tower.mk2StateFrame = Math.min(frames.length - 1, Math.floor(tower.mk2StateTime * fps));
        if (tower.mk2StateFrame >= frames.length - 1) {
          setMk2AnimState(tower, tower.mk2State === 'fireTurnLeftToMid' ? 'fireLoopCenter' : 'fireLoopRight', true);
        }
        return;
      }

      if (tower.mk2State === 'fireLoopLeft' || tower.mk2State === 'fireLoopCenter' || tower.mk2State === 'fireLoopRightMid' || tower.mk2State === 'fireLoopRight') {
        const fps = frames.length / Math.max(0.06, tower.mk2ShotCycle);
        tower.mk2StateFrame = Math.floor(tower.mk2StateTime * fps) % frames.length;
        return;
      }

      if (tower.mk2State === 'fireEndLeftSmoke' || tower.mk2State === 'returnLeftAfterFiring') {
        const fps = 14;
        tower.mk2StateFrame = Math.min(frames.length - 1, Math.floor(tower.mk2StateTime * fps));
        if (tower.mk2StateFrame >= frames.length - 1) finishMk2ReturnToLeft(tower);
      }
    }

    function getMk2DryFrame(progress, reverse = false) {
      const frames = reverse ? mk2Sequences.dryRightToLeft : mk2Sequences.dryLeftToRight;
      const idx = Math.round(Math.max(0, Math.min(1, progress)) * (frames.length - 1));
      return { frames, frameIndex: idx };
    }

    function getMk2SequenceRenderState(tower) {
      if (tower.mk2State === 'idlePose' || tower.mk2State === 'tracking') {
        return getMk2DryFrame(tower.mk2AimProgress || 0, false);
      }
      const frames = getMk2SequenceFrames(tower.mk2State);
      if (!frames) return getMk2DryFrame(tower.mk2AimProgress || 0, false);
      return {
        frames,
        frameIndex: Math.max(0, Math.min(frames.length - 1, tower.mk2StateFrame || 0)),
      };
    }

    function getMk2MuzzleWorld(tower) {
      const pivot = getTurretPivotWorld(tower);
      const angle = getMk2AngleFromProgress(tower.mk2AimProgress || 0);
      return {
        x: pivot.x + Math.cos(angle) * TURRET_MUZZLE_LENGTH,
        y: pivot.y + Math.sin(angle) * TURRET_MUZZLE_LENGTH - TURRET_MUZZLE_LIFT,
      };
    }

    function spawnMuzzleFlash(tower) {
      const pivot = getTurretPivotWorld(tower);
      state.effects.push({
        kind: 'muzzleFlash',
        x: pivot.x,
        y: pivot.y,
        frameIndex: getTurretFrameIndex(tower),
        age: 0,
        maxAge: 0.09,
      });
    }

    function spawnShellCasing(tower) {
      const burstIndex = tower.casingCounter || 0;
      const speed = 36 + Math.random() * 18;
      const ejectAngle = tower.facing + Math.PI / 2.25 + (Math.random() - 0.5) * 0.55;
      const pivot = getTurretPivotWorld(tower);
      state.effects.push({
        kind: 'shellCasing',
        x: pivot.x + Math.cos(ejectAngle) * 18,
        y: pivot.y + Math.sin(ejectAngle) * 12 - 6,
        vx: Math.cos(ejectAngle) * speed,
        vy: Math.sin(ejectAngle) * speed - 8,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 8,
        frameIndex: burstIndex % 16,
        age: 0,
        maxAge: 0.5 + Math.random() * 0.18,
      });
      tower.casingCounter = burstIndex + 1;
    }

    function getFrontHemisphereAimProgress(angle) {
      const wrapped = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const frontClamped = Math.max(0, Math.min(Math.PI, wrapped));
      return 1 - frontClamped / Math.PI;
    }

    function updateTurretAimFrame(tower, hasTarget) {
      if (tower.spriteState === 'place') return;
      if (!hasTarget) return;
      const progress = getFrontHemisphereAimProgress(tower.facing);
      const idx = Math.min(TURRET_AIM_FRAMES.length - 1, Math.max(0, Math.round(progress * (TURRET_AIM_FRAMES.length - 1))));
      tower.aimFrame = TURRET_AIM_FRAMES[idx];
    }

    function spawnGroundFlame(tower) {
      const spread = (Math.random() - 0.5) * 0.5;
      const dist = 56 + Math.random() * 52;
      const x = tower.x + Math.cos(tower.facing + spread) * dist;
      const y = tower.y + Math.sin(tower.facing + spread) * dist + 14;
      const onPath = isOnPath(x, y);
      state.effects.push({
        kind: 'groundFlame',
        x,
        y,
        scale: 0.42 + Math.random() * 0.12,
        age: 0,
        maxAge: 1.2 + Math.random() * 0.4,
        variant: onPath ? 'path' : 'offPath',
      });
    }

    function showToast(message) {
      ui.toast.textContent = message;
      ui.toast.classList.add('show');
      clearTimeout(showToast._t);
      showToast._t = setTimeout(() => ui.toast.classList.remove('show'), 1600);
    }

    function syncDefenseMenu() {
      ui.defenseMenu.classList.toggle('expanded', state.radialMenuOpen);
      ui.defenseToggle.textContent = state.radialMenuOpen ? '×' : '+';
    }

    function pulseWaveBadge() {
      ui.waveBadge.classList.add('flash');
      clearTimeout(pulseWaveBadge._t);
      pulseWaveBadge._t = setTimeout(() => ui.waveBadge.classList.remove('flash'), 380);
    }

    function handlePlayWaveAction() {
      if (state.currentWaveRunning) {
        startWaveEarly();
        return;
      }
      startNextWave();
    }

    function updateHUD() {
      const buildBusy = !!state.heldTower || !!state.wallDraft;
      ui.points.textContent = Math.floor(state.points);
      ui.lives.textContent = state.lives;
      ui.wave.textContent = state.wave;
      ui.aliveEnemies.textContent = state.aliveEnemies;
      ui.earlyBonus.textContent = `+${Math.floor(state.lastEarlyBonus)}`;
      ui.earlyChip.style.display = state.lastEarlyBonus > 0 ? '' : 'none';
      ui.buyMinigun.disabled = state.points < towerDefs.minigun.cost || buildBusy;
      ui.buyMinigunMk2.disabled = state.points < towerDefs.minigunMk2.cost || buildBusy;
      ui.buyCannon.disabled = state.points < towerDefs.cannon.cost || buildBusy;
      ui.buyFlamethrower.disabled = state.points < towerDefs.flamethrower.cost || buildBusy;
      ui.buyMine.disabled = state.points < towerDefs.mine.cost || buildBusy;
      ui.buyPlaceholder.disabled = state.gameOver || buildBusy;
      ui.playWaveBtn.disabled = state.gameOver;
      ui.playWaveBtn.textContent = state.currentWaveRunning ? '≫' : '▶';
      syncDefenseMenu();
      updateSelectionPanel();
    }

    function getTowerUpgradeLevel(tower, stat) {
      return tower?.upgrades?.[stat] || 0;
    }

    function refreshTowerLevel(tower) {
      tower.level = 1
        + getTowerUpgradeLevel(tower, 'range')
        + getTowerUpgradeLevel(tower, 'rate')
        + getTowerUpgradeLevel(tower, 'damage');
    }

    function getUpgradeUnlockWave(level) {
      if (level < 5) return null;
      if (level < 10) return UPGRADE_LOCK_WAVES[0];
      if (level < 15) return UPGRADE_LOCK_WAVES[1];
      if (level < 20) return UPGRADE_LOCK_WAVES[2];
      return Infinity;
    }

    function getUpgradeCategoryCost(tower, stat) {
      const def = towerDefs[tower.type];
      const level = getTowerUpgradeLevel(tower, stat);
      const mult = stat === 'range' ? 1.05 : stat === 'rate' ? 1.18 : 1.32;
      const tierWeight = level < 5
        ? 1.75 + level * 0.6
        : level < 10
          ? 5.5 + (level - 5) * 0.95
          : level < 15
            ? 10.5 + (level - 10) * 1.2
            : 17 + (level - 15) * 1.5;
      return Math.round(def.upgradeBase * mult * tierWeight);
    }

    function getUpgradeCategoryInfo(tower, stat) {
      const level = getTowerUpgradeLevel(tower, stat);
      const unlockWave = getUpgradeUnlockWave(level);
      const maxed = unlockWave === Infinity;
      const locked = unlockWave !== null && unlockWave !== Infinity && state.wave < unlockWave;
      const cost = maxed ? null : getUpgradeCategoryCost(tower, stat);
      return { level, unlockWave, locked, maxed, cost };
    }

    function getTowerStats(tower) {
      const def = towerDefs[tower.type];
      const rangeLevel = getTowerUpgradeLevel(tower, 'range');
      const rateLevel = getTowerUpgradeLevel(tower, 'rate');
      const damageLevel = getTowerUpgradeLevel(tower, 'damage');
      if (tower.type === 'minigun' || tower.type === 'minigunMk2') {
        return {
          range: def.baseRange + rangeLevel * 12,
          fireRate: Math.max(0.05, def.baseFireRate - rateLevel * 0.006),
          damage: def.baseDamage + damageLevel * 2,
          splashRadius: 0,
        };
      }
      if (tower.type === 'flamethrower') {
        return {
          range: def.baseRange + rangeLevel * 8,
          fireRate: Math.max(0.08, def.baseFireRate - rateLevel * 0.008),
          damage: def.baseDamage + damageLevel * 1.15,
          splashRadius: 0,
          flameAngle: Math.max(Math.PI / 7, def.flameAngle + rangeLevel * 0.018),
          burnTime: def.burnTime + damageLevel * 0.18,
        };
      }
      if (tower.type === 'mine') {
        return {
          range: 0,
          fireRate: 0,
          damage: def.baseDamage + damageLevel * 22,
          splashRadius: def.splashRadius + damageLevel * 8,
          triggerRadius: def.triggerRadius + rangeLevel * 3,
        };
      }
      return {
        range: def.baseRange + rangeLevel * 11,
        fireRate: Math.max(0.45, def.baseFireRate - rateLevel * 0.035),
        damage: def.baseDamage + damageLevel * 8,
        splashRadius: (def.splashRadius || 0) + damageLevel * 6,
      };
    }

    function getUpgradeCost(tower) {
      return Math.min(
        ...['range', 'rate', 'damage']
          .map(stat => getUpgradeCategoryInfo(tower, stat))
          .filter(info => !info.locked && !info.maxed)
          .map(info => info.cost)
      );
    }

    function getSelectedTower() {
      return state.towers.find(t => t.id === state.selectedTowerId) || null;
    }

    function updateSelectionPanel() {
      const tower = getSelectedTower();
      if (!tower) {
        ui.selectedInfo.innerHTML = 'None selected';
        ui.selectionHud.classList.remove('show');
        ui.upgradeBtn.classList.remove('show');
        ui.upgradeBtn.disabled = true;
        ui.upgradeRangeBtn.classList.remove('show');
        ui.upgradeRateBtn.classList.remove('show');
        ui.upgradeDamageBtn.classList.remove('show');
        state.upgradeMenuOpen = false;
        state.selectionUiBounds = null;
        return;
      }
      const stats = getTowerStats(tower);
      const rangeInfo = getUpgradeCategoryInfo(tower, 'range');
      const rateInfo = getUpgradeCategoryInfo(tower, 'rate');
      const damageInfo = getUpgradeCategoryInfo(tower, 'damage');
      const canAnyUpgrade = [rangeInfo, rateInfo, damageInfo].some(info => !info.locked && !info.maxed);
      const p = worldToScreen(tower.x, tower.y);
      const hudX = Math.max(108, Math.min(canvas.width - 108, p.x));
      const hudY = Math.max(80, Math.min(canvas.height - 82, p.y - 74));
      const rangeLabel = tower.type === 'mine'
        ? `Blast ${Math.round(stats.splashRadius)}`
        : tower.type === 'flamethrower'
          ? `Range ${Math.round(stats.range)} • Burn ${stats.burnTime.toFixed(1)}s`
          : `Range ${Math.round(stats.range)}`;
      const rateLabel = tower.type === 'mine'
        ? `Trigger ${Math.round(stats.triggerRadius)}`
        : `Dmg ${Math.round(stats.damage)} • ${stats.fireRate ? `${stats.fireRate.toFixed(2)}s` : 'Passive'}`;
      ui.selectionHud.style.left = `${hudX}px`;
      ui.selectionHud.style.top = `${hudY}px`;
      ui.selectedInfo.innerHTML = `
        <div class="title">${towerDefs[tower.type].name}</div>
        <div class="meta">Lv ${tower.level} • ${rangeLabel}</div>
        <div class="meta">R ${rangeInfo.level} • F ${rateInfo.level} • D ${damageInfo.level}</div>
        <div class="meta">${rateLabel}</div>
      `;
      ui.selectionHud.classList.add('show');
      ui.upgradeBtn.disabled = !canAnyUpgrade;
      ui.upgradeBtn.style.left = `${hudX}px`;
      ui.upgradeBtn.style.top = `${Math.max(44, hudY - 40)}px`;
      ui.upgradeBtn.title = canAnyUpgrade ? 'Open upgrades' : 'Upgrades locked';
      ui.upgradeBtn.classList.add('show');
      state.selectionUiBounds = {
        left: hudX - 130,
        right: hudX + 130,
        top: Math.max(20, hudY - 90),
        bottom: hudY + 42,
      };

      const options = [
        { btn: ui.upgradeRangeBtn, info: rangeInfo, label: 'RG', x: hudX - 58, y: hudY - 72 },
        { btn: ui.upgradeRateBtn, info: rateInfo, label: 'FR', x: hudX, y: hudY - 96 },
        { btn: ui.upgradeDamageBtn, info: damageInfo, label: 'DM', x: hudX + 58, y: hudY - 72 },
      ];
      for (const option of options) {
        option.btn.style.left = `${option.x}px`;
        option.btn.style.top = `${option.y}px`;
        option.btn.querySelector('.symbol').textContent = option.label;
        option.btn.querySelector('.detail').textContent = option.info.maxed
          ? 'MAX'
          : option.info.locked
            ? `W${option.info.unlockWave}`
            : `${option.info.cost}`;
        option.btn.disabled = option.info.maxed || option.info.locked || state.points < option.info.cost;
        option.btn.title = option.info.maxed
          ? `${option.label} maxed`
          : option.info.locked
            ? `Unlocks at wave ${option.info.unlockWave}`
            : `${option.label} upgrade (${option.info.cost})`;
        option.btn.disabled = option.info.maxed || option.info.locked;
        option.btn.classList.toggle('show', state.upgradeMenuOpen);
      }
    }

    function createExplosion(x, y, color = '#fb923c') {
      state.effects.push({
        x, y, age: 0, maxAge: 0.45, color, glow: 1,
      });
    }

    function resetGame() {
      state.points = 400;
      state.lives = 20;
      state.wave = 0;
      state.aliveEnemies = 0;
      state.towers = [];
      state.enemies = [];
      state.projectiles = [];
      state.effects = [];
      state.decals = [];
      state.enemyGhosts = [];
      state.walls = [];
      state.heldTower = null;
      state.wallDraft = null;
      state.selectedTowerId = null;
      state.spawnQueue = [];
      state.currentWaveRunning = false;
      state.earlyStartedThisWave = false;
      state.radialMenuOpen = false;
      state.upgradeMenuOpen = false;
      state.selectionUiBounds = null;
      state.cameraPan.x = 0;
      state.cameraPan.y = 0;
      state.lastEarlyBonus = 0;
      state.gameOver = false;
      state.nextTowerId = 1;
      state.nextWallId = 1;
      state.nextWallChainId = 1;
      state.cannonGroundHitCounter = 0;
      state.nextCannonGroundHitAt = 3;
      state.nextEnemyDeathVariant = 0;
      state.camera = { x: 1040, y: 470, zoom: 0.76, targetZoom: 0.76 };
      ui.waveBadge.classList.remove('flash');
      updateHUD();
      showToast('Run reset');
    }

    function beginPlayEquivalent() {
      updateHUD();
      syncDefenseMenu();
      showToast('Loaded improved routed foundation');
    }

    function worldToScreen(x, y) {
      return {
        x: (x - state.camera.x) * state.camera.zoom + canvas.width / 2,
        y: (y - state.camera.y) * state.camera.zoom + canvas.height / 2,
      };
    }

    function screenToWorld(x, y) {
      return {
        x: (x - canvas.width / 2) / state.camera.zoom + state.camera.x,
        y: (y - canvas.height / 2) / state.camera.zoom + state.camera.y,
      };
    }

    function clampCamera() {
      const halfW = canvas.width / 2 / state.camera.zoom;
      const halfH = canvas.height / 2 / state.camera.zoom;
      state.camera.x = Math.max(halfW, Math.min(MAP_WIDTH - halfW, state.camera.x));
      state.camera.y = Math.max(halfH, Math.min(MAP_HEIGHT - halfH, state.camera.y));
    }

    function spawnHeldTower(type) {
      if (state.heldTower) return;
      const def = towerDefs[type];
      if (!def || state.points < def.cost) return;
      state.points -= def.cost;
      state.radialMenuOpen = false;
      state.heldTower = {
        type,
        x: state.mouseWorld.x,
        y: state.mouseWorld.y,
        isHeld: true,
      };
      updateHUD();
      showToast(`${def.name} ready to place`);
    }

    function cancelHeldTower() {
      if (!state.heldTower) return;
      const def = towerDefs[state.heldTower.type];
      state.points += def.cost;
      state.heldTower = null;
      updateHUD();
      showToast(`Placement cancelled (+${def.cost})`);
    }

    function startWallDraft() {
      if (state.gameOver || state.heldTower || state.wallDraft) return;
      state.selectedTowerId = null;
      state.radialMenuOpen = false;
      state.upgradeMenuOpen = false;
      state.wallDraft = {
        phase: 'awaitStart',
        start: null,
        current: { x: state.mouseWorld.x, y: state.mouseWorld.y },
      };
      updateHUD();
      showToast('Click to place wall start');
    }

    function cancelWallDraft() {
      if (!state.wallDraft) return;
      state.wallDraft = null;
      updateHUD();
      showToast('Wall placement cancelled');
    }

    function pointSegmentDistance(px, py, ax, ay, bx, by) {
      const abx = bx - ax;
      const aby = by - ay;
      const apx = px - ax;
      const apy = py - ay;
      const abLenSq = abx * abx + aby * aby;
      const t = abLenSq === 0 ? 0 : Math.max(0, Math.min(1, (apx * abx + apy * aby) / abLenSq));
      const cx = ax + abx * t;
      const cy = ay + aby * t;
      const dx = px - cx;
      const dy = py - cy;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function lineSegmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
      const det = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
      if (Math.abs(det) < 0.0001) return false;
      const t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / det;
      const u = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / det;
      return t >= 0 && t <= 1 && u >= 0 && u <= 1;
    }

    function snapWallPoint(x, y) {
      const step = 10;
      return {
        x: Math.round(x / step) * step,
        y: Math.round(y / step) * step,
      };
    }

    function buildWallPreviewSegments(start, end) {
      if (!start || !end) return [];
      const snappedStart = snapWallPoint(start.x, start.y);
      const snappedEnd = snapWallPoint(end.x, end.y);
      const dx = snappedEnd.x - snappedStart.x;
      const dy = snappedEnd.y - snappedStart.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < wallDefs.segmentLength * 0.5) return [];

      const count = Math.max(1, Math.min(wallDefs.maxSegmentCount, Math.round(dist / wallDefs.segmentLength)));
      const ux = dx / dist;
      const uy = dy / dist;
      const chainStart = { x: snappedStart.x, y: snappedStart.y };
      const chainEnd = {
        x: snappedStart.x + ux * wallDefs.segmentLength * count,
        y: snappedStart.y + uy * wallDefs.segmentLength * count,
      };
      const segments = [];
      const gateIndex = count >= 3 ? Math.floor(count / 2) : -1;

      for (let i = 0; i < count; i++) {
        const x1 = snappedStart.x + ux * wallDefs.segmentLength * i;
        const y1 = snappedStart.y + uy * wallDefs.segmentLength * i;
        const x2 = snappedStart.x + ux * wallDefs.segmentLength * (i + 1);
        const y2 = snappedStart.y + uy * wallDefs.segmentLength * (i + 1);
        segments.push({
          segmentIndex: i,
          x1, y1, x2, y2,
          x: (x1 + x2) * 0.5,
          y: (y1 + y2) * 0.5,
          angle: Math.atan2(y2 - y1, x2 - x1),
          kind: i === gateIndex ? 'gate' : 'straight',
          chainStart,
          chainEnd,
        });
      }
      return segments;
    }

    function getWallDraftSegments() {
      if (!state.wallDraft || state.wallDraft.phase !== 'dragging') return [];
      return buildWallPreviewSegments(state.wallDraft.start, state.wallDraft.current);
    }

    function isValidWallNode(x, y) {
      if (x < 40 || x > MAP_WIDTH - 40 || y < 40 || y > MAP_HEIGHT - 40) return false;
      return classifyPlacementZone(x, y) === 'trap';
    }

    function overlapsWallSegment(segment, ignoreWallId = null) {
      const wallPadding = wallDefs.thickness + 6;
      for (const wall of state.walls) {
        if (ignoreWallId && wall.id === ignoreWallId) continue;
        if (pointSegmentDistance(segment.x, segment.y, wall.x1, wall.y1, wall.x2, wall.y2) < wallPadding) {
          return true;
        }
      }
      for (const tower of state.towers) {
        const radius = tower.type === 'mine' ? state.mineRadius : state.towerRadius;
        if (pointSegmentDistance(tower.x, tower.y, segment.x1, segment.y1, segment.x2, segment.y2) < radius + wallDefs.thickness) {
          return true;
        }
      }
      return false;
    }

    function isValidWallChain(segments) {
      if (!segments.length) return false;
      for (const segment of segments) {
        const points = [
          { x: segment.x1, y: segment.y1 },
          { x: segment.x2, y: segment.y2 },
          { x: segment.x, y: segment.y },
        ];
        if (points.some(pt => !isValidWallNode(pt.x, pt.y) || isOnGoalPad(pt.x, pt.y))) {
          return false;
        }
        if (overlapsWallSegment(segment)) return false;
      }
      return true;
    }

    function getWallChainCost(segments) {
      return segments.reduce((sum, segment) => sum + (segment.kind === 'gate' ? wallDefs.gateCost : wallDefs.straightCost), 0);
    }

    function placeWallChain(segments) {
      if (!segments.length) {
        showToast('Drag a longer wall');
        return;
      }
      if (!isValidWallChain(segments)) {
        showToast('Invalid wall placement');
        return;
      }
      const cost = getWallChainCost(segments);
      if (state.points < cost) {
        showToast(`Need ${cost} points`);
        return;
      }

      state.points -= cost;
      const chainId = state.nextWallChainId++;
      for (const segment of segments) {
        state.walls.push({
          id: state.nextWallId++,
          chainId,
          kind: segment.kind,
          x1: segment.x1,
          y1: segment.y1,
          x2: segment.x2,
          y2: segment.y2,
          x: segment.x,
          y: segment.y,
          angle: segment.angle,
          maxHp: segment.kind === 'gate' ? wallDefs.gateHp : wallDefs.straightHp,
          hp: segment.kind === 'gate' ? wallDefs.gateHp : wallDefs.straightHp,
          chainStart: segment.chainStart,
          chainEnd: segment.chainEnd,
          hitFlash: 0,
        });
      }
      state.wallDraft = null;
      updateHUD();
      showToast(`Barricade placed (${cost})`);
    }

    function getBlockingWall(ax, ay, bx, by, ignoreWallId = null) {
      for (const wall of state.walls) {
        if (wall.id === ignoreWallId) continue;
        const nearMid = pointSegmentDistance(wall.x, wall.y, ax, ay, bx, by) <= wallDefs.thickness + 10;
        if (nearMid || lineSegmentsIntersect(ax, ay, bx, by, wall.x1, wall.y1, wall.x2, wall.y2)) {
          return wall;
        }
      }
      return null;
    }

    function getWallDetourPoint(enemy, wall) {
      const sx = wall.chainStart.x;
      const sy = wall.chainStart.y;
      const ex = wall.chainEnd.x;
      const ey = wall.chainEnd.y;
      const dx = ex - sx;
      const dy = ey - sy;
      const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const ux = dx / len;
      const uy = dy / len;
      const nx = -uy;
      const ny = ux;
      const side = Math.sign((enemy.x - sx) * nx + (enemy.y - sy) * ny) || 1;
      const offsetA = {
        x: sx - ux * 22 + nx * side * 28,
        y: sy - uy * 22 + ny * side * 28,
      };
      const offsetB = {
        x: ex + ux * 22 + nx * side * 28,
        y: ey + uy * 22 + ny * side * 28,
      };
      const candidates = [offsetA, offsetB].filter(pt => pt.x > 0 && pt.y > 0 && pt.x < MAP_WIDTH && pt.y < MAP_HEIGHT);
      if (!candidates.length) return null;
      candidates.sort((a, b) => {
        const da = Math.hypot(enemy.x - a.x, enemy.y - a.y);
        const db = Math.hypot(enemy.x - b.x, enemy.y - b.y);
        return da - db;
      });
      return candidates[0];
    }

    function damageWall(wall, amount) {
      if (!wall) return;
      wall.hp -= amount;
      wall.hitFlash = 0.12;
      state.effects.push({
        kind: 'hitFlash',
        x: wall.x,
        y: wall.y,
        age: 0,
        maxAge: 0.08,
        color: wall.kind === 'gate' ? '#fbbf24' : '#d6b28a'
      });
      if (wall.hp <= 0) {
        state.walls = state.walls.filter(candidate => candidate.id !== wall.id);
      }
    }

    function isOnPath(x, y) {
      const paths = Object.values(PATH_VARIANTS);
      for (const path of paths) {
        for (let i = 0; i < path.length - 1; i++) {
          const a = path[i];
          const b = path[i + 1];
          if (pointSegmentDistance(x, y, a.x, a.y, b.x, b.y) <= state.pathHalfWidth + state.towerRadius * 0.8) {
            return true;
          }
        }
      }
      return false;
    }

    function isOnGoalPad(x, y) {
      const dx = x - GOAL.x;
      const dy = y - GOAL.y;
      return Math.sqrt(dx * dx + dy * dy) <= GOAL.radius + 18;
    }

    function getPlacementMaskSample(x, y) {
      if (!placementMaskPixels) return null;
      const ix = Math.max(0, Math.min(MAP_WIDTH - 1, Math.round(x)));
      const iy = Math.max(0, Math.min(MAP_HEIGHT - 1, Math.round(y)));
      const idx = (iy * MAP_WIDTH + ix) * 4;
      return {
        r: placementMaskPixels[idx],
        g: placementMaskPixels[idx + 1],
        b: placementMaskPixels[idx + 2],
        a: placementMaskPixels[idx + 3],
      };
    }

    function classifyPlacementZone(x, y) {
      const s = getPlacementMaskSample(x, y);
      if (!s || s.a < 10) return 'blocked';
      const { r, g, b } = s;

      if (r > 120 && g > 120 && b < 120) return 'special';
      if (g > 120 && r < 140 && b < 140) return 'build';
      if (r > 120 && b > 120 && g < 120) return 'special';
      if (r > 120 && g < 120 && b < 120) return 'path';
      if (b > 110 && r < 130 && g < 150) return 'trap';
      return 'blocked';
    }

    function overlapsTower(x, y) {
      if (state.towers.some(t => {
        const dx = t.x - x;
        const dy = t.y - y;
        const radius = t.type === 'mine' ? state.mineRadius : state.towerRadius;
        const placementRadius = state.heldTower?.type === 'mine' ? state.mineRadius : state.towerRadius;
        return Math.sqrt(dx * dx + dy * dy) < radius + placementRadius + 8;
      })) return true;
      return state.walls.some(wall => pointSegmentDistance(x, y, wall.x1, wall.y1, wall.x2, wall.y2) < state.towerRadius + wallDefs.thickness + 4);
    }

    function pointInBuildZone(x, y) {
      return classifyPlacementZone(x, y) === 'build';
    }

    function isValidTowerPlacement(x, y, type = state.heldTower?.type) {
      const inBounds = x > 40 && x < MAP_WIDTH - 40 && y > 40 && y < MAP_HEIGHT - 40;
      if (!inBounds || overlapsTower(x, y)) return false;
      const zone = classifyPlacementZone(x, y);
      if (type === 'mine') return (zone === 'path' || zone === 'trap') && !isOnGoalPad(x, y);
      return zone === 'build' && !isOnGoalPad(x, y);
    }

    function dropHeldTower() {
      if (!state.heldTower) return;
      const { x, y, type } = state.heldTower;
      if (!isValidTowerPlacement(x, y, type)) {
        showToast('Invalid placement');
        return;
      }
      state.towers.push({
        id: state.nextTowerId++,
        type,
        x, y,
        level: 1,
        upgrades: { range: 0, rate: 0, damage: 0 },
        cooldown: 0,
        facing: 0,
        armed: type === 'mine' ? 0.45 : 0,
        animTime: 0,
        aimFrame: TURRET_AIM_FRAMES[Math.floor(TURRET_AIM_FRAMES.length / 2)],
        spriteState: turretSpriteTypes.has(type) ? 'place' : 'idle',
        flamePatchCooldown: 0,
        casingCounter: 0,
        minigunAnimTime: 0,
        minigunFireTimer: 0,
        minigunSmokeTimer: 0,
        minigunVisualBand: 'left',
        minigunHasTarget: false,
        mk2AimProgress: 0,
        mk2TargetProgress: 0,
        mk2State: type === 'minigunMk2' ? 'placement' : 'idlePose',
        mk2StateTime: 0,
        mk2StateFrame: 0,
        mk2ShotCycle: towerDefs[type]?.baseFireRate || 0.14,
        mk2VisualBand: 'left',
      });
      state.heldTower = null;
      updateHUD();
      showToast('Defense placed');
    }

    function selectTowerAt(worldX, worldY) {
      let selected = null;
      for (let i = state.towers.length - 1; i >= 0; i--) {
        const t = state.towers[i];
        const dx = t.x - worldX;
        const dy = t.y - worldY;
        const radius = t.type === 'mine' ? state.mineRadius : state.towerRadius;
        if (Math.sqrt(dx * dx + dy * dy) <= radius) {
          selected = t;
          break;
        }
      }
      state.selectedTowerId = selected ? selected.id : null;
      state.upgradeMenuOpen = false;
      updateHUD();
    }

    function upgradeSelectedTower(stat) {
      const tower = getSelectedTower();
      if (!tower) return;
      const info = getUpgradeCategoryInfo(tower, stat);
      if (info.locked || info.maxed) return;
      if (!tower.upgrades) tower.upgrades = { range: 0, rate: 0, damage: 0 };
      const cost = info.cost;
      if (state.points < cost) {
        showToast(`Need ${cost} points`);
        return;
      }
      state.points -= cost;
      tower.upgrades[stat] += 1;
      refreshTowerLevel(tower);
      state.upgradeMenuOpen = true;
      updateHUD();
      const pretty = stat === 'range' ? 'range' : stat === 'rate' ? 'fire rate' : 'damage';
      showToast(`${towerDefs[tower.type].name} ${pretty} upgraded`);
    }

    function choosePathVariant(enemyType, pathChoice) {
      if (enemyType === 'stormer') {
        if (pathChoice === 'P_upper') return PATH_VARIANTS.P_upper;
        if (pathChoice === 'P_lower') return PATH_VARIANTS.P_lower;
        return Math.random() < 0.5 ? PATH_VARIANTS.P_upper : PATH_VARIANTS.P_lower;
      }

      if (pathChoice === 'A') {
        return Math.random() < 0.42 ? PATH_VARIANTS.A_loop : PATH_VARIANTS.A_main;
      }

      const roll = Math.random();
      if (roll < 0.2) return PATH_VARIANTS.B_upper;
      if (roll < 0.48) return PATH_VARIANTS.B_lower;
      if (roll < 0.72) return PATH_VARIANTS.B_loop;
      return PATH_VARIANTS.B_main;
    }

    function queueWave(enemyCount, startDelay = 0) {
      for (let i = 0; i < enemyCount; i++) {
        const isStormer = state.wave >= 2 && i % 5 === 4;
        const lane = isStormer
          ? (i % 2 === 0 ? 'P_upper' : 'P_lower')
          : (i % 2 === 0 ? 'A' : 'B');
        state.spawnQueue.push({
          delay: startDelay + i * (isStormer ? 0.48 : 0.65),
          enemyType: isStormer ? 'stormer' : 'walker',
          pathChoice: lane,
        });
      }
      state.currentWaveRunning = true;
      state.earlyStartedThisWave = false;
    }

    function startNextWave() {
      if (state.gameOver) return;
      state.wave += 1;
      state.lastEarlyBonus = 0;
      const enemyCount = 6 + state.wave * 3;
      queueWave(enemyCount);
      updateHUD();
      pulseWaveBadge();
      showToast(`Wave ${state.wave} started`);
    }

    function startWaveEarly() {
      if (!state.currentWaveRunning) return;
      const activeThreats = Math.max(1, state.aliveEnemies + Math.ceil(state.spawnQueue.length * 0.5));
      const bonus = Math.floor(36 + activeThreats * 12);
      state.points += bonus;
      state.lastEarlyBonus += bonus;
      state.wave += 1;
      const enemyCount = 6 + state.wave * 3;
      const nextDelay = Math.min(0.45, Math.max(0.08, state.spawnQueue.length ? Math.min(...state.spawnQueue.map(item => item.delay)) : 0.12));
      queueWave(enemyCount, nextDelay);
      updateHUD();
      pulseWaveBadge();
      showToast(`Wave ${state.wave} started early (+${bonus})`);
    }


    function addBulletHole(x, y, radius = 4, towerLevel = 1) {
      const useUpgraded = towerLevel >= 3 && Math.random() < 0.42;
      const frames = useUpgraded ? bulletHitUpgradedFrames : bulletHitSingleFrames;
      state.decals.push({
        kind: 'bulletHole',
        x,
        y,
        radius,
        age: 0,
        maxAge: useUpgraded ? 22 : 24,
        animDuration: useUpgraded ? 0.52 : 0.34,
        frames,
        settleFrame: useUpgraded ? Math.max(0, frames.length - 3) : Math.max(0, frames.length - 2),
        frameHeight: useUpgraded ? 58 : 26,
      });
      if (state.decals.length > 200) state.decals.shift();
    }

    function addCannonScorch(x, y, radius = 26) {
      state.decals.push({ kind: 'scorch', x, y, radius, age: 0, maxAge: 24 });
      if (state.decals.length > 200) state.decals.shift();
    }

    function addCannonGroundHitDecal(x, y) {
      state.decals.push({ kind: 'cannonGroundHit', x, y, age: 0, maxAge: 0.52 });
      const groundHits = state.decals.filter(decal => decal.kind === 'cannonGroundHit');
      while (groundHits.length > 17) {
        const oldest = groundHits.shift();
        const idx = state.decals.indexOf(oldest);
        if (idx >= 0) state.decals.splice(idx, 1);
      }
    }

    function createCannonImpactSprite(x, y, damage) {
      const frameCount = damage < 100 ? 6 : 16;
      state.effects.push({ kind: 'cannonImpact', x, y, age: 0, maxAge: 0.62, color: '#fbbf24', frameCount });
    }

    function noteCannonGroundHit(x, y) {
      state.cannonGroundHitCounter += 1;
      if (state.cannonGroundHitCounter < state.nextCannonGroundHitAt) return;
      addCannonGroundHitDecal(x, y);
      state.cannonGroundHitCounter = 0;
      state.nextCannonGroundHitAt = Math.random() < 0.5 ? 3 : 4;
    }

    function flagEnemyHit(enemy, duration = 0.16) {
      enemy.hitTimer = Math.max(enemy.hitTimer || 0, duration);
      if (enemy.mode === 'walking') enemy.mode = 'hit';
    }

    function killEnemy(enemyIndex, escaped = false, cause = 'default') {
      const enemy = state.enemies[enemyIndex];
      if (!enemy || enemy.mode === 'dying' || enemy.mode === 'attacking') return;
      createExplosion(enemy.x, enemy.y, escaped ? '#f87171' : '#fb923c');
      if (!escaped) state.points += enemy.reward;
      const deathAnimName = escaped
        ? null
        : cause === 'explosion'
          ? 'explosion'
          : (state.nextEnemyDeathVariant++ % 2 === 0 ? 'death1' : 'death2');
      const deathDuration = escaped
        ? 0.34
        : enemy.type === 'walker'
          ? getWalkerDeathDuration(cause, deathAnimName)
          : 0.44;
      enemy.mode = escaped ? 'attacking' : 'dying';
      enemy.stateTimer = deathDuration;
      enemy.pendingEscape = escaped;
      enemy.deathCause = cause;
      enemy.speed = 0;
      enemy.deathAnimName = escaped ? null : deathAnimName;
      enemy.deathFacing = enemy.facing || 'down';
      enemy.deathDuration = deathDuration;
      state.aliveEnemies = Math.max(0, state.aliveEnemies - 1);
      if (escaped) {
        state.lives -= 1;
        if (state.lives <= 0) {
          state.lives = 0;
          state.gameOver = true;
          showToast('Game over');
        }
      }
      updateHUD();
    }

    function completeWaveIfDone() {
      if (state.currentWaveRunning && state.spawnQueue.length === 0 && state.enemies.length === 0) {
        state.currentWaveRunning = false;
        state.earlyStartedThisWave = false;
        state.lastEarlyBonus = 0;
        updateHUD();
        showToast(`Wave ${state.wave} cleared`);
      }
    }

    function updateSpawning(dt) {
      for (const item of state.spawnQueue) item.delay -= dt;
      const ready = state.spawnQueue.filter(item => item.delay <= 0);
      state.spawnQueue = state.spawnQueue.filter(item => item.delay > 0);
      for (const item of ready) {
        state.enemies.push(createEnemyByType(item.enemyType || 'walker', item.pathChoice, state.wave));
        state.aliveEnemies += 1;
      }
      if (ready.length > 0) updateHUD();
    }

    function createEnemy(pathChoice, waveScale = 1) {
      const path = choosePathVariant('walker', pathChoice);
      return {
        x: path[0].x,
        y: path[0].y,
        type: 'walker',
        path,
        pathIndex: 1,
        pathProgress: 0,
        speed: 58 + waveScale * 4.5,
        hp: 46 + waveScale * 15,
        maxHp: 46 + waveScale * 15,
        reward: 18 + waveScale * 2,
        radius: 14,
        moveX: 0,
        moveY: 1,
        facing: 'down',
        mode: 'walking',
        stateTimer: 0,
        hitTimer: 0,
        animTime: Math.random(),
        attackCooldown: 0,
        blockedWallId: null,
        detourPoint: null,
        deathAnimName: null,
        deathFacing: 'down',
        deathDuration: 0,
      };
    }

    function createEnemyByType(enemyType, pathChoice, waveScale = 1) {
      if (enemyType === 'stormer') {
        const path = choosePathVariant('stormer', pathChoice);
        return {
          x: path[0].x,
          y: path[0].y,
          type: 'stormer',
          path,
          pathIndex: 1,
          pathProgress: 0,
          speed: 88 + waveScale * 6.5,
          hp: 34 + waveScale * 11,
          maxHp: 34 + waveScale * 11,
          reward: 24 + waveScale * 3,
          radius: 12,
          moveX: 0,
          moveY: 1,
          facing: 'down',
          mode: 'walking',
          stateTimer: 0,
          hitTimer: 0,
          animTime: Math.random() * 0.6,
          attackCooldown: 0,
          blockedWallId: null,
          detourPoint: null,
          deathAnimName: null,
          deathFacing: 'down',
          deathDuration: 0,
        };
      }
      return createEnemy(pathChoice, waveScale);
    }

    function finalizeEnemyState(enemyIndex) {
      const enemy = state.enemies[enemyIndex];
      if (!enemy) return;
      if (enemy.mode === 'dying') {
        if (enemy.deathCause === 'explosion') {
          const pieceCount = enemy.type === 'stormer' ? 6 : 7;
          for (let i = 0; i < pieceCount; i++) {
            const angle = (Math.PI * 2 * i) / pieceCount + Math.random() * 0.45;
            const speed = (enemy.type === 'stormer' ? 72 : 64) + Math.random() * 38;
            state.enemyGhosts.push({
              kind: 'burstPiece',
              x: enemy.x,
              y: enemy.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 18,
              spin: (Math.random() - 0.5) * 12,
              angle: Math.random() * Math.PI * 2,
              size: (enemy.type === 'stormer' ? 6 : 7) + Math.random() * 4,
              age: 0,
              maxAge: enemy.type === 'stormer' ? 0.34 : 0.4,
              color: enemy.type === 'stormer' ? '#c084fc' : '#cbd5e1'
            });
          }
        } else {
          state.enemyGhosts.push({
            kind: 'ghost',
            x: enemy.x,
            y: enemy.y,
            age: 0,
            maxAge: enemy.type === 'stormer' ? 0.24 : 0.3,
            color: enemy.type === 'stormer' ? '#c084fc' : '#94a3b8'
          });
        }
      }
      state.enemies.splice(enemyIndex, 1);
    }

    function updateEnemyFacing(enemy) {
      if (enemy.moveY > 0.35 && Math.abs(enemy.moveX) > 0.22) {
        enemy.facing = enemy.moveX < 0 ? 'turnLeft' : 'turnRight';
      } else if (Math.abs(enemy.moveX) > Math.abs(enemy.moveY) * 0.72) {
        enemy.facing = enemy.moveX < 0 ? 'left' : 'right';
      } else {
        enemy.facing = 'down';
      }
    }

    function updateEnemies(dt) {
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];
        e.animTime += dt;
        e.attackCooldown = Math.max(0, (e.attackCooldown || 0) - dt);

        if (e.hitTimer > 0) {
          e.hitTimer -= dt;
          if (e.hitTimer <= 0 && e.mode === 'hit') e.mode = 'walking';
        }

        if (e.mode === 'dying' || e.mode === 'attacking') {
          e.stateTimer -= dt;
          if (e.stateTimer <= 0) finalizeEnemyState(i);
          continue;
        }

        if (e.blockedWallId) {
          const blockedWall = state.walls.find(wall => wall.id === e.blockedWallId);
          if (!blockedWall) {
            e.blockedWallId = null;
            if (e.mode === 'attackingWall') e.mode = 'walking';
          } else if (blockedWall.kind === 'gate') {
            e.mode = 'attackingWall';
            const dx = blockedWall.x - e.x;
            const dy = blockedWall.y - e.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 18) {
              const step = Math.min(e.speed * dt * 0.55, dist);
              e.moveX = dx / dist;
              e.moveY = dy / dist;
              e.x += e.moveX * step;
              e.y += e.moveY * step;
              updateEnemyFacing(e);
            } else if (e.attackCooldown <= 0) {
              damageWall(blockedWall, e.type === 'stormer' ? 18 : 11);
              e.attackCooldown = e.type === 'stormer' ? 0.34 : 0.5;
            }
            continue;
          } else {
            e.blockedWallId = null;
            if (e.mode === 'attackingWall') e.mode = 'walking';
          }
        }

        const target = e.detourPoint || e.path[e.pathIndex];
        if (!target) {
          killEnemy(i, true);
          continue;
        }

        const wallBlock = getBlockingWall(e.x, e.y, target.x, target.y);
        if (wallBlock) {
          if (wallBlock.kind === 'gate') {
            e.blockedWallId = wallBlock.id;
            e.mode = 'attackingWall';
            continue;
          }
          const detour = getWallDetourPoint(e, wallBlock);
          if (detour && !getBlockingWall(e.x, e.y, detour.x, detour.y, wallBlock.id)) {
            e.detourPoint = detour;
          } else {
            e.blockedWallId = wallBlock.id;
            e.mode = 'attackingWall';
            continue;
          }
        }

        const dx = target.x - e.x;
        const dy = target.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 2) {
          if (e.detourPoint) {
            e.detourPoint = null;
            e.mode = 'walking';
          } else {
            e.pathIndex += 1;
          }
        } else {
          const step = e.speed * dt;
          const moved = Math.min(step, dist);
          e.moveX = dx / dist;
          e.moveY = dy / dist;
          e.x += e.moveX * moved;
          e.y += e.moveY * moved;
          if (e.mode !== 'hit') e.mode = 'walking';
          updateEnemyFacing(e);
        }

        const progress = Math.min(1, e.pathIndex / Math.max(1, e.path.length - 1));
        e.pathProgress = progress;
        e.radius = e.type === 'stormer' ? 12 : 14;
      }
    }

    function damageEnemy(enemy, amount, hitColor = '#fb923c', cause = 'default') {
      if (!enemy || enemy.mode === 'dying' || enemy.mode === 'attacking') return;
      enemy.hp -= amount;
      flagEnemyHit(enemy);
      state.effects.push({
        kind: 'hitFlash',
        x: enemy.x,
        y: enemy.y,
        age: 0,
        maxAge: enemy.type === 'stormer' ? 0.09 : 0.12,
        color: enemy.type === 'stormer' ? '#d8b4fe' : hitColor
      });
      if (enemy.hp <= 0) {
        const idx = state.enemies.indexOf(enemy);
        if (idx >= 0) killEnemy(idx, false, cause);
      }
    }

    function applyBurn(enemy, damage, duration) {
      enemy.burn = {
        time: Math.max(enemy.burn?.time || 0, duration),
        dps: Math.max(enemy.burn?.dps || 0, damage * 2.6),
      };
    }

    function applyConeDamage(tower, stats) {
      const range = stats.range;
      const facing = tower.facing || 0;
      let hitAny = false;
      for (const enemy of state.enemies) {
        if (enemy.mode === 'dying' || enemy.mode === 'attacking') continue;
        const dx = enemy.x - tower.x;
        const dy = enemy.y - tower.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > range) continue;
        const angle = Math.atan2(dy, dx);
        let delta = angle - facing;
        while (delta > Math.PI) delta -= Math.PI * 2;
        while (delta < -Math.PI) delta += Math.PI * 2;
        if (Math.abs(delta) <= stats.flameAngle) {
          hitAny = true;
          damageEnemy(enemy, stats.damage, '#fb923c', 'flame');
          applyBurn(enemy, stats.damage, stats.burnTime);
        }
      }
      if (hitAny) {
        state.effects.push({
          kind: 'flameCone',
          x: tower.x,
          y: tower.y,
          angle: facing,
          spread: stats.flameAngle,
          range,
          age: 0,
          maxAge: 0.18,
          color: '#fb923c',
        });
        if (tower.flamePatchCooldown <= 0) {
          spawnGroundFlame(tower);
          tower.flamePatchCooldown = 0.16;
        }
      }
    }

    function updateTowers(dt) {
      for (const tower of state.towers) {
        tower.cooldown -= dt;
        tower.armed = Math.max(0, (tower.armed || 0) - dt);
        tower.flamePatchCooldown = Math.max(0, (tower.flamePatchCooldown || 0) - dt);
        if (turretSpriteTypes.has(tower.type)) {
          tower.animTime = (tower.animTime || 0) + dt;
          if (tower.spriteState === 'place') {
            if (tower.animTime >= TURRET_PLACE_DURATION) {
              tower.spriteState = 'idle';
            }
          }
        }
        if (tower.type === 'minigun') {
          tower.minigunAnimTime = (tower.minigunAnimTime || 0) + dt;
          tower.minigunFireTimer = Math.max(0, (tower.minigunFireTimer || 0) - dt);
          tower.minigunSmokeTimer = Math.max(0, (tower.minigunSmokeTimer || 0) - dt);
        }
        if (tower.type === 'minigunMk2') {
          tower.mk2ShotCycle = tower.mk2ShotCycle || 0.14;
          updateMk2SequenceState(tower, dt);
        }
        const stats = getTowerStats(tower);

        if (tower.type === 'mine') {
          if (tower.armed > 0) continue;
          for (let i = state.enemies.length - 1; i >= 0; i--) {
            const enemy = state.enemies[i];
            if (enemy.mode === 'dying' || enemy.mode === 'attacking') continue;
            const dx = enemy.x - tower.x;
            const dy = enemy.y - tower.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= stats.triggerRadius + enemy.radius * 0.35) {
              applyCannonSplash(tower.x, tower.y, stats.splashRadius, stats.damage, true);
              state.towers = state.towers.filter(t => t.id !== tower.id);
              break;
            }
          }
          continue;
        }

        let target = null;
        let bestProgress = -Infinity;

        for (const enemy of state.enemies) {
          if (enemy.mode === 'dying' || enemy.mode === 'attacking') continue;
          const dx = enemy.x - tower.x;
          const dy = enemy.y - tower.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (tower.type === 'minigunMk2') {
            const aimAngle = ((Math.atan2(dy, dx) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
            if (aimAngle < MK2_ARC_RIGHT || aimAngle > MK2_ARC_LEFT) continue;
          }
          if (dist <= stats.range) {
            const progress = enemy.pathIndex * 10000 - dist;
            if (progress > bestProgress) {
              bestProgress = progress;
              target = enemy;
            }
          }
        }

        if (target) {
          if (tower.type === 'minigunMk2') {
            const desiredAngle = clampAngleToMk2Arc(Math.atan2(target.y - tower.y, target.x - tower.x));
            const desiredProgress = getMk2AimProgressFromAngle(desiredAngle);
            tower.mk2TargetProgress = desiredProgress;
            tower.mk2AimProgress = approach(tower.mk2AimProgress || 0, desiredProgress, MK2_TRACK_SPEED * dt);
            tower.facing = getMk2AngleFromProgress(tower.mk2AimProgress);
            tower.mk2VisualBand = getMk2AimBand(tower.mk2AimProgress);
            if (tower.mk2State !== 'placement') {
              updateMk2FireVisualState(tower, tower.mk2VisualBand);
            }
          } else {
            tower.facing = Math.atan2(target.y - tower.y, target.x - tower.x);
            if (turretSpriteTypes.has(tower.type)) updateTurretAimFrame(tower, true);
          }
        } else if (tower.type === 'minigunMk2') {
          const priorState = tower.mk2State;
          tower.mk2AimProgress = approach(tower.mk2AimProgress || 0, 0, MK2_IDLE_RETURN_SPEED * dt);
          tower.facing = getMk2AngleFromProgress(tower.mk2AimProgress);
          tower.mk2VisualBand = getMk2AimBand(tower.mk2AimProgress);
          if (priorState === 'fireStartLeft' || priorState === 'fireLoopLeft' || priorState === 'fireTurnLeftToMid' || priorState === 'fireLoopCenter') {
            setMk2AnimState(tower, 'fireEndLeftSmoke');
          } else if (priorState === 'fireLoopRightMid' || priorState === 'fireTurnRightMidToRight' || priorState === 'fireLoopRight') {
            setMk2AnimState(tower, 'returnLeftAfterFiring');
          } else if (priorState !== 'placement' && !isMk2EndState(priorState)) {
            setMk2AnimState(tower, tower.mk2AimProgress > 0.01 ? 'tracking' : 'idlePose');
          }
        }
        if (tower.type === 'minigun') {
          tower.minigunHasTarget = !!target;
          if (target) {
            tower.minigunVisualBand = getMinigunAimBand(tower);
          } else if (tower.minigunFireTimer <= 0 && tower.minigunSmokeTimer <= 0) {
            tower.minigunVisualBand = 'left';
          }
        }

        if (tower.type === 'minigunMk2' && target && tower.cooldown <= 0 && Math.abs((tower.mk2AimProgress || 0) - (tower.mk2TargetProgress || 0)) <= 0.08) {
          tower.cooldown = stats.fireRate;
          tower.mk2ShotCycle = stats.fireRate;
          const band = getMk2AimBand(tower.mk2AimProgress);
          updateMk2FireVisualState(tower, band);
          spawnShellCasing(tower);
          const origin = getMk2MuzzleWorld(tower);
          const tracer = {
            kind: 'mk2Tracer',
            x1: origin.x,
            y1: origin.y,
            x2: origin.x,
            y2: origin.y,
            age: 0,
            maxAge: 1.0,
          };
          state.effects.push(tracer);
          state.projectiles.push({
            towerType: tower.type,
            x: origin.x,
            y: origin.y,
            prevX: origin.x,
            prevY: origin.y,
            target,
            towerLevel: tower.level,
            speed: towerDefs[tower.type].projectileSpeed,
            damage: stats.damage,
            splashRadius: 0,
            radius: 4,
            tracer,
          });
          continue;
        }

        if (target && tower.cooldown <= 0) {
          tower.cooldown = stats.fireRate;
          if (tower.type === 'flamethrower') {
            applyConeDamage(tower, stats);
            continue;
          }
          if (tower.type === 'cannon') spawnMuzzleFlash(tower);
          if (tower.type === 'minigun') {
            tower.minigunFireTimer = MINIGUN_FIRE_VISUAL_HOLD;
            tower.minigunSmokeTimer = MINIGUN_SMOKE_DURATION;
            spawnShellCasing(tower);
          }
          const origin = turretSpriteTypes.has(tower.type) ? getTurretMuzzleWorld(tower) : { x: tower.x, y: tower.y };
          state.projectiles.push({
            towerType: tower.type,
            x: origin.x,
            y: origin.y,
            target,
            towerLevel: tower.level,
            speed: towerDefs[tower.type].projectileSpeed,
            damage: stats.damage,
            splashRadius: stats.splashRadius || 0,
            radius: tower.type === 'minigun' ? 4 : 7,
          });
        }
      }
    }

    function applyCannonSplash(x, y, splashRadius, damage, fromMine = false) {
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const e = state.enemies[i];
        if (e.mode === 'dying' || e.mode === 'attacking') continue;
        const dx = e.x - x;
        const dy = e.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= splashRadius) {
          const falloff = Math.max(0.35, 1 - dist / Math.max(1, splashRadius));
          damageEnemy(e, damage * falloff, fromMine ? '#f59e0b' : '#fde047', 'explosion');
        }
      }
      addCannonScorch(x, y, Math.max(18, splashRadius * 0.34));
      createExplosion(x, y, fromMine ? '#f59e0b' : '#fde047');
      if (fromMine) {
        state.effects.push({ kind: 'mineBurst', x, y, age: 0, maxAge: 0.28, color: '#f59e0b' });
      } else {
        noteCannonGroundHit(x, y);
      }
      createCannonImpactSprite(x, y, damage);
    }

    function updateProjectiles(dt) {
      for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const p = state.projectiles[i];
        const targetAlive = state.enemies.includes(p.target);
        if (!targetAlive) {
          state.projectiles.splice(i, 1);
          continue;
        }

        const dx = p.target.x - p.x;
        const dy = p.target.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < p.radius + p.target.radius) {
          if (p.towerType === 'cannon') {
            applyCannonSplash(p.target.x, p.target.y, p.splashRadius, p.damage);
          } else {
            addBulletHole(
              p.target.x + (Math.random() * 6 - 3),
              p.target.y + (Math.random() * 6 - 3),
              2 + Math.random() * 2,
              p.towerLevel || 1
            );
            damageEnemy(p.target, p.damage, '#93c5fd', 'bullet');
          }
          state.projectiles.splice(i, 1);
          continue;
        }

        const step = p.speed * dt;
        p.prevX = p.x;
        p.prevY = p.y;
        p.x += (dx / dist) * Math.min(step, dist);
        p.y += (dy / dist) * Math.min(step, dist);
        if (p.tracer) {
          p.tracer.x1 = p.prevX;
          p.tracer.y1 = p.prevY;
          p.tracer.x2 = p.x;
          p.tracer.y2 = p.y;
          p.tracer.age = 0;
        }
      }
    }

    function updateEffects(dt) {
      for (const wall of state.walls) {
        wall.hitFlash = Math.max(0, (wall.hitFlash || 0) - dt);
      }
      for (let i = state.effects.length - 1; i >= 0; i--) {
        const fx = state.effects[i];
        fx.age += dt;
        if (fx.age >= fx.maxAge) state.effects.splice(i, 1);
      }
      for (let i = state.enemyGhosts.length - 1; i >= 0; i--) {
        const ghost = state.enemyGhosts[i];
        ghost.age += dt;
        if (ghost.age >= ghost.maxAge) state.enemyGhosts.splice(i, 1);
      }
      for (let i = state.decals.length - 1; i >= 0; i--) {
        const decal = state.decals[i];
        decal.age += dt;
        if (decal.kind !== 'cannonGroundHit' && decal.age >= decal.maxAge) state.decals.splice(i, 1);
      }

      for (let i = state.enemyGhosts.length - 1; i >= 0; i--) {
        const ghost = state.enemyGhosts[i];
        if (ghost.kind === 'burstPiece') {
          ghost.x += ghost.vx * dt;
          ghost.y += ghost.vy * dt;
          ghost.vy += 160 * dt;
          ghost.vx *= Math.pow(0.12, dt);
          ghost.angle += ghost.spin * dt;
        }
      }

      for (const enemy of state.enemies) {
        if (enemy.burn?.time > 0 && enemy.mode !== 'dying' && enemy.mode !== 'attacking') {
          enemy.burn.time -= dt;
          damageEnemy(enemy, enemy.burn.dps * dt, '#f97316', 'burn');
        }
      }
    }

    function updateCamera(dt) {
      const inTopLeftHud = state.mouseScreen.x < 290 && state.mouseScreen.y < 120;
      const inTopRightHud = state.mouseScreen.x > canvas.width - 220 && state.mouseScreen.y < 120;
      const inBottomLeftHud = state.mouseScreen.x < 180 && state.mouseScreen.y > canvas.height - 160;
      const inBottomRightHud = state.mouseScreen.x > canvas.width - 260 && state.mouseScreen.y > canvas.height - 260;
      const inSelectionHud = state.selectionUiBounds &&
        state.mouseScreen.x >= state.selectionUiBounds.left &&
        state.mouseScreen.x <= state.selectionUiBounds.right &&
        state.mouseScreen.y >= state.selectionUiBounds.top &&
        state.mouseScreen.y <= state.selectionUiBounds.bottom;
      const blockCamera = state.uiHover || inTopLeftHud || inTopRightHud || inBottomLeftHud || inBottomRightHud || inSelectionHud;

      if (!state.dragCamera.active && !blockCamera) {
        const deadzoneX = canvas.width * 0.12;
        const deadzoneY = canvas.height * 0.10;
        const fullReachX = canvas.width * 0.24;
        const fullReachY = canvas.height * 0.21;
        const edgeFlattenX = canvas.width * 0.30;
        const edgeFlattenY = canvas.height * 0.26;
        const edgeSpeed = 230 / state.camera.zoom;
        let targetX = 0;
        let targetY = 0;
        const offsetX = state.mouseScreen.x - canvas.width * 0.5;
        const offsetY = state.mouseScreen.y - canvas.height * 0.5;
        const absX = Math.abs(offsetX);
        const absY = Math.abs(offsetY);

        if (absX > deadzoneX) {
          const t = Math.min(1, (absX - deadzoneX) / Math.max(1, fullReachX - deadzoneX));
          const edgeT = Math.max(0, Math.min(1, (absX - fullReachX) / Math.max(1, edgeFlattenX - fullReachX)));
          targetX = Math.sign(offsetX) * (Math.pow(t, 1.1) * (1 - edgeT * 0.28) + 0.08 * edgeT);
        }

        if (absY > deadzoneY) {
          const t = Math.min(1, (absY - deadzoneY) / Math.max(1, fullReachY - deadzoneY));
          const edgeT = Math.max(0, Math.min(1, (absY - fullReachY) / Math.max(1, edgeFlattenY - fullReachY)));
          targetY = Math.sign(offsetY) * (Math.pow(t, 1.1) * (1 - edgeT * 0.28) + 0.08 * edgeT);
        }

        const panEase = 1 - Math.pow(0.006, dt);
        state.cameraPan.x += (targetX - state.cameraPan.x) * panEase;
        state.cameraPan.y += (targetY - state.cameraPan.y) * panEase;

        state.camera.x += state.cameraPan.x * edgeSpeed * dt;
        state.camera.y += state.cameraPan.y * edgeSpeed * dt;
      } else {
        state.cameraPan.x *= Math.pow(0.002, dt);
        state.cameraPan.y *= Math.pow(0.002, dt);
      }

      const zoomLerp = 1 - Math.pow(0.01, dt);
      state.camera.zoom += (state.camera.targetZoom - state.camera.zoom) * zoomLerp;
      clampCamera();
    }

    function drawBackgroundLayer(parallax, alpha) {
      if (!bgImage.complete) return;
      const sourceW = canvas.width / state.camera.zoom;
      const sourceH = canvas.height / state.camera.zoom;
      const sx = Math.max(0, Math.min(MAP_WIDTH - sourceW, state.camera.x - sourceW / 2 * parallax));
      const sy = Math.max(0, Math.min(MAP_HEIGHT - sourceH, state.camera.y - sourceH / 2 * parallax));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(bgImage, sx, sy, sourceW, sourceH, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    function hexToRgba(hex, alpha) {
      const safe = (hex || '#ffffff').replace('#', '');
      const full = safe.length === 3
        ? safe.split('').map(c => c + c).join('')
        : safe.padEnd(6, 'f').slice(0, 6);
      const value = parseInt(full, 16);
      const r = (value >> 16) & 255;
      const g = (value >> 8) & 255;
      const b = value & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function drawMap() {
      ctx.save();
      ctx.fillStyle = '#31423a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      if (bgImage.complete && bgImage.naturalWidth > 0) {
        drawBackgroundLayer(0.88, 0.42);
        drawBackgroundLayer(0.94, 0.65);
        drawBackgroundLayer(1.0, 1.0);
      } else {
        // Fallback terrain tint while image is loading
        ctx.save();
        ctx.globalAlpha = 0.12;
        for (let i = 0; i < 40; i++) {
          ctx.fillStyle = i % 2 === 0 ? '#8aa08f' : '#44574a';
          ctx.fillRect((i * 53) % canvas.width, (i * 29) % canvas.height, 180, 24);
        }
        ctx.restore();
      }
    }

    
    const SHOW_PATH_DEBUG = false;
    const SHOW_BUILD_DEBUG = false;

    function drawPathDebug() {
      if (!SHOW_PATH_DEBUG) return;
      const paths = Object.values(PATH_VARIANTS);
      ctx.save();
      for (const path of paths) {
        ctx.beginPath();
        const start = worldToScreen(path[0].x, path[0].y);
        ctx.moveTo(start.x, start.y);
        for (let i = 1; i < path.length; i++) {
          const p = worldToScreen(path[i].x, path[i].y);
          ctx.lineTo(p.x, p.y);
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(34,197,94,0.9)';
        ctx.stroke();

        for (const pt of path) {
          const p = worldToScreen(pt.x, pt.y);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#22c55e';
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawBuildZones() {
      if (!SHOW_BUILD_DEBUG || !placementMaskImage.complete || !placementMaskImage.naturalWidth) return;
      ctx.save();
      ctx.globalAlpha = 0.22;
      const tl = worldToScreen(0, 0);
      const br = worldToScreen(MAP_WIDTH, MAP_HEIGHT);
      ctx.drawImage(placementMaskImage, tl.x, tl.y, br.x - tl.x, br.y - tl.y);
      ctx.restore();
    }

function drawGoal() {
      const g = worldToScreen(GOAL.x, GOAL.y);
      ctx.save();
      ctx.beginPath();
      ctx.arc(g.x, g.y, GOAL.radius * state.camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59,130,246,0.26)';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(96,165,250,0.9)';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(g.x, g.y, GOAL.radius * 0.42 * state.camera.zoom, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(191,219,254,0.92)';
      ctx.fill();
      ctx.restore();
    }

    function drawBarricadeSegment(segment, alpha = 1, ghost = false) {
      const img = spriteSheets.barricade.img;
      if (!img.complete || !img.naturalWidth) return;
      const src = segment.kind === 'gate' ? BARRICADE_SPRITES.gate : BARRICADE_SPRITES.straight;
      const p = worldToScreen(segment.x, segment.y);
      const worldLength = Math.hypot(segment.x2 - segment.x1, segment.y2 - segment.y1);
      const drawW = (worldLength + (segment.kind === 'gate' ? 18 : 12)) * state.camera.zoom;
      const drawH = (segment.kind === 'gate' ? 62 : 54) * state.camera.zoom;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(segment.angle);
      ctx.globalAlpha = alpha;
      if (ghost) {
        ctx.filter = 'grayscale(0.12) brightness(1.1)';
      }
      ctx.drawImage(
        img,
        src.sx, src.sy, src.sw, src.sh,
        -drawW / 2,
        -drawH / 2,
        drawW,
        drawH
      );
      if (segment.hitFlash > 0) {
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = Math.min(0.65, segment.hitFlash * 5);
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
      }
      ctx.restore();
    }

    function drawWalls() {
      for (const wall of state.walls) {
        drawBarricadeSegment(wall, 1);
      }
    }

    function drawWallDraft() {
      const segments = getWallDraftSegments();
      if (!segments.length) {
        if (!state.wallDraft || state.wallDraft.phase !== 'awaitStart') return;
        const p = worldToScreen(state.mouseWorld.x, state.mouseWorld.y);
        const valid = isValidWallNode(state.mouseWorld.x, state.mouseWorld.y);
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = valid ? 'rgba(110,231,183,0.55)' : 'rgba(248,113,113,0.55)';
        ctx.fill();
        ctx.restore();
        return;
      }

      const valid = isValidWallChain(segments);
      for (const segment of segments) {
        drawBarricadeSegment(segment, valid ? 0.72 : 0.32, true);
      }

      const cost = getWallChainCost(segments);
      const tail = segments[segments.length - 1];
      const p = worldToScreen(tail.x2, tail.y2);
      ctx.save();
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = valid ? '#f8fafc' : '#fecaca';
      ctx.strokeStyle = 'rgba(15,23,42,0.7)';
      ctx.lineWidth = 4;
      const label = `${cost}`;
      ctx.strokeText(label, p.x, p.y - 12);
      ctx.fillText(label, p.x, p.y - 12);
      ctx.restore();
    }

    function drawTurretSpriteAt(screenX, screenY, frameIndex, alpha = 1) {
      const rect = getTurretSpriteRect(screenX, screenY);
      drawSheetFrame(spriteSheets.turret, frameIndex, rect.x, rect.y, rect.size, rect.size, { alpha });
      return rect;
    }

    function drawTowerSheetAt(screenX, screenY, sheet, frameIndex, alpha = 1) {
      const rect = getTurretSpriteRect(screenX, screenY);
      drawSheetFrame(sheet, frameIndex, rect.x, rect.y, rect.size, rect.size, { alpha });
      return rect;
    }

    function drawPlacedTowers() {
      for (const tower of state.towers) {
        const p = worldToScreen(tower.x, tower.y);
        const selected = tower.id === state.selectedTowerId;
        const def = towerDefs[tower.type];

        ctx.save();
        if (selected) {
          const stats = getTowerStats(tower);
          ctx.globalAlpha = 0.15;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          if (tower.type === 'minigunMk2') {
            ctx.moveTo(p.x, p.y);
            ctx.arc(
              p.x,
              p.y,
              stats.range * state.camera.zoom,
              MK2_ARC_RIGHT,
              MK2_ARC_LEFT
            );
            ctx.closePath();
          } else {
            ctx.arc(p.x, p.y, stats.range * state.camera.zoom, 0, Math.PI * 2);
          }
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        if (tower.type === 'mine') {
          ctx.arc(p.x, p.y, state.mineRadius * state.camera.zoom, 0, Math.PI * 2);
          ctx.fillStyle = tower.armed > 0 ? '#ca8a04' : def.color;
          ctx.fill();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#111827';
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6 * state.camera.zoom, 0, Math.PI * 2);
          ctx.fillStyle = tower.armed > 0 ? '#111827' : '#ef4444';
          ctx.fill();
        } else if (tower.type === 'minigunMk2') {
          const sprite = getMk2SequenceRenderState(tower);
          const rect = getSequenceSpriteRect(p.x, p.y, sprite.frames);
          drawSequenceFrame(sprite.frames, sprite.frameIndex, rect.x, rect.y, rect.width, rect.height);
        } else if (tower.type === 'minigun') {
          const sprite = getMinigunSpriteState(tower);
          drawTowerSheetAt(p.x, p.y, sprite.sheet, sprite.frameIndex);
        } else if (turretSpriteTypes.has(tower.type)) {
          drawTurretSpriteAt(p.x, p.y, getTurretFrameIndex(tower));
        } else {
          ctx.arc(p.x, p.y, state.towerRadius * state.camera.zoom, 0, Math.PI * 2);
          ctx.fillStyle = def.color;
          ctx.fill();
          ctx.lineWidth = selected ? 4 : 2;
          ctx.strokeStyle = selected ? '#f59e0b' : '#111827';
          ctx.stroke();
        }

        if (!turretSpriteTypes.has(tower.type)) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${12 * state.camera.zoom}px Arial`;
          ctx.textAlign = 'center';
          const towerLabel = tower.type === 'minigun' ? 'MG' : tower.type === 'minigunMk2' ? 'M2' : tower.type === 'cannon' ? 'CN' : tower.type === 'flamethrower' ? 'FL' : 'MN';
          ctx.fillText(towerLabel, p.x, p.y + 4 * state.camera.zoom);
        }
        ctx.restore();
      }
    }

    function drawHeldTower() {
      if (!state.heldTower) return;
      const p = worldToScreen(state.heldTower.x, state.heldTower.y);
      const def = towerDefs[state.heldTower.type];
      const stats = { range: def.baseRange };
      const valid = isValidTowerPlacement(state.heldTower.x, state.heldTower.y, state.heldTower.type);

      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = valid ? '#86efac' : '#ef4444';
      ctx.beginPath();
      if (state.heldTower.type === 'minigunMk2') {
        ctx.moveTo(p.x, p.y);
        ctx.arc(
          p.x,
          p.y,
          stats.range * state.camera.zoom,
          MK2_ARC_RIGHT,
          MK2_ARC_LEFT
        );
        ctx.closePath();
      } else {
        ctx.arc(p.x, p.y, stats.range * state.camera.zoom, 0, Math.PI * 2);
      }
      ctx.fill();

      ctx.globalAlpha = 0.45;
      ctx.fillStyle = valid ? def.color : '#ef4444';
      if (turretSpriteTypes.has(state.heldTower.type)) {
        drawTurretSpriteAt(p.x, p.y, 0, valid ? 0.82 : 0.42);
      } else if (state.heldTower.type === 'minigunMk2') {
        const rect = getSequenceSpriteRect(p.x, p.y, mk2Sequences.placement);
        drawSequenceFrame(mk2Sequences.placement, 0, rect.x, rect.y, rect.width, rect.height, valid ? 0.82 : 0.42);
      } else {
        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          (state.heldTower.type === 'mine' ? state.mineRadius : state.towerRadius) * state.camera.zoom,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.restore();
    }


    function drawDecals() {
      for (const decal of state.decals) {
        const p = worldToScreen(decal.x, decal.y);
        const ageT = decal.age / decal.maxAge;
        ctx.save();
        if (decal.kind === 'bulletHole') {
          const frames = decal.frames || bulletHitSingleFrames;
          const animT = Math.min(1, decal.age / (decal.animDuration || 0.35));
          const settleFrame = Math.max(0, Math.min(frames.length - 1, decal.settleFrame ?? (frames.length - 1)));
          const frameIndex = animT >= 1
            ? settleFrame
            : Math.min(settleFrame, Math.floor(animT * (settleFrame + 1)));
          const rect = getSequenceSpriteRect(
            p.x,
            p.y,
            frames,
            (decal.frameHeight || 18) * state.camera.zoom
          );
          const sample = frames?.find(img => img?.naturalWidth && img?.naturalHeight);
          if (sample) {
            drawSequenceFrame(
              frames,
              frameIndex,
              rect.x,
              rect.y,
              rect.width,
              rect.height,
              Math.max(0.26, 0.98 - ageT * 0.05),
              'screen'
            );
          } else {
            ctx.globalAlpha = Math.max(0.18, 0.55 - ageT * 0.18);
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(p.x, p.y, decal.radius * state.camera.zoom, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = Math.max(0.08, 0.25 - ageT * 0.08);
            ctx.strokeStyle = '#3f3f46';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, decal.radius * 1.8 * state.camera.zoom, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (decal.kind === 'scorch') {
          ctx.globalAlpha = Math.max(0.18, 0.42 - ageT * 0.12);
          ctx.fillStyle = '#1f1f1f';
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, decal.radius * state.camera.zoom, decal.radius * 0.68 * state.camera.zoom, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = Math.max(0.08, 0.16 - ageT * 0.04);
          ctx.fillStyle = '#4b5563';
          ctx.beginPath();
          ctx.arc(p.x, p.y, decal.radius * 0.22 * state.camera.zoom, 0, Math.PI * 2);
          ctx.fill();
        } else if (decal.kind === 'cannonGroundHit') {
          const t = Math.min(1, decal.age / decal.maxAge);
          const frameIndex = Math.min(cannonGroundHitFrames.length - 1, Math.floor(t * (cannonGroundHitFrames.length - 1)));
          const rect = getSequenceSpriteRect(p.x, p.y, cannonGroundHitFrames, 86 * state.camera.zoom);
          drawSequenceFrame(
            cannonGroundHitFrames,
            frameIndex,
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            0.98
          );
        }
        ctx.restore();
      }
    }

    function drawWalkerEnemy(p, e) {
      const isDying = e.mode === 'dying';
      const bob = isDying ? 0 : Math.sin(e.animTime * 8) * 1.4 * state.camera.zoom;
      const frames = isDying ? getEnemyDeathSequence(e) : getEnemyWalkSequence(e);
      if (!frames?.length) return;
      const frameIndex = isDying
        ? Math.min(
            Math.max(0, frames.length - 1),
            Math.floor(((e.deathDuration || 0) - e.stateTimer) * (e.deathAnimName === 'explosion' ? WALKER_EXPLOSION_DEATH_FPS : WALKER_DEATH_FPS))
          )
        : Math.floor(e.animTime * WALKER_WALK_FPS) % frames.length;
      const flipX = isDying ? getEnemyDeathFlipX(e) : getEnemyWalkFlipX(e);
      const rect = getPivotedSequenceRect(
        p.x,
        p.y + bob,
        frames,
        WALKER_SPRITE_HEIGHT * state.camera.zoom,
        WALKER_SPRITE_PIVOT
      );

      ctx.save();
      ctx.fillStyle = 'rgba(15,23,42,0.25)';
      ctx.beginPath();
      ctx.ellipse(
        p.x,
        p.y + 4 * state.camera.zoom,
        11 * state.camera.zoom,
        4 * state.camera.zoom,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      if (e.mode === 'hit') {
        drawSequenceFrameExt(frames, frameIndex, rect.x, rect.y, rect.width, rect.height, { alpha: 0.82, flipX });
        drawSequenceFrameExt(frames, frameIndex, rect.x, rect.y, rect.width, rect.height, { alpha: 0.35, flipX, blendMode: 'screen' });
      } else {
        drawSequenceFrameExt(frames, frameIndex, rect.x, rect.y, rect.width, rect.height, { flipX });
      }
      ctx.restore();
    }

    function drawEnemyPlaceholder(p, e) {
      const stormer = e.type === 'stormer';
      const bodyW = (stormer ? 20 : 22) * state.camera.zoom;
      const bodyH = (stormer ? 24 : 28) * state.camera.zoom;
      const bob = Math.sin(e.animTime * (stormer ? 18 : 14)) * (stormer ? 2.2 : 1.6) * state.camera.zoom;
      const hurtTint = e.mode === 'hit' ? '#fca5a5' : '#f8fafc';
      const isAttacking = e.mode === 'attacking' || e.mode === 'attackingWall';
      const bodyColor = e.mode === 'dying'
        ? (stormer ? '#c4b5fd' : '#94a3b8')
        : isAttacking
          ? '#f97316'
          : (stormer ? '#a855f7' : '#ef4444');
      const eyeShift = e.facing === 'left' ? -3 : e.facing === 'right' ? 3 : 0;
      const arrowDir = e.facing === 'left' ? '<' : e.facing === 'right' ? '>' : 'v';
      const stateLabel =
        e.mode === 'dying' ? 'DIE' :
        isAttacking ? 'ATK' :
        e.mode === 'hit' ? 'HIT' :
        (stormer ? 'RUN' : 'WLK');

      ctx.save();
      ctx.translate(p.x, p.y + bob);
      ctx.fillStyle = 'rgba(15,23,42,0.35)';
      ctx.beginPath();
      ctx.ellipse(0, bodyH * 0.55, bodyW * 0.65, bodyH * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = bodyColor;
      ctx.strokeStyle = hurtTint;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-bodyW / 2, -bodyH / 2, bodyW, bodyH, 6 * state.camera.zoom);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#111827';
      ctx.fillRect(-bodyW / 2 + 3, -bodyH / 2 + 3, bodyW - 6, 8 * state.camera.zoom);
      ctx.fillStyle = '#f8fafc';
      ctx.font = `bold ${7 * state.camera.zoom}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(stateLabel, 0, -bodyH / 2 + 9 * state.camera.zoom);

      ctx.fillStyle = '#111827';
      ctx.beginPath();
      ctx.arc(-4 * state.camera.zoom + eyeShift * state.camera.zoom * 0.35, -2 * state.camera.zoom, 2 * state.camera.zoom, 0, Math.PI * 2);
      ctx.arc(4 * state.camera.zoom + eyeShift * state.camera.zoom * 0.35, -2 * state.camera.zoom, 2 * state.camera.zoom, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde68a';
      ctx.font = `bold ${12 * state.camera.zoom}px Arial`;
      ctx.fillText(arrowDir, 0, 11 * state.camera.zoom);
      ctx.restore();
    }

    function drawEnemyHolder(p, e) {
      if (e.type === 'walker') {
        drawWalkerEnemy(p, e);
        return;
      }
      drawEnemyPlaceholder(p, e);
    }

    function drawEnemies() {
      for (const ghost of state.enemyGhosts) {
        const p = worldToScreen(ghost.x, ghost.y);
        ctx.save();
        if (ghost.kind === 'burstPiece') {
          const alpha = Math.max(0, 0.72 - ghost.age / ghost.maxAge * 0.72);
          ctx.translate(p.x, p.y);
          ctx.rotate(ghost.angle || 0);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = ghost.color;
          ctx.beginPath();
          ctx.moveTo(-ghost.size * 0.55 * state.camera.zoom, -ghost.size * 0.3 * state.camera.zoom);
          ctx.lineTo(ghost.size * 0.65 * state.camera.zoom, -ghost.size * 0.15 * state.camera.zoom);
          ctx.lineTo(ghost.size * 0.2 * state.camera.zoom, ghost.size * 0.6 * state.camera.zoom);
          ctx.lineTo(-ghost.size * 0.7 * state.camera.zoom, ghost.size * 0.22 * state.camera.zoom);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = alpha * 0.45;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-ghost.size * 0.18 * state.camera.zoom, -ghost.size * 0.18 * state.camera.zoom, ghost.size * 0.34 * state.camera.zoom, ghost.size * 0.22 * state.camera.zoom);
        } else {
          ctx.globalAlpha = Math.max(0, 0.35 - ghost.age / ghost.maxAge * 0.35);
          ctx.fillStyle = ghost.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 15 * state.camera.zoom, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      for (const e of state.enemies) {
        const p = worldToScreen(e.x, e.y);
        drawEnemyHolder(p, e);

        ctx.save();
        const barW = 34 * state.camera.zoom;
        const hpPct = Math.max(0, e.hp / e.maxHp);
        const barY = e.type === 'walker'
          ? p.y - 70 * state.camera.zoom
          : p.y - 26 * state.camera.zoom;
        ctx.fillStyle = '#111827';
        ctx.fillRect(p.x - barW / 2, barY, barW, 5 * state.camera.zoom);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(p.x - barW / 2, barY, barW * hpPct, 5 * state.camera.zoom);
        ctx.restore();
      }
    }

    function drawProjectiles() {
      for (const p of state.projectiles) {
        if (p.towerType === 'minigunMk2') continue;
        const pos = worldToScreen(p.x, p.y);
        ctx.save();
        ctx.fillStyle = p.towerType === 'minigun' || p.towerType === 'minigunMk2' ? '#93c5fd' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.radius * state.camera.zoom, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function drawEffects() {
      for (const fx of state.effects) {
        const p = worldToScreen(fx.x, fx.y);
        const t = fx.age / fx.maxAge;
        ctx.save();
        if (fx.kind === 'cannonImpact') {
          const frameCount = fx.frameCount || 16;
          const frameIndex = Math.min(frameCount - 1, Math.floor(t * frameCount));
          const size = 132 * state.camera.zoom;
          ctx.globalCompositeOperation = 'screen';
          const blastGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 0.72);
          blastGlow.addColorStop(0, 'rgba(255,244,200,0.72)');
          blastGlow.addColorStop(0.42, 'rgba(251,191,36,0.34)');
          blastGlow.addColorStop(1, 'rgba(251,191,36,0)');
          ctx.fillStyle = blastGlow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 0.72, 0, Math.PI * 2);
          ctx.fill();
          drawSheetFrame(
            spriteSheets.cannonImpact,
            frameIndex,
            p.x - size * 0.5,
            p.y - size * 0.54,
            size,
            size,
            { alpha: Math.max(0, 1 - t * 0.12), blendMode: 'screen' }
          );
        } else if (fx.kind === 'muzzleFlash') {
          const rect = getTurretSpriteRect(p.x, p.y);
          ctx.globalCompositeOperation = 'screen';
          const flashGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rect.size * 0.5);
          flashGlow.addColorStop(0, 'rgba(255,247,214,0.8)');
          flashGlow.addColorStop(0.38, 'rgba(251,191,36,0.28)');
          flashGlow.addColorStop(1, 'rgba(251,191,36,0)');
          ctx.fillStyle = flashGlow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, rect.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          drawSheetFrame(
            spriteSheets.muzzle,
            fx.frameIndex,
            rect.x,
            rect.y,
            rect.size,
            rect.size,
            { alpha: Math.max(0, 0.95 - t), blendMode: 'screen' }
          );
        } else if (fx.kind === 'shellCasing') {
          const life = fx.age / fx.maxAge;
          const worldX = fx.x + fx.vx * fx.age;
          const worldY = fx.y + fx.vy * fx.age + 46 * fx.age * fx.age;
          const shellPos = worldToScreen(worldX, worldY);
          drawSheetFrameRotated(
            spriteSheets.shellCasings,
            fx.frameIndex,
            shellPos.x,
            shellPos.y,
            54 * state.camera.zoom,
            54 * state.camera.zoom,
            fx.rotation + fx.spin * fx.age,
            { alpha: Math.max(0, 0.95 - life * 0.85) }
          );
        } else if (fx.kind === 'groundFlame') {
          const useAltSheet = fx.variant === 'offPath';
          const sheet = useAltSheet ? spriteSheets.groundFlameAlt : spriteSheets.groundFlame;
          const frameIndex = useAltSheet
            ? Math.min(11, Math.floor(t * 12))
            : Math.min(3, Math.floor(t * 4));
          const width = (useAltSheet ? 46 : 116) * state.camera.zoom * fx.scale;
          const height = (useAltSheet ? 46 : 28) * state.camera.zoom * fx.scale;
          ctx.globalAlpha = Math.max(0, 0.2 - t * 0.1);
          const glow = ctx.createRadialGradient(
            p.x,
            p.y - height * 0.15,
            0,
            p.x,
            p.y - height * 0.15,
            width * 0.7
          );
          glow.addColorStop(0, 'rgba(255,210,120,0.7)');
          glow.addColorStop(0.45, 'rgba(251,146,60,0.28)');
          glow.addColorStop(1, 'rgba(251,146,60,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y - height * 0.1, width * 0.7, height * 1.3, 0, 0, Math.PI * 2);
          ctx.fill();
          drawSheetFrame(
            sheet,
            frameIndex,
            p.x - width * 0.5,
            p.y - height * 0.72,
            width,
            height,
            { alpha: Math.max(0, 0.82 - t * 0.48), blendMode: 'screen' }
          );
        } else if (fx.kind === 'mineBurst') {
          const ringR = (10 + t * 28) * state.camera.zoom;
          ctx.globalCompositeOperation = 'screen';
          const mineGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, ringR * 1.3);
          mineGlow.addColorStop(0, 'rgba(255,224,160,0.45)');
          mineGlow.addColorStop(0.5, 'rgba(249,115,22,0.2)');
          mineGlow.addColorStop(1, 'rgba(249,115,22,0)');
          ctx.fillStyle = mineGlow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, ringR * 1.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = Math.max(0, 0.72 - t * 1.1);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = Math.max(1, 5 * (1 - t)) * state.camera.zoom;
          ctx.beginPath();
          ctx.arc(p.x, p.y, ringR, 0, Math.PI * 2);
          ctx.stroke();

          ctx.globalAlpha = Math.max(0, 0.48 - t * 0.95);
          ctx.fillStyle = '#f97316';
          for (let i = 0; i < 5; i++) {
            const a = i / 5 * Math.PI * 2 + t * 3.4;
            const dx = Math.cos(a) * ringR * 0.45;
            const dy = Math.sin(a) * ringR * 0.45;
            ctx.beginPath();
            ctx.arc(p.x + dx, p.y + dy, (3 + (1 - t) * 2.2) * state.camera.zoom, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.globalAlpha = Math.max(0, 0.3 - t * 0.8);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, (6 + (1 - t) * 3) * state.camera.zoom, 0, Math.PI * 2);
          ctx.fill();
        } else if (fx.kind === 'flameCone') {
          ctx.globalAlpha = Math.max(0, 0.32 - t * 0.32);
          ctx.fillStyle = '#fb923c';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.arc(p.x, p.y, fx.range * state.camera.zoom, fx.angle - fx.spread, fx.angle + fx.spread);
          ctx.closePath();
          ctx.fill();
        } else if (fx.kind === 'hitFlash') {
          ctx.globalAlpha = Math.max(0, 0.45 - t * 0.45);
          ctx.fillStyle = fx.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (10 + t * 12) * state.camera.zoom, 0, Math.PI * 2);
          ctx.fill();
        } else if (fx.kind === 'mk2Tracer') {
          const p1 = worldToScreen(fx.x1, fx.y1);
          const p2 = worldToScreen(fx.x2, fx.y2);
          const tracerAlpha = Math.max(0, 1 - t * 5.2);
          const smokeAlpha = Math.max(0, Math.min(1, (t - 0.12) / 0.88));
          const smokeLift = smokeAlpha * 7 * state.camera.zoom;

          if (tracerAlpha > 0.001) {
            ctx.globalCompositeOperation = 'screen';
            ctx.strokeStyle = `rgba(255,240,210,${tracerAlpha * 0.45})`;
            ctx.lineWidth = Math.max(1.25, 2.8 * state.camera.zoom);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            ctx.strokeStyle = `rgba(255,255,255,${tracerAlpha * 0.96})`;
            ctx.lineWidth = Math.max(0.8, 0.95 * state.camera.zoom);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }

          if (smokeAlpha > 0.001) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = `rgba(210,214,220,${(1 - smokeAlpha) * 0.16})`;
            ctx.lineWidth = Math.max(1.4, 3.2 * state.camera.zoom);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y - smokeLift * 0.22);
            ctx.lineTo(p2.x, p2.y - smokeLift);
            ctx.stroke();

            ctx.strokeStyle = `rgba(243,244,246,${(1 - smokeAlpha) * 0.09})`;
            ctx.lineWidth = Math.max(0.7, 1.25 * state.camera.zoom);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y - smokeLift * 0.18);
            ctx.lineTo(p2.x, p2.y - smokeLift * 0.85);
            ctx.stroke();
          }
        } else {
          const radius = (20 + t * 42) * state.camera.zoom;
          ctx.globalCompositeOperation = 'screen';
          const genericGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 1.25);
          genericGlow.addColorStop(0, 'rgba(255,244,220,0.5)');
          genericGlow.addColorStop(0.44, `${hexToRgba(fx.color, 0.24)}`);
          genericGlow.addColorStop(1, `${hexToRgba(fx.color, 0)}`);
          ctx.fillStyle = genericGlow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 1.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = Math.max(0, 0.7 - t);
          ctx.fillStyle = fx.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = Math.max(0, 0.45 - t);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 0.55, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function drawWaveState() {
      if (!state.currentWaveRunning && !state.gameOver) {
        ctx.save();
        ctx.fillStyle = 'rgba(17,24,39,0.72)';
        ctx.fillRect(canvas.width / 2 - 185, 18, 370, 42);
        ctx.fillStyle = '#f9fafb';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Build phase — place defenses or start the next wave', canvas.width / 2, 45);
        ctx.restore();
      }

      if (state.gameOver) {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 42px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '20px Arial';
        ctx.fillText('Press Reset Run to try again', canvas.width / 2, canvas.height / 2 + 30);
        ctx.restore();
      }
    }

    function ensurePostFxCanvas() {
      if (postFxCanvas.width !== canvas.width || postFxCanvas.height !== canvas.height) {
        postFxCanvas.width = canvas.width;
        postFxCanvas.height = canvas.height;
      }
      if (edgeFxCanvas.width !== canvas.width || edgeFxCanvas.height !== canvas.height) {
        edgeFxCanvas.width = canvas.width;
        edgeFxCanvas.height = canvas.height;
      }
    }

    function getLensWarpProfile() {
      const zoom = state.camera.zoom;
      if (zoom >= 1.01) {
        const t = Math.min(1, (zoom - 1.01) / 0.18);
        return { mode: 'ground', amount: 0.016 + t * 0.028, chroma: 0.55 + t * 1.15 };
      }
      const t = Math.min(1, Math.max(0, (1.01 - zoom) / 0.16));
      return { mode: 'aerial', amount: 0.01 + t * 0.02, chroma: 0 };
    }

    function applyLensWarp() {
      ensurePostFxCanvas();
      const { mode, amount, chroma } = getLensWarpProfile();
      postFxCtx.clearRect(0, 0, postFxCanvas.width, postFxCanvas.height);
      postFxCtx.drawImage(canvas, 0, 0);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const stripH = 2;
      for (let y = 0; y < canvas.height; y += stripH) {
        const ny = ((y + stripH * 0.5) / canvas.height) * 2 - 1;
        const influence = mode === 'ground'
          ? Math.pow(Math.abs(ny), 1.7)
          : 1 - Math.pow(Math.abs(ny), 1.6);
        const drawW = canvas.width * (1 + amount * influence);
        const dx = (canvas.width - drawW) * 0.5;
        const curve = (mode === 'ground' ? -1 : 1) * amount * 14 * (1 - ny * ny);
        ctx.drawImage(
          postFxCanvas,
          0,
          y,
          canvas.width,
          stripH,
          dx,
          y + curve,
          drawW,
          stripH + 1
        );
      }

      if (chroma > 0.01) {
        edgeFxCtx.clearRect(0, 0, edgeFxCanvas.width, edgeFxCanvas.height);
        edgeFxCtx.save();
        edgeFxCtx.drawImage(postFxCanvas, 0, 0);
        edgeFxCtx.globalCompositeOperation = 'destination-in';
        const edgeMask = edgeFxCtx.createRadialGradient(
          canvas.width * 0.5,
          canvas.height * 0.5,
          canvas.width * 0.24,
          canvas.width * 0.5,
          canvas.height * 0.5,
          canvas.width * 0.73
        );
        edgeMask.addColorStop(0, 'rgba(255,255,255,0)');
        edgeMask.addColorStop(0.55, 'rgba(255,255,255,0)');
        edgeMask.addColorStop(0.82, 'rgba(255,255,255,0.35)');
        edgeMask.addColorStop(1, 'rgba(255,255,255,0.95)');
        edgeFxCtx.fillStyle = edgeMask;
        edgeFxCtx.fillRect(0, 0, canvas.width, canvas.height);
        edgeFxCtx.restore();

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = Math.min(0.1, chroma * 0.055);
        ctx.drawImage(edgeFxCanvas, -chroma, 0);
        ctx.globalAlpha = Math.min(0.085, chroma * 0.045);
        ctx.drawImage(edgeFxCanvas, chroma, 0);
        ctx.restore();
      }

      const vignette = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.height * 0.08,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.75
      );
      vignette.addColorStop(0, 'rgba(255,255,255,0)');
      vignette.addColorStop(0.72, 'rgba(15,23,42,0)');
      vignette.addColorStop(1, 'rgba(15,23,42,0.1)');
      ctx.save();
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    function drawWorld() {
      drawMap();
      drawGoal();
      drawPathDebug();
      drawBuildZones();
      drawDecals();
      drawWalls();
      drawPlacedTowers();
      drawHeldTower();
      drawWallDraft();
      drawEnemies();
      drawProjectiles();
      drawEffects();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWorld();
      applyLensWarp();
      drawWaveState();
    }

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      state.mouseScreen.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      state.mouseScreen.y = (e.clientY - rect.top) * (canvas.height / rect.height);
      state.mouseWorld = screenToWorld(state.mouseScreen.x, state.mouseScreen.y);

      if (state.heldTower) {
        state.heldTower.x = state.mouseWorld.x;
        state.heldTower.y = state.mouseWorld.y;
      }
      if (state.wallDraft) {
        state.wallDraft.current = { x: state.mouseWorld.x, y: state.mouseWorld.y };
      }

      if (state.dragCamera.active) {
        const dx = (state.mouseScreen.x - state.dragCamera.startX) / state.camera.zoom;
        const dy = (state.mouseScreen.y - state.dragCamera.startY) / state.camera.zoom;
        state.camera.x = state.dragCamera.camX - dx;
        state.camera.y = state.dragCamera.camY - dy;
        clampCamera();
      }
    }

    canvas.addEventListener('mousemove', onPointerMove);

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 1) {
        e.preventDefault();
        state.dragCamera.active = true;
        state.dragCamera.startX = state.mouseScreen.x;
        state.dragCamera.startY = state.mouseScreen.y;
        state.dragCamera.camX = state.camera.x;
        state.dragCamera.camY = state.camera.y;
        return;
      }

      if (e.button !== 0) return;

      state.radialMenuOpen = false;

      if (state.heldTower) {
        dropHeldTower();
        return;
      }

      if (state.wallDraft) {
        if (state.wallDraft.phase === 'awaitStart') {
          if (!isValidWallNode(state.mouseWorld.x, state.mouseWorld.y)) {
            showToast('Walls must start in blue fortification zones');
            return;
          }
          state.wallDraft.phase = 'dragging';
          state.wallDraft.start = snapWallPoint(state.mouseWorld.x, state.mouseWorld.y);
          state.wallDraft.current = { ...state.wallDraft.start };
          showToast('Click again to place barricade');
          return;
        }
        placeWallChain(getWallDraftSegments());
        return;
      }

      selectTowerAt(state.mouseWorld.x, state.mouseWorld.y);
    });

    canvas.addEventListener('mouseup', (e) => {
      if (e.button === 1) state.dragCamera.active = false;
    });

    canvas.addEventListener('mouseleave', () => {
      state.dragCamera.active = false;
    });

    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (state.wallDraft) {
        cancelWallDraft();
        return;
      }
      cancelHeldTower();
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const oldWorld = screenToWorld(state.mouseScreen.x, state.mouseScreen.y);
      const zoomDelta = e.deltaY < 0 ? 1.07 : 0.935;
      state.camera.targetZoom = Math.max(0.625, Math.min(1.12, state.camera.targetZoom * zoomDelta));
      const projected = screenToWorld(state.mouseScreen.x, state.mouseScreen.y);
      const shiftX = oldWorld.x - projected.x;
      const shiftY = oldWorld.y - projected.y;
      state.camera.x += shiftX * 1.04;
      state.camera.y += shiftY * 1.04;
      clampCamera();
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
      state.keys[e.code] = true;
      if (e.code === 'Escape') {
        if (state.wallDraft) {
          cancelWallDraft();
        } else {
          cancelHeldTower();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      state.keys[e.code] = false;
    });

    const interactiveHudButtons = [
      ui.defenseToggle,
      ui.buyMinigun,
      ui.buyMinigunMk2,
      ui.buyCannon,
      ui.buyFlamethrower,
      ui.buyMine,
      ui.buyPlaceholder,
      ui.playWaveBtn,
      ui.resetBtn,
      ui.upgradeBtn,
      ui.upgradeRangeBtn,
      ui.upgradeRateBtn,
      ui.upgradeDamageBtn,
    ];

    for (const button of interactiveHudButtons) {
      if (!button) continue;
      button.addEventListener('mouseenter', () => {
        state.uiHover = true;
        state.cameraPan.x = 0;
        state.cameraPan.y = 0;
      });
      button.addEventListener('mouseleave', () => {
        state.uiHover = false;
      });
    }

    ui.defenseToggle.addEventListener('click', () => {
      state.radialMenuOpen = !state.radialMenuOpen;
      updateHUD();
    });
    ui.buyMinigun.addEventListener('click', () => spawnHeldTower('minigun'));
    ui.buyMinigunMk2.addEventListener('click', () => spawnHeldTower('minigunMk2'));
    ui.buyCannon.addEventListener('click', () => spawnHeldTower('cannon'));
    ui.buyFlamethrower.addEventListener('click', () => spawnHeldTower('flamethrower'));
    ui.buyMine.addEventListener('click', () => spawnHeldTower('mine'));
    ui.buyPlaceholder.addEventListener('click', startWallDraft);
    ui.upgradeBtn.addEventListener('click', () => {
      const tower = getSelectedTower();
      if (!tower) return;
      state.upgradeMenuOpen = !state.upgradeMenuOpen;
      updateHUD();
    });
    ui.upgradeRangeBtn.addEventListener('click', () => upgradeSelectedTower('range'));
    ui.upgradeRateBtn.addEventListener('click', () => upgradeSelectedTower('rate'));
    ui.upgradeDamageBtn.addEventListener('click', () => upgradeSelectedTower('damage'));
    ui.playWaveBtn.addEventListener('click', handlePlayWaveAction);
    ui.resetBtn.addEventListener('click', resetGame);

    let lastTime = performance.now();
    function loop(now) {
      const dt = Math.min(0.033, (now - lastTime) / 1000);
      lastTime = now;

      if (!state.gameOver) {
        updateCamera(dt);
        updateSpawning(dt);
        updateEnemies(dt);
        updateTowers(dt);
        updateProjectiles(dt);
        updateEffects(dt);
        completeWaveIfDone();
      } else {
        updateEffects(dt);
      }

      updateHUD();
      draw();
      requestAnimationFrame(loop);
    }

    beginPlayEquivalent();
    requestAnimationFrame(loop);
