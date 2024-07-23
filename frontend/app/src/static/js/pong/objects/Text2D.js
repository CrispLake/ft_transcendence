import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export class Text2D
{
    constructor(scene, text, position, size, color, fontLoader)
    {
        this.scene = scene;
        this.text = text;
        this.position = position;
        this.size = size;
        this.color = color;
        this.fontLoader = fontLoader;
        this.mesh = null;
        this.create2DTextMesh();
    }

    create2DTextMesh()
    {
        console.log('here 1');
        this.fontLoader.load('/static/fonts/font.json', (font) => {
          console.log('here 2');
            const textGeometry = new TextGeometry(this.text,
            {
                font: font,
                size: this.size,
                height: 1,
                depth: 0.1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 2,
                bevelSize: 1,
                bevelOffset: 0,
                bevelSegments: 3
            });

            const textMaterial = new THREE.MeshBasicMaterial({ color: this.color });
            this.mesh = new THREE.Mesh(textGeometry, textMaterial);
            this.mesh.position.copy(this.position);
            this.scene.add(this.mesh);
        });
    }

    update2DText(newText)
    {
        this.scene.remove(this.mesh);
        this.text = newText;
        this.create2DTextMesh();
    }
}