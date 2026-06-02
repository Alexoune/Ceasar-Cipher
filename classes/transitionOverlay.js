export default class TransitionOverlay extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, alpha) {
        super(scene, x, y, 'black');

        this.scene = scene;
        this.scene.add.existing(this);

        this.setScale(3);
        this.setDepth(10000000000000000000000000000000000000000000000000);
        this.setAlpha(alpha);

        this.isShown;

        if (alpha > 0) {
            this.isDrawn = true;
        } else {
            this.isDrawn = false;
        }

    }

    fadeIn(delay) {
        if (!this.isDrawn) return;

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: delay,
            ease: 'Linear'
        });

        this.isDrawn = false;
    }

    fadeOut(delay) {
        if (this.isDrawn) return;

        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: delay,
            ease: 'Linear'
        });

        this.isDrawn = true;
    }

}