import React, { Component } from 'react';
import Phaser from 'phaser';
import background from './assets/background.png';

export class Welcome extends Component {
    componentDidMount() {
        const image = new Image('./assets/background.png');
        let player, cursors;
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
        
        var game = new Phaser.Game(config);
        
        function preload() {
            this.load.image('background', 'assets/background.png');
            this.load.image('obstacle', 'assets/obstacle.png');
            this.load.image('tank', 'assets/tank.png');
        }
        
        function create() {
            // this.anims.create({
            //     key: 'left',
            //     frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            //     frameRate: 10,
            //     repeat: -1
            // });

            // this.anims.create({
            //     key: 'turn',
            //     frames: [ { key: 'dude', frame: 4 } ],
            //     frameRate: 20
            // });

            // this.anims.create({
            //     key: 'right',
            //     frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            //     frameRate: 10,
            //     repeat: -1
            // });

            this.add.image(400, 250, 'background');

            cursors = this.input.keyboard.createCursorKeys();

            let obstacles = this.physics.add.staticGroup();
            obstacles.create(400, 350, 'obstacle');
            obstacles.create(200, 150, 'obstacle');
            obstacles.create(550, 150, 'obstacle');

            player = this.physics.add.sprite(10, 10, 'tank');
            player.setCollideWorldBounds(true);
            this.physics.add.collider(player, obstacles);
        }
        
        function update() {
            if (cursors.up.isDown)
            {
                console.log('up')
                player.body.velocity.copy(this.physics.velocityFromAngle(player.angle, 160))
            }
            else if (cursors.down.isDown)
            {
                player.body.velocity.copy(this.physics.velocityFromAngle(player.angle, -160))
            }
            else 
            {
                player.setVelocityX(0);
                player.setVelocityY(0);
            }
            
            if (cursors.left.isDown)
            {
                player.setAngularVelocity(-160);
            }
            else if (cursors.right.isDown)
            {
                player.setAngularVelocity(160);
            }
            else
            {
                player.setAngularVelocity(0);
            }
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