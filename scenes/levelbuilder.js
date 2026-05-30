import Player from "../classes/player.js";
import Clone from "../classes/clone.js";
import TileOverlay from "../classes/tileOverlay.js";

import { tileGroups, tileRecipes } from "../data/autotileData.js";
import { vectorMap } from "../data/moveData.js";

import Keys from "../classes/keys.js";

const TILE_LENGTH = 32;
const MAP_OFFSET_X = 16;
const MAP_OFFSET_Y = 16;

export default class LevelBuilder extends Phaser.Scene {
    constructor() {
        super('levelBuilder');

        this.startX = 1;
        this.startY = 1;

        this.check;

        this.tile;
        this.tileGroup;
        this.recipe;
        this.edgeTile;

        this.spawning = false;

    }

    create() {    
        this.g = this.add.graphics()
        this.g.lineStyle(4, 0xffffff, 1);

        this.map = this.make.tilemap({key: 'build'});
        this.tileset = this.map.addTilesetImage('spritefusion', 'tileset');

        this.background = this.map.createDynamicLayer('Background', this.tileset, 0, 0);
        this.ground = this.map.createDynamicLayer('Ground', this.tileset, 0, 0);
        this.foreground = this.map.createDynamicLayer('Foreground', this.tileset, 0, 0);

        this.layerList = [this.background, this.ground, this.foreground];

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

        this.tileOverlay = new TileOverlay(this, 0, 0);

        this.keys = new Keys(this);
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
        this.check = layer.getTileAt(x, y);
        return this.check && this.check.canCollide;
    }

    createClone() {
        if (!this.spawning) return;

        let clone = new Clone(this, this.startX, this.startY);

        this.cloneGroup.add(clone);
        this.cloneList.push(clone);
    }

    moveClones(layer) {
        for (let i = 0; i < this.cloneList.length; i++) {
            this.cloneList[i].moveClone(layer);
        }
    }

    stopClones(layer) {
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

    putTile(layer, tile, x, y) {
        if (tile == 1) {
            layer.putTileAt(-1, x, y);
            return;
        }

        layer.putTileAt(tile, x, y);
    }

    fixTile(layer, x, y) {
        this.tile = layer.layer.data[y][x].index - 1;

        if (this.tile < 0 || !tileRecipes[this.tile]) {
            return;
        }

        this.tileGroup = tileGroups[this.tile];

        if (!this.tileGroup) {
            return;
        }

        this.recipe = "";

        for (let i = 0; i < vectorMap.length; i++) {
            if (x + vectorMap[i][0] > layer.layer.width - 1 || x + vectorMap[i][0] < 0) continue;
            if (y + vectorMap[i][1] > layer.layer.height - 1 || y + vectorMap[i][1] < 0) continue;

            this.edgeTile = layer.layer.data[y + vectorMap[i][1]][x + vectorMap[i][0]].index - 1

            if (this.tileGroup === tileGroups[this.edgeTile]) {
                this.recipe += "1";
            } else {
                this.recipe += "0";
            }
        }

        for (let t = 0; t < tileGroups.length; t++) {
            if (tileGroups[t] != this.tileGroup) continue;
            if (!tileRecipes[t].includes(this.recipe)) continue;

            layer.putTileAt(t + 1, x, y);
            return
        }
        
    }

    copyLevel() {
        let storedLevel = "";

        storedLevel += `
    {
        "id": 1,
        "name": "Ground",
        "opacity": 1.0,
        "type": "tilelayer",
        "visible": true,
        "x": 0,
        "y": 0,
        "width": 23,
        "height": 15,
        "data": [
        `;

        storedLevel += this.copyLayer(this.ground);

        storedLevel += `
        ],
        "properties": [
            {
            "name": "collider",
            "type": "bool",
            "value": false
            }
        ]
    }, {
        "id": 2,
        "name": "Foreground",
        "opacity": 1.0,
        "type": "tilelayer",
        "visible": true,
        "x": 0,
        "y": 0,
        "width": 23,
        "height": 15,
        "data": [
        `;

        storedLevel += this.copyLayer(this.foreground);

        storedLevel += `
        ],
        "properties": [
            {
            "name": "collider",
            "type": "bool",
            "value": false
            }
        ]
    }, {
        "id": 3,
        "name": "Background",
        "opacity": 1.0,
        "type": "tilelayer",
        "visible": true,
        "x": 0,
        "y": 0,
        "width": 23,
        "height": 15,
        "data": [
        `;

        storedLevel += this.copyLayer(this.background);

        storedLevel += `
        ],
        "properties": [
            {
            "name": "collider",
            "type": "bool",
            "value": false
            }
        ]
    }
        `;

        navigator.clipboard.writeText(storedLevel);
    }

    copyLayer(layer) {
        let storedLayer = "";
        let tile;

        for (let y = 0; y < layer.layer.height; y++) {
            for (let x = 0; x < layer.layer.width; x++) {
                tile = layer.layer.data[y][x].index;
                if (tile < 0) tile = 0;

                storedLayer += (tile + ",");
            }
        }

        storedLayer = storedLayer.slice(0,-1);

        //navigator.clipboard.writeText(storedLayer);

        return storedLayer;

    }

    update(time) {
        this.player.update(time, this.ground);

        this.tileOverlay.update(time);

        if (this.keys.isQ()) {
            this.copyLevel();
        }
    } 

}