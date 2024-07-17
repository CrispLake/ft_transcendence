import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';

export class PowerPaddleLong
{
    constructor(game)
    {
        this.game = game;
        this.geometry = new THREE.BoxGeometry(G.powerupSize, G.powerupSize, G.powerupSize);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.POWER_PADDLE_LONG, emissive: COLOR.POWER_PADDLE_LONG});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_PADDLE_LONG;
        this.message = "Enlarge paddle";
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        if (player.paddleLength < G.maxPaddleLength)
        {
            let newPaddleLength = player.paddleLength + G.paddleSizeIncrement;
            if (newPaddleLength > G.maxPaddleLength)
                newPaddleLength = G.maxPaddleLength;
            player.resize(newPaddleLength);
        }
    }
}

export class PowerPaddleShort
{
    constructor(game)
    {
        this.game = game;
        this.geometry = new THREE.BoxGeometry(G.powerupSize, G.powerupSize, G.powerupSize);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.POWER_PADDLE_SHORT, emissive: COLOR.POWER_PADDLE_SHORT});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_PADDLE_LONG;
        this.message = "Shrink paddle";
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        if (player.paddleLength > G.minPaddleLength)
        {
            let newPaddleLength = player.paddleLength - G.paddleSizeIncrement;
            if (newPaddleLength < G.minPaddleLength)
                newPaddleLength = G.minPaddleLength;
            player.resize(newPaddleLength);
        }
    }
}

// export class PowerLifePlus
// {
//     constructor(game)
//     {
//         this.game = game;
//         this.geometry = new THREE.BoxGeometry(G.powerupSize, G.powerupSize, G.powerupSize);
//         this.material = new THREE.MeshStandardMaterial({color: COLOR.POWER_LIFE_PLUS, emissive: COLOR.POWER_LIFE_PLUS});
//         this.mesh = new THREE.Mesh(this.geometry, this.material);
//         this.box = new THREE.Box3();
//         this.box.setFromObject(this.mesh);
//         this.power = G.POWER_LIFE_PLUS;
//         this.message = "Life Plus";
//     }

//     rotate()
//     {
//         this.mesh.rotation.y += G.powerupRotationSpeed;
//         this.box.setFromObject(this.mesh);
//     }

//     activate(player)
//     {
//         console.log(this.message);
//         if (player.lives < G.lives)
//         {
//             player.lives++;
//             player.setLife(player.lives);
//         }
//     }
// }

export class PowerWavyWalls
{
    constructor(game)
    {
        this.game = game;
        this.geometry = new THREE.BoxGeometry(G.powerupSize, G.powerupSize, G.powerupSize);
        this.material = new THREE.MeshStandardMaterial({color: COLOR.POWER_WAVY_WALLS, emissive: COLOR.POWER_WAVY_WALLS});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
        this.power = G.POWER_WAVY_WALLS;
        this.message = "Wavy Walls";
    }

    rotate()
    {
        this.mesh.rotation.y += G.powerupRotationSpeed;
        this.box.setFromObject(this.mesh);
    }

    activate(player)
    {
        console.log(this.message);
        this.game.powerupManager.wavyWalls = true;
        this.game.powerupManager.wavyWallsTimer.start();
    }
}

export class PowerLifePlus
{
    constructor(game)
    {
        const w = 0.8;
        const h = 1.2;
        const d = 0.2;
        const gap = 0.15;
        const frameThickness = 0.1;
        const topLen = w + 2 * gap + 2 * frameThickness;
        const sideLen = h + 2 * gap + 2 * frameThickness;
        const margin = 0.1;

        this.game = game;
        this.mesh = new THREE.Group();

        const geoInner = new THREE.BoxGeometry(w, h, d);
        const geoHori = new THREE.BoxGeometry(topLen, frameThickness, d);
        const geoVert = new THREE.BoxGeometry(frameThickness, sideLen, d);
        
        const matInner = new THREE.MeshStandardMaterial({color: COLOR.POWER_LIFE_PLUS_INNER, emissive: COLOR.POWER_LIFE_PLUS_INNER});
        const matFrame = new THREE.MeshStandardMaterial({color: COLOR.POWER_LIFE_PLUS_FRAME, emissive: COLOR.POWER_LIFE_PLUS_FRAME});
        
        const inner = new THREE.Mesh(geoInner, matInner);
        const top = new THREE.Mesh(geoHori, matFrame);
        const bottom = new THREE.Mesh(geoHori, matFrame);
        const left = new THREE.Mesh(geoVert, matFrame);
        const right = new THREE.Mesh(geoVert, matFrame);
        
        inner.position.set(0, h / 2 + gap + frameThickness + margin, 0);
        top.position.set(0, h + 1.5 * frameThickness + 2 * gap + margin, 0);
        bottom.position.set(0, frameThickness / 2 + margin, 0);
        left.position.set(-(w / 2 + gap + frameThickness / 2), sideLen / 2 + margin, 0);
        right.position.set((w / 2 + gap + frameThickness / 2), sideLen / 2 + margin, 0);

        const frontLight = new THREE.RectAreaLight(COLOR.POWER_LIFE_PLUS_INNER, G.wallLightIntensity, w, h);
        const backLight = new THREE.RectAreaLight(COLOR.POWER_LIFE_PLUS_INNER, G.wallLightIntensity, w, h);
        frontLight.position.set(inner.position.x, inner.position.y, inner.position.z + d / 2);
        backLight.position.set(inner.position.x, inner.position.y, inner.position.z - d / 2);
        frontLight.lookAt(inner.position.x, inner.position.y, this.mesh.position.z + 2);
        backLight.lookAt(inner.position.x, inner.position.y, this.mesh.position.z - 2);

        this.mesh.add(inner);
        this.mesh.add(top);
        this.mesh.add(bottom);
        this.mesh.add(left);
        this.mesh.add(right);
        this.mesh.add(frontLight);
        this.mesh.add(backLight);

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