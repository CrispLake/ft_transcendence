import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';


export class Lane
{
    constructor(posZ) {
        this.colors = [
            new THREE.Color(COLOR.PLAYER2LANE),
            new THREE.Color(COLOR.WALL),
            new THREE.Color(COLOR.PLAYER1LANE)
        ];
        this.sectionPositions = [
            G.laneOriginX - G.laneLength / 2, // Player2 section
            G.laneOriginX + G.laneLength / 2 // Player1 section
        ];
        this.vertexShader = `
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        this.fragmentShader = `
            uniform vec3 colors[3];
            uniform float sectionPositions[2];
            varying vec3 vPosition;
            void main() {
                vec3 color;
                if (vPosition.x < sectionPositions[0]) {
                    color = colors[0];
                } else if (vPosition.x < sectionPositions[1]) {
                    color = colors[1];
                } else {
                    color = colors[2];
                }
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        this.geometry = new THREE.BoxGeometry(G.laneLength, G.laneHeight, G.laneThickness);
        this.material = new THREE.ShaderMaterial({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            uniforms: {
                colors: { value: this.colors },
                sectionPositions: { value: this.sectionPositions }
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(G.laneOriginX, G.laneY, posZ);
    }
    setSectionPos(leftPos, rightPos) {
        this.sectionPositions[0] = leftPos;
        this.sectionPositions[1] = rightPos;
    }
    player1scored(amount) {
        amount *= 5;
        if (this.sectionPositions[1] - amount < G.laneOriginX - G.laneLength / 2) {
            this.setSectionPos(G.laneOriginX - G.laneLength / 2, G.laneOriginX - G.laneLength / 2)
            return ;
        }
        if (this.sectionPositions[0] > this.sectionPositions[1] - amount) {
            this.setSectionPos(this.sectionPositions[1] - amount, this.sectionPositions[1] - amount)            
        }
        else {
            this.setSectionPos(this.sectionPositions[0], this.sectionPositions[1] - amount)
        }
    }
    player2scored(amount) {        
        amount *= 5;
        if (this.sectionPositions[0] + amount > G.laneOriginX + G.laneLength / 2) {
            this.setSectionPos(G.laneOriginX + G.laneLength / 2, G.laneOriginX + G.laneLength / 2)
            return ;
        }
        if (this.sectionPositions[0] + amount > this.sectionPositions[1]) {
            this.setSectionPos(this.sectionPositions[0] + amount, this.sectionPositions[0] + amount)            
        }
        else {
            this.setSectionPos(this.sectionPositions[0] + amount, this.sectionPositions[1])
        }
    }
}

export class Arena
{
    constructor(scene)
    {
        this.lanes = [];
        this.lanes.push(new Lane(G.lanePositions[0]));
        this.lanes.push(new Lane(G.lanePositions[1]));
        this.lanes.push(new Lane(G.lanePositions[2]));
        this.ambientLight = new THREE.AmbientLight(COLOR.WHITE, 0.05);
        this.addToScene(scene);
    }
    
    addToScene(scene)
    {
        scene.add(this.ambientLight);
        for (let i = 0; i < this.lanes.length; i++) {
            scene.add(this.lanes[i].mesh);
        }
    }
}