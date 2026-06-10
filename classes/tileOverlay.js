import Button from "../classes/level_button.js";
import Door from "../classes/level_door.js";

import Keys from "../classes/keys.js";

import { tileGroups, tileRecipes } from "../data/autotileData.js";
import { vectorMap } from "../data/moveData.js";
import { doorKeyData } from "../data/doorKeyData.js";

const TILE_LENGTH = 32;

export default class TileOverlay extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'tileset');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        this.setAlpha(0.75);
        this.setDepth(1000000);

        this.keys = new Keys(this.scene);
        this.mouse = this.scene.input.activePointer;

        this.tile = 1;

        this.tileIndex;
        this.tileGroup;
        this.recipe;
        this.edgeTile;

        this.gridX = 0;
        this.gridY = 0;

        this.offX = this.displayWidth/2;
        this.offY = this.displayHeight/2

        this.imageX = 0;
        this.imageY = 0;

        this.autotile = 1;

        this.exitBlueX = null;
        this.exitBlueY = null;
        this.exitPurpleX = null;
        this.exitPurpleY = null;

        this.layerList = this.scene.layerList;
        this.layer = 1;

        this.placeDoorMode = false;

    }

    putTile(layer, x, y) {
        this.putTileOnLayer(layer, this.tile + 1, x, y);

        if (this.tile == 18 && this.exitBlueX == null) {
            this.exitBlueX = x;
            this.exitBlueY = y;
        }

        if (this.tile == 19 && this.exitPurpleX == null) {
            this.exitPurpleX = x;
            this.exitPurpleY = y;
        }

        if (this.tile == 4 || this.tile == 5) {
            let button = new Button(this.scene, this.gridX, this.gridY, doorKeyData.length, this.tile);
            doorKeyData.push([button]);

            this.placeDoorMode = true;
            this.tile += 4;
            return;
        }

        if (this.tile == 8 || this.tile == 9) {
            let door = new Door(this.scene, this.gridX, this.gridY, doorKeyData.length, this.tile, layer);
            doorKeyData[doorKeyData.length - 1].push(door);

            this.placeDoorMode = false;
            this.tile -= 4;
            return;
        }

        if (this.autotile > 0) {
            this.fixTileAtPoint(layer, x, y);

            for (let i = 0; i < vectorMap.length; i++) {
                if (x + vectorMap[i][0] > layer.layer.width - 1 || x + vectorMap[i][0] < 0) continue;
                if (y + vectorMap[i][1] > layer.layer.height - 1 || y + vectorMap[i][1] < 0) continue;

                this.fixTileAtPoint(layer, x + vectorMap[i][0], y + vectorMap[i][1]);

            }
        }
    
    }

    putTileOnLayer(layer, tile, x, y) {
        if (tile == 1) {
            this.deleteTile(layer, tile, x, y);
            return;
        }

        if (tile == 19) {
            if (this.exitBlueX != null) {
                return;
            }
        }

        if (tile == 20) {
            if (this.exitPurpleX != null) {
                return;
            }
        }

        layer.putTileAt(tile, x, y);
    }

    deleteTile(layer, tile, x, y) {
        let tileIndex = layer.layer.data[y][x].index - 1;

        if (tileIndex == 18) {
            this.exitBlueX = null;
            this.exitBlueY = null;
        }

        if (tileIndex == 19) {
            this.exitPurpleX = null;
            this.exitPurpleY = null;
        }

        if (tileIndex == 4 || tileIndex == 5) {
            for (let i = 0; i < doorKeyData.length; i++) {
                if (doorKeyData[i][0].gridX == x && doorKeyData[i][0].gridY == y) {
                    layer.putTileAt(-1, doorKeyData[i][1].gridX, doorKeyData[i][1].gridY);

                    doorKeyData[i][0].destroy();
                    doorKeyData[i][1].destroy();
                    
                    doorKeyData.splice(i, 1);
                    
                    break;
                }
            }
        }

        if (tileIndex == 8 || tileIndex == 9) {
            for (let i = 0; i < doorKeyData.length; i++) {
                if (doorKeyData[i][1].gridX == x && doorKeyData[i][1].gridY == y) {
                    layer.putTileAt(-1, doorKeyData[i][0].gridX, doorKeyData[i][0].gridY);
                    
                    doorKeyData[i][0].destroy();
                    doorKeyData[i][1].destroy();
                    
                    doorKeyData.splice(i, 1);

                    break;
                }
            }
        }

        layer.putTileAt(-1, x, y);
    }

    fixTileAtPoint(layer, x, y) {
        this.tileIndex = layer.layer.data[y][x].index - 1;

        if (this.tileIndex < 0 || !tileRecipes[this.tileIndex]) {
            return;
        }

        this.tileGroup = tileGroups[this.tileIndex];

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

    resetAllDoors() {
        for (let door of doorKeyData) {
            door[1].resetDoor();
        }
    }

    update(time, layer = this.scene.layerList[this.layer]) {
        this.gridX = Math.floor(this.mouse.x / TILE_LENGTH);
        this.gridY = Math.floor(this.mouse.y / TILE_LENGTH);

        if (this.gridX > layer.layer.width) this.gridX = layer.layer.width;
        if (this.gridY > layer.layer.height) this.gridY = layer.layer.height;
        if (this.gridX < 0) this.gridX = 0;
        if (this.gridY < 0) this.gridY = 0;

        this.imageX = (this.tile % 4) * (TILE_LENGTH + 1) + 1;
        this.imageY = (Math.floor(this.tile / 4)) * (TILE_LENGTH + 1) + 1;

        this.setPosition(
            this.gridX * TILE_LENGTH + this.offX - this.imageX, 
            this.gridY * TILE_LENGTH + this.offY - this.imageY
        );

        this.setCrop(this.imageX, this.imageY, TILE_LENGTH, TILE_LENGTH);

        if (this.placeDoorMode) {
            if (this.keys.isSpace(false)) {
                this.putTile(layer, this.gridX, this.gridY);
            }
            return;
        }

        if (this.keys.isNumberKey(0)) this.tile = 0;
        if (this.keys.isNumberKey(1)) this.tile = 1;
        if (this.keys.isNumberKey(2)) this.tile = 19;
        if (this.keys.isNumberKey(3)) this.tile = 18;
        if (this.keys.isNumberKey(4)) this.tile = 4;
        if (this.keys.isNumberKey(5)) this.tile = 5;
        if (this.keys.isNumberKey(6)) this.tile = 12;

        if (this.keys.isSpace(!(this.tile == 4 || this.tile == 5 || this.tile == 8 || this.tile == 9))) {
            this.putTile(layer, this.gridX, this.gridY);
        }

        if (this.keys.isE()) {
            this.tile = layer.layer.data[this.gridY][this.gridX].index - 1;
            if (this.tile < 0) this.tile = 0;
            if (this.tile == 8 || this.tile == 9) this.tile = 0;
        }

        if (this.keys.isA()) {
            this.autotile = 1 - this.autotile;
        }

        if (this.keys.isL()) {
            this.layer += 1;

            if (this.layer > this.scene.layerList.length - 1) {
                this.layer = 0;
            }

        }

    }

}