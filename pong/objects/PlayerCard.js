import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import { Text2D } from './Text2D.js';
import { Life } from './Life.js';
import * as PongMath from '../math.js';

export class PlayerCard
{
    constructor(player, scene, fontLoader, info)
    {
        this.scene = scene;
        this.fontLoader = fontLoader;
        this.playerNum = player.playerNum;
        this.name = player.name;
        this.lives = G.lives;
        this.position = new THREE.Vector3();
        this.initializeSize(info);
        // this.setSize(info);
        this.setPosition();
        this.createCardBackground();
        this.createBorder();
        this.createName();
        this.createLifeArray();
        this.addToScene();
    }

    initializeSize(info)
    {
        // Get new values from info
        this.width = info.width;
        this.height = info.height;
        this.sideMargin = info.sideMargin;
        this.topBottomMargin = info.topBottomMargin;
        this.nameSize = info.nameSize;
        this.lives = info.lives;
        this.lifeBoxWidth = info.lifeBoxWidth;
        this.lifeBoxHeight = info.lifeBoxHeight;
        this.lifeHeight = info.lifeHeight;
        this.lifeWidth = info.lifeWidth;
        this.lifeGap = info.lifeGap;
    }

    setSize(info)
    {
        // Get new values from info
        this.width = info.width;
        this.height = info.height;
        this.sideMargin = info.sideMargin;
        this.topBottomMargin = info.topBottomMargin;
        this.nameSize = info.nameSize;
        this.lives = info.lives;
        this.lifeBoxWidth = info.lifeBoxWidth;
        this.lifeBoxHeight = info.lifeBoxHeight;
        this.lifeHeight = info.lifeHeight;
        this.lifeWidth = info.lifeWidth;
        this.lifeGap = info.lifeGap;

        // Set everything according to the new values
        this.cardMesh.geometry.width = this.width;
        this.cardMesh.geometry.height = this.height;
        this.borderTop.geometry.width = this.width + G.playerCardBorderThickness;
        this.borderBottom.geometry.width = this.width + G.playerCardBorderThickness;
        this.borderLeft.geometry.height = this.height;
        this.borderRight.geometry.height = this.height;
        this.nameText.update2DTextSize(this.width / 6);
    }

    setPosition()
    {
        const margin = PongMath.widthPercentage(2);
        const cardDistFromSide = window.innerWidth / 2 - this.width / 2 - margin;
        const cardDistFromTop = window.innerHeight / 2 - this.height / 2 - margin;

        if (this.playerNum == 1)
            this.position.set(-cardDistFromSide, -cardDistFromTop, 0);
        else if (this.playerNum == 2)
            this.position.set(cardDistFromSide, cardDistFromTop, 0);
        else if (this.playerNum == 3)
            this.position.set(-cardDistFromSide, cardDistFromTop, 0);
        else if (this.playerNum == 4)
            this.position.set(cardDistFromSide, -cardDistFromTop, 0);
    }

    createCardBackground()
    {
        this.cardGeometry = new THREE.BoxGeometry(this.width, this.height, G.playerCardThickness);
        this.cardMaterial = new THREE.MeshBasicMaterial({color: COLOR.UI_PLAYERCARD_BG});
        this.cardMesh = new THREE.Mesh(this.cardGeometry, this.cardMaterial);
        this.cardMesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    createBorder()
    {
        this.borderHorizontalGeometry = new THREE.BoxGeometry(this.width + G.playerCardBorderThickness, G.playerCardBorderThickness, G.playerCardThickness);
        this.borderVerticalGeometry = new THREE.BoxGeometry(G.playerCardBorderThickness, this.height, G.playerCardThickness);
        this.borderMaterial = new THREE.MeshStandardMaterial({color: COLOR.UI_PLAYERCARD_BORDER, emissive: COLOR.UI_PLAYERCARD_BORDER});
        this.borderTop = new THREE.Mesh(this.borderHorizontalGeometry, this.borderMaterial);
        this.borderBottom = new THREE.Mesh(this.borderHorizontalGeometry, this.borderMaterial);
        this.borderLeft = new THREE.Mesh(this.borderVerticalGeometry, this.borderMaterial);
        this.borderRight = new THREE.Mesh(this.borderVerticalGeometry, this.borderMaterial);
        this.borderTop.position.set(this.position.x, this.position.y + this.height / 2, this.position.z);
        this.borderBottom.position.set(this.position.x, this.position.y - this.height / 2, this.position.z);
        this.borderLeft.position.set(this.position.x - this.width / 2, this.position.y, this.position.z);
        this.borderRight.position.set(this.position.x + this.width / 2, this.position.y, this.position.z);
    }

    createName()
    {
        this.namePosition = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
        this.nameText = new Text2D(this.scene, this.name, this.namePosition, G.playerCardNameSize, COLOR.UI_NAME, this.fontLoader);
        this.namePosition.y += G.playerCardHeight / 2 - Math.min(10, G.playerCardHeight * 0.95);
    }

    createLifeArray()
    {
        this.lifeArray = [];
        const maxLifeSpan = (this.lives - 1) * (this.width + this.lifeGap);
        for (let i = 0; i < this.lives; i++)
        {
            let x = PongMath.lerp(i, 1, this.lives, this.position.x - (maxLifeSpan / 2), this.position.x + (maxLifeSpan / 2));
            let y = this.position.y - this.height / 2 + this.topBottomMargin + this.lifeBoxHeight / 2;
            let lifePos = new THREE.Vector3();
            lifePos.set(x, y, this.position.z);
            let life = new Life(this.scene, lifePos, this.lifeHeight, this.lifeWidth);
            this.lifeArray.push(life);
        }
    }

    addToScene()
    {
        console.log("Adding card to scene.");
        this.scene.add(this.cardMesh);
        this.scene.add(this.borderTop);
        this.scene.add(this.borderBottom);
        this.scene.add(this.borderLeft);
        this.scene.add(this.borderRight);
        for (let life in this.lifeArray)
            this.lifeArray[life].addToScene();
    }

    removeFromScene()
    {
        this.scene.remove(this.cardMesh);
        this.scene.remove(this.borderTop);
        this.scene.remove(this.borderBottom);
        this.scene.remove(this.borderLeft);
        this.scene.remove(this.borderRight);
        for (let life in this.lifeArray)
            this.lifeArray[life].removeFromScene();
    }

    updateLife()
    {
        for (let i = 0; i < this.lives; i++)
            this.lifeArray[i].fill();
    }

    emptyArray()
    {
        for (let i = this.lives; i > 0; i--)
            this.lifeArray[i - 1].empty();
    }

    setLife(lives)
    {
        this.emptyArray();
        this.lives = lives;
        this.updateLife();
    }

    decreaseLife(lives)
    {
        if (this.lives - lives < 0)
            this.setLife(0);
        else
            this.setLife(this.lives - lives);
    }

    increaseLife(lives)
    {
        if (this.lives + lives > G.lives)
            this.setLife(G.lives);
        else
            this.setLife(this.lives + lives);
    }

    resetLife()
    {
        this.setLife(G.lives);
    }
}