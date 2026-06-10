const TILE_LENGTH = 32;

export default class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, tile, layer) {
        super(scene, x*TILE_LENGTH + 16, y*TILE_LENGTH + 16, 'doors', 9 - (tile - 8)*9 + 4);

        this.scene = scene;
        this.scene.add.existing(this);

        this.setDepth(this.y - 32);

        this.gridX = x;
        this.gridY = y;

        this.key = key;

        this.tile = tile;
        this.layer = layer;

        this.row = 9 - (this.tile - 8)*9;

        this.open = false;

    }

    openDoor(layer) {
        if (this.open) return;

        this.open = true;

        if (this.tile == 8) {
            this.anims.play('purple_door_open');
        } else {
            this.anims.play('blue_door_open');
        }

        layer.putTileAt(-1, this.gridX, this.gridY);

    }

    resetDoor() {
        this.setFrame(this.row + 4);
        this.open = false;

        this.layer.putTileAt(this.tile + 1, this.gridX, this.gridY);
    }

}