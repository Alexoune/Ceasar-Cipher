const TILE_LENGTH = 32;

export default class Button extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, tile) {
        super(scene, x*TILE_LENGTH + 16, y*TILE_LENGTH + 16, 'buttons', tile - 4);

        this.scene = scene;
        this.scene.add.existing(this);

        this.setDepth(this.y - 32);

        this.gridX = x;
        this.gridY = y;

        this.key = key;

        this.tile = tile;

    }

}