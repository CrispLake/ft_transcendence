import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import * as PongMath from '../math.js';

export class Life
{
    constructor(scene, cardPosition, index)
    {
        this.scene = scene;
        this.lifeBackgroundGeometry = new THREE.BoxGeometry(G.lifeWidth, G.lifeHeight, G.lifeThickness);
        this.lifeHorizontalBorderGeometry = new THREE.BoxGeometry(G.lifeWidth, G.lifeBorderThickness, G.lifeThickness);
        this.lifeVerticalBorderGeometry = new THREE.BoxGeometry(G.lifeBorderThickness, G.lifeHeight, G.lifeThickness);
        this.lifeMaterial = new THREE.MeshStandardMaterial({color: COLOR.UI_LIFE, emissive: COLOR.UI_LIFE});
        this.background = new THREE.Mesh(this.lifeBackgroundGeometry, this.lifeMaterial);
        this.borderTop = new THREE.Mesh(this.lifeHorizontalBorderGeometry, this.lifeMaterial);
        this.borderBottom = new THREE.Mesh(this.lifeHorizontalBorderGeometry, this.lifeMaterial);
        this.borderLeft = new THREE.Mesh(this.lifeVerticalBorderGeometry, this.lifeMaterial);
        this.borderRight = new THREE.Mesh(this.lifeVerticalBorderGeometry, this.lifeMaterial);
        this.setPosition(cardPosition, index);
        this.addToScene();
    }

    addToScene()
    {
        this.scene.add(this.background);
        this.scene.add(this.borderTop);
        this.scene.add(this.borderBottom);
        this.scene.add(this.borderLeft);
        this.scene.add(this.borderRight);
    }

    setPosition(pos, i)
    {
        this.position = new THREE.Vector3(pos.x, pos.y, pos.z);
        let distance = (G.lives - 1) * (G.lifeGap + G.lifeWidth);
        let posFirst = this.position.x - (distance / 2);
        let posLast = this.position.x + distance / 2;

        this.position.x = PongMath.lerp(i, 0, G.lives - 1, posFirst, posLast);
        this.position.y -= G.playerCardHeight / 2 - G.lifeHeight / 2 - G.playerCardHeight * 0.1;
        this.background.position.set(this.position.x, this.position.y, this.position.z);
        this.borderTop.position.set(this.position.x, this.position.y + G.lifeHeight / 2, this.position.z);
        this.borderBottom.position.set(this.position.x, this.position.y - G.lifeHeight / 2, this.position.z);
        this.borderLeft.position.set(this.position.x - G.lifeWidth / 2, this.position.y, this.position.z);
        this.borderRight.position.set(this.position.x + G.lifeWidth / 2, this.position.y, this.position.z);
    }

    empty()
    {
        this.scene.remove(this.background);
    }

    fill()
    {
        this.scene.add(this.background);
    }

}