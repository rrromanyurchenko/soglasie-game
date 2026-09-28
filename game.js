'use strict';

/* «Согласие» — праздничный раннер. Phaser 3.60. */

const WIN_FORM_URL = 'https://33.soglasie.ru/win';

const PROMO_URL =
    'https://www.soglasie.ru/puteshestviya/kalkulyator-strahovaniya-vyezjayushih-za-rubej/' +
    '?utm_campaign=dr_33&utm_medium=igra_dr&utm_content=promo_code_vzr';

const BASE_W = 960;
const H = 540;
const BG_W = 960;
const TARGET_DISTANCE = 3300;
const METERS_PER_PIXEL = 0.08;

const ROAD_VISIBLE_HEIGHT = 155;
const GROUND_Y = 500;
const SHADOW_Y = GROUND_Y - 3;
const OBSTACLE_BOTTOM_Y = GROUND_Y - 4;

const BAKERY_HEIGHT = 540;
// Стык тротуара кондитерской с дорожкой: ещё на 9 игровых пикселей выше.
const BAKERY_BOTTOM_Y = H - 1;
// При старте левая граница здания совпадает с краем игрового экрана.
// Офисный PNG содержит собственную ограду и тротуар.
const OFFICE_HEIGHT = H;
const OFFICE_BOTTOM_Y = H;

/*
 * Прежняя высота отображения была около 116 игровых пикселей.
 * Теперь 155. Одинаковый scaleX/scaleY для ВСЕХ кадров героя.
 */
const HERO_DISPLAY_HEIGHT = 155;

// Общая физика одинакова; отличается только способность героя.
const HERO_GRAVITY = 1600;
const HERO_JUMP_FORCE = -820;
const HEROES = {
    artem: { prefix: 'p', gravityY: HERO_GRAVITY, jumpForce: -930, hearts: 2, shields: 0, boxes: 0 },
    maksim: { prefix: 'o', gravityY: HERO_GRAVITY, jumpForce: HERO_JUMP_FORCE, hearts: 2, shields: 1, boxes: 0 },
    viktoria: { prefix: 'g', gravityY: HERO_GRAVITY, jumpForce: HERO_JUMP_FORCE, hearts: 2, shields: 0, boxes: 0 }
};

const ASSETS = {
    bg_seg_1: 'https://static.tildacdn.com/tild3137-3365-4137-b064-653761333736/1.jpg',
    bg_seg_2: 'https://static.tildacdn.com/tild3566-3564-4338-a536-376362373339/2.jpg',
    bg_seg_3: 'https://static.tildacdn.com/tild3234-6237-4439-b565-363361613462/3.jpg',
    bg_seg_4: 'https://static.tildacdn.com/tild3065-3265-4238-b739-653932643830/4.jpg',
    bg_seg_5: 'https://static.tildacdn.com/tild3339-3938-4362-b836-326563313361/5.jpg',
    bg_seg_6: 'https://static.tildacdn.com/tild3432-6237-4562-a534-356365623136/6.jpg',
    bg_seg_7: 'https://static.tildacdn.com/tild3033-3763-4361-a561-373239303463/7.jpg',

    road_tex: 'https://static.tildacdn.com/tild6432-3031-4361-b634-616538333964/road.png',
    bakery: 'https://static.tildacdn.com/tild3133-6339-4534-b532-613938663837/bakery.png',
    office: 'https://static.tildacdn.com/tild6434-3461-4932-a466-643136336132/-_.png',
    logo_33: 'https://static.tildacdn.com/tild3362-3565-4136-a661-313237623834/_6.png',

    choose_screen: 'https://static.tildacdn.com/tild6132-3837-4839-b332-383362333666/choose.png',
    die_screen: 'https://static.tildacdn.com/tild6530-6462-4966-a131-326531393162/die2.png',
    win_screen: 'https://static.tildacdn.com/tild3562-6264-4561-b131-363764646361/win.png',

    hud_bar: 'https://static.tildacdn.com/tild3439-3938-4165-b038-653031613135/distance_time.png',
    hud_heart: 'https://static.tildacdn.com/tild3161-3133-4566-a435-353934316363/heart.png',
    hud_shield: 'https://static.tildacdn.com/tild3236-3665-4361-b930-643064643635/shield.png',
    hud_box: 'https://static.tildacdn.com/tild3537-3734-4430-b865-613432363734/box.png',

    obs_barrier: 'https://static.tildacdn.com/tild6461-3135-4230-a637-333236326137/barrier.png',
    obs_pallet: 'https://static.tildacdn.com/tild3338-3865-4665-b139-643062306537/tiles.png',
    obs_scooter: 'https://static.tildacdn.com/tild3062-6131-4339-b566-666639633066/scooter.png',
    obs_pot: 'https://static.tildacdn.com/tild6566-3334-4562-b336-343730663131/flower.png',

    bird_1: 'https://static.tildacdn.com/tild6263-6166-4266-a661-623631616233/gull.png',
    bird_2: 'https://static.tildacdn.com/tild3338-6636-4763-b961-386536343534/gull2.png',
    bird_3: 'https://static.tildacdn.com/tild3462-3030-4236-a137-353336626536/gull3.png',
    bird_4: 'https://static.tildacdn.com/tild6533-6230-4633-b438-303962353138/gull4.png',
    bird_5: 'https://static.tildacdn.com/tild3833-6434-4463-b839-633430643130/gull5.png',
    bird_low_1: 'https://static.tildacdn.com/tild6235-6263-4163-b630-643265626565/b1.png',
    bird_low_2: 'https://static.tildacdn.com/tild6133-3830-4635-a563-303932653431/b2.png',
    bird_low_3: 'https://static.tildacdn.com/tild6134-3038-4139-a463-363134626531/b3.png',
    bird_low_4: 'https://static.tildacdn.com/tild3634-6465-4461-b366-303065333835/b5.png',
    bird_dive_1: 'https://static.tildacdn.com/tild3162-3634-4835-b666-356631353165/b7.png',
    bird_dive_2: 'https://static.tildacdn.com/tild3063-3166-4139-a165-323738613733/b8.png',
    bird_dive_3: 'https://static.tildacdn.com/tild6434-6230-4235-a265-666564663731/b9.png',

    bonus_box: 'https://static.tildacdn.com/tild6266-3762-4931-b336-636566343761/box.png',
    bonus_shield: 'https://static.tildacdn.com/tild3734-3066-4761-a136-643662383662/shield.png',
    bonus_heart: 'https://static.tildacdn.com/tild3236-3161-4833-b034-646131636231/heart.png',

    g1: 'https://static.tildacdn.com/tild6665-3631-4636-b265-323732303435/g1.png',
    g2: 'https://static.tildacdn.com/tild6263-3438-4436-a365-333536303232/g2.png',
    g3: 'https://static.tildacdn.com/tild3532-3539-4465-a338-313761613530/g3.png',
    g4: 'https://static.tildacdn.com/tild3332-3135-4133-b934-326133353239/g4.png',
    g5: 'https://static.tildacdn.com/tild3766-3066-4364-b938-343931326330/g5.png',
    g6: 'https://static.tildacdn.com/tild6661-3466-4431-b336-343132636139/g6.png',
    g7: 'https://static.tildacdn.com/tild3637-3737-4639-a130-336461653231/g7.png',
    g8: 'https://static.tildacdn.com/tild3534-6232-4839-b865-393962316633/g8.png',
    g9: 'https://static.tildacdn.com/tild6361-6332-4666-a338-633833633161/g9.png',

    o1: 'https://static.tildacdn.com/tild6631-3736-4463-b934-653434636438/o1.png',
    o2: 'https://static.tildacdn.com/tild6237-6333-4835-a361-306634313363/o2.png',
    o3: 'https://static.tildacdn.com/tild6535-3764-4134-b839-393662303964/o3.png',
    o4: 'https://static.tildacdn.com/tild6636-6532-4234-b362-346437326634/o4.png',
    o5: 'https://static.tildacdn.com/tild3031-3231-4032-a434-326563653339/o5.png',
    o6: 'https://static.tildacdn.com/tild6164-6238-4363-b536-633534343633/o6.png',
    o7: 'https://static.tildacdn.com/tild3139-3764-4865-b932-336266343233/o7.png',
    o8: 'https://static.tildacdn.com/tild6230-6336-4465-b436-393431346232/o8.png',
    o9: 'https://static.tildacdn.com/tild3566-3739-4936-b931-623561633536/o9.png',

    p1: 'https://static.tildacdn.com/tild3732-6665-4130-b939-383439316662/p1.png',
    p2: 'https://static.tildacdn.com/tild3462-3334-4166-a130-613536616138/p2.png',
    p3: 'https://static.tildacdn.com/tild3831-6136-4533-a166-396632303162/p3.png',
    p4: 'https://static.tildacdn.com/tild3633-3234-4436-b738-643536356535/p4.png',
    p5: 'https://static.tildacdn.com/tild3339-3265-4134-b332-323436353162/p5.png',
    p6: 'https://static.tildacdn.com/tild6361-6436-4161-b764-313637393833/p6.png',
    p7: 'https://static.tildacdn.com/tild6633-3635-4365-b630-643431333164/p7.png',
    p8: 'https://static.tildacdn.com/tild3263-6538-4662-b365-383835376363/p8.png',
    p9: 'https://static.tildacdn.com/tild6434-6666-4566-b133-636432383361/p9.png'
};

