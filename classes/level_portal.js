const TILE_LENGTH = 32;

export default class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, idx) {
        super(scene, x*TILE_LENGTH + 16, y*TILE_LENGTH + 16, 'portals', 0);

        this.scene = scene;
        this.scene.add.existing(this);

        this.setDepth(1000);
        this.setScale(0.15);
        
        this.animation;
        if (idx == 0) this.animation = 'blue_portal';
        else this.animation = 'purple_portal';

    }

    appear() {
        this.anims.play(this.animation, true);
    }

    dissapear() {
        this.anims.stop()
        this.setFrame(0);
    }

}