import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import { Wall } from './Wall.js';
import { Text3D } from './Text3D.js';

export class Arena
{
    constructor(scene, fontLoader, renderer, composer, camera)
    {
        this.scene = scene;
        this.fontLoader = fontLoader;
        this.renderer = renderer;
        this.composer = composer;
        this.camera = camera;

        // ----PONG Text----
        this.pongText = new Text3D(
            this.scene,
            'PONG',
            new THREE.Vector3(0, 0, -10),
            6,
            COLOR.PONG,
            this.fontLoader,
            this.renderer,
            this.composer,
            this.camera);

        // ----Back Wall----
        this.backWallGeometry = new THREE.BoxGeometry(25, 15, 2);
        this.backWallMeshMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: COLOR.BACKWALL});
        this.backWall = new THREE.Mesh(this.backWallGeometry, this.backWallMeshMaterial);
        this.backWall.position.set(0, 0, -10.5);
        
        // ----Floor----
        this.floorGeometry = new THREE.BoxGeometry(G.arenaLength, G.floorThickness, G.floorWidth);
        this.floorMeshMaterial = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: COLOR.FLOOR, wireframe: false});
        this.floor = new THREE.Mesh(this.floorGeometry, this.floorMeshMaterial);
        this.floor.position.set(0, -(G.wallHeight / 2 + G.floorThickness / 2), 0);

        // ----Side Walls----
        this.walls = [];
        this.walls["leftWall"] = new Wall(G.horizontal, G.arenaLength, G.wallHeight, G.wallThickness, 0, 0, -(G.arenaWidth / 2 + G.wallThickness / 2));
        this.walls["rightWall"] = new Wall(G.horizontal, G.arenaLength, G.wallHeight, G.wallThickness, 0, 0, (G.arenaWidth / 2 + G.wallThickness / 2));
        
        // ----General Light----
        this.ambientLight = new THREE.AmbientLight(COLOR.WHITE, 0.05);

        // Add everything to the scene
        this.addToScene();
    }

    addToScene()
    {
        this.scene.add(this.backWall);
        this.scene.add(this.floor);
        this.scene.add(this.ambientLight);
        for (let wall in this.walls)
        {
            this.scene.add(this.walls[wall].mesh);
            this.scene.add(this.walls[wall].light);
        }
    }

    update()
    {
        for (let wall in this.walls)
        {
            if (this.walls[wall].effect)
                this.walls[wall].updateLightEffect();
        }
    }
}