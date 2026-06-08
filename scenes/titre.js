const SCREEN_WIDTH = 736;
const SCREEN_HEIGHT = 480;

export default class Titre extends Phaser.Scene {
    constructor() {
        super('titre');
    }
    create() {
        this.bg = this.add.image(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 'Logo');
        this.bg.setScale(0.5);

        this.time.delayedCall(2000, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);

            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('menuScreen');
            });
        });

    }

}