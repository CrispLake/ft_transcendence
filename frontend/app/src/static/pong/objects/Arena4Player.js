import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import { Wall } from './Wall.js';
import { Text3D } from './Text3D.js';

export class Arena4Player
{
    constructor(scene, fontLoader, renderer, composer, camera)
    {
        console.log("Creating Multiplayer Arena...");
        this.scene = scene;
        this.fontLoader = fontLoader;
        this.renderer = renderer;
        this.composer = composer;
        this.camera = camera;

        // ----PONG Text----
        this.pongText = new Text3D(
            this.scene,
            'PONG',
            new THREE.Vector3(0, 0, -(G.arenaWidth4Player / 2 + 3)),
            6,
            COLOR.PONG,
            this.fontLoader,
            this.renderer,
            this.composer,
            this.camera);
        
        // ----Floor----
        this.floorGeometry = new THREE.BoxGeometry(G.arenaWidth4Player, G.floorThickness, G.arenaWidth4Player);
        this.floorMeshMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: COLOR.FLOOR, wireframe: false});
        this.floor = new THREE.Mesh(this.floorGeometry, this.floorMeshMaterial);
        this.floor.position.set(0, -(G.wallHeight / 2 + G.floorThickness / 2), 0);

        // ----Side Walls----
        const distFromCenter = G.arenaWidth4Player / 2 - G.wallThickness / 2;
        const wallOffset = G.arenaWidth4Player / 2 - G.wallLength4Player / 2;
        this.walls = [];
        this.walls["wallLeftUp"] = new Wall(G.vertical, G.wallLength4Player, G.wallHeight, G.wallThickness, -distFromCenter, 0, -wallOffset);
        this.walls["wallLeftDown"] = new Wall(G.vertical, G.wallLength4Player, G.wallHeight, G.wallThickness, -distFromCenter, 0, wallOffset);
        this.walls["wallRightUp"] = new Wall(G.vertical, G.wallLength4Player, G.wallHeight, G.wallThickness, distFromCenter, 0, -wallOffset);
        this.walls["wallRightDown"] = new Wall(G.vertical, G.wallLength4Player, G.wallHeight, G.wallThickness, distFromCenter, 0, wallOffset);
        this.walls["wallTopLeft"] = new Wall(G.horizontal, G.wallLength4Player, G.wallHeight, G.wallThickness, -wallOffset, 0, -distFromCenter);
        this.walls["wallTopRight"] = new Wall(G.horizontal, G.wallLength4Player, G.wallHeight, G.wallThickness, wallOffset, 0, -distFromCenter);
        this.walls["wallBottomLeft"] = new Wall(G.horizontal, G.wallLength4Player, G.wallHeight, G.wallThickness, -wallOffset, 0, distFromCenter);
        this.walls["wallBottomRight"] = new Wall(G.horizontal, G.wallLength4Player, G.wallHeight, G.wallThickness, wallOffset, 0, distFromCenter);

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
        {
            this.scene.add(this.walls[wall].mesh);
            this.scene.add(this.walls[wall].light);
        }
        this.scene.add(this.ambientLight);
    }

    update()
    {
        for (let wall in this.walls)
            if (this.walls[wall].effect)
                this.walls[wall].updateLightEffect();
    }
}