/* =========================== Экран =========================== */

function isTouchDevice() {
    return window.matchMedia('(pointer: coarse)').matches;
}

// Без viewport-тега мобильный браузер может сохранить портретную
// «виртуальную» ширину страницы даже после поворота. Ставим тег до
// создания Phaser; HTML страницы по возможности тоже должен содержать его.
function ensureMobileViewportMeta() {
    if (!isTouchDevice()) return;
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
    }
    const content = meta.getAttribute('content') || '';
    if (!/width\s*=\s*device-width/i.test(content)) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
    }
}

ensureMobileViewportMeta();

function isLandscapeViewport() {
    // При повороте orientation меняется раньше размеров visualViewport.
    const orientation = window.screen && window.screen.orientation;
    if (orientation && orientation.type) return orientation.type.startsWith('landscape');
    if (typeof window.orientation === 'number') return Math.abs(window.orientation) === 90;
    return window.matchMedia('(orientation: landscape)').matches;
}

function viewportSize() {
    const vv = window.visualViewport;
    let width = vv ? vv.width : window.innerWidth;
    let height = vv ? vv.height : window.innerHeight;
    if (!isTouchDevice()) return { width, height };

    // visualViewport иногда задерживается на старой портретной геометрии.
    // На такой короткий промежуток используем физическую ширину экрана
    // в CSS-пикселях (а не старую ширину обёртки / canvas).
    const sw = window.screen && window.screen.width || 0;
    const sh = window.screen && window.screen.height || 0;
    if (isLandscapeViewport() && width < height) {
        width = Math.max(window.innerWidth || 0, sw, sh, width, height);
        height = Math.min(window.innerHeight || height, sw || height, sh || height, height);
    }
    return { width, height };
}

function syncMobileViewport() {
    if (!isTouchDevice()) return;

    const wrapper = document.getElementById('game-wrapper');
    const container = document.getElementById('game-container');
    if (!wrapper || !container) return;

    // Не берём размеры wrapper: после поворота CSS страницы может оставлять
    // ему старую портретную ширину. Берём реальный видимый viewport.
    const vp = viewportSize();
    const width = Math.round(vp.width);
    const height = Math.round(vp.height);
    if (width < 1 || height < 1) return;

    Object.assign(wrapper.style, {
        position: 'fixed',
        left: '0',
        top: '0',
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        margin: '0',
        zIndex: '9999'
    });
    Object.assign(container.style, {
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        maxHeight: 'none'
    });
}

function calculateWidth() {
    // Размер игры не должен зависеть от устаревшего размера DOM-обёртки.
    const vp = viewportSize();
    const wrapper = document.getElementById('game-wrapper');
    const rect = wrapper ? wrapper.getBoundingClientRect() : null;
    const width = isTouchDevice() ? vp.width : (rect && rect.width) || vp.width;
    const height = isTouchDevice() ? vp.height : (rect && rect.height) || vp.height;
    return Math.max(320, Math.round(H * width / Math.max(1, height)));
}

syncMobileViewport();
let gameWidth = calculateWidth();
let viewportResizeTimers = [];

// Размер окна может изменяться поэтапно при повороте экрана и скрытии
// адресной строки. Пересчитываем сцену несколько раз без reload страницы.
function scheduleViewportResize() {
    viewportResizeTimers.forEach(clearTimeout);
    viewportResizeTimers = [];
    resizeGame();
    [100, 300, 700, 1500].forEach(delay => {
        viewportResizeTimers.push(setTimeout(resizeGame, delay));
    });
}

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: gameWidth,
    height: H,
    backgroundColor: '#0b131e',

    render: {
        antialias: true,
        pixelArt: false,
        resolution: Math.min(window.devicePixelRatio || 1, 2)
    },

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1600 },
            debug: false
        }
    },

    scale: {
        // На телефоне FIT и ручная подгонка canvas боролись за его CSS-размер:
        // при повороте игра то раскрывалась, то схлопывалась до 183×309.
        // Оставляем одного владельца размера: игровую область меняет resize(),
        // а отображаемый canvas заполняет контейнер через fitMobileCanvas().
        mode: isTouchDevice() ? Phaser.Scale.NONE : Phaser.Scale.FIT,
        autoCenter: isTouchDevice() ? Phaser.Scale.NO_CENTER : Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
        width: gameWidth,
        height: H
    },

    scene: { preload, create, update }
};

new Phaser.Game(config);

/* ========================= Состояние ========================= */

let sceneRef = null;
let player, playerView, playerShadow, floor;
let roadSprite = null;
let roadScale = 1;

let backgrounds = [];
let nextBackgroundIndex = 1;

let bakerySprite = null;

let obstacles, platforms, bonuses, birds;
let cursors, keys;

let hudBar, hudDistance, hudTimer, hudLogo;
let hudHeart, hudShield, hudBox;
let hudHeartCount, hudShieldCount, hudBoxCount;
let warningText;

let currentUI = null;
let officeGroup = null;

let gameState = 'START_SCREEN';
let selectedHero = 'artem';

let realDistance = 0;
let gameSeconds = 0;
let baseSpeed = 315;

let nextObstacle = 130;
let nextBonus = 75;
let nextBird = 280;
let birdAttackPending = false;
let lastBirdDistance = -1000;
let lastObstacleDistance = -1000;

let hearts = 1;
let shields = 0;
let boxes = 0;

let jumpCount = 0;
let isSliding = false;
let invulnerable = false;
let canRestart = false;
let portraitBlocked = false;

let runTimer = 0;
let runFrame = 1;
let birdTimer = 0;
let birdFrame = 1;
let birdAttackNumber = 0;

let raceId = 0;
let invulnerabilityTween = null;
let heroScales = {};
let slideScale = {};

window.touchMoveLeft = false;
window.touchMoveRight = false;
window.touchSlideActive = false;

/* ============================ Звук ============================ */

const SoundFx = {
    ctx: null,

    tone(freq, type, duration, endFreq) {
        try {
            if (!this.ctx) {
                const AudioContextClass =
                    window.AudioContext || window.webkitAudioContext;

                if (!AudioContextClass) return;
                this.ctx = new AudioContextClass();
            }

            if (this.ctx.state === 'suspended') this.ctx.resume();

            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);

            if (endFreq) {
                osc.frequency.exponentialRampToValueAtTime(
                    Math.max(1, endFreq),
                    now + duration
                );
            }

            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                now + duration
            );

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (error) {
            // Если браузер заблокировал звук, игра продолжает работать.
        }
    },

    jump() { this.tone(280, 'sine', 0.22, 600); },
    slide() { this.tone(180, 'triangle', 0.23, 80); },
    bonus() { this.tone(650, 'sine', 0.2, 900); },
    hit() { this.tone(120, 'square', 0.35, 40); },
    gull() { this.tone(900, 'sawtooth', 0.3, 300); },

    win() {
        [440, 554, 659, 880].forEach((freq, index) => {
            setTimeout(
                () => this.tone(freq, 'triangle', 0.35),
                index * 150
            );
        });
    }
};

/* =========================== Ресурсы =========================== */

function preload() {
    this.load.crossOrigin = 'anonymous';

    this.load.on('loaderror', file => {
        console.error(
            '[Игра] Не загрузился ресурс:',
            file.key,
            file.src
        );
    });

    const dummy = document.createElement('canvas');
    dummy.width = 48;
    dummy.height = 92;
    this.textures.addCanvas('hitbox_dummy', dummy);

    Object.entries(ASSETS).forEach(([key, url]) => {
        this.load.image(key, url);
    });
}

function calculateHeroScales(scene) {
    Object.entries(HEROES).forEach(([heroKey, hero]) => {
        let maximumHeight = 1;
        let runningHeight = 1;

        for (let frame = 1; frame <= 8; frame++) {
            const key = hero.prefix + frame;
            if (!scene.textures.exists(key)) continue;
            const source = scene.textures.get(key).getSourceImage();
            maximumHeight = Math.max(maximumHeight, source.height || 1);
            if (frame <= 6) runningHeight = Math.max(runningHeight, source.height || 1);
        }

        heroScales[heroKey] = HERO_DISPLAY_HEIGHT / maximumHeight;
        const slideKey = hero.prefix + '9';
        const slideHeight = scene.textures.exists(slideKey)
            ? scene.textures.get(slideKey).getSourceImage().height || 1
            : runningHeight;
        // Масштаб кадра приседания считаем по его собственной высоте:
        // при смене позы персонаж остаётся того же порядка величины.
        // 0.9 оставляет его ниже бегущего, но не уменьшает целиком вдвое.
        // У девушки и очкарика крупные прозрачные поля в кадре приседа:
        // чуть увеличиваем только этот кадр, не меняя физику или хитбокс.
        const slideCorrection = heroKey === 'artem' ? 1 : 1.09;
        slideScale[heroKey] = heroScales[heroKey] * runningHeight * 0.9 / slideHeight * slideCorrection;
    });
}

