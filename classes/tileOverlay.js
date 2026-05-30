import Keys from "../classes/keys.js";

import { vectorMap } from "../data/moveData.js";

const TILE_LENGTH = 32;

export default class TileOverlay extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'tileset');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        this.setAlpha(0.75);

        this.keys = new Keys(this.scene);
        this.mouse = this.scene.input.activePointer;

        this.tile = 1;

        this.gridX = 0;
        this.gridY = 0;

        this.offX = this.displayWidth/2;
        this.offY = this.displayHeight/2

        this.imageX = 0;
        this.imageY = 0;

        this.autotile = 1;

        this.layerList = this.scene.layerList;
        this.layer = 0;

    }

    update(time, layer = this.layerList[this.layer]) {
        if (this.keys.isNumberKey(0)) this.tile = 0;
        if (this.keys.isNumberKey(1)) this.tile = 1;
        if (this.keys.isNumberKey(2)) this.tile = 2;
        if (this.keys.isNumberKey(3)) this.tile = 12;

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

        if (this.keys.isSpace()) {
            this.scene.putTile(layer, this.tile + 1, this.gridX, this.gridY);

            if (this.autotile > 0) {
                this.scene.fixTile(layer, this.gridX, this.gridY);

                for (let i = 0; i < vectorMap.length; i++) {
                    if (this.gridX + vectorMap[i][0] > layer.layer.width - 1 || this.gridX + vectorMap[i][0] < 0) continue;
                    if (this.gridY + vectorMap[i][1] > layer.layer.height - 1 || this.gridY + vectorMap[i][1] < 0) continue;

                    this.scene.fixTile(layer, this.gridX + vectorMap[i][0], this.gridY + vectorMap[i][1]);
                }

            }
        }

        if (this.keys.isE()) {
            this.tile = layer.layer.data[this.gridY][this.gridX].index - 1;
            if (this.tile < 0) this.tile = 0;
        }

        if (this.keys.isA()) {
            this.autotile = 1 - this.autotile;
        }

        if (this.keys.isL()) {
            this.layer += 1;

            if (this.layer > this.layerList.length - 1) {
                this.layer = 0;
            }

            console.log(this.layer);
        }

    }

}