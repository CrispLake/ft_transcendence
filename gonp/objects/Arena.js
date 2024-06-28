import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';


export class Lane
{
    constructor(posZ) {
        this.colors = [
            new THREE.Color(COLOR.PLAYER2),   // Color for the first section
            new THREE.Color(COLOR.WALL),   // Color for the second section
            new THREE.Color(COLOR.PLAYER1)    // Color for the third section
        ];
        this.sectionPositions = [
            0 - G.laneLength / 2,  // End of the first section
            0 + G.laneLength / 2   // End of the second section
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
        this.mesh.position.set(0, G.laneY, posZ);
    }
    setSectionPos(leftPos, rightPos) {
        this.sectionPositions[0] = leftPos;
        this.sectionPositions[1] = rightPos;
    }
}

export class Arena
{
    constructor(scene)
    {
        this.lane1 = new Lane(G.lanePositions[0]);
        this.lane2 = new Lane(G.lanePositions[1]);
        this.lane3 = new Lane(G.lanePositions[2]);
        this.ambientLight = new THREE.AmbientLight(COLOR.WHITE, 0.05);
        this.addToScene(scene);
        this.lane1.setSectionPos(-10, 1)
    }

    addToScene(scene)
    {
        scene.add(this.ambientLight);
        scene.add(this.lane1.mesh);
        scene.add(this.lane2.mesh);
        scene.add(this.lane3.mesh);
    }
}