function setHeroFrame(frame) {
    const key = HEROES[selectedHero].prefix + frame;

    if (!sceneRef.textures.exists(key)) return;

    playerView
        .setTexture(key)
        .setScale(frame === 9 ? slideScale[selectedHero] : heroScales[selectedHero]);
}

/* ========================== Фоны ========================== */

function createBackgrounds(scene) {
    const count = Math.ceil(gameWidth / BG_W) + 2;

    for (let i = 0; i < count; i++) {
        backgrounds.push(
            scene.add
                .image(
                    BG_W / 2 + i * BG_W,
                    H / 2,
                    `bg_seg_${i % 7 + 1}`
                )
                .setDisplaySize(BG_W, H)
                .setDepth(1)
        );
    }

    nextBackgroundIndex = count % 7 + 1;
}

function ensureBackgroundCoverage(scene) {
    if (!backgrounds.length) return;

    let rightEdge = Math.max(
        ...backgrounds.map(bg => bg.x + BG_W / 2)
    );

    while (rightEdge < gameWidth + BG_W) {
        backgrounds.push(
            scene.add
                .image(
                    rightEdge + BG_W / 2,
                    H / 2,
                    `bg_seg_${nextBackgroundIndex}`
                )
                .setDisplaySize(BG_W, H)
                .setDepth(1)
        );

        nextBackgroundIndex =
            nextBackgroundIndex % 7 + 1;

        rightEdge += BG_W;
    }
}

function resetBackgrounds(scene) {
    backgrounds.forEach(bg => bg.destroy());
    backgrounds = [];
    createBackgrounds(scene);
}

function scrollBackgrounds(scene, amount) {
    backgrounds.forEach(bg => {
        bg.x -= amount;
    });

    backgrounds.forEach(bg => {
        if (bg.x > -BG_W / 2) return;

        const rightmostX = Math.max(
            ...backgrounds.map(other => other.x)
        );

        bg.setTexture(`bg_seg_${nextBackgroundIndex}`);
        bg.x = rightmostX + BG_W;

        nextBackgroundIndex =
            nextBackgroundIndex % 7 + 1;
    });

    ensureBackgroundCoverage(scene);
}

function createRoad(scene) {
    if (!scene.textures.exists('road_tex')) return;

    const source = scene.textures
        .get('road_tex')
        .getSourceImage();

    roadScale = Math.min(
        1,
        BASE_W / Math.max(1, source.width)
    );

    const visibleHeight = Math.min(
        ROAD_VISIBLE_HEIGHT,
        source.height * roadScale
    );

    roadSprite = scene.add
        .tileSprite(
            gameWidth / 2,
            H - visibleHeight / 2,
            gameWidth,
            visibleHeight,
            'road_tex'
        )
        .setDepth(5);

    // Одинаковый масштаб по X и Y: ограждение не плющится.
    roadSprite.tileScaleX = roadScale;
    roadSprite.tileScaleY = roadScale;

    roadSprite.tilePositionY = Math.max(
        0,
        source.height - visibleHeight / roadScale
    );
}

function removeBakery() {
    if (bakerySprite) {
        bakerySprite.destroy();
        bakerySprite = null;
    }
}

function createBakery(scene) {
    removeBakery();
    if (!scene.textures.exists('bakery')) return;

    const source = scene.textures.get('bakery').getSourceImage();
    const scale = BAKERY_HEIGHT / Math.max(1, source.height);
    const width = source.width * scale;

    // Левая граница PNG вплотную к левой границе игровой сцены.
    bakerySprite = scene.add
        .image(width / 2, BAKERY_BOTTOM_Y, 'bakery')
        .setOrigin(0.5, 1)
        .setScale(scale)
        .setDepth(6);
}

/* ======================= Телефон ======================= */

function resetTouchFlags() {
    window.touchMoveLeft = false;
    window.touchMoveRight = false;
    window.touchSlideActive = false;
}

function updateTouchControls() {
    const controls = document.getElementById('touch-controls');
    if (!controls) return;

    controls.style.display =
        isTouchDevice() &&
        !portraitBlocked &&
        gameState === 'PLAYING'
            ? 'block'
            : 'none';
}

function updateOrientation() {
    portraitBlocked = isTouchDevice() && !isLandscapeViewport();

    const overlay = document.getElementById('rotate-device');

    if (overlay) {
        overlay.style.display =
            portraitBlocked ? 'flex' : 'none';
    }

    if (sceneRef && portraitBlocked) {
        sceneRef.physics.world.pause();
        resetTouchFlags();
    } else if (sceneRef && gameState === 'PLAYING') {
        sceneRef.physics.world.resume();
    }

    updateTouchControls();
}

