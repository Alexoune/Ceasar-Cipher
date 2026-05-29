export default class Titre extends Phaser.Scene {
    constructor() {
        super('titre');
    }

    create() {
        this.bg = this.add.image(240, 160, 'cube');
    }

    update(time) {
        if (time > 2000) {
            this.scene.switch('menuScreen');
        }
    } 

}