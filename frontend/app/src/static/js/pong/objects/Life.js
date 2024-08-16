import * as THREE from 'three';
import * as G from '../globals.js';
import * as COLOR from '../colors.js';
import * as PongMath from '../math.js';

export class Life
{
    constructor(scene, position, height, width)
    {
        this.scene = scene;
        this.position = position;
        this.height = height;
        this.width = width;
        this.lifeBackgroundGeometry = new THREE.BoxGeometry(this.width, this.height, G.lifeThickness);
        this.lifeHorizontalBorderGeometry = new THREE.BoxGeometry(this.width, G.lifeBorderThickness, G.lifeThickness);
        this.lifeVerticalBorderGeometry = new THREE.BoxGeometry(G.lifeBorderThickness, this.height, G.lifeThickness);
        this.lifeMaterial = new THREE.MeshStandardMaterial({color: COLOR.UI_LIFE, emissive: COLOR.UI_LIFE});
        this.background = new THREE.Mesh(this.lifeBackgroundGeometry, this.lifeMaterial);
        this.borderTop = new THREE.Mesh(this.lifeHorizontalBorderGeometry, this.lifeMaterial);
        this.borderBottom = new THREE.Mesh(this.lifeHorizontalBorderGeometry, this.lifeMaterial);
        this.borderLeft = new THREE.Mesh(this.lifeVerticalBorderGeometry, this.lifeMaterial);
        this.borderRight = new THREE.Mesh(this.lifeVerticalBorderGeometry, this.lifeMaterial);
        this.setPos();
        this.groupTogether();
    }

    groupTogether()
    {
        this.life = new THREE.Group();
        this.life.add(this.background);
        this.life.add(this.borderTop);
        this.life.add(this.borderBottom);
        this.life.add(this.borderLeft);
        this.life.add(this.borderRight);
    }

    setPos()
    {
        this.background.position.copy(this.position);
        this.borderTop.position.set(this.position.x, this.position.y + this.height / 2, 0);
        this.borderBottom.position.set(this.position.x, this.position.y - this.height / 2, 0);
        this.borderLeft.position.set(this.position.x - this.width / 2, this.position.y, 0);
        this.borderRight.position.set(this.position.x + this.width / 2, this.position.y, 0);
    }

    empty()
    {
        this.background.visible = false;
    }

    fill()
    {
        this.background.visible = true;
    }
}