// На мобильных отключён Phaser.Scale.FIT: только здесь задаём CSS-размер
// canvas. Иначе Phaser и наш код попеременно сжимают и расширяют изображение.
function fitMobileCanvas() {
    if (!isTouchDevice() || !sceneRef || !sceneRef.game.canvas) return;
    const container = document.getElementById('game-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const canvas = sceneRef.game.canvas;
    canvas.style.setProperty('width', `${Math.round(rect.width)}px`, 'important');
    canvas.style.setProperty('height', `${Math.round(rect.height)}px`, 'important');
    canvas.style.setProperty('max-width', 'none', 'important');
    canvas.style.setProperty('max-height', 'none', 'important');
    canvas.style.setProperty('margin', '0', 'important');
    canvas.style.setProperty('left', '0', 'important');
    canvas.style.setProperty('top', '0', 'important');
    canvas.style.setProperty('transform', 'none', 'important');

    // Scale.NONE не пересчитывает координаты касаний после ручного
    // изменения CSS-размера canvas. Без этого изображение кнопок находится
    // в новом месте, а Phaser проверяет нажатие по прежним координатам.
    // updateBounds обновляет canvasBounds и displayScale для InputManager.
    sceneRef.scale.updateBounds();
}

function resizeGame() {
    syncMobileViewport();
    updateOrientation();
    if (!sceneRef) return;
    // Запоминаем актуальную ширину даже в портретном режиме: иначе после
    // поворота Phaser продолжает показывать узкий старый canvas.
    const newWidth = calculateWidth();

    if (Math.abs(newWidth - gameWidth) < 2) {
        // Не вызываем Phaser FIT refresh() после ручной подгонки canvas.
        fitMobileCanvas();
        resizeWindowUI();
        return;
    }

    gameWidth = newWidth;

    sceneRef.scale.resize(gameWidth, H);
    fitMobileCanvas();
    sceneRef.physics.world.setBounds(0, 0, gameWidth, H);

    floor.setPosition(gameWidth / 2, GROUND_Y + 10);
    floor.setDisplaySize(gameWidth, 20);
    floor.refreshBody();

    if (roadSprite) {
        roadSprite.x = gameWidth / 2;
        roadSprite.width = gameWidth;
    }

    ensureBackgroundCoverage(sceneRef);

    if (warningText) warningText.x = gameWidth / 2;
    if (hudLogo) hudLogo.x = gameWidth / 2;

    positionHudRight();

    if (currentUI) currentUI.x = gameWidth / 2;
    resizeWindowUI();
    // Следующий кадр учитывает завершившуюся раскладку после поворота
    // и повторно синхронизирует координаты Phaser InputManager.
    requestAnimationFrame(fitMobileCanvas);
}

// Не только центрируем окно: если оно было создано в портрете,
// после поворота увеличиваем сам PNG и его интерактивные зоны.
function resizeWindowUI() {
    if (!currentUI || !currentUI.windowImage || !currentUI.windowImage.active) return;
    const ui = currentUI;
    const source = ui.windowImage.scene.textures.get(ui.windowImage.texture.key).getSourceImage();
    const sw = source.width || 1380;
    const sh = source.height || 780;
    const scale = Math.min((gameWidth - 16) / sw, (H - 12) / sh);
    ui.windowImage.setScale(scale);
    const w = sw * scale;
    const h = sh * scale;
    (ui.windowHotspots || []).forEach(({ object, x, y, width, height }) => {
        if (!object.active) return;
        object.setPosition((x - 0.5) * w, (y - 0.5) * h);
        object.setSize(width * w, height * h);
        object.input.hitArea.setSize(width * w, height * h);
    });
}

function bindHoldButton(id, flag) {
    const button = document.getElementById(id);
    if (!button) return;

    button.style.touchAction = 'none';

    button.addEventListener('pointerdown', event => {
        event.preventDefault();

        if (gameState !== 'PLAYING' || portraitBlocked) return;

        window[flag] = true;

        try {
            button.setPointerCapture(event.pointerId);
        } catch (error) {
            // Захват указателя поддерживается не везде.
        }
    });

    const release = event => {
        if (event) event.preventDefault();
        window[flag] = false;
    };

    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
}

function bindTouchButtons() {
    bindHoldButton('m-btn-left', 'touchMoveLeft');
    bindHoldButton('m-btn-right', 'touchMoveRight');
    bindHoldButton('m-btn-slide', 'touchSlideActive');

    const jump = document.getElementById('m-btn-jump');

    if (jump) {
        jump.style.touchAction = 'none';

        jump.addEventListener('pointerdown', event => {
            event.preventDefault();

            if (gameState === 'PLAYING' && !portraitBlocked) {
                doJump();
            }
        });
    }
}

/*
 * На телефоне герой стартует дальше правой кнопки движения.
 * Увеличение его картинки само по себе проблему перекрытия
 * не решает, поэтому меняется именно игровая X-координата.
 */
function playerStartX() {
    if (isTouchDevice()) {
        return Math.min(
            gameWidth - 330,
            Math.max(340, gameWidth * 0.32)
        );
    }

    return Math.min(
        gameWidth - 240,
        Math.max(260, gameWidth * 0.27)
    );
}

/* ========================== Сцена ========================== */

function create() {
    sceneRef = this;
    // На мобильном Phaser.Scale.NONE рисует canvas растянутым CSS, но
    // координаты Phaser Input могут остаться с прежним масштабом.
    // Обрабатываем клики по окнам по реальному DOM-прямоугольнику canvas.
    if (isTouchDevice()) {
        this.game.canvas.addEventListener('pointerdown', event => {
            if (portraitBlocked || !currentUI || !currentUI.windowImage ||
                !currentUI.windowImage.active) return;
            const rect = this.game.canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const x = (event.clientX - rect.left) * gameWidth / rect.width;
            const y = (event.clientY - rect.top) * H / rect.height;
            // Проверяем зоны в обратном порядке (верхняя зона — последняя).
            const zones = currentUI.windowHotspots || [];
            for (let i = zones.length - 1; i >= 0; i--) {
                const zone = zones[i];
                if (!zone.object.active) continue;
                const centerX = currentUI.x + (zone.x - 0.5) * currentUI.windowImage.displayWidth;
                const centerY = currentUI.y + (zone.y - 0.5) * currentUI.windowImage.displayHeight;
                const halfW = zone.width * currentUI.windowImage.displayWidth / 2;
                const halfH = zone.height * currentUI.windowImage.displayHeight / 2;
                if (Math.abs(x - centerX) <= halfW && Math.abs(y - centerY) <= halfH) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    zone.callback();
                    return;
                }
            }
            // Пока открыто окно, нельзя срабатывать смещённым Phaser-зонам.
            event.stopImmediatePropagation();
        }, true);
    }

    calculateHeroScales(this);
    createBackgrounds(this);
    createRoad(this);
    createBakery(this);

    const ground = this.physics.add.staticGroup();

    floor = ground.create(
        gameWidth / 2,
        GROUND_Y + 10,
        'hitbox_dummy'
    );

    floor
        .setDisplaySize(gameWidth, 20)
        .setVisible(false)
        .refreshBody();

    playerShadow = this.add
        .ellipse(260, SHADOW_Y, 52, 12, 0x000000, 0.36)
        .setDepth(9)
        .setVisible(false);

    player = this.physics.add
        .sprite(260, GROUND_Y, 'hitbox_dummy')
        .setOrigin(0.5, 1)
        .setDepth(10)
        .setVisible(false);

    player.body.setSize(48, 92);
    player.body.setCollideWorldBounds(true);

    playerView = this.add
        .image(260, GROUND_Y, 'p1')
        .setOrigin(0.5, 1)
        .setDepth(11)
        .setVisible(false);

    obstacles = this.physics.add.group();
    platforms = this.physics.add.group();
    bonuses = this.physics.add.group();
    birds = this.physics.add.group();

    // Arcade Physics сдвигает спрайты ПОСЛЕ update(); синхронизируем
    // тени после физического шага, чтобы они не отставали на один кадр.
    this.physics.world.on('worldstep', () => {
        obstacles.getChildren().forEach(syncObjectShadow);
        platforms.getChildren().forEach(syncObjectShadow);
    });

    this.physics.add.collider(player, ground, () => {
        jumpCount = 0;
    });

    this.physics.add.collider(
        player,
        platforms,
        () => {
            jumpCount = 0;
        },
        (hero, platform) => (
            hero.body.velocity.y >= 0 &&
            hero.body.bottom <= platform.body.top + 16
        ),
        this
    );

    this.physics.add.overlap(
        player,
        obstacles,
        hitObstacle,
        null,
        this
    );

    this.physics.add.overlap(
        player,
        birds,
        hitObstacle,
        null,
        this
    );

    this.physics.add.overlap(
        player,
        bonuses,
        getBonus,
        null,
        this
    );

    this.physics.add.overlap(
        player,
        platforms,
        (hero, platform) => {
            if (
                hero.body.bottom > platform.body.top + 16 &&
                hero.body.top < platform.body.bottom
            ) {
                hitObstacle.call(this, hero, platform);
            }
        },
        null,
        this
    );

    createHud(this);

    cursors = this.input.keyboard.createCursorKeys();

    keys = this.input.keyboard.addKeys({
        one: Phaser.Input.Keyboard.KeyCodes.ONE,
        two: Phaser.Input.Keyboard.KeyCodes.TWO,
        three: Phaser.Input.Keyboard.KeyCodes.THREE,
        enter: Phaser.Input.Keyboard.KeyCodes.ENTER
    });

    this.input.keyboard.addCapture([
        Phaser.Input.Keyboard.KeyCodes.SPACE,
        Phaser.Input.Keyboard.KeyCodes.UP,
        Phaser.Input.Keyboard.KeyCodes.DOWN,
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.RIGHT
    ]);

    bindTouchButtons();

    window.addEventListener('resize', scheduleViewportResize);
    window.addEventListener('orientationchange', scheduleViewportResize);
    window.addEventListener('pageshow', scheduleViewportResize);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) scheduleViewportResize();
    });
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', scheduleViewportResize);
    }
    // Страница может сменить ориентацию до создания сцены либо не послать
    // resize при возврате из системного экрана поворота.
    if (isTouchDevice()) {
        window.matchMedia('(orientation: landscape)')
            .addEventListener('change', scheduleViewportResize);
        let lastViewport = '';
        window.setInterval(() => {
            if (document.hidden) return;
            const vp = viewportSize();
            const state = `${Math.round(vp.width)}:${Math.round(vp.height)}:${isLandscapeViewport()}`;
            if (state !== lastViewport) {
                lastViewport = state;
                scheduleViewportResize();
            }
        }, 500);
    }

    showCharacterSelect(this);
    updateOrientation();

    scheduleViewportResize();
}

/* =========================== HUD =========================== */

function setImageWidth(image, width) {
    const source = image.scene.textures
        .get(image.texture.key)
        .getSourceImage();

    image.setScale(width / Math.max(1, source.width));
}

function createHud(scene) {
    const mobile = isTouchDevice();
    const iconWidth = mobile ? 84 : 69;
    const spacing = mobile ? 91 : 77;

    hudHeart = scene.add
        .image(45, 54, 'hud_heart')
        .setDepth(95);

    hudShield = scene.add
        .image(45 + spacing, 54, 'hud_shield')
        .setDepth(95);

    hudBox = scene.add
        .image(45 + spacing * 2, 54, 'hud_box')
        .setDepth(95);

    [hudHeart, hudShield, hudBox].forEach(icon => {
        setImageWidth(icon, iconWidth);
    });

    const countStyle = {
        fontSize: mobile ? '26px' : '21px',
        fontFamily: 'sans-serif',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#61300c',
        strokeThickness: 5
    };

    hudHeartCount = scene.add
        .text(69, 78, '1', countStyle)
        .setOrigin(0.5)
        .setDepth(97);

    hudShieldCount = scene.add
        .text(69 + spacing, 78, '0', countStyle)
        .setOrigin(0.5)
        .setDepth(97);

    hudBoxCount = scene.add
        .text(69 + spacing * 2, 78, '0', countStyle)
        .setOrigin(0.5)
        .setDepth(97);

    hudLogo = scene.add
        .image(gameWidth / 2, 42, 'logo_33')
        .setDepth(95);

    setImageWidth(hudLogo, mobile ? 260 : 240);

    hudBar = scene.add
        .image(gameWidth - 190, 48, 'hud_bar')
        .setDepth(94);

    setImageWidth(hudBar, mobile ? 380 : 345);
    // Пауза по всей плашке; никаких новых значков поверх HUD.
    hudBar.setInteractive({ useHandCursor: true });
    hudBar.on('pointerdown', () => toggleRacePause(scene));

    /*
     * В distance_time.png уже нарисованы флажок и часы.
     * Текст ставим правее этих значков.
     *
     * Показываем только пройденное расстояние: «85 м».
     */
    const distanceStyle = {
        fontSize: mobile ? '32px' : '27px',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        color: '#301f1b',
        stroke: '#ffffff',
        strokeThickness: 4
    };

    const timerStyle = {
        fontSize: mobile ? '27px' : '23px',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        color: '#8e3b00',
        stroke: '#ffffff',
        strokeThickness: 3
    };

    hudDistance = scene.add
        .text(
            gameWidth - (mobile ? 310 : 294),
            48,
            '0 м',
            distanceStyle
        )
        .setOrigin(0, 0.5)
        .setDepth(96);

    hudTimer = scene.add
        .text(
            gameWidth - (mobile ? 115 : 104),
            48,
            '00:00',
            timerStyle
        )
        .setOrigin(0, 0.5)
        .setDepth(96);

    warningText = scene.add
        .text(
            gameWidth / 2,
            125,
            '⚠️ КЛЮВ КЛЮВЫЧ АТАКУЕТ! ПРИГНИСЬ! ⚠️',
            {
                fontSize: '19px',
                fontFamily: 'sans-serif',
                fontStyle: 'bold',
                color: '#ff3333',
                backgroundColor: '#000000',
                padding: { x: 10, y: 5 }
            }
        )
        .setOrigin(0.5)
        .setDepth(98)
        .setVisible(false);

    updateHud();
}

