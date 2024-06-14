import * as THREE from 'three';
import * as G from './globals.js';
import * as COLOR from './colors.js';

export class Arena
{
    constructor(scene)
    {
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
        this.sideWallGeometry = new THREE.BoxGeometry(G.arenaLength, G.wallHeight, G.wallThickness);
        this.wallMeshMaterial = new THREE.MeshStandardMaterial({color: COLOR.WALL, emissive: COLOR.WALL, wireframe: false});
        this.leftSideWall = new THREE.Mesh(this.sideWallGeometry, this.wallMeshMaterial);
        this.leftSideWall.position.set(0, 0, -(G.arenaWidth / 2 + G.wallThickness / 2))
        this.rightSideWall = new THREE.Mesh(this.sideWallGeometry, this.wallMeshMaterial);
        this.rightSideWall.position.set(0, 0, (G.arenaWidth / 2 + G.wallThickness / 2));
        this.addToScene(scene);
    }

    addToScene(scene)
    {
        scene.add(this.backWall);
        scene.add(this.floor);
        scene.add(this.leftSideWall);
        scene.add(this.rightSideWall);
    }
}