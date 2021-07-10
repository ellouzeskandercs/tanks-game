import Phaser from 'phaser';
import { initPreloadImages } from '../assets/constants';

class InitScene extends Phaser.Scene {
    constructor(){
        super('initScene');
    }

    private _startGame() {
        this.scene.switch('gameScene');
    }

	preload() {
        Object.values(initPreloadImages).forEach((imagetoLoad) => this.load.image(imagetoLoad.name, imagetoLoad.path))
	}

	create() {
        this.add.image(400, 250, 'init-background');

        const text = this.add.text(350,250, 'Start the game');
        text.setInteractive({ useHandCursor: true });
        text.on('pointerdown', () => this._startGame());
	}
}

export default InitScene;