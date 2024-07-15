import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import { Text2D } from './Text2D.js';

export class PlayerCard
{
    constructor(player, scene, fontLoader)
    {
        this.scene = scene;
        this.fontLoader = fontLoader;
        this.playerNum = player.playerNum;
        this.name = player.name;
        this.lives = G.lives;
        this.setPosition();
        this.createCardBackground();
        this.createBorder();
        this.createName();
    }

    setPosition()
    {
        console.log("playerNum = " + this.playerNum);
        if (this.playerNum == 1)
            this.position = G.p1CardPos;
        else if (this.playerNum == 2)
            this.position = G.p2CardPos;
        else if (this.playerNum == 3)
            this.position = G.p3CardPos;
        else if (this.playerNum == 4)
            this.position = G.p4CardPos;
        console.log("x = " + this.position.x);
        console.log("y = " + this.position.y);
        console.log("z = " + this.position.z);
    }

    createCardBackground()
    {
        this.cardGeometry = new THREE.BoxGeometry(G.playerCardWidth, G.playerCardHeight, G.playerCardThickness);
        this.cardMaterial = new THREE.MeshBasicMaterial({color: COLOR.UI_PLAYERCARD_BG});
        this.cardMesh = new THREE.Mesh(this.cardGeometry, this.cardMaterial);
        this.cardMesh.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(this.cardMesh);
    }

    createBorder()
    {
        this.borderHorizontalGeometry = new THREE.BoxGeometry(G.playerCardWidth + G.playerCardBorderThickness, G.playerCardBorderThickness, G.playerCardThickness);
        this.borderVerticalGeometry = new THREE.BoxGeometry(G.playerCardBorderThickness, G.playerCardHeight, G.playerCardThickness);
        this.borderMaterial = new THREE.MeshStandardMaterial({color: COLOR.UI_PLAYERCARD_BORDER, emissive: COLOR.UI_PLAYERCARD_BORDER});
        this.borderTop = new THREE.Mesh(this.borderHorizontalGeometry, this.borderMaterial);
        this.borderBottom = new THREE.Mesh(this.borderHorizontalGeometry, this.borderMaterial);
        this.borderLeft = new THREE.Mesh(this.borderVerticalGeometry, this.borderMaterial);
        this.borderRight = new THREE.Mesh(this.borderVerticalGeometry, this.borderMaterial);
        this.borderTop.position.set(this.position.x, this.position.y + G.playerCardHeight / 2, this.position.z);
        this.borderBottom.position.set(this.position.x, this.position.y - G.playerCardHeight / 2, this.position.z);
        this.borderLeft.position.set(this.position.x - G.playerCardWidth / 2, this.position.y, this.position.z);
        this.borderRight.position.set(this.position.x + G.playerCardWidth / 2, this.position.y, this.position.z);
        this.scene.add(this.borderTop);
        this.scene.add(this.borderBottom);
        this.scene.add(this.borderLeft);
        this.scene.add(this.borderRight);
    }

    createName()
    {
        this.namePosition = this.position;
        this.nameText = new Text2D(this.scene, this.name, this.namePosition, G.playerCardNameSize, COLOR.UI_NAME, this.fontLoader);
        this.namePosition.y += G.playerCardHeight / 2 - Math.min(10, G.playerCardHeight * 0.95);
    }

    decreaseLife(lives)
    {
        if (this.lives > lives)
            this.lives -= lives;
        else
            this.lives = 0;
    }
}