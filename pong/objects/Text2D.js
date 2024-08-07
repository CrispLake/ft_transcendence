import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export class Text2D
{
    constructor(scene, text, position, size, color, fontLoader, onCreate)
    {
        this.scene = scene;
        this.text = text;
        this.position = position;
        this.size = size;
        this.color = color;
        this.fontLoader = fontLoader;
        this.mesh = null;
        this.onCreate = onCreate;
        this.create2DTextMesh();
    }

    create2DTextMesh()
    {
        this.fontLoader.load('./resources/font.json', (font) => {
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
            textGeometry.computeBoundingBox();
            const boundingBox = textGeometry.boundingBox;
            this.textWidth = boundingBox.max.x - boundingBox.min.x;
            this.textHeight = boundingBox.max.y - boundingBox.min.y;
            this.mesh.position.set(this.position.x - this.textWidth / 2, this.position.y - this.textHeight, this.position.z);
            this.scene.add(this.mesh);

            if (this.onCreate)
                this.onCreate(this.mesh);
        });
    }

    update2DText(newText)
    {
        this.scene.remove(this.mesh);
        this.text = newText;
        this.create2DTextMesh();
    }

    update2DTextSize(size)
    {
        this.scene.remove(this.mesh);
        this.size = size;
        this.create2DTextMesh();
    }
}