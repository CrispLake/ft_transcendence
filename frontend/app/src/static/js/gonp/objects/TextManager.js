
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

export class TextManager {
	constructor(scene, composer, renderer, camera, fontUrl, text, color1, color2) {
		this.scene = scene;
		this.composer = composer;
		this.renderer = renderer;
		this.camera = camera;
		this.fontUrl = fontUrl;
		this.text = text;
		this.color1 = color1;
		this.color2 = color2;
		this.textMesh = null;
		this.outlinePass = null;
		this.textMaterial = null;
		this.boundingBox = null;
		this.textGeometry = null;
		this.fontLoader = new FontLoader();
		this.loadFontAndSetup();
	}

	loadFontAndSetup() {
		this.fontLoader.load(this.fontUrl, (font) => {
			if (!font) {
				console.error("Font failed to load.");
				return;
			}
			this.font = font;
			this.textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
			this.createTextMesh(this.text);
			if (!this.textMesh) {
				console.error("Text mesh creation failed.");
				return ;
			}
			this.outlinePass = new OutlinePass(
				new THREE.Vector2(window.innerWidth, window.innerHeight),
				this.scene,
				this.camera,
				[this.textMesh]
			);

			this.outlinePass.edgeStrength = 10;
			this.outlinePass.edgeGlow = 1;
			this.outlinePass.visibleEdgeColor.set(0x11ffff);
			this.outlinePass.hiddenEdgeColor.set(0x11ffff);
			
			this.composer.addPass(this.outlinePass);
		}, undefined, (error) => {
			console.error("Error loading font: ", error);
		});
	}

	createTextMesh(text) {
		if (!this.font) {
			return;
		}
		this.textGeometry = new TextGeometry(text, {
			font: this.font,
			size: 6,
			depth: 0.1,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.5,
			bevelSize: 0.2,
			bevelOffset: 0,
			bevelSegments: 3
		});
		if (!this.textGeometry) {
			console.error("Text geometry creation failed.");
			return;
		}
		this.textMesh = new THREE.Mesh(this.textGeometry, this.textMaterial);
		this.textGeometry.computeBoundingBox();
		this.boundingBox = this.textGeometry.boundingBox;
		const textWidth = this.boundingBox.max.x - this.boundingBox.min.x;
		this.textMesh.position.set(-textWidth / 2, 0, -10);
		this.scene.add(this.textMesh);
	}

	updateText(newText) {
		if (this.textMesh) {
			this.scene.remove(this.textMesh);
			this.textMesh.geometry.dispose();
		}
		this.createTextMesh(newText);
		if (this.outlinePass) {
			this.outlinePass.selectedObjects = [this.textMesh];
		}
	}
}
