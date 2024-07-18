import * as THREE from 'three';
import * as G from '../globals.js';
import * as PongMath from '../math.js';
import { PowerLifePlus } from './powerups/PowerLifePlus.js';
import { PowerPaddleLong } from './powerups/PowerPaddleLong.js';
import { PowerPaddleShort } from './powerups/PowerPaddleShort.js';
import { PowerWavyWalls } from './powerups/PowerWavyWalls.js';

export class PowerupManager
{
    constructor(game)
    {
        this.game = game;
        this.scene = game.gameScene;
        this.powerups = [
            // new PowerPaddleLong(this.game),
            // new PowerPaddleShort(this.game),
            new PowerLifePlus(this.game),
            // new PowerWavyWalls(this.game)
        ]
        this.availablePowerups = [...this.powerups];
        this.powerup = null;
        this.spawnTimer = new THREE.Clock();
        this.activeTimer = new THREE.Clock();
        this.arenaIsEmpty = true;
        this.spawnTimer.start();

        this.wavyWalls = false;
        this.wavyWallsTimer = new THREE.Clock();
    }


    //--------------------------------------------------------------------------
    //  MANAGER FUNCTIONS
    //--------------------------------------------------------------------------

    update()
    {
        if (this.wavyWalls)
        {
            this.handleWavyWalls();
            return;
        }
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

    reset()
    {
        if (this.wavyWalls)
            this.resetWavyWalls();
        this.resetPowerups();
        this.removePowerup();
        this.spawnTimer.start();
    }


    //--------------------------------------------------------------------------
    //  POWERUP MANAGEMENT
    //--------------------------------------------------------------------------

    resetPowerups()
    {
        this.availablePowerups = [...this.powerups];
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


    //--------------------------------------------------------------------------
    //  WAVY WALLS
    //--------------------------------------------------------------------------

    handleWavyWalls()
    {
        const effectElapsedTime = this.wavyWallsTimer.getElapsedTime();

        if (effectElapsedTime <= G.wavyWallsDurationSec)
        {
            const width = this.getWavyWidth(effectElapsedTime);

            this.game.arena.setWidth(width);
            for (let player in this.game.players)
            {
                this.game.players[player].setMovingBoundaries();
                this.game.players[player].stayWithinBoundaries();
            }
        }
        else
        {
            this.resetWavyWalls();
            for (let player in this.game.players)
            {
                this.game.players[player].setMovingBoundaries();
                this.game.players[player].stayWithinBoundaries();
            }

        }
    }

    getWavyWidth(elapsedTime)
    {
        const frequency = (2 * Math.PI) / G.wavyWallsDurationSec * G.wavyWallsCycles; // Set amount of sine wave cycles over the duration
        const maxDivergence = G.arenaWidth * G.maxDivergencePercentage;
        const sineWave = Math.sin(frequency * elapsedTime); // Sine wave oscillation
        const newWidth = G.arenaWidth + (sineWave * maxDivergence); // Calculate new width
        return newWidth;
    }

    resetWavyWalls()
    {
        this.wavyWalls = false;
        this.wavyWallsTimer.stop();
        this.game.arena.setWidth(G.arenaWidth);
        for (let player in this.game.players)
        {
            this.game.players[player].setMovingBoundaries();
            this.game.players[player].stayWithinBoundaries();
        }
    }
}
