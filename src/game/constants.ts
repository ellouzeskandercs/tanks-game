export interface assetImage {
    name: string,
    path: string,
    width: number,
    height: number
} 

const tankImage: assetImage = {
    name: 'tank',
    path: 'assets/tank.png',
    width: 40,
    height: 30
}

const obstacleImage: assetImage = {
    name: 'obstacle',
    path: 'assets/obstacle.png',
    width: 274,
    height: 82
}

const cannonImage: assetImage = {
    name: 'cannon',
    path: 'assets/cannon.png',
    width: 40,
    height: 10
}

const backgroundImage: assetImage = {
    name: 'background',
    path: 'assets/background.png',
    width: 800,
    height: 500
}

const bulletImage: assetImage = {
    name: 'bullet',
    path: 'assets/bullet.png',
    width: 15,
    height: 8
}

export const preloadImages: assetImage[] = [tankImage, obstacleImage, cannonImage, backgroundImage, bulletImage] 