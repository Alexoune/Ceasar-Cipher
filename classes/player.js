import Keys from "../classes/keys.js";

import { directionMap, moveInputs } from "../data/moveData.js";
import { doorKeyData } from "../data/doorKeyData.js";
import Clone from "./clone.js";

const TILE_LENGTH = 32;
const MAP_OFFSET_X = 16;
const MAP_OFFSET_Y = 10;

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, MAP_OFFSET_X + TILE_LENGTH*x, MAP_OFFSET_Y + TILE_LENGTH*y, 'lapin_sang', 4);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        this.body.setSize(10,10);
        this.body.setOffset(this.displayWidth/4 + 1, this.displayHeight/2) - 2; 

        this.setScale(4/3);

        this.keys = new Keys(this.scene);

        this.t = 0.3;
        this.v = (TILE_LENGTH/this.t);

        this.vx = 0;
        this.vy = 0;

        this.startX = x;
        this.startY = y;

        this.mapX = x;
        this.mapY = y;
        
        this.nextMapX = x;
        this.nextMapY = y;

        this.xAxis = 0;
        this.yAxis = 0;

        this.startPressTime;
        this.elapsed;

        this.cloneLateFactor = 3;
        this.cloneLimit = 1;
        this.cloneCount = 0;

        this.tile;

        this.pressed = false;
        this.moving = false;

        this.cloneToPush;
        this.pushX;
        this.pushY;

        this.clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    }

    update(time, layers) {
        this.setDepth(this.y);
        if (this.scene.clone) this.scene.clone.setDepth(this.scene.clone.y);

        if (time == 0) return;

        if (this.moving) {
            this.movement(time, layers);
        } else {
            this.inputs(time, layers);
        }

    }

    inputs(time, layers) {
        this.xAxis = (+this.keys.isRight()) - (+this.keys.isLeft());
        this.yAxis = (+this.keys.isDown()) - (+this.keys.isUp());

        if (this.xAxis != 0 || this.yAxis != 0) {
            if (!this.pressed) {
                this.pressed = true;
                this.moving = true;
                this.startPressTime = time;
                    
                this.nextMapX += this.xAxis;
                this.nextMapY += this.yAxis;

                for (let layer of layers) {
                    if (this.scene.checkCollisionAtSquare(this.nextMapX, this.nextMapY, layer)) {
                        this.nextMapX = this.mapX;
                        this.nextMapY = this.mapY;
                    }
                
                }

                this.vx = this.xAxis * this.v;
                this.vy = this.yAxis * this.v;

                if (this.scene.clone) {
                    this.pushClone(layers);
                    this.scene.clone.moveClone(layers);
                }

                if (this.xAxis > 0 && this.yAxis == 0) this.anims.play("lapin_sang_right", true);
                else if (this.xAxis < 0 && this.yAxis == 0) this.anims.play("lapin_sang_left", true);
                else if (this.xAxis == 0 && this.yAxis > 0) this.anims.play("lapin_sang_down", true);
                else if (this.xAxis == 0 && this.yAxis < 0) this.anims.play("lapin_sang_up", true);

                this.setVelocity(this.vx, this.vy);

            }
        } else {
            this.pressed = false;
        }
    }

    movement(time, layers) {
        this.elapsed = (time - this.startPressTime)/1000;

        if (this.elapsed >= this.t) {
            this.moving = false;

            this.pushMoveFromVelocity(this.vx, this.vy);

            this.vx = 0;
            this.vy = 0;
            
            this.setVelocity(this.vx,this.vy);

            this.resetPosition(this.nextMapX, this.nextMapY);

            if (moveInputs.length % this.cloneLateFactor == 0 && this.cloneCount < this.cloneLimit && this.scene.spawning) {
                this.scene.clone = new Clone(this.scene, this.startX, this.startY);
                this.scene.cloneGroup.add(this.scene.clone);
                this.cloneCount += 1;
            }

            this.pressButtonCheck(layers);

            this.anims.stop()
            this.setFrame(4);

            if (this.scene.clone) this.scene.clone.stopClone(layers);

        }
    }

    pushMoveFromVelocity(vx, vy) {
        directionMap.forEach(d => {
            if(d.check({ vx, vy })) moveInputs.push(d.dir);
        });
    }

    pressButtonCheck(layers) {
        if (this.mapX < 0 || this.mapX > 22 || this.mapY < 0 || this.mapY > 14) return;

        for (let layer of layers) {
            this.tile = layer.layer.data[this.mapY][this.mapX].index - 1;

            if (this.tile == 4 || this.tile == 5) {
                for (let i = 0; i < doorKeyData.length; i++) {
                    if (doorKeyData[i][0].gridX == this.mapX && doorKeyData[i][0].gridY == this.mapY) {
                        doorKeyData[i][1].openDoor(layer);
                        return;
                    }
                }
            }
        }
    }

    pushClone(layers) {
        this.cloneToPush = this.getCloneToPush();

        if(this.cloneToPush) {
            this.pushX = this.cloneToPush.mapX + this.xAxis;
            this.pushY = this.cloneToPush.mapY + this.yAxis;

            let condition = false;

            for (let layer of layers) {
                if (!this.scene.checkCollisionAtSquare(this.pushX, this.pushY, layer)) {
                    condition = true;
                    break;
                }
            }

            if (condition) {
                this.cloneToPush.vx = (this.cloneToPush.nextMapX - this.cloneToPush.mapX)*this.v;
                this.cloneToPush.vy = (this.cloneToPush.nextMapY - this.cloneToPush.mapY)*this.v;

                this.cloneToPush.nextMapX = this.pushX;
                this.cloneToPush.nextMapY = this.pushY;

            } else {
                this.nextMapX = this.mapX;
                this.nextMapY = this.mapY;
            }

            return
        }

        for (let layer of layers) {
            if (this.scene.checkCollisionAtSquare(this.nextMapX, this.nextMapY, layer)) {
                this.nextMapX = this.mapX;
                this.nextMapY = this.mapY;
            }
        }

    }

    getCloneToPush() {
        if (this.scene.clone.mapX == this.nextMapX && this.scene.clone.mapY == this.nextMapY && this.scene.clone.isCollide) {
            return this.scene.clone;
        }

        return null;
    }

    isAtPoint(x, y) {
        return this.mapX == x && this.mapY == y;
    }

    isCloneAtPoint(x, y) {
        if (!this.scene.clone) return false;

        return this.scene.clone.mapX == x && this.scene.clone.mapY == y;
    }

    resetPosition(x, y) {
        this.mapX = x;
        this.mapY = y;

        this.setPosition(
            MAP_OFFSET_X + this.mapX*TILE_LENGTH,
            MAP_OFFSET_Y + this.mapY*TILE_LENGTH
        );

        this.nextMapX = x;
        this.nextMapY = y;

    }

    resetClone() {
        this.scene.clone = null;
    }

}