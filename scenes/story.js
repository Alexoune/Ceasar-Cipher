import Player from "../classes/player.js";
import Clone from "../classes/clone.js";

import TransitionOverlay from "../classes/transitionOverlay.js";
import EngineText from '../classes/engineText.js';

import Keys from "../classes/keys.js";

import { moveInputs } from "../data/moveData.js";

const TILE_LENGTH = 32;
const MAP_OFFSET_X = 16;
const MAP_OFFSET_Y = 16;

export default class Story extends Phaser.Scene {
    constructor() {
        super('story');

        this.tile;

        this.canPlay = false;
        this.isGameOver = false;
        this.isIntro = true;

        this.currentLevel;
        this.entered = false;

        this.cloneLateFactor;

        this.startX;
        this.startY;

        this.exit1X;
        this.exit1Y;
        this.exit2X;
        this.exit2Y;

        this.spawning = 1;
    }

    introScene() {
        this.setup(this.currentLevel);
        this.player.update(0, this.layerList);

        this.blackOverlay.setAlpha(1);

        this.time.delayedCall(3000, () => {
            this.startMusic.play();

            this.time.delayedCall(1000, () => {
                this.static.setAlpha(1);
            });

            this.time.delayedCall(10000, () => {
                this.blackOverlay.fadeIn(2000);
            });

            this.time.delayedCall(20000, () => {
                for (let i = 0; i < 100; i++) {
                    this.time.delayedCall(i*60, () => {
                        this.startMusic.setVolume(0.5 - i/200);
                        this.static.setAlpha(1 - i/100);
                    });
                }
            });

            this.time.delayedCall(26000, () => {
                this.startMusic.stop();
                this.isIntro = true;
                this.entered = true;
                this.canPlay = true;
            });
        });

    }

    gameOverScene() {
        this.engineText.clearLetters()
        
        this.canPlay = false;

        this.static.setPosition(this.player.x, this.player.y);
        this.static.setAlpha(1);

        this.gameOverSound.setVolume(0.5);
        this.gameOverSound.play();

        this.time.delayedCall(1000, () => {
            this.blackOverlay.fadeOut(2000);
        });

        this.time.delayedCall(3000, () => {
            this.engineText.drawKey(16, 12, 0);
            this.engineText.drawPhrase(42, 16, "quitter", 0);

            this.engineText.drawKey(16, 42, 1);
            this.engineText.drawPhrase(42, 48, "poursuivre", 0);

            this.engineText.drawKey(16, 72, 2);
            this.engineText.drawPhrase(42, 78, "recommencer", 0);

            this.isGameOver = true;

        });

    }

    restartScene() {
        this.isGameOver = false;

        this.engineText.clearLetters();

        for (let i = 0; i < 100; i++) {
            this.time.delayedCall(20*i, () => {
                this.static.setAlpha(1 - i/100);
                this.gameOverSound.setVolume(0.5 - i/200);
            });
        }

        this.time.delayedCall(2000, () => {
            this.player.resetPosition(this.startX, this.startY);
            this.player.cloneCount = 0;
            moveInputs.length = 0;
            
            this.cloneGroup.clear(true, true);
            this.cloneList.length = 0;

            this.g.clear();
        });

        this.time.delayedCall(3000, () => {
            this.blackOverlay.fadeIn(2000);

            this.time.delayedCall(3000, () => {
                this.canPlay = true;
            });
        });
        
    }

    continueScene() {
        this.isGameOver = false;

        this.engineText.clearLetters();

        this.blackOverlay.fadeIn(2000);

        for (let i = 0; i < 100; i++) {
            this.time.delayedCall(20*i, () => {
                this.static.setAlpha(1 - i/100);
                this.gameOverSound.setVolume(0.5 - i/200);
            });
        }

        this.time.delayedCall(2500, () => {
            this.canPlay = true;
        });
    }

    exitScene() {
        this.isGameOver = false;

        this.engineText.clearLetters();

        for (let i = 0; i < 100; i++) {
            this.time.delayedCall(20*i, () => {
                this.static.setAlpha(1 - i/100);
                this.gameOverSound.setVolume(0.5 - i/200);
            });
        }

        this.time.delayedCall(2500, () => {
            this.reset();

            this.time.delayedCall(50, () => {
                this.entered = false;
                this.scene.switch('menuScreen');
            });
        });
    }

    reEnterScene() {
        this.blackOverlay.fadeIn(2000);

        this.time.delayedCall(2500, () => {
            this.canPlay = true;
            this.entered = true;
        });
    }

    reset() {
        this.layerList.length = 0

        this.player.cloneCount = 0;
        moveInputs.length = 0;
        
        this.cloneGroup.clear(true, true);
        this.cloneList.length = 0;

        this.g.clear();
        
        this.cloneLateFactor = null;

        this.startX = null;
        this.startY = null;

        this.exit1X = null;
        this.exit1Y = null;
        this.exit2X = null;
        this.exit2Y = null;
    
    }

