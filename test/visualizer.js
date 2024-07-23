import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as V from './GuiVisualizers.js';
import * as C from '../pong/colors.js';

//------------------------------------------------------------------------------
//	WORLD SETUP
//------------------------------------------------------------------------------

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(-22, 25, 23);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);


//------------------------------------------------------------------------------
//	WORLD LIGHT
//------------------------------------------------------------------------------

const COLOR_LIGHT = C.WHITE;
const intensity = 0.5;

const daylight = new THREE.AmbientLight(COLOR_LIGHT);
const light1 = new THREE.DirectionalLight({COLOR_LIGHT, intensity});
const light2 = new THREE.DirectionalLight({COLOR_LIGHT, intensity});

light1.position.set(-5, 4, -5);
light2.position.set(5, 4, 5);

light1.lookAt(0, 0, 0);
light2.lookAt(0, 0, 0);

scene.add(daylight);
scene.add(light1);
scene.add(light2);


//------------------------------------------------------------------------------
//	VISUALIZE
//------------------------------------------------------------------------------

// const visualizer = new V.WavyWallVisualizer();
const visualizer = new V.WavyWallVisualizer();

scene.add(visualizer.group);


//------------------------------------------------------------------------------
//	RENDER
//------------------------------------------------------------------------------

const FPS = 60;

function update()
{
	setTimeout(() => { requestAnimationFrame(update); }, 1000 / FPS);
	renderer.render(scene, camera);
}
update();


//------------------------------------------------------------------------------
//	EVENT LISTENERS
//------------------------------------------------------------------------------

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize( event )
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}