function positionHudRight() {
    if (!hudBar) return;

    const mobile = isTouchDevice();

    hudBar.x = gameWidth - 190;

    hudDistance.x =
        gameWidth - (mobile ? 310 : 294);

    hudTimer.x =
        gameWidth - (mobile ? 115 : 104);
}

function updateHud() {
    if (!hudHeart) return;

    hudHeart.setAlpha(hearts > 0 ? 1 : 0.28);
    hudShield.setAlpha(shields > 0 ? 1 : 0.28);
    hudBox.setAlpha(boxes > 0 ? 1 : 0.28);

    hudHeartCount.setText(String(hearts));
    hudShieldCount.setText(String(shields));
    hudBoxCount.setText(String(boxes));
}

function toggleRacePause(scene) {
    if (portraitBlocked ||
        (gameState !== 'PLAYING' && gameState !== 'PAUSED')) return;

    if (gameState === 'PLAYING') {
        gameState = 'PAUSED';
        resetTouchFlags();
        player.setVelocityX(0);
        scene.physics.world.pause();
        scene.time.timeScale = 0;
        scene.tweens.timeScale = 0;
    } else {
        gameState = 'PLAYING';
        scene.time.timeScale = 1;
        scene.tweens.timeScale = 1;
        scene.physics.world.resume();
    }
    updateTouchControls();
}

/* ======================= Окна игры ======================= */

function clearUI() {
    if (!currentUI) return;

    currentUI.destroy(true);
    currentUI = null;
}

function clearOffice() {
    if (!officeGroup) return;

    officeGroup.getChildren().forEach(object => {
        if (object && object.scene) {
            object.scene.tweens.killTweensOf(object);
        }
    });

    officeGroup.destroy(true);
    officeGroup = null;
}

function hidePlayer() {
    player.setVisible(false);
    playerView.setVisible(false);
    playerShadow.setVisible(false);
}

/*
 * Показывает готовый PNG целиком и сохраняет его пропорции.
 * Зоны нажатий задаются долями ширины/высоты картинки:
 * при другом размере исходника они остаются на своих местах.
 */
function imageWindow(scene, textureKey, darken = 0.7) {
    clearUI();

    const ui = scene.add
        .container(gameWidth / 2, H / 2)
        .setDepth(110);

    currentUI = ui;

    const backdrop = scene.add
        .rectangle(
            0,
            0,
            4000,
            1500,
            0x080d16,
            darken
        )
        .setInteractive();

    ui.add(backdrop);

    if (!scene.textures.exists(textureKey)) {
        console.error(
            '[Игра] Не загрузилось окно:',
            textureKey
        );

        const fallback = scene.add
            .text(0, 0, 'Не загрузилось изображение окна', {
                fontSize: '26px',
                color: '#ffffff',
                backgroundColor: '#733300'
            })
            .setOrigin(0.5);

        ui.add(fallback);

        return null;
    }

    const source = scene.textures
        .get(textureKey)
        .getSourceImage();

    const imageWidth = source.width || 1380;
    const imageHeight = source.height || 780;

    const scale = Math.min(
        (gameWidth - 16) / imageWidth,
        (H - 12) / imageHeight
    );

    const image = scene.add
        .image(0, 0, textureKey)
        .setScale(scale);

    ui.add(image);
    ui.windowImage = image;
    ui.windowHotspots = [];

    return {
        ui,
        width: imageWidth * scale,
        height: imageHeight * scale
    };
}

function addWindowHotspot(
    scene,
    windowData,
    centerXFraction,
    centerYFraction,
    widthFraction,
    heightFraction,
    callback
) {
    const hotspot = scene.add
        .rectangle(
            (centerXFraction - 0.5) * windowData.width,
            (centerYFraction - 0.5) * windowData.height,
            widthFraction * windowData.width,
            heightFraction * windowData.height,
            0xffffff,
            0.001
        )
        .setInteractive({ useHandCursor: true });

    hotspot.on('pointerdown', event => {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        callback();
    });

    windowData.ui.add(hotspot);
    windowData.ui.windowHotspots.push({
        object: hotspot,
        callback,
        x: centerXFraction,
        y: centerYFraction,
        width: widthFraction,
        height: heightFraction
    });
}

function showStartScreen(scene) {
    gameState = 'START_SCREEN';
    updateTouchControls();
    hidePlayer();

    clearUI();

    const ui = scene.add
        .container(gameWidth / 2, H / 2)
        .setDepth(110);

    currentUI = ui;

    const backdrop = scene.add
        .rectangle(0, 0, 4000, 1500, 0x08111d, 0.9)
        .setInteractive();

    const card = scene.add
        .rectangle(0, 0, 790, 400, 0x132030)
        .setStrokeStyle(3, 0xff8500);

    const title = scene.add
        .text(
            0,
            -128,
            '🎂 ПРАЗДНИЧНЫЙ ЗАБЕГ «СОГЛАСИЯ»',
            {
                fontSize: '27px',
                color: '#ffffff',
                fontFamily: 'sans-serif',
                fontStyle: 'bold'
            }
        )
        .setOrigin(0.5);

    const instructions = scene.add
        .text(
            0,
            -25,
            'Заберите торт из кондитерской и доставьте в офис!\n\n' +
            'Прыжок: ↑ / Пробел / ▲\n' +
            'Подкат: ↓ / ▼',
            {
                fontSize: '19px',
                color: '#c9e9f4',
                fontFamily: 'sans-serif',
                align: 'center'
            }
        )
        .setOrigin(0.5);

    const button = scene.add
        .rectangle(0, 135, 370, 58, 0xff6d00)
        .setInteractive({ useHandCursor: true });

    const buttonLabel = scene.add
        .text(0, 135, 'ВЫБРАТЬ ПЕРСОНАЖА', {
            fontSize: '19px',
            color: '#ffffff',
            fontFamily: 'sans-serif',
            fontStyle: 'bold'
        })
        .setOrigin(0.5);

    button.on('pointerdown', () => showCharacterSelect(scene));

    ui.add([
        backdrop,
        card,
        title,
        instructions,
        button,
        buttonLabel
    ]);
}

function showCharacterSelect(scene) {
    gameState = 'CHARACTER_SELECT';
    updateTouchControls();
    clearOffice();
    hidePlayer();

    const windowData = imageWindow(
        scene,
        'choose_screen',
        0.75
    );

    if (!windowData) {
        // Если PNG не загрузился, клавиши 1/2/3 всё ещё работают.
        return;
    }

    /*
     * Три оранжевые кнопки на choose.png.
     * Доли рассчитаны по присланному изображению.
     */
    [
        { x: 0.26, hero: 'artem' },
        { x: 0.50, hero: 'viktoria' },
        { x: 0.74, hero: 'maksim' }
    ].forEach(item => {
        addWindowHotspot(
            scene,
            windowData,
            item.x,
            0.61,
            0.20,
            0.13,
            () => startRace(scene, item.hero)
        );
        // Вся карточка персонажа тоже выбирает его: на телефоне легче попасть.
        addWindowHotspot(
            scene,
            windowData,
            item.x,
            0.38,
            0.20,
            0.31,
            () => startRace(scene, item.hero)
        );
    });
}

/* ========================== Забег ========================== */

function destroyWithShadow(object) {
    if (!object) return;

    if (object.shadowRef && object.shadowRef.active) {
        object.shadowRef.destroy();
    }

    if (object.active) object.destroy();
}

function clearRaceObjects() {
    [obstacles, platforms, bonuses, birds].forEach(group => {
        group.getChildren()
            .slice()
            .forEach(destroyWithShadow);
    });
}

