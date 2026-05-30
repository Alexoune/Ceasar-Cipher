import Keys from "../classes/keys.js";

import { directionMap, moveInputs } from "../data/moveData.js";

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

        this.body.setSize(8,8);
        this.body.setOffset(this.displayWidth/4 + 2, this.displayHeight/2) - 2; 

        this.setScale(4/3);

        this.keys = new Keys(this.scene);

        this.t = 0.3;
        this.v = (TILE_LENGTH/this.t);

        this.vx = 0;
        this.vy = 0;

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

        this.pressed = false;
        this.moving = false;

        this.cloneToPush;
        this.pushX;
        this.pushY;

    }

    update(time, layer) {
        if (this.moving) {
            this.movement(time, layer);
        } else {
            this.inputs(time, layer);
        }

    }

    inputs(time, layer) {
        this.xAxis = (+this.keys.isRight()) - (+this.keys.isLeft());
        this.yAxis = (+this.keys.isDown()) - (+this.keys.isUp());

        if (this.xAxis != 0 || this.yAxis != 0) {
            if (!this.pressed) {
                this.pressed = true;
                this.moving = true;
                this.startPressTime = time;
                    
                this.nextMapX += this.xAxis;
                this.nextMapY += this.yAxis;

                if (this.scene.checkCollisionAtSquare(this.nextMapX, this.nextMapY, layer)) {
                    this.nextMapX = this.mapX;
                    this.nextMapY = this.mapY;
                }

                this.vx = this.xAxis * this.v;
                this.vy = this.yAxis * this.v;

                this.pushClone(layer);

                this.scene.moveClones(layer);

                if (this.xAxis > 0 && this.yAxis == 0) this.anims.play("lapin_sang_right", true);
                else if (this.xAxis < 0 && this.yAxis == 0) this.anims.play("lapin_sang_left", true);
                else if (this.xAxis == 0 && this.yAxis > 0) this.anims.play("lapin_sang_down", true);
                else if (this.xAxis == 0 && this.yAxis < 0) this.anims.play("lapin_sang_up", true);

                this.setVelocity(this.vx,this.vy);

            }
        } else {
            this.pressed = false;
        }
    }

    movement(time, layer) {
        this.elapsed = (time - this.startPressTime)/1000;

        if (this.elapsed >= this.t) {
            this.moving = false;

            this.pushMoveFromVelocity(this.vx, this.vy);

            this.vx = 0;
            this.vy = 0;
            
            this.setVelocity(this.vx,this.vy);

            this.mapX = this.nextMapX;
            this.mapY = this.nextMapY;

            this.setPosition(
                MAP_OFFSET_X + this.mapX*TILE_LENGTH,
                MAP_OFFSET_Y + this.mapY*TILE_LENGTH
            );

            if (moveInputs.length % this.cloneLateFactor == 0 && this.cloneCount < this.cloneLimit) {
                this.scene.createClone();
                this.cloneCount += 1;
            }

            this.anims.stop()
            this.setFrame(4);

            this.scene.stopClones(layer);

        }
    }

    pushMoveFromVelocity(vx, vy) {
        directionMap.forEach(d => {
            if(d.check({ vx, vy })) moveInputs.push(d.dir);
        });
    }

    pushClone(layer) {
        this.cloneToPush = this.scene.getCloneToPush(this);

        if(this.cloneToPush) {
            this.pushX = this.cloneToPush.mapX + this.xAxis;
            this.pushY = this.cloneToPush.mapY + this.yAxis;
            
            if(!this.scene.checkCollisionAtSquare(this.pushX, this.pushY, layer)) {
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
            
        if (this.scene.checkCollisionAtSquare(this.nextMapX, this.nextMapY, layer)) {
            this.nextMapX = this.mapX;
            this.nextMapY = this.mapY;
        }

    }

}