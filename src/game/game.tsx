import './game.scss';
import { Component } from 'react';
import Phaser from 'phaser';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAlt, faMouse, faMousePointer } from '@fortawesome/free-solid-svg-icons'
import GameScene from './scenes/gameScene';
import InitScene from './scenes/initScene';

export class Game extends Component {
    componentDidMount() {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 500,
            parent: 'game-canvas',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            },
        };
        const gameScene = new GameScene();
        const initScene = new InitScene();

        const game = new Phaser.Game(config);

        game.scene.add('gameScene', gameScene);
        game.scene.add('initScene', initScene);
        game.scene.start('initScene');
    }

    render() {
        return (
            <div className="game-container"> 
                <div className="d-flex">
                    <div id="game-canvas"></div>
                    <div className="game-commands">
                        <div className="game-command"> <FontAwesomeIcon icon={faArrowsAlt} className="fa-w-16 command-icon"/> Move Tank </div>
                        <div className="game-command"> <FontAwesomeIcon icon={faMouse} className="fa-w-16 command-icon"/> Left click to shoot bullets </div>
                        <div className="game-command"> <FontAwesomeIcon icon={faMousePointer} className="fa-w-16 command-icon"/> Move mouse to move the cannon </div>
                    </div>
                </div>
            </div>)
    }
}