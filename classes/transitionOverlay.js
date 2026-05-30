export default class TransitionOverlay extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, alpha) {
        super(scene, x, y, 'black');

        this.scene = scene;
        this.scene.add.existing(this);

        this.setScale(3);
        this.setAlpha(alpha);

    }

    fadeIn(delay) {
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: delay,
            ease: 'Linear'
        });
    }

    fadeOut(delay) {
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: delay,
            ease: 'Linear'
        });
    }

}