function startRace(scene, heroKey) {
    const hero = HEROES[heroKey];
    if (!hero) return;

    raceId++;
    selectedHero = heroKey;

    if (invulnerabilityTween) {
        invulnerabilityTween.stop();
        invulnerabilityTween = null;
    }

    clearRaceObjects();
    clearOffice();
    clearUI();

    // HUD отображает текущий остаток каждого ресурса: без незаметного
    // ограничения в 2/3 единицы для повторных подборов.
    hearts = hero.hearts;
    shields = hero.shields;
    boxes = hero.boxes;
    scene.time.timeScale = 1;
    scene.tweens.timeScale = 1;

    realDistance = 0;
    gameSeconds = 0;
    baseSpeed = 315;

    // Первые секунды без препятствий: время освоиться с управлением.
    nextObstacle = 130;
    nextBonus = 75;
    nextBird = 280;
    birdAttackPending = false;
    lastBirdDistance = -1000;
    lastObstacleDistance = -1000;

    jumpCount = 0;
    isSliding = false;
    invulnerable = false;
    canRestart = false;

    runTimer = 0;
    runFrame = 1;
    birdTimer = 0;
    birdFrame = 1;
    birdAttackNumber = 0;

    resetTouchFlags();
    resetBackgrounds(scene);
    createBakery(scene);

    if (roadSprite) {
        roadSprite.tilePositionX = 0;
    }

    player
        .setPosition(playerStartX(), GROUND_Y)
        .setVelocity(0, 0)
        .setVisible(true);

    player.body.enable = true;
    player.body.setGravityY(hero.gravityY);
    player.body.setSize(48, 92);
    player.body.setOffset(0, 0);

    playerView
        .setPosition(player.x, player.y)
        .setVisible(true)
        .setAlpha(1)
        .clearTint();

    setHeroFrame(1);

    playerShadow
        .setPosition(player.x + 12, SHADOW_Y)
        .setVisible(true);

    warningText.setVisible(false);
    hudDistance.setText('0 м');
    hudTimer.setText('00:00');

    updateHud();

    gameState = 'PLAYING';

    if (!portraitBlocked) {
        scene.physics.world.resume();
    }

    updateTouchControls();
    SoundFx.bonus();
}