    setup(level) {
        this.currentLevel = level;

        this.map = this.make.tilemap({key: level});
        this.tileset = this.map.addTilesetImage('spritefusion', 'tileset');

        this.background = this.map.createDynamicLayer('Background', this.tileset, 0, 0);
        this.ground = this.map.createDynamicLayer('Ground', this.tileset, 0, 0);
        this.foreground = this.map.createDynamicLayer('Foreground', this.tileset, 0, 0);

        this.ground.setCollision([9,10,13,14,15,16,17,18], true);
        this.foreground.setCollision([9,10,13,14,15,16,17,18], true);

        this.layerList = [this.background, this.ground, this.foreground];

        this.g = this.add.graphics();
        this.g.lineStyle(4, 0xffffff, 1);

        this.startX = this.map.layers[0].properties[0].startX;
        this.startY = this.map.layers[0].properties[0].startY;

        this.exit1X = this.map.layers[0].properties[0].exit1X;
        this.exit1Y = this.map.layers[0].properties[0].exit1Y;
        this.exit2X = this.map.layers[0].properties[0].exit2X;
        this.exit2Y = this.map.layers[0].properties[0].exit2Y;

        this.player.resetPosition(this.startX, this.startY);
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.foreground);
        moveInputs.length = 0;

        this.static.setPosition(this.player.x, this.player.y);

        this.cloneLateFactor = this.map.layers[0].properties[0].cloneLateFactor;
        this.player.cloneLateFactor = this.cloneLateFactor;
        this.player.startX = this.startX;
        this.player.startY = this.startY;

        this.cloneGroup = this.add.group();
        this.physics.add.collider(this.cloneGroup, this.ground);
        this.physics.add.collider(this.cloneGroup, this.foreground);

        this.physics.add.overlap(this.player, this.cloneGroup, (p, c) => {
            p.setVelocity(0,0);
            
            p.setPosition(
                16 + p.mapX*TILE_LENGTH, 
                10 + p.mapY*TILE_LENGTH
            );
            
            [p.nextMapX, p.nextMapY] = [p.mapX, p.mapY];

            c.isBashed = true;
            c.setVelocity(0,0);
            c.setPosition(
                16 + c.lastMapX*TILE_LENGTH, 
                8 + c.lastMapY*TILE_LENGTH
            );
        });

        this.physics.add.overlap(this.cloneGroup, this.cloneGroup, (c1, c2) => {
            [c1, c2].forEach((clone) => {    
                clone.isBashed = true;
                clone.setVelocity(0,0);
                clone.setPosition(
                    16 + clone.lastMapX*TILE_LENGTH, 
                    8 + clone.lastMapY*TILE_LENGTH
                );
            });
        });
    }

    create() {
        this.keys = new Keys(this);

        this.blackOverlay = new TransitionOverlay(this, 240, 160, 1);
        this.engineText = new EngineText(this);

        this.player = new Player(this, 0, 0);
        this.cloneGroup = this.add.group();
        this.cloneList = [];

        this.static = this.add.sprite(0, 0, 'lapin_game_over')
            .setScale(4/3)
            .setAlpha(0)
            .setDepth(this.blackOverlay.depth + 1);
        this.static.anims.play('lapin_game_over', true);

        this.startMusic = this.sound.add('songStart', {
            volume: 0.5 
        });

        this.stopMusic = this.sound.add('suddenStop', {
            volume: 0.5 
        });

        this.gameOverSound = this.sound.add('game_over_static', {
            volume: 0.5,
            loop: true
        });

        this.currentLevel = 'level1';

        if (!this.isIntro) this.introScene();

    }

    drawArrow(x1, y1, x2, y2, headLength = 10) {
        this.g.lineBetween(x1, y1, x2, y2);

        const angle = Math.atan2(y2 - y1, x2 - x1);

        const leftX  = x2 - headLength * Math.cos(angle - Math.PI / 5);
        const leftY  = y2 - headLength * Math.sin(angle - Math.PI / 5);
        const rightX = x2 - headLength * Math.cos(angle + Math.PI / 5);
        const rightY = y2 - headLength * Math.sin(angle + Math.PI / 5);

        this.g.lineBetween(x2, y2, rightX, rightY);
        this.g.lineBetween(x2, y2, leftX, leftY);
    }

    checkCollisionAtSquare(x, y, layer) {
        this.tile = layer.getTileAt(x, y);
        return this.tile && this.tile.canCollide;
    }

    update(time) {
        if (!this.entered && this.isIntro) {
            this.setup(this.currentLevel);
            this.player.update(0, this.layerList);
            this.reEnterScene();
        }

        if (this.isGameOver) {
            if (this.keys.isEnter()) this.continueScene();
            if (this.keys.isR()) this.restartScene();
            if (this.keys.isEsc()) this.exitScene();
            return;
        }

        if (this.canPlay) {
            this.player.update(time, this.layerList);

            this.engineText.clearLetters();
            this.engineText.drawKey(2, 2, 0);

            if (this.keys.isEsc()) {
                this.gameOverScene();
            }
        }

    }

}