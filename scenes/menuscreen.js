import Keys from "../classes/keys.js";

export default class MenuScreen extends Phaser.Scene {
    constructor() {
        super('menuScreen');
    }

    create() {    
        this.bg = this.add.image(240, 160, 'Menu');
        this.flecheGauche = this.add.image(50, 180, 'FlecheGauche');
        this.flecheDroite = this.add.image(430, 180, 'FlecheDroite');
        this.flecheBas = this.add.image(240, 290, 'FlecheBas');

        this.bg.setScale(0.1);
        this.flecheGauche.setScale(0.1);
        this.flecheDroite.setScale(0.1);
        this.flecheBas.setScale(0.1);
        
        this.keys = new Keys(this);
    }

    update(time) {
        if (this.keys.isLeft()) {
            this.scene.switch('story');
        }
        
        if (this.keys.isRight()) {
            this.scene.switch('levelBuilder');
        }

        if (this.keys.isDown()) {
            this.scene.switch('aboutUs');
        }
    } 

}