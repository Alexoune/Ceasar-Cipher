import { directionMap, moveInputs, vectorMap } from "../data/moveData.js";

const TILE_LENGTH = 32;
const MAP_OFFSET_X = 16;
const MAP_OFFSET_Y = 8;

export default class Clone extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, MAP_OFFSET_X + TILE_LENGTH*x, MAP_OFFSET_Y + TILE_LENGTH*y, 'lapin_orange', 4);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        this.body.setSize(12,12);
        this.body.setOffset(this.displayWidth/4, this.displayHeight/2); 

        this.setScale(4/3);

        this.animation;
        this.deltaX;
        this.deltaY;

        this.t = 0.3;
        this.v = (TILE_LENGTH/this.t);

        this.vx = 0;
        this.vy = 0;

        this.mapX = x;
        this.mapY = y;
        
        this.nextMapX = x;
        this.nextMapY = y;
        
        this.lastMapX = x;
        this.lastMapY = y;

        this.stepCount = 0;
        this.i = 0;

        this.isBashed = false;
        this.isCollide = false;

    }

    moveClone(layer) {
        this.anims.play(this.animation, true);

        this.vx += (this.nextMapX - this.mapX)*this.v;
        this.vy += (this.nextMapY - this.mapY)*this.v;

        if (this.scene.checkCollisionAtSquare(this.nextMapX, this.nextMapY, layer)) {
            this.nextMapX = this.mapX;
            this.nextMapY = this.mapY;
        }

        this.lastMapX = this.mapX;
        this.lastMapY = this.mapY;

        this.mapX = this.nextMapX;
        this.mapY = this.nextMapY;
            
        this.setVelocity(this.vx, this.vy);

        this.stepCount += 1;

    }   

    stopClone(layer) {
        this.anims.stop()
        this.setFrame(4);

        this.i = moveInputs[this.stepCount];
        
        if(this.isBashed) {
            this.mapX = this.lastMapX;
            this.mapY = this.lastMapY;
        }

        this.isBashed = false;
        this.isCollide = false;

        this.nextMapX = this.mapX + vectorMap[this.i][0];
        this.nextMapY = this.mapY + vectorMap[this.i][1];

        this.scene.drawArrow(
            this.mapX*TILE_LENGTH + MAP_OFFSET_X, 
            this.mapY*TILE_LENGTH + MAP_OFFSET_Y, 
            this.nextMapX*TILE_LENGTH + MAP_OFFSET_X, 
            this.nextMapY*TILE_LENGTH + MAP_OFFSET_Y
        );

        if (this.scene.checkCollisionAtSquare(this.nextMapX, this.nextMapY, layer)) {
            this.isCollide = true;
        }

        this.vx = 0; 
        this.vy = 0;
        this.setVelocity(this.vx, this.vy);

        this.setPosition(
            MAP_OFFSET_X + this.mapX*TILE_LENGTH, 
            MAP_OFFSET_Y + this.mapY*TILE_LENGTH
        );

        this.deltaX = this.nextMapX - this.mapX;
        this.deltaY = this.nextMapY - this.mapY;

        if(this.deltaX > 0 && this.deltaY == 0) this.animation = "lapin_orange_right";
        else if(this.deltaX < 0 && this.deltaY == 0) this.animation = "lapin_orange_left";
        else if(this.deltaX == 0 && this.deltaY > 0) this.animation = "lapin_orange_down";
        else if(this.deltaX == 0 && this.deltaY < 0) this.animation = "lapin_orange_up";

    }
    
}