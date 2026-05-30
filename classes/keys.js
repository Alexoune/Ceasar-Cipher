export default class Keys {
    constructor(scene)  {
        this.scene = scene;

        this.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.space = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.e = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.a = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.l = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.q = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        this.numbers = [
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO),
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX),
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN),
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT),
            this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE),
        ];

    }

    isRight() {
        return Phaser.Input.Keyboard.JustDown(this.right);
    }

    isLeft() {
        return Phaser.Input.Keyboard.JustDown(this.left);
    }

    isDown() {
        return Phaser.Input.Keyboard.JustDown(this.down);
    }

    isUp() {
        return Phaser.Input.Keyboard.JustDown(this.up);
    }

    isSpace() {
        return this.space.isDown;
    }

    isE() {
        return Phaser.Input.Keyboard.JustDown(this.e);
    }

    isA() {
        return Phaser.Input.Keyboard.JustDown(this.a);
    }

    isL() {
        return Phaser.Input.Keyboard.JustDown(this.l);
    }

    isQ() {
        return Phaser.Input.Keyboard.JustDown(this.q);
    }

    isNumberKey(n) {
        return Phaser.Input.Keyboard.JustDown(this.numbers[n]);
    }


    
}