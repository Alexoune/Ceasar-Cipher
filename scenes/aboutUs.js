import Keys from "../classes/keys.js";

export default class AboutUs extends Phaser.Scene {
    constructor() {
        super('aboutUs');
    }

    create() {    
        this.bg = this.add.image(240, 160, 'Background');
        this.bg.setScale(0.1);

        this.keys = new Keys(this);
    }

    update(time) {
        if (this.keys.isUp()) {
            this.scene.switch('menuScreen');
        }
    } 

}