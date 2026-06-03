export default class Gate extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, idx) {
        super(scene, x, y);

        this.scene = scene;
        this.scene.add.existing(this);

        this.idx = idx;

    }

}