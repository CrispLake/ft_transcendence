import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';

export class PowerPaddleLong
{
    constructor(game)
    {
        this.game = game;
        this.geometry = new THREE.BoxGeometry(G.powerupSize, G.powerupSize, G.powerupSize);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.POWER_PADDLE_LONG, emissive: COLOR.POWER_PADDLE_LONG});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_PADDLE_LONG;
        this.message = "Enlarge paddle";
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        if (player.paddleLength < G.maxPaddleLength)
        {
            let newPaddleLength = player.paddleLength + G.paddleSizeIncrement;
            if (newPaddleLength > G.maxPaddleLength)
                newPaddleLength = G.maxPaddleLength;
            player.resize(newPaddleLength);
        }
    }
}

export class PowerPaddleShort
{
    constructor(game)
    {
        this.game = game;
        this.geometry = new THREE.BoxGeometry(G.powerupSize, G.powerupSize, G.powerupSize);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.POWER_PADDLE_SHORT, emissive: COLOR.POWER_PADDLE_SHORT});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_PADDLE_LONG;
        this.message = "Shrink paddle";
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        if (player.paddleLength > G.minPaddleLength)
        {
            let newPaddleLength = player.paddleLength - G.paddleSizeIncrement;
            if (newPaddleLength < G.minPaddleLength)
                newPaddleLength = G.minPaddleLength;
            player.resize(newPaddleLength);
        }
    }
}

export class PowerLifePlus
{
    constructor(game)
    {
        this.game = game;
        this.geometry = new THREE.BoxGeometry(G.powerupSize, G.powerupSize, G.powerupSize);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.POWER_LIFE_PLUS, emissive: COLOR.POWER_LIFE_PLUS});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_LIFE_PLUS;
        this.message = "Life Plus";
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        if (player.lives < G.lives)
        {
            player.lives++;
            player.setLife(player.lives);
        }
    }
}

export class PowerWavyWalls
{
    constructor(game)
    {
        this.game = game;
        this.geometry = new THREE.BoxGeometry(G.powerupSize, G.powerupSize, G.powerupSize);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.POWER_WAVY_WALLS, emissive: COLOR.POWER_WAVY_WALLS});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_WAVY_WALLS;
        this.message = "Wavy Walls";
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        this.game.powerupManager.wavyWalls = true;
        this.game.powerupManager.wavyWallsTimer.start();
    }
}