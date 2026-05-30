const SCREEN_WIDTH = 736;
const SCREEN_HEIGHT = 480;

export default class Titre extends Phaser.Scene {
    constructor() {
        super('titre');
    }

    create() {
        this.bg = this.add.image(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, 'Logo');
        this.bg.setScale(0.5);

        this.bg.setAlpha(1);
    }

    update(time) {
        if (time > 3000) {
            this.scene.switch('menuScreen');
            
        }
    } 

}