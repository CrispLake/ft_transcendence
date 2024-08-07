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
        this.card = new THREE.Group();
        this.initializeSize(info);
        this.createCardBackground();
        this.createBorder();
        this.createName();
        this.createLifeArray();
        this.groupTogether();
        this.setPosition();
        this.addToScene();
    }


    //--------------------------------------------------------------------------
    //  INITIALIZATION
    //--------------------------------------------------------------------------

    initializeSize(info)
    {
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

    createCardBackground()
    {
        this.cardGeometry = new THREE.BoxGeometry(this.width, this.height, G.playerCardThickness);
        this.cardMaterial = new THREE.MeshBasicMaterial({color: COLOR.UI_PLAYERCARD_BG});
        this.cardMesh = new THREE.Mesh(this.cardGeometry, this.cardMaterial);
        this.cardMesh.position.set(0, 0, 0);
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
        this.borderTop.position.set(0, 0 + this.height / 2, 0);
        this.borderBottom.position.set(0, 0 - this.height / 2, 0);
        this.borderLeft.position.set(0 - this.width / 2, 0, 0);
        this.borderRight.position.set(0 + this.width / 2, 0, 0);
    }

    createName()
    {
        this.namePosition = new THREE.Vector3(0, 0, 0);
        this.nameText = new Text2D(this.scene, this.name, this.namePosition, G.playerCardNameSize, COLOR.UI_NAME, this.fontLoader, (mesh) => {
            this.card.add(mesh);
        });
        this.namePosition.y += G.playerCardHeight / 2 - Math.min(10, G.playerCardHeight * 0.95);
    }

    createLifeArray()
    {
        this.lifeArray = [];
        const maxLifeSpan = (this.lives - 1) * (this.lifeWidth + this.lifeGap);
        for (let i = 0; i < this.lives; i++)
        {
            let x = PongMath.lerp(i, 0, this.lives - 1,-(maxLifeSpan / 2), (maxLifeSpan / 2));
            let y = -this.height / 2 + this.topBottomMargin + this.lifeBoxHeight / 2;
            let lifePos = new THREE.Vector3(0, 0, 0);
            lifePos.set(x, y, 0);
            let life = new Life(this.scene, lifePos, this.lifeHeight, this.lifeWidth);
            this.lifeArray.push(life);
        }
    }

    setPosition()
    {
        const margin = 10;
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

        this.card.position.copy(this.position);
    }

    groupTogether()
    {
        this.card.add(this.cardMesh);
        this.card.add(this.borderTop);
        this.card.add(this.borderBottom);
        this.card.add(this.borderLeft);
        this.card.add(this.borderRight);
        // this.card.add(this.nameText.mesh);
        for (let life in this.lifeArray)
            this.card.add(this.lifeArray[life].life);
    }


    //--------------------------------------------------------------------------
    //  SCENE
    //--------------------------------------------------------------------------

    addToScene()
    {
        this.scene.add(this.card);
    }

    removeFromScene()
    {
        this.scene.remove(this.card);
    }


    //--------------------------------------------------------------------------
    //  LIFE
    //--------------------------------------------------------------------------

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