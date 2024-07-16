import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import * as PongMath from './math.js';
import * as G from './globals.js';
import * as COLOR from './colors.js';
import { Player } from './objects/Player.js';
import { Arena } from './objects/Arena.js';
import { Text } from './objects/Text.js';
import { UserInterface } from './objects/UserInterface.js';
import * as KEY from './keys.js';
import * as SETTINGS from './gameSetting.js';


/*---- INITIALIZE ------------------------------------------------------------*/

RectAreaLightUniformsLib.init();
const scene = new THREE.Scene();
const arena = new Arena(scene);
let player1 = new Player(scene, G.p1StartPos, 'BLU', COLOR.PLAYER1);
let player2 = new Player(scene, G.p2StartPos, 'RED', COLOR.PLAYER2);
// let ball = new Ball(scene, G.ballStartPos);

// -----Camera Setup----
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.lookAt(0, 0, 0);
camera.position.set(0, 25, 20);

// ----Renderer Setup----
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ----Orbit Controls----
const controls = new OrbitControls(camera, renderer.domElement);

// ----Font----
// let textMesh;
// let composer;
// const fontLoader = new FontLoader();
// fontLoader.load('./resources/font.json', function (font)
// {
//     const textGeometry = new TextGeometry( 'GONP', 
//     {
// 		font: font,
// 		size: 6,
//         height: 1,
// 		depth: 0.1,
// 		curveSegments: 12,
// 		bevelEnabled: true,
// 		bevelThickness: 0.5,
// 		bevelSize: 0.2,
// 		bevelOffset: 0,
// 		bevelSegments: 3
// 	});
//     const textMaterial = new THREE.MeshBasicMaterial({color: COLOR.PLAYER1LANE});
//     textMesh = new THREE.Mesh(textGeometry, textMaterial);
//     textGeometry.computeBoundingBox();
//     const boundingBox = textGeometry.boundingBox;
//     const textWidth = boundingBox.max.x - boundingBox.min.x;
//     textMesh.position.set(-textWidth / 2, 0, -10);
//     scene.add(textMesh);

let composer = new EffectComposer(renderer);
    // composer.addPass(new RenderPass(scene, camera));

    // // Create the OutlinePass

    // // Add FXAA for better smoothing of edges
    // const effectFXAA = new ShaderPass(FXAAShader);
    // effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    // composer.addPass(effectFXAA);
// });

class TextManager {
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
        
        this.fontLoader = new FontLoader();
        this.loadFontAndSetup();
    }

    loadFontAndSetup() {
        this.fontLoader.load(this.fontUrl, (font) => {
            this.font = font;
            this.createTextMesh(this.text);

            // Setup composer and outline pass
            this.composer.addPass(new RenderPass(this.scene, this.camera));

            this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera, [this.textMesh]);
            this.outlinePass.edgeStrength = 10;
            this.outlinePass.edgeGlow = 1;
            this.outlinePass.visibleEdgeColor.set(this.color2);
            this.outlinePass.hiddenEdgeColor.set(this.color2);
            this.composer.addPass(this.outlinePass);

            const effectFXAA = new ShaderPass(FXAAShader);
            effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
            this.composer.addPass(effectFXAA);
        });
    }

    createTextMesh(text) {
        const textGeometry = new TextGeometry(text, {
            font: this.font,
            size: 6,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 3
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: this.color1 });
        this.textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textGeometry.computeBoundingBox();
        const boundingBox = textGeometry.boundingBox;
        const textWidth = boundingBox.max.x - boundingBox.min.x;
        this.textMesh.position.set(-textWidth / 2, 0, -10);

        this.scene.add(this.textMesh);
    }

    updateText(newText) {
        if (this.textMesh) {
            // Remove old mesh from the scene
            this.scene.remove(this.textMesh);

            // Dispose of old geometry and material
            this.textMesh.geometry.dispose();
            this.textMesh.material.dispose();
        }

        // Create new text mesh
        this.createTextMesh(newText);

        // Update the OutlinePass
        this.outlinePass.selectedObjects = [this.textMesh];
    }
}



let text = new TextManager(scene, composer, renderer, camera, "./resources/font.json", "GONP", 0XFFFFFF, 0X000000)
	const scene2D = new THREE.Scene();

const camera2D = new THREE.OrthographicCamera(
    window.innerWidth / -2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / -2,
    0.1, 1000
);

class Timer {
    constructor() {
        this.startTime = null;
        this.duration = null;
        this.timerId = null;
    }

    start(seconds) {
        this.duration = seconds;
        this.startTime = Date.now();
        if (this.timerId) {
            clearInterval(this.timerId);
        }
        this.timerId = setInterval(() => {
            const remainingTime = this.getRemainingTime();
            if (remainingTime <= 0) {
                clearInterval(this.timerId);
                this.timerId = null;
                console.log("Timer finished");
            }
        }, 1000);
    }

