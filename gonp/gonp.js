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
let player1 = new Player(scene, G.p1StartPos, 'BLU', COLOR.PLAYER1, arena);
let player2 = new Player(scene, G.p2StartPos, 'RED', COLOR.PLAYER2, arena);
// let ball = new Ball(scene, G.ballStartPos);

// -----Camera Setup----
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.lookAt(0, 0, 0);
camera.position.set(0, 25, 20);

// ----Renderer Setup----
const renderer = new THREE.WebGLRenderer( {antialias:true} );
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
composer.addPass(new RenderPass(scene, camera));
const effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
composer.addPass(effectFXAA);
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
        this.textMesh = 0;
        this.textMaterial = 0;
        this.boundingBox = 0;
        this.textGeometry = 0;
    
        this.fontLoader = new FontLoader();
        this.loadFontAndSetup();
    }

    loadFontAndSetup() {
        this.fontLoader.load(this.fontUrl, (font) => {
            this.font = font;
            
            // Setup composer and outline pass
            this.composer.addPass(new RenderPass(this.scene, this.camera));
            
            this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera, [this.textMesh]);
            this.outlinePass.edgeStrength = 10;
            this.outlinePass.edgeGlow = 1;
            this.outlinePass.visibleEdgeColor.set(0x00ff00);
            this.outlinePass.hiddenEdgeColor.set(0xff00ff);
            this.composer.addPass(this.outlinePass);
            const effectFXAA = new ShaderPass(FXAAShader);
            effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
            this.composer.addPass(effectFXAA);
            this.textMaterial = new THREE.MeshBasicMaterial({ color: 0XB65B98 });
            this.createTextMesh(this.text);
        });
    }

    createTextMesh(text) {
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
    }
}



let text = new TextManager(scene, composer, renderer, camera, "./resources/font.json", "GONP", 0XFFFFFF, 0X000000)


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

function checkPowerupCollision() {
	let speedup;
	let balance = Math.random();
	let player;
	let players = [
		player1,
		player2
	];
	if (balance < 0.5) {
		players[0] = player2;
		players[1] = player1;
	}
	for (let i = 0; i < players.length; i++) {
		player = players[i];
		for (let j = 0; j < player.pushers.length; j++) {
			if (arena.powerup) {
				if (player.pushers[j].box.intersectsBox(arena.powerup.box)) {
					scene.remove(arena.powerup.mesh)
					arena.powerup.remove();
					arena.powerup = null;
					speedup = player.pushers[j].size > G.pusherMaxSize * 0.9;
					player.pushers[j].upSize(G.pusherMaxSize);
					if (speedup) {
						player.pushers[j].speed *= 2;
					}
					console.log("Collected powerup");
				}
			}
		}
	}
}

function pushersLogic()
{
    // pusherOutlinePass.selectedObjects = [...player1.pushers]
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
                if (obj1.colliding == false) {
                    obj1.mesh.position.x -= mtv.x / 2 - 0.005;
				}
				if (obj2.colliding == false) {
					obj2.mesh.position.x += mtv.x / 2 - 0.005;
				}
                obj1.downSize(G.pusherFightValue);
                obj2.downSize(G.pusherFightValue);
                obj1.colliding = true;
                obj2.colliding = true;
                obj1.updateBoundingBox();
                obj2.updateBoundingBox();
				continue ;
            }
			// console.log(arena.powerup.box);
		}
	}
	checkPowerupCollision();
	movePushers();
}

// ----Update and render----
function movePushers() {
    let pusher;
    for (let i = 0; i < player1.pushers.length; i++) {
        pusher = player1.pushers[i];
        player1.movePusher(pusher);
        if (pusher.furtestX > G.laneEnd) {
			// console.log()
			arena.lanes[pusher.lane].player1scored(pusher.size - (G.pusherMinSize / 2));
            pusher.player.removePusher(pusher);
        }
		else if (pusher.furtestX < arena.getOpposingSectionPositionByPusher(pusher))
		{
			arena.lanes[pusher.lane].player1scored(G.passiveScore);
			pusher.downSize(G.passiveScore);
		}
	}
    for (let i = 0; i < player2.pushers.length; i++) {
        pusher = player2.pushers[i];
        player2.movePusher(pusher)
        if (pusher.furtestX < -G.laneEnd) {
            arena.lanes[pusher.lane].player2scored(pusher.size - (G.pusherMinSize / 2));
            pusher.player.removePusher(pusher);
        }
		else if (pusher.furtestX > arena.getOpposingSectionPositionByPusher(pusher))
		{
			arena.lanes[pusher.lane].player2scored(G.passiveScore);
			pusher.downSize(G.passiveScore);
		}
    }
}

function playersLogic()
{
	player1.logicLoop();
	player2.logicLoop();
}

// const pusherOutlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
// pusherOutlinePass.edgeStrength = 3.0;
// pusherOutlinePass.edgeGlow = 0.0;
// pusherOutlinePass.edgeThickness = 1.0;
// pusherOutlinePass.pulsePeriod = 0;
// pusherOutlinePass.visibleEdgeColor.set('#000000'); // Black outline
// pusherOutlinePass.hiddenEdgeColor.set('#000000'); // Black outline

timer.start(61);
function update()
{
    setTimeout(() => { requestAnimationFrame(update); }, 1000 / G.fps);
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
	arena.checkPowerupSpawn();
	text.updateText(Math.floor(timer.getRemainingTime()).toString());
	// arena.addToScene();
	renderer.autoClear = false;
    renderer.clearDepth();
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
    if (event.repeat && event.key != KEY.P1_BOOST && event.key != KEY.P2_BOOST && event.key != KEY.P1_BOOST_PAUSE && event.key != KEY.P2_BOOST_PAUSE)
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
		case KEY.P1_BOOST_PAUSE:
			player1.boostPaused = true;
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
		case KEY.P2_BOOST_PAUSE:
			player2.boostPaused = true;
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
		case KEY.P1_BOOST_PAUSE:
			player1.boostPaused = false;
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
		case KEY.P2_BOOST_PAUSE:
			player2.boostPaused = false;
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
