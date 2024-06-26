import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';

export class Arena
{
    constructor(scene)
    {

        // Lanes
        this.laneGeometry = new THREE.BoxGeometry(G.laneLength, G.laneHeight, G.laneThickness);
        this.laneMeshMaterial = new THREE.MeshStandardMaterial({color: COLOR.WALL, emissive: COLOR.WALL, wireframe: false});
        this.lane1 = new THREE.Mesh(this.laneGeometry, this.laneMeshMaterial);
        this.lane2 = new THREE.Mesh(this.laneGeometry, this.laneMeshMaterial);
        this.lane3 = new THREE.Mesh(this.laneGeometry, this.laneMeshMaterial);
        this.lane1.position.set(0, (- (G.paddleThickness)) + G.laneHeight / 2, G.lanePositions[0]);
        this.lane2.position.set(0, (- (G.paddleThickness)) + G.laneHeight / 2, G.lanePositions[1]);
        this.lane3.position.set(0, (- (G.paddleThickness)) + G.laneHeight / 2, G.lanePositions[2]);

        // this.leftWallBox = new THREE.Box3();
        
        // ----General Light----
        this.ambientLight = new THREE.AmbientLight(COLOR.WHITE, 0.05);

        // ----Wall Lights----
        // this.laneLight = new THREE.RectAreaLight(COLOR.WALL, G.wallLightIntensity, G.arenaLength, G.wallHeight);
        // this.wallLightLeft.position.copy(this.leftSideWall.position);
        // this.wallLightLeft.lookAt(0, 0, 0);
        // this.wallLightRight = new THREE.RectAreaLight(COLOR.WALL, G.wallLightIntensity, G.arenaLength, G.wallHeight);
        // this.wallLightRight.position.copy(this.rightSideWall.position);
        // this.wallLightRight.lookAt(0, 0, 0);

        // Add everything to the scene
        this.addToScene(scene);
    }

    addToScene(scene)
    {
        scene.add(this.backWall);
        scene.add(this.floor);
        scene.add(this.ambientLight);
        scene.add(this.lane1);
        scene.add(this.lane2);
        scene.add(this.lane3);
        // scene.add(this.wallLightLeft);
        // scene.add(this.wallLightRight);
    }
}