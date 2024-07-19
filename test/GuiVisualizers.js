import * as THREE from 'three';
import { Plus } from './Plus.js';
import { WavyWall } from './WavyWall.js';

export class PlusVisualizer
{
    constructor()
    {
        this.gui = new dat.GUI();
        this.params = {
            size: 1,
            width: 1,
            length: 3,
            thickness: 1.3,
            roundPercentage: 50,
            segments: 10,
            hitBoxVisible: false
        };

        this.model = new Plus(
            this.params.size,
            this.params.width,
            this.params.length,
            this.params.thickness,
            this.params.roundPercentage,
            this.params.segments,
            this.params.hitBoxVisible
        );

        this.group = new THREE.Group();
        this.group.add(this.model.mesh);

        this.gui.add(this.params, 'size', 1, 5).step(1).onChange(() => this.updateShape());
        this.gui.add(this.params, 'width', 0.5, 5).onChange(() => this.updateShape());
        this.gui.add(this.params, 'length', 0.5, 5).onChange(() => this.updateShape());
        this.gui.add(this.params, 'thickness', 0, 5).onChange(() => this.updateShape());
        this.gui.add(this.params, 'roundPercentage', 0, 100).step(5).onChange(() => this.updateShape());
        this.gui.add(this.params, 'segments', 1, 20).step(1).onChange(() => this.updateShape());
        this.gui.add(this.params, 'hitBoxVisible').onChange(() => this.updateShape());
    }

    updateShape() {
        console.log('updateShape called');
        console.log('Current Params:', this.params);
        
        this.group.remove(this.model.mesh);
        this.model = new Plus(
            this.params.size,
            this.params.width,
            this.params.length,
            this.params.thickness,
            this.params.roundPercentage,
            this.params.segments,
            this.params.hitBoxVisible
        );
        this.group.add(this.model.mesh);
    }
}

export class WavyWallVisualizer
{
    constructor()
    {
        this.gui = new dat.GUI();
        this.params = {
            size: 1,
            width: 2,
            length: 3,
            floorThickness: 0.1,
            wallHeight: 0.3,
            wallThickness: 0.2,
            widthSegments: 16,
            heightSegments: 16,
            dotSize: 0.1,
            hitBoxVisible: false,
            dotsVisible: false
        };

        this.model = new WavyWall(
            this.params.size,
            this.params.width,
            this.params.length,
            this.params.floorThickness,
            this.params.wallHeight,
            this.params.wallThickness,
            this.params.widthSegments,
            this.params.heightSegments,
            this.params.dotSize,
            this.params.hitBoxVisible,
            this.params.dotsVisible
        );

        this.group = new THREE.Group();
        this.group.add(this.model.mesh);

        this.gui.add(this.params, 'size', 1, 5).step(1).onChange(() => this.updateShape());
        this.gui.add(this.params, 'width', 0.5, 5).onChange(() => this.updateShape());
        this.gui.add(this.params, 'length', 0.5, 5).onChange(() => this.updateShape());
        this.gui.add(this.params, 'floorThickness', 0.05, 1).step(0.05).onChange(() => this.updateShape());
        this.gui.add(this.params, 'wallHeight', 0.1, 1).step(0.05).onChange(() => this.updateShape());
        this.gui.add(this.params, 'wallThickness', 0.1, 1).step(0.05).onChange(() => this.updateShape());
        this.gui.add(this.params, 'widthSegments', 1, 32).step(1).onChange(() => this.updateShape());
        this.gui.add(this.params, 'heightSegments', 1, 32).step(1).onChange(() => this.updateShape());
        this.gui.add(this.params, 'dotSize', 0.01, 0.1).onChange(() => this.updateShape());
        this.gui.add(this.params, 'hitBoxVisible').onChange(() => this.updateShape());
        this.gui.add(this.params, 'dotsVisible').onChange(() => this.updateShape());
    }

    updateShape()
    {
        this.group.remove(this.model.mesh);
        this.model = new WavyWall(
            this.params.size,
            this.params.width,
            this.params.length,
            this.params.floorThickness,
            this.params.wallHeight,
            this.params.wallThickness,
            this.params.widthSegments,
            this.params.heightSegments,
            this.params.dotSize,
            this.params.hitBoxVisible,
            this.params.dotsVisible
        );
        this.group.add(this.model.mesh);
    }
}