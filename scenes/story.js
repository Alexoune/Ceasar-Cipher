import Player from "../classes/player.js";
import Clone from "../classes/clone.js";

import TransitionOverlay from "../classes/transitionOverlay.js";

import Keys from "../classes/keys.js";

const TILE_LENGTH = 32;
const MAP_OFFSET_X = 16;
const MAP_OFFSET_Y = 16;

export default class Story extends Phaser.Scene {
    constructor() {
        super('story');

        this.startX = 1;
        this.startY = 1;

        this.tile;

        this.canPlay = true;
    }

    introScene() {
        this.blackOverlay.setAlpha(1);

        this.time.delayedCall(3000, () => {
            this.startMusic.play();

            this.time.delayedCall(1000, () => {
                this.static.setAlpha(1);
            });

            this.time.delayedCall(10000, () => {
                this.blackOverlay.fadeIn(2000);
            });

            this.time.delayedCall(19000, () => {
                this.stopMusic.play()
                
            });

            this.time.delayedCall(21900, () => {
                this.startMusic.stop()
                this.static.setAlpha(0);
                this.canPlay = true;
            });
        });

    }

    gameOverScene() {
        this.canPlay = false;

        this.static.setPosition(this.player.x, this.player.y);
        this.static.setAlpha(1);

        this.gameOverSound.play();

        this.time.delayedCall(3000, () => {
            this.blackOverlay.fadeOut(2000);
        });

    }

    create() {    
        this.g = this.add.graphics()
        this.g.lineStyle(4, 0xffffff, 1);

        this.map = this.make.tilemap({key: 'map'});
        this.tileset = this.map.addTilesetImage('spritefusion', 'tileset');

        this.ground = this.map.createDynamicLayer('Ground', this.tileset, 0, 0);

        this.player = new Player(this, this.startX, this.startY);
        this.physics.add.collider(this.player, this.ground);

        this.cloneGroup = this.add.group();
        this.physics.add.collider(this.cloneGroup, this.ground);
        this.cloneList = [];

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

        this.keys = new Keys(this);
        
        this.blackOverlay = new TransitionOverlay(this, 240, 160, 0);

        this.startMusic = this.sound.add('songStart', {
            volume: 0.5 
        });

        this.stopMusic = this.sound.add('suddenStop', {
            volume: 0.5 
        });

        this.gameOverSound = this.sound.add('game_over_static', {
            volume: 0.7,
            loop: true
        })

        this.static = this.add.sprite(this.player.x, this.player.y, 'lapin_game_over').setScale(4/3).setAlpha(0);
        this.static.anims.play('lapin_game_over', true);        

        //this.introScene();

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

    createClone() {
        let clone = new Clone(this, this.startX, this.startY);

        this.cloneGroup.add(clone);
        this.cloneList.push(clone);
    }

    moveClones(layer) {
        this.g.clear()

        for (let i = 0; i < this.cloneList.length; i++) {
            this.cloneList[i].moveClone(layer);
        }
    }

    stopClones(layer) {
        this.g.lineStyle(4, 0xffffff, 1);

        for (let i = 0; i < this.cloneList.length; i++) {
            this.cloneList[i].stopClone(layer);
        }
    }

    getCloneToPush(pusher) {
        for (let i = 0; i < this.cloneList.length; i++) {
            if (this.cloneList[i].mapX == pusher.nextMapX && this.cloneList[i].mapY == pusher.nextMapY && this.cloneList[i].isCollide) {
                return this.cloneList[i];
            }
        }

        return null;
    }

    update(time) {
        if (this.canPlay) {
            this.player.update(time, this.ground); 

            if (this.keys.isEsc()) {
                this.gameOverScene();
            }
        }

    }

}