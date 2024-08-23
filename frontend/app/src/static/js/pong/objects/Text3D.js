import * as THREE from 'three';
import * as COLOR from '../colors.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

export class Text3D
{
	constructor(scene, text, position, size, color, fontLoader, renderer, composer, camera)
    {
        this.scene = scene;
        this.text = text;
        this.position = position;
        this.size = size;
        this.color = color;

		this.fontLoader = fontLoader;
		this.renderer = renderer;
		this.composer = composer;
		this.camera = camera;
		this.create3DTextMesh();
    }

	create3DTextMesh()
	{
		this.fontLoader.load('/static/fonts/font.json', (font) => {
			const textGeometry = new TextGeometry(this.text, 
			{
				font: font,
				size: 6,
				height: 1,
				depth: 0.1,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.5,
				bevelSize: 0.2,
				bevelOffset: 0,
				bevelSegments: 3
			});
			const textMaterial = new THREE.MeshBasicMaterial({color: this.color});
			this.mesh = new THREE.Mesh(textGeometry, textMaterial);
			textGeometry.computeBoundingBox();
			const boundingBox = textGeometry.boundingBox;
			const textWidth = boundingBox.max.x - boundingBox.min.x;
			this.mesh.position.set(this.position.x - textWidth / 2, this.position.y, this.position.z);
			this.scene.add(this.mesh);

			this.composer.addPass(new RenderPass(this.scene, this.camera));
			
			// Create the OutlinePass
			const outlinePass = new OutlinePass(
				new THREE.Vector2(window.innerWidth, window.innerHeight),
				this.scene,
				this.camera,
				[this.mesh]);
			outlinePass.edgeStrength = 10; // Increase to make the edges glow more
			outlinePass.edgeGlow = 1; // Increase to make the glow wider
			outlinePass.visibleEdgeColor.set(COLOR.PONG_AURA);
			outlinePass.hiddenEdgeColor.set(COLOR.PONG_AURA);
			this.composer.addPass(outlinePass);
			
			// Add FXAA for better smoothing of edges
			const effectFXAA = new ShaderPass(FXAAShader);
			effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
			this.composer.addPass(effectFXAA);
		});
	}

	render()
	{
		this.composer.render();
	}
}
