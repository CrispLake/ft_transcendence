import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import * as PongMath from '../math.js';

export class PowerupManager
{
    constructor(scene)
    {
        this.scene = scene;
        this.powerups = [
            new PowerPaddleLong(),
            new PowerPaddleShort(),
            new PowerLifePlus()
        ]
        this.availablePowerups = [...this.powerups];
        this.powerup = null;
        this.spawnTimer = new THREE.Clock();
        this.activeTimer = new THREE.Clock();
        this.arenaIsEmpty = true;
        this.spawnTimer.start();
    }

    resetPowerups()
    {
        this.availablePowerups = [...this.powerups];
    }

    update()
    {
        if (this.spawnTimer.getElapsedTime() >= G.powerupIntervalSec && this.arenaIsEmpty)
        {
            this.spawnPowerup();
            this.arenaIsEmpty = false;
            this.spawnTimer.stop();
            this.activeTimer.start();
        }
        if (this.arenaIsEmpty == false && this.powerup != null)
        {
            this.powerup.mesh.rotation.y += G.powerupRotationSpeed;
        }
        if (this.activeTimer.getElapsedTime() >= G.powerupMaxTimeSec)
        {
            this.removePowerup();
        }
    }

    restart()
    {
        this.resetPowerups();
        this.removePowerup();
        this.spawnTimer.start();
    }

    removePowerup()
    {
        if (this.powerup)
        {
            this.scene.remove(this.powerup.mesh);
            this.powerup = null;
            this.arenaIsEmpty = true;
            this.activeTimer.stop();
            this.spawnTimer.start();
        }
    }

    getRandomPosition()
    {
        // Set random x and z position so that there will be a margin between powerup and arena end.
        let x = PongMath.lerp(Math.random(), 0, 1, -(G.arenaLength / 2 - G.wallThickness - G.powerupSize / 2 - G.powerupWidthMargin), (G.arenaLength / 2 - G.wallThickness - G.powerupSize / 2 - G.powerupWidthMargin));
        let z = PongMath.lerp(Math.random(), 0, 1, -(G.arenaWidth / 2 - G.powerupSize / 2 - G.powerupLengthMargin), (G.arenaWidth / 2 - G.powerupSize / 2 - G.powerupLengthMargin));
        return (new THREE.Vector3(x, 0, z));
    }

    spawnPowerup()
    {
        // Here we pick a random powerup from a bag until it's empty, then refill it again with all the different powerups.
        
        // Fill it if it's empty.
        if (this.availablePowerups.length == 0)
            this.resetPowerups();

        // Get random powerup and remove it from the bag.
        const randomIndex = Math.floor(Math.random() * this.availablePowerups.length);
        this.powerup = this.availablePowerups.splice(randomIndex, 1)[0];

        const randomPosition = this.getRandomPosition();
        this.powerup.mesh.position.set(randomPosition.x, randomPosition.y, randomPosition.z);
        this.powerup.box.setFromObject(this.powerup.mesh);
        this.scene.add(this.powerup.mesh);
    }
}


export class PowerPaddleLong
{
    constructor()
    {
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
    constructor()
    {
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
    constructor()
    {
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