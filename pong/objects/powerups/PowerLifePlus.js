import * as THREE from 'three';
import * as G from '../../globals.js';
import * as COLOR from '../../colors.js';

export class PowerLifePlus
{
    // constructor(game)
    // {
    //     const w = 0.8;
    //     const h = 1.2;
    //     const d = 0.2;
    //     const gap = 0.15;
    //     const frameThickness = 0.1;
    //     const topLen = w + 2 * gap + 2 * frameThickness;
    //     const sideLen = h + 2 * gap + 2 * frameThickness;
    //     const margin = 0.1;

    //     this.game = game;
    //     this.mesh = new THREE.Group();

    //     const geoInner = new THREE.BoxGeometry(w, h, d);
    //     const geoHori = new THREE.BoxGeometry(topLen, frameThickness, d);
    //     const geoVert = new THREE.BoxGeometry(frameThickness, sideLen, d);
        
    //     const matInner = new THREE.MeshStandardMaterial({color: COLOR.POWER_LIFE_PLUS_INNER, emissive: COLOR.POWER_LIFE_PLUS_INNER});
    //     const matFrame = new THREE.MeshStandardMaterial({color: COLOR.POWER_LIFE_PLUS_FRAME, emissive: COLOR.POWER_LIFE_PLUS_FRAME});
        
    //     const inner = new THREE.Mesh(geoInner, matInner);
    //     const top = new THREE.Mesh(geoHori, matFrame);
    //     const bottom = new THREE.Mesh(geoHori, matFrame);
    //     const left = new THREE.Mesh(geoVert, matFrame);
    //     const right = new THREE.Mesh(geoVert, matFrame);
        
    //     inner.position.set(0, h / 2 + gap + frameThickness + margin, 0);
    //     top.position.set(0, h + 1.5 * frameThickness + 2 * gap + margin, 0);
    //     bottom.position.set(0, frameThickness / 2 + margin, 0);
    //     left.position.set(-(w / 2 + gap + frameThickness / 2), sideLen / 2 + margin, 0);
    //     right.position.set((w / 2 + gap + frameThickness / 2), sideLen / 2 + margin, 0);

    //     const frontLight = new THREE.RectAreaLight(COLOR.POWER_LIFE_PLUS_INNER, G.wallLightIntensity, w, h);
    //     const backLight = new THREE.RectAreaLight(COLOR.POWER_LIFE_PLUS_INNER, G.wallLightIntensity, w, h);
    //     frontLight.position.set(inner.position.x, inner.position.y, inner.position.z + d / 2);
    //     backLight.position.set(inner.position.x, inner.position.y, inner.position.z - d / 2);
    //     frontLight.lookAt(inner.position.x, inner.position.y, this.mesh.position.z + 2);
    //     backLight.lookAt(inner.position.x, inner.position.y, this.mesh.position.z - 2);

    //     this.mesh.add(inner);
    //     this.mesh.add(top);
    //     this.mesh.add(bottom);
    //     this.mesh.add(left);
    //     this.mesh.add(right);
    //     this.mesh.add(frontLight);
    //     this.mesh.add(backLight);

    //     this.box = new THREE.Box3();
    //     this.box.setFromObject(this.mesh);
    //     this.power = G.POWER_LIFE_PLUS;
    //     this.message = "Life Plus";
    // }

    constructor(game)
    {
        this.game = game;

        const multiplier = G.plusMultiplier;
        const width = G.plusWidth;
        const length = G.plusLength;
        const thickness = G.plusThickness;
        const roundPercentage = G.plusRoundnessPercentage;
        const segments = G.plusSegments;

        const adjustedThickness = thickness * multiplier;
        const adjustedWidth = width * multiplier;
        const adjustedLength = length * multiplier;

        const w = adjustedWidth / 2;
        const l = adjustedLength / 2;
        const r = adjustedWidth / 2 * (roundPercentage / 100);

        const maxBevelThickness = adjustedThickness / 2;
        const bevelThickness = Math.min(r, maxBevelThickness);
        const bevelSize = 0.3 * multiplier;
        const depth = adjustedThickness - r * 2;

        const extrudeSettings = {
            steps: 1,
            depth: depth,
            bevelEnabled: true,
            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelOffset: 0,
            bevelSegments: segments,
            curveSegments: segments
        };

        const shape = new THREE.Shape();
        shape.moveTo(-w + r, l);
        shape.lineTo(w - r, l);
        shape.quadraticCurveTo(w, l, w, l - r);
        shape.lineTo(w, w);
        shape.lineTo(l - r, w);
        shape.quadraticCurveTo(l, w, l, w - r);
        shape.lineTo(l, -w + r);
        shape.quadraticCurveTo(l, -w, l - r, -w);
        shape.lineTo(w, -w);
        shape.lineTo(w, -l + r);
        shape.quadraticCurveTo(w, -l, w - r, -l);
        shape.lineTo(-w + r, -l);
        shape.quadraticCurveTo(-w, -l, -w, -l + r);
        shape.lineTo(-w, -w);
        shape.lineTo(-l + r, -w);
        shape.quadraticCurveTo(-l, -w, -l, -w + r);
        shape.lineTo(-l, w - r);
        shape.quadraticCurveTo(-l, w, -l + r, w);
        shape.lineTo(-w, w);
        shape.lineTo(-w, l - r);
        shape.quadraticCurveTo(-w, l, -w + r, l);

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const material = new THREE.MeshBasicMaterial({color: COLOR.POWER_LIFE_PLUS});
        const plus = new THREE.Mesh(geometry, material);
        const light = new THREE.PointLight(COLOR.POWER_LIFE_PLUS, 1, 5, 0.5);
        light.position.set(0, 0, 0);
        plus.position.y += adjustedLength / 2;
        light.position.y += adjustedLength / 2;

        this.mesh = new THREE.Group();
        this.mesh.add(plus);
        this.mesh.add(light);

        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_LIFE_PLUS;
        this.message = "Life Plus";
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        if (player.lives < G.lives)
        {
            player.lives++;
            player.setLife(player.lives);
        }
    }
}