    getRemainingTime() {
        if (!this.startTime || !this.duration) {
            return 0;
        }
        const elapsedTime = (Date.now() - this.startTime) / 1000;
        const remainingTime = this.duration - elapsedTime;
        return Math.max(remainingTime, 0);
    }
}

let timer = new Timer();

camera2D.position.z = 4;

/*---- LOOP ------------------------------------------------------------------*/

function setPushersColliding(colliding)
{
    for (let i = 0; i < player1.pushers.length; i++) {
        player1.pushers[i].colliding = colliding;
    }
    for (let i = 0; i < player2.pushers.length; i++) {
        player2.pushers[i].colliding = colliding;
    }
}

function pushersLogic()
{
    setPushersColliding(false);
    for (let i = 0; i < player1.pushers.length; i++) {
        const obj1 = player1.pushers[i];
        const box1 = obj1.box;

        for (let j = 0; j < player2.pushers.length; j++) {
            const obj2 = player2.pushers[j];
            const box2 = obj2.box;

            if (box1.intersectsBox(box2)) {
                const overlapX = Math.min(box1.max.x, box2.max.x) - Math.max(box1.min.x, box2.min.x);
                let mtv = new THREE.Vector3(overlapX, 0, 0);
                if (obj1.colliding == false)
                    obj1.mesh.position.x -= mtv.x / 2 - 0.005;
                if (obj2.colliding == false)
                    obj2.mesh.position.x += mtv.x / 2 - 0.005;
                obj1.downSize();
                obj2.downSize();
                obj1.colliding = true;
                obj2.colliding = true;
                obj1.updateBoundingBox();
                obj2.updateBoundingBox();
            }
        }
    }
    movePushers();
}

// ----Update and render----
function movePushers() {
    let pusher;
    for (let i = 0; i < player1.pushers.length; i++) {
        pusher = player1.pushers[i];
        player1.movePusher(pusher);
        if (pusher.mesh.position.x >= player2.mesh.position.x) {
            arena.lanes[pusher.lane].player1scored(pusher.size);
            pusher.player.removePusher(pusher);
        }
    }
    for (let i = 0; i < player2.pushers.length; i++) {
        pusher = player2.pushers[i];
        player2.movePusher(pusher)
        if (pusher.mesh.position.x <= player1.mesh.position.x) {
            arena.lanes[pusher.lane].player2scored(pusher.size);
            pusher.player.removePusher(pusher);
        }
    }
}

function playersLogic()
{
	player1.logicLoop();
	player2.logicLoop();
}

timer.start(42);
function update()
{
    setTimeout(() => { requestAnimationFrame(update); }, 1000 / G.fps);
    // updateBoost();
    // updatePlayerPosition();
	// text.updateText(toString(timer.getRemainingTime()));
	console.log((timer.getRemainingTime()));
	playersLogic();
    pushersLogic();
    if (composer)
    {
        composer.render();
    }
    else
    {
        renderer.render(scene, camera);
    }

    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(scene2D, camera2D);
}
update();

function sleepMillis(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}


// ----Key Input----
function handleKeyDown(event)
{
    if (event.repeat && event.key != KEY.P1_BOOST && event.key != KEY.P2_BOOST)
    {
        handleKeyUp(event);
        return ;
    }
    switch (event.key)
    {
        case KEY.P1_LEFT:
            player1.moveLeft = true;
            break;
        case KEY.P1_RIGHT:
            player1.moveRight = true;
            break;
        case KEY.P1_BOOST:
            player1.boostPressed = true;
            break;
        case KEY.P2_LEFT:
            player2.moveLeft = true;
            break;
        case KEY.P2_RIGHT:
            player2.moveRight = true;
            break;
        case KEY.P2_BOOST:
            player2.boostPressed = true;
            break;
    }
}

function handleKeyUp(event)
{
    switch (event.key)
    {
        case KEY.P1_LEFT:
            player1.moveLeft = false;
            break;
        case KEY.P1_RIGHT:
            player1.moveRight = false;
            break;
        case KEY.P1_BOOST:
            player1.boostPressed = false;
            break;
        case KEY.P2_LEFT:
            player2.moveLeft = false;
            break;
        case KEY.P2_RIGHT:
            player2.moveRight = false;
            break;
        case KEY.P2_BOOST:
            player2.boostPressed = false;
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function updatePlayerPosition()
{
    player1.move();
    player2.move();

}

function updateBoost()
{
    if (player1.boostPressed) {
        player1.increaseBoost();
    }
    else {
        player1.resetBoost();
    }
    if (player2.boostPressed) {
        player2.increaseBoost();
    }
    else {
        player2.resetBoost();
    }
}

// ----Window resize----
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize( event )
{
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