function update(time, delta) {
    if (portraitBlocked) return;

    if (gameState === 'CHARACTER_SELECT') {
        if (Phaser.Input.Keyboard.JustDown(keys.one)) {
            startRace(this, 'artem');
        } else if (Phaser.Input.Keyboard.JustDown(keys.two)) {
            startRace(this, 'viktoria');
        } else if (Phaser.Input.Keyboard.JustDown(keys.three)) {
            startRace(this, 'maksim');
        }
        return;
    }

    if (gameState === 'GAMEOVER') {
        if (
            canRestart &&
            Phaser.Input.Keyboard.JustDown(cursors.space)
        ) {
            startRace(this, selectedHero);
        }
        return;
    }

    if (gameState === 'WIN_MENU') {
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            showCharacterSelect(this);
        }
        return;
    }

    if (gameState === 'WIN_CINEMATIC') {
        // Физика остановлена, но до двери герой продолжает бежать.
        if (playerView.y >= GROUND_Y - 1) {
            runTimer += delta;
            if (runTimer >= 100) {
                runTimer %= 100;
                runFrame = runFrame % 6 + 1;
                setHeroFrame(runFrame);
            }
        }
        return;
    }

    if (gameState !== 'PLAYING') return;

    const dt = Math.min(delta, 50) / 1000;

    gameSeconds += dt;

    const minutes = Math.floor(gameSeconds / 60);
    const seconds = Math.floor(gameSeconds % 60);

    hudTimer.setText(
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`
    );

    let adjustment = 0;

    if (cursors.left.isDown || window.touchMoveLeft) {
        adjustment = -230;
        player.setVelocityX(-230);
    } else if (cursors.right.isDown || window.touchMoveRight) {
        adjustment = 190;
        player.setVelocityX(190);
    } else {
        player.setVelocityX(0);
    }

    const worldSpeed = Math.max(80, baseSpeed + adjustment);

    realDistance = Math.min(
        TARGET_DISTANCE,
        realDistance + worldSpeed * dt * METERS_PER_PIXEL
    );

    if (roadSprite) {
        roadSprite.tilePositionX +=
            worldSpeed * dt / roadScale;
    }

    scrollBackgrounds(this, worldSpeed * 0.08 * dt);

    if (bakerySprite && bakerySprite.active) {
        bakerySprite.x -= worldSpeed * dt;

        if (
            bakerySprite.x +
            bakerySprite.displayWidth / 2 < -50
        ) {
            removeBakery();
        }
    }

    if (realDistance >= TARGET_DISTANCE) {
        realDistance = TARGET_DISTANCE;
        hudDistance.setText('3300 м');
        syncPlayerView();
        startOfficeArrival(this);
        return;
    }

    hudDistance.setText(
        `${Math.floor(realDistance)} м`
    );

    const segment = Math.min(
        7,
        Math.floor(realDistance / TARGET_DISTANCE * 7) + 1
    );

    baseSpeed = 300 + segment * 15;

    if (
        Phaser.Input.Keyboard.JustDown(cursors.up) ||
        Phaser.Input.Keyboard.JustDown(cursors.space)
    ) {
        doJump();
    }

    const grounded =
        player.body.touching.down ||
        player.body.blocked.down;

    const slideHeld =
        cursors.down.isDown ||
        window.touchSlideActive;

    if (slideHeld && grounded) {
        if (!isSliding) {
            startSlide();
            SoundFx.slide();
        }

        setHeroFrame(9);
    } else {
        if (isSliding) stopSlide();

        if (!grounded) {
            setHeroFrame(
                player.body.velocity.y < 0 ? 7 : 8
            );
        } else {
            runTimer += delta;

            if (runTimer >= 100) {
                runTimer = 0;
                runFrame = runFrame % 6 + 1;
                setHeroFrame(runFrame);
            }
        }
    }

    syncPlayerView();

    if (selectedHero === 'viktoria') {
        attractBonuses(this);
    }

    // При приближении птицы временно отложим очередное препятствие.
    // Иначе частые препятствия могут бесконечно блокировать атаку чайки.
    if (
        realDistance >= nextBird &&
        realDistance < TARGET_DISTANCE - 150 &&
        !birdAttackPending &&
        birds.countActive() === 0
    ) {
        launchBird(this);
        lastBirdDistance = realDistance;
        nextBird = realDistance + 380;
    }

    if (
        realDistance >= nextObstacle &&
        realDistance < TARGET_DISTANCE - 100 &&
        !birdAttackPending &&
        birds.countActive() === 0 &&
        realDistance - lastBirdDistance > 65 &&
        nextBird - realDistance > 85
    ) {
        spawnChallenge(this);
    }

    if (
        realDistance >= nextBonus &&
        realDistance < TARGET_DISTANCE - 50
    ) {
        spawnBonus(this);

        nextBonus = realDistance +
            Phaser.Math.Between(105, 135);
    }

    animateBirds(this, delta);
    updateRaceObjects(this, worldSpeed, delta);
}

function syncPlayerView() {
    playerView.setPosition(player.x, player.y);

    // У рисунка бегущего героя стопы слегка правее центра спрайта.
    playerShadow.x = player.x + 12;
    playerShadow.y = SHADOW_Y;

    const grounded =
        player.body.touching.down ||
        player.body.blocked.down;

    if (grounded) {
        playerShadow.setDisplaySize(isSliding ? 90 : 80, 9);
        playerShadow.setAlpha(0.28);
    } else {
        const altitude = Math.max(0, GROUND_Y - player.y);
        const factor = Math.max(0.42, 1 - altitude / 280);

        playerShadow.setDisplaySize(80 * factor, 9 * factor);
        playerShadow.setAlpha(0.28 * factor);
    }
}

function doJump() {
    if (gameState !== 'PLAYING' || portraitBlocked) return;

    const grounded =
        player.body.touching.down ||
        player.body.blocked.down;

    if (isSliding) stopSlide();

    const force = HEROES[selectedHero].jumpForce;

    if (grounded) {
        player.setVelocityY(force);
        jumpCount = 1;
        SoundFx.jump();
    } else if (jumpCount === 1) {
        player.setVelocityY(force + 90);
        jumpCount = 2;
        SoundFx.jump();
    }
}

function startSlide() {
    isSliding = true;
    player.body.setSize(48, 45);
    player.body.setOffset(0, 47);
}

function stopSlide() {
    isSliding = false;

    if (!player || !player.body) return;

    player.body.setSize(48, 92);
    player.body.setOffset(0, 0);
}

/* ======================= Предметы ======================= */

function fitBody(sprite, width, height) {
    const scaleX = Math.abs(sprite.scaleX) || 1;
    const scaleY = Math.abs(sprite.scaleY) || 1;

    sprite.body.setSize(
        width / scaleX,
        height / scaleY,
        true
    );

    sprite.body.updateFromGameObject();
    return sprite;
}

function attachShadow(scene, object, width) {
    object.shadowRef = scene.add
        .ellipse(object.x, SHADOW_Y, width, 7, 0x000000, 0.18)
        .setDepth(6);
    // Координата тени синхронизируется с предметом каждый кадр.
}

function syncObjectShadow(object) {
    if (!object.shadowRef || !object.shadowRef.active) return;
    object.shadowRef.x = object.x;
    object.shadowRef.y = SHADOW_Y;
    if (object.texture.key === 'obs_pot') {
        object.shadowRef.setAlpha(Math.max(0.12, 0.33 - (GROUND_Y - object.y) / 1800));
    }
}

function spawnChallenge(scene) {
    const pattern = Phaser.Math.Between(1, 5);

    if (pattern === 1 || pattern === 5) {
        // Паллету можно перепрыгнуть или приземлиться на неё.
        createPlatform(scene, 'obs_pallet', 115, 85, 105, 75, -19);
    } else if (pattern === 2) {
        // Самокат — только препятствие, стоять на нём нельзя.
        createObstacle(scene, 'obs_scooter', 135, 65, 125, 55);
    } else if (pattern === 3) {
        spawnBarrier(scene);
    } else {
        spawnPot(scene);
    }

    lastObstacleDistance = realDistance;
    nextObstacle = realDistance + Phaser.Math.Between(80, 105);
}

function createObstacle(
    scene,
    key,
    visibleWidth,
    visibleHeight,
    hitWidth,
    hitHeight
) {
    const object = obstacles
        .create(
            gameWidth + 80,
            OBSTACLE_BOTTOM_Y,
            key
        )
        .setOrigin(0.5, 1)
        .setDisplaySize(visibleWidth, visibleHeight)
        .setDepth(7);

    fitBody(object, hitWidth, hitHeight);

    object.body.allowGravity = false;
    object.setImmovable(true);
    object.setVelocityX(-baseSpeed);
    object.obstacleType = 'bottom';

    attachShadow(scene, object, visibleWidth * 0.85);
}

function createPlatform(scene, key, width, height, hitWidth, hitHeight, offsetY = 0) {
    const platform = platforms
        .create(gameWidth + 80, OBSTACLE_BOTTOM_Y + offsetY, key)
        .setOrigin(0.5, 1)
        .setDisplaySize(width, height)
        .setDepth(7);

    fitBody(platform, hitWidth, hitHeight);
    platform.body.allowGravity = false;
    platform.setImmovable(true);
    platform.setVelocityX(-baseSpeed);
    platform.obstacleType = 'bottom';
    // У барьера собственная тень уже есть в изображении/на мостовой;
    // отдельный овал под ним выглядел как посторонний предмет.
    if (key !== 'obs_barrier') {
        attachShadow(scene, platform, width * 0.78);
    }
    return platform;
}

function spawnBarrier(scene) {
    createPlatform(scene, 'obs_barrier', 120, 90, 105, 80);
}

function spawnPot(scene) {
    const x = player.x +
        Phaser.Math.Between(300, 420);

    const pot = obstacles
        .create(x, 75, 'obs_pot')
        .setDisplaySize(75, 75)
        .setDepth(8);

    fitBody(pot, 55, 55);

    pot.body.allowGravity = false;
    pot.setImmovable(true);
    pot.setVelocity(-baseSpeed * 0.55, 570);
    pot.obstacleType = 'top';

    attachShadow(scene, pot, 58);
}

function spawnBonus(scene) {
    const roll = Phaser.Math.Between(1, 10);

    // Коробка встречается реже: 2 из 10 бонусов вместо 4 из 10.
    const key =
        roll <= 2
            ? 'bonus_box'
            : roll <= 6
                ? 'bonus_shield'
                : 'bonus_heart';

    // На ровной дороге предмет недоступен без прыжка; с паллеты достать можно.
    const y = Phaser.Math.RND.pick([
        GROUND_Y - 225,
        GROUND_Y - 245
    ]);

    const bonus = bonuses
        .create(gameWidth + 60, y, key)
        .setDisplaySize(48, 48)
        .setDepth(8);

    fitBody(bonus, 44, 44);

    bonus.body.allowGravity = false;
    bonus.setVelocityX(-baseSpeed);
    bonus.bonusKey = key;
    bonus.isMagnetized = false;
}

function getBonus(hero, bonus) {
    if (gameState !== 'PLAYING' || !bonus.active) return;

    if (bonus.bonusKey === 'bonus_box') {
        boxes++;
    } else if (bonus.bonusKey === 'bonus_shield') {
        shields++;
    } else if (bonus.bonusKey === 'bonus_heart') {
        hearts++;
    }

    bonus.destroy();

    updateHud();
    SoundFx.bonus();
}

function attractBonuses(scene) {
    bonuses.getChildren().forEach(bonus => {
        if (!bonus.active) return;

        const distance = Phaser.Math.Distance.Between(
            player.x,
            player.y,
            bonus.x,
            bonus.y
        );

        // Виктория подбирает благо поблизости даже с земли и без
        // точного касания предмета. Остальные подбирают по коллизии.
        if (distance < 270) {
            getBonus(player, bonus);
        }
    });
}

/* ====================== Клюв Клювыч ====================== */

function createBird(scene, x, y, mode) {
    const bird = birds
        .create(x, y, 'bird_low_1')
        .setDisplaySize(84, 60)
        // Правая птица сначала использует ТЕ ЖЕ кадры, что и левая,
        // но в отражении; только при пикировании — кадры b7–b9.
        .setFlipX(mode === 'dive')
        .setDepth(8);

    // Низкая чайка летит визуально над присевшим героем. Более высокий
    // хитбокс пересекает голову стоящего; в приседе урон исключён ниже.
    fitBody(bird, 58, mode === 'low' ? 96 : 30);
    bird.body.allowGravity = false;
    bird.obstacleType = 'top';
    bird.flightMode = mode;
    bird.frameIndex = 0;
    bird.frameElapsed = 0;
    bird.diveStarted = false;
    return bird;
}

function launchBird(scene) {
    const thisRace = raceId;
    // Чередуем виды атаки: сначала обучающий низкий пролёт.
    const mode = birdAttackNumber++ % 2 === 0 ? 'low' : 'dive';
    birdAttackPending = true;
    // Предупреждение требуется для атаки сзади. Для пикирования
    // птица появляется видимой сверху справа без этой надписи.
    warningText.setVisible(mode === 'low');
    SoundFx.gull();

    scene.time.delayedCall(mode === 'low' ? 1200 : 650, () => {
        if (thisRace !== raceId || gameState !== 'PLAYING') return;
        birdAttackPending = false;
        warningText.setVisible(false);

        if (mode === 'low') {
            // Летит над присевшим, но может задеть стоящего головой.
            const bird = createBird(
                scene,
                -65,
                GROUND_Y - 132,
                'low'
            );
            bird.setVelocityX(Math.max(450, baseSpeed + 165));
        } else {
            // Вылетает целиком из-за правого края; до пикирования
            // летит горизонтально отражёнными кадрами низкой чайки.
            const startX = Math.max(gameWidth + 75, player.x + 480);
            const bird = createBird(scene, startX, GROUND_Y - 285, 'dive');
            bird.setVelocity(-Math.max(340, baseSpeed + 30), 0);
            bird.diveAtX = player.x + 265;
        }
        SoundFx.gull();
    });
}

function animateBirds(scene, delta) {
    birds.getChildren().forEach(bird => {
        if (!bird.active) return;
        if (bird.flightMode === 'dive' && !bird.diveStarted && bird.x <= bird.diveAtX) {
            bird.diveStarted = true;
            bird.frameIndex = 0;
            bird.frameElapsed = 0;
            // При пикировании только один кадр, без переключения b7–b9.
            bird.setTexture('bird_dive_1').setDisplaySize(84, 60);
            bird.setFlipX(false);
            bird.setAngle(0);
            fitBody(bird, 48, 48);
            bird.setVelocityY((GROUND_Y - 95 - bird.y) * Math.abs(bird.body.velocity.x) /
                Math.max(1, bird.x - player.x));
        }
        // После перехода в пике фиксируем один кадр, не анимируем его.
        if (bird.flightMode === 'dive' && bird.diveStarted) return;
        bird.frameElapsed += delta;
        if (bird.frameElapsed < 120) return;
        bird.frameElapsed = 0;
        const frames = ['bird_low_1', 'bird_low_2', 'bird_low_3', 'bird_low_4'];
        bird.frameIndex = (bird.frameIndex + 1) % frames.length;
        const key = frames[bird.frameIndex];
        if (scene.textures.exists(key)) {
            bird.setTexture(key);
            bird.setFlipX(bird.flightMode === 'dive');
            // Для низкой чайки сохраняем хитбокс при каждом кадре.
            bird.setDisplaySize(84, 60);
            fitBody(bird, 58, bird.flightMode === 'low' ? 96 : 30);
        }
    });
}

function updateRaceObjects(scene, speed, delta) {
    obstacles.getChildren().slice().forEach(object => {
        if (!object.active) return;

        if (object.texture.key === 'obs_pot') {
            object.angle +=
                210 * Math.min(delta, 50) / 1000;

            if (object.y >= GROUND_Y - 42) {
                destroyWithShadow(object);
                return;
            }
        } else {
            object.setVelocityX(-speed);
        }

        if (object.x < -140) {
            destroyWithShadow(object);
        }
    });

    platforms.getChildren().slice().forEach(object => {
        if (!object.active) return;

        object.setVelocityX(-speed);

        if (object.x < -140) {
            destroyWithShadow(object);
        }
    });

    bonuses.getChildren().slice().forEach(bonus => {
        if (!bonus.active) return;

        if (!bonus.isMagnetized) {
            bonus.setVelocityX(-speed);
        }

        if (bonus.x < -100 || bonus.y > H + 100) {
            bonus.destroy();
        }
    });

    birds.getChildren().slice().forEach(bird => {
        if (!bird.active) return;

        if (
            bird.x < -140 ||
            bird.x > gameWidth + 200 ||
            bird.y > H + 100
        ) {
            bird.destroy();
        }
    });
}

/* ====================== Урон и поражение ====================== */

function hitObstacle(hero, obstacle) {
    if (
        gameState !== 'PLAYING' ||
        invulnerable ||
        !obstacle.active
    ) {
        return;
    }

    if (isSliding && obstacle.obstacleType === 'top') {
        return;
    }

    if (obstacle.obstacleType === 'top' && boxes > 0) {
        boxes--;
        destroyWithShadow(obstacle);
        SoundFx.bonus();
        flashPlayer(this, 0xff8400);
        updateHud();
        return;
    }

    if (obstacle.obstacleType === 'bottom' && shields > 0) {
        shields--;
        destroyWithShadow(obstacle);
        SoundFx.bonus();
        flashPlayer(this, 0xff8400);
        updateHud();
        return;
    }

    // Последнее сердце тоже тратится и отображается как 0 перед поражением.
    if (hearts > 0) {
        hearts--;
        destroyWithShadow(obstacle);
        flashPlayer(this, 0xff8400);
        updateHud();
        if (hearts === 0) {
            showGameOver(this);
        } else {
            SoundFx.hit();
            triggerInvulnerability(this);
        }
        return;
    }

    showGameOver(this);
}

function triggerInvulnerability(scene) {
    invulnerable = true;

    if (invulnerabilityTween) {
        invulnerabilityTween.stop();
    }

    invulnerabilityTween = scene.tweens.add({
        targets: playerView,
        alpha: 0.25,
        duration: 100,
        yoyo: true,
        repeat: 7,

        onComplete: () => {
            playerView.setAlpha(1);
            invulnerable = false;
            invulnerabilityTween = null;
        }
    });
}

function flashPlayer(scene, color) {
    const thisRace = raceId;

    playerView.setTint(color);

    scene.time.delayedCall(450, () => {
        if (
            thisRace === raceId &&
            gameState === 'PLAYING'
        ) {
            playerView.clearTint();
        }
    });
}

function showGameOver(scene) {
    gameState = 'GAMEOVER';
    canRestart = false;

    updateTouchControls();
    warningText.setVisible(false);
    resetTouchFlags();
    scene.physics.world.pause();
    hidePlayer();
    SoundFx.hit();

    const windowData = imageWindow(
        scene,
        'die_screen',
        0.72
    );

    if (!windowData) return;

    /*
     * В изображении окна может быть напечатан пример дистанции.
     * Пока закрываем его светлой подложкой и пишем
     * реальное расстояние. Идеально — позже получить PNG
     * без примерного числа.
     */
    const distancePatch = scene.add
        .rectangle(
            (0.78 - 0.5) * windowData.width,
            (0.29 - 0.5) * windowData.height,
            windowData.width * 0.35,
            windowData.height * 0.07,
            0xf1e6dc
        );

    const distanceLabel = scene.add
        .text(
            (0.78 - 0.5) * windowData.width,
            (0.29 - 0.5) * windowData.height,
            `Пройдено: ${Math.floor(realDistance)} м из 3300 м`,
            {
                fontSize: Math.max(
                    13,
                    Math.round(windowData.height * 0.037)
                ) + 'px',
                fontFamily: 'sans-serif',
                fontStyle: 'bold',
                color: '#553322'
            }
        )
        .setOrigin(0.5);

    windowData.ui.add([
        distancePatch,
        distanceLabel
    ]);

    // Билет с промокодом.
    addWindowHotspot(
        scene,
        windowData,
        0.79, 0.47,
        0.34, 0.20,
        () => window.open(
            PROMO_URL,
            '_blank',
            'noopener,noreferrer'
        )
    );

    // Оранжевая кнопка.
    addWindowHotspot(
        scene,
        windowData,
        0.79, 0.67,
        0.33, 0.14,
        () => {
            if (canRestart) startRace(scene, selectedHero);
        }
    );

    // Серая кнопка.
    addWindowHotspot(
        scene,
        windowData,
        0.79, 0.82,
        0.33, 0.13,
        () => {
            if (canRestart) showCharacterSelect(scene);
        }
    );

    const thisRace = raceId;

    scene.time.delayedCall(400, () => {
        if (
            thisRace === raceId &&
            gameState === 'GAMEOVER'
        ) {
            canRestart = true;
        }
    });
}

/* =========================== Финиш =========================== */

function startOfficeArrival(scene) {
    if (gameState !== 'PLAYING') return;

    gameState = 'WIN_CINEMATIC';
    updateTouchControls();
    warningText.setVisible(false);
    resetTouchFlags();

    scene.physics.world.pause();
    clearRaceObjects();
    clearOffice();

    if (invulnerabilityTween) {
        invulnerabilityTween.stop();
        invulnerabilityTween = null;
    }

    playerView.setAlpha(1).clearTint();
    if (isSliding) stopSlide();
    // Заканчиваем прыжок на земле, не телепортируя героя по вертикали.
    if (playerView.y < GROUND_Y) {
        setHeroFrame(8);
        scene.tweens.add({
            targets: playerView,
            y: GROUND_Y,
            duration: 420,
            ease: 'Quad.easeIn',
            onComplete: () => { runTimer = 0; }
        });
    } else {
        playerView.y = GROUND_Y;
        setHeroFrame(1);
    }
    playerShadow.y = SHADOW_Y;
    playerShadow.setDisplaySize(80, 9).setAlpha(0.28);

    officeGroup = scene.add.group();

    if (!scene.textures.exists('office')) {
        console.error('[Игра] Не загрузился PNG офиса');
        showVictoryCard(scene);
        return;
    }

    const source = scene.textures
        .get('office')
        .getSourceImage();

    const scale =
        OFFICE_HEIGHT / Math.max(1, source.height);

    /* PNG содержит ограду и тротуар: передняя часть перекрывает road.png. */
    const office = scene.add
        .image(
            gameWidth + source.width * scale / 2,
            OFFICE_BOTTOM_Y,
            'office'
        )
        .setOrigin(0.5, 1)
        .setScale(scale)
        .setDepth(6);

    officeGroup.add(office);

    const destinationX =
        gameWidth - office.displayWidth / 2;

    const travel = Math.max(
        1,
        office.x - destinationX
    );

    let previousX = office.x;

    scene.tweens.add({
        targets: office,
        x: destinationX,
        duration: travel / 350 * 1000,
        ease: 'Linear',

        onUpdate: () => {
            const moved = previousX - office.x;
            previousX = office.x;

            if (roadSprite) {
                roadSprite.tilePositionX += moved / roadScale;
            }

            scrollBackgrounds(scene, moved * 0.08);
        },

        onComplete: () => {
            // Центр входной двери — около 31% ширины PNG офиса
            // (на отметке пользователя), а не окно на отметке 53%.
            const officeLeft = office.x - office.displayWidth / 2;
            const heroTargetX = Math.min(
                gameWidth - 120,
                officeLeft + office.displayWidth * 0.31
            );

            scene.tweens.add({
                targets: playerView,
                x: heroTargetX,
                duration: 750,

                onUpdate: () => {
                    playerShadow.x = playerView.x;
                },

                onComplete: () => {
                    playerView.x = heroTargetX;
                    playerView.y = GROUND_Y;
                    playerShadow.x = heroTargetX;
                    // Только теперь останавливаемся у двери.
                    setHeroFrame(1);
                    SoundFx.win();
                    scene.time.delayedCall(700, () => showVictoryCard(scene));
                }
            });
        }
    });
}

function showVictoryCard(scene) {
    if (gameState !== 'WIN_CINEMATIC') return;

    gameState = 'WIN_MENU';
    updateTouchControls();
    hidePlayer();

    const windowData = imageWindow(
        scene,
        'win_screen',
        0.72
    );

    if (!windowData) return;

    // Оранжевая кнопка «ЗАБРАТЬ СВОЙ ПОДАРОК».
    addWindowHotspot(
        scene,
        windowData,
        0.75, 0.75,
        0.44, 0.18,
        // Во встроенном браузере iPhone новая вкладка может блокироваться.
        () => window.location.assign(WIN_FORM_URL)
    );

    // Нижняя текстовая ссылка «Сыграть ещё раз».
    addWindowHotspot(
        scene,
        windowData,
        0.76, 0.90,
        0.30, 0.11,
        () => showCharacterSelect(scene)
    );
}
