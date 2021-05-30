import React, { Component } from 'react';
import Phaser from 'phaser';
import { assetImage, preloadImages } from './constants';
import { Tank } from './tank';
import _ from 'lodash';

function getDirectionAngle([top, right, bottom, left]: boolean[]){
    enum DIRECTIONS {
        TOP = -90,
        TOPRIGHT = -45,
        RIGHT = 0,
        BOTTOMRIGHT = 45,
        BOTTOM = 90,
        BOTTOMLEFT = 135,
        LEFT = 180,
        TOPLEFT = -135,
    }
    if(_.isEqual([top, right, bottom, left], [true,false,false,false])) { return DIRECTIONS.TOP; } 
    if(_.isEqual([top, right, bottom, left], [true,true,false,false])) { return DIRECTIONS.TOPRIGHT; } 
    if(_.isEqual([top, right, bottom, left], [false,true,false,false])) { return DIRECTIONS.RIGHT; } 
    if(_.isEqual([top, right, bottom, left], [false,true,true,false])) { return DIRECTIONS.BOTTOMRIGHT; } 
    if(_.isEqual([top, right, bottom, left], [false,false,true,false])) { return DIRECTIONS.BOTTOM; } 
    if(_.isEqual([top, right, bottom, left], [false,false,true,true])) { return DIRECTIONS.BOTTOMLEFT; } 
    if(_.isEqual([top, right, bottom, left], [false,false,false,true])) { return DIRECTIONS.LEFT; } 
    if(_.isEqual([top, right, bottom, left], [true,false,false,true])) { return DIRECTIONS.TOPLEFT; } 
}

export class Welcome extends Component {
    componentDidMount() {
        let player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        let tank: Tank;
        let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
        var config = {
            type: Phaser.AUTO,
            width: 800,
            height: 500,
            parent: 'game-container',
            scene: {
                preload: preload,
                create: create,
                update: update
            },
            physics: {
                default: 'arcade',
                arcade: {
                    // gravity: { y: 300 },
                    debug: false
                }
            },
        };
        let cannon: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

        var game = new Phaser.Game(config);
        
        function preload(this: Phaser.Scene) {
            preloadImages.forEach((imagetoLoad) => this.load.image(imagetoLoad.name, imagetoLoad.path))
        }
        
        function create(this: Phaser.Scene) {
            this.add.image(400, 250, 'background');

            cursors = this.input.keyboard.createCursorKeys();

            let obstacles = this.physics.add.staticGroup();
            obstacles.create(400, 350, 'obstacle');
            obstacles.create(200, 150, 'obstacle');
            obstacles.create(550, 150, 'obstacle');

            tank = new Tank(this, 25, 20, obstacles) 
            // player.setCollideWorldBounds(true);
            // this.physics.add.collider(tank, obstacles);
        }
        
        function update(this: Phaser.Scene) {
            let cursorsDirections = [cursors.up.isDown, cursors.right.isDown, cursors.down.isDown, cursors.left.isDown];

            if(cursorsDirections[0] && cursorsDirections[2] || cursorsDirections[1] && cursorsDirections[3] || !cursorsDirections.reduce((a, b) => a || b, false)){
                tank.stop();
            } else {
                tank.moveToDirection(getDirectionAngle(cursorsDirections) as number)
            }
            let mousepointer = this.game.input.mousePointer;
            tank.pointCannonToPoint(mousepointer.x, mousepointer.y); 
        }
    }

    render() {
        return (
            <div className="game">
                <h1>Hi this is a game</h1>
                <div className="game-container"> </div>
            </div>);
    }
}