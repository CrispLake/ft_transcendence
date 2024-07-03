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

    createBorder()
    {
        this.borderGeometry = new THREE.BoxGeometry(G.playerCardWidth, G.playerCardHeight, G.playerCardThickness);
        this.borderMaterial = new THREE.MeshStandardMaterial({color: COLOR.UI_PLAYERCARD_BORDER, emissive: COLOR.UI_PLAYERCARD_BORDER});
        this.borderMesh = new THREE.Mesh(this.borderGeometry, this.borderMaterial);
        this.borderMesh.position.set(this.position);
    }

    createName()
    {
        this.namePosition = this.position;
        this.nameText = new Text2D(this.scene, this.name, this.namePosition, G.playerCardNameSize, COLOR.UI_NAME, this.fontLoader);
        this.namePosition.y -= G.playerCardHeight / 4;
        // this.nameText.
    }

    decreaseLife(lives)
    {
        if (this.lives > lives)
            this.lives -= lives;
        else
            this.lives = 0;
    }
}