import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import { Wall } from './Wall.js';

export class Arena4Player
{
    constructor(scene)
    {
        this.scene = scene;

        // ----Back Wall----
        this.backWallGeometry = new THREE.BoxGeometry(25, 15, 2);
        this.backWallMeshMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: COLOR.BACKWALL});
        this.backWall = new THREE.Mesh(this.backWallGeometry, this.backWallMeshMaterial);
        this.backWall.position.set(0, 0, -10.5);
        
        // ----Floor----
        this.floorGeometry = new THREE.BoxGeometry(G.arenaLength, G.floorThickness, G.floorLength);
        this.floorMeshMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: COLOR.FLOOR, wireframe: false});
        this.floor = new THREE.Mesh(this.floorGeometry, this.floorMeshMaterial);
        this.floor.position.set(0, -(G.wallHeight / 2 + G.floorThickness / 2), 0);

        // ----Side Walls----
        const distFromCenter = G.arenaSize4Player / 2 + G.wallThickness / 2;
        const wallOffset = G.arenaSize4Player / 2 - G.wallLength4Player / 2;
        this.walls = [];
        this.walls["wallLeftUp"] = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, -distFromCenter, 0, -wallOffset);
        this.walls["wallLeftDown"] = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, -distFromCenter, 0, wallOffset);
        this.walls["wallRightUp"] = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, distFromCenter, 0, -wallOffset);
        this.walls["wallRightDown"] = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, distFromCenter, 0, wallOffset);
        this.walls["wallTopLeft"] = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, -wallOffset, 0, -distFromCenter);
        this.walls["wallTopRight"] = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, wallOffset, 0, -distFromCenter);
        this.walls["wallBottomLeft"] = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, -wallOffset, 0, distFromCenter);
        this.walls["wallBottomRight"] = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, wallOffset, 0, distFromCenter);
        // this.wallLeftUp = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, -distFromCenter, 0, -wallOffset);
        // this.wallLeftDown = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, -distFromCenter, 0, wallOffset);
        // this.wallRightUp = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, distFromCenter, 0, -wallOffset);
        // this.wallRightDown = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, distFromCenter, 0, wallOffset);
        // this.wallTopLeft = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, -wallOffset, 0, -distFromCenter);
        // this.wallTopRight = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, wallOffset, 0, -distFromCenter);
        // this.wallBottomLeft = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, -wallOffset, 0, distFromCenter);
        // this.wallBottomRight = new Wall(G.wallLength4Player, G.wallHeight, G.wallThickness, wallOffset, 0, distFromCenter);

        // ----General Light----
        this.ambientLight = new THREE.AmbientLight(COLOR.WHITE, 0.05);

        // Add everything to the scene
        this.addToScene();
    }

    addToScene()
    {
        this.scene.add(this.backWall);
        this.scene.add(this.floor);
        for (let wall in this.walls)
            this.scene.add(this.walls[wall].mesh);
        // this.scene.add(this.wallLeftUp.mesh);
        // this.scene.add(this.wallLeftDown.mesh);
        // this.scene.add(this.wallRightUp.mesh);
        // this.scene.add(this.wallRightDown.mesh);
        // this.scene.add(this.wallTopLeft.mesh);
        // this.scene.add(this.wallTopRight.mesh);
        // this.scene.add(this.wallBottomLeft.mesh);
        // this.scene.add(this.wallBottomRight.mesh);
        // this.scene.add(this.ambientLight);
        // this.scene.add(this.wallLeftUp.light);
        // this.scene.add(this.wallLeftDown.light);
        // this.scene.add(this.wallRightUp.light);
        // this.scene.add(this.wallRightDown.light);
        // this.scene.add(this.wallTopLeft.light);
        // this.scene.add(this.wallTopRight.light);
        // this.scene.add(this.wallBottomLeft.light);
        // this.scene.add(this.wallBottomRight.light);
    }

    update()
    {
        for (let wall in this.walls)
            if (this.walls[wall].effect)
                this.walls[wall].updateLightEffect();
        // if (this.wallLeftUp.effect)
        //     this.wallLeftUp.updateLightEffect();
        // if (this.wallLeftDown.effect)
        //     this.wallLeftDown.updateLightEffect();
        // if (this.wallRightUp.effect)
        //     this.wallRightUp.updateLightEffect();
        // if (this.wallRightDown.effect)
        //     this.wallRightDown.updateLightEffect();
        // if (this.wallTopLeft.effect)
        //     this.wallTopLeft.updateLightEffect();
        // if (this.wallTopRight.effect)
        //     this.wallTopRight.updateLightEffect();
        // if (this.wallBottomLeft.effect)
        //     this.wallBottomLeft.updateLightEffect();
        // if (this.wallBottomRight.effect)
        //     this.wallBottomRight.updateLightEffect();
    }
}