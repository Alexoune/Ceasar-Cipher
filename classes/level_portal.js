export default class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene = scene;
        this.scene.add.existing(this);

    }

}