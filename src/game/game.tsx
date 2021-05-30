import React, { Component } from 'react';
import Phaser from 'phaser';
import { assetImage, preloadImages } from './constants';
import { Tank } from './tank';
import _ from 'lodash';
import { Angle, ANGLE_UNIT } from './angle'

function getDirectionAngle([top, right, bottom, left]: boolean[]): Angle{
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
    if(_.isEqual([top, right, bottom, left], [true,false,false,false])) { return (new Angle(DIRECTIONS.TOP, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [true,true,false,false])) { return (new Angle(DIRECTIONS.TOPRIGHT, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [false,true,false,false])) { return (new Angle(DIRECTIONS.RIGHT, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [false,true,true,false])) { return (new Angle(DIRECTIONS.BOTTOMRIGHT, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [false,false,true,false])) { return (new Angle(DIRECTIONS.BOTTOM, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [false,false,true,true])) { return (new Angle(DIRECTIONS.BOTTOMLEFT, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [false,false,false,true])) { return (new Angle(DIRECTIONS.LEFT, ANGLE_UNIT.DEGREES)); } 
    if(_.isEqual([top, right, bottom, left], [true,false,false,true])) { return (new Angle(DIRECTIONS.TOPLEFT, ANGLE_UNIT.DEGREES)); } 
    throw new Error('Could not find the direction angle form input');
}

export class Welcome extends Component {
    componentDidMount() {
        let tank: Tank;
        let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

        const config = {
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
                    debug: false
                }
            },
        };

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
                tank.moveToDirection(getDirectionAngle(cursorsDirections))
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