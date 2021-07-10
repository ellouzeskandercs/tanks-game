export interface assetImage {
    name: string,
    path: string,
    width: number,
    height: number
} 

const tankImage: assetImage = {
    name: 'tank',
    path: '/tanks-game/assets/tank.png',
    width: 40,
    height: 30
}

const obstacleImage: assetImage = {
    name: 'obstacle',
    path: '/tanks-game/assets/obstacle.png',
    width: 274,
    height: 82
}

const cannonImage: assetImage = {
    name: 'cannon',
    path: '/tanks-game/assets/cannon.png',
    width: 40,
    height: 10
}

const backgroundImage: assetImage = {
    name: 'background',
    path: '/tanks-game/assets/background.png',
    width: 800,
    height: 500
}

const bulletImage: assetImage = {
    name: 'bullet',
    path: '/tanks-game/assets/bullet.png',
    width: 15,
    height: 8
}

const initBackgroundImage: assetImage = {
    name: 'init-background',
    path: '/tanks-game/assets/init-background.png',
    width: 800,
    height: 500
}

export const initPreloadImages: Record<string, assetImage> = { initBackgroundImage } 
export const gamePreloadImages: Record<string, assetImage> = { tankImage, obstacleImage, cannonImage, backgroundImage, bulletImage } 