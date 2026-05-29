import Player from "../classes/player.js";
import Clone from "../classes/clone.js";

const TILE_LENGTH = 32;
const MAP_OFFSET_X = 16;
const MAP_OFFSET_Y = 16;

export default class Story extends Phaser.Scene {
    constructor() {
        super('story');

        this.startX = 1;
        this.startY = 1;

        this.tile;
    }

    create() {    
        this.g = this.add.graphics()
        this.g.lineStyle(4, 0xffffff, 1);

        this.map = this.make.tilemap({key: 'map'});
        this.tileset = this.map.addTilesetImage('spritefusion', 'tiles');

        this.ground = this.map.createDynamicLayer('Ground', this.tileset, 0, 0).setScale(2);
        this.ground.setCollisionBetween(15, 16);


        this.player = new Player(this, this.startX, this.startY);
        this.physics.add.collider(this.player, this.ground);

        this.cloneGroup = this.add.group();
        this.physics.add.collider(this.cloneGroup, this.ground);
        this.cloneList = [];

        this.physics.add.overlap(this.player, this.cloneGroup, (p, c) => {
            p.setVelocity(0,0);
            
            p.setPosition(
                MAP_OFFSET_X + p.mapX*TILE_LENGTH, 
                MAP_OFFSET_Y + p.mapY*TILE_LENGTH
            );
            
            [p.nextMapX, p.nextMapY] = [p.mapX, p.mapY];

            c.isBashed = true;
            c.setVelocity(0,0);
            c.setPosition(
                MAP_OFFSET_X + c.lastMapX*TILE_LENGTH, 
                MAP_OFFSET_Y + c.lastMapY*TILE_LENGTH
            );
        });

        this.physics.add.overlap(this.cloneGroup, this.cloneGroup, (c1, c2) => {
            [c1, c2].forEach((clone) => {    
                clone.isBashed = true;
                clone.setVelocity(0,0);
                clone.setPosition(
                    MAP_OFFSET_X + clone.lastMapX*TILE_LENGTH, 
                    MAP_OFFSET_Y + clone.lastMapY*TILE_LENGTH
                );
            });
        });
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
        this.player.update(time, this.ground);
    } 

}