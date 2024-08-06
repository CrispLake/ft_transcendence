import { Text2D } from './Text2D.js';
import { PlayerCard } from './PlayerCard.js';
import * as G from '../globals.js';

export class UserInterface
{
    constructor(scene, fontLoader)
    {
        this.scene = scene;
        this.fontLoader = fontLoader;
        this.card = {
            width: 0,
            height: 0,
            sideMargin: 0,
            topBottomMargin: 0,
            nameSize: 0,
            lives: 0,
            lifeBoxWidth: 0,
            lifeBoxHeight: 0,
            lifeHeight: 0,
            lifeWidth: 0,
            lifeGap: 0
        };
        this.playerCards = {};
        this.addedToScene = false;
        this.setPlayerCardSize();
    }

    setPlayerCardSize()
    {
        this.card.width = G.playerCardWidth;
        this.card.height = G.playerCardHeight;
        this.card.sideMargin = G.playerCardSideMargin;
        this.card.topBottomMargin = G.playerCardTopBottomMargin;
        this.card.nameSize = G.playerCardNameSize;
        this.card.lifeBoxWidth = G.lifeBoxWidth;
        this.card.lifeBoxHeight = G.lifeBoxHeight;
        this.card.lives = G.lives;

        if (this.card.lives * (this.card.lifeBoxHeight * G.lifeSizeRatio) + ((this.card.lives - 1) * this.card.lifeBoxHeight * G.lifeSizeRatio * G.lifeGapWidthRatio) <= this.card.lifeBoxWidth)
        {
            console.log("Fits inside the box.");
            this.card.lifeHeight = this.card.lifeBoxHeight;
            this.card.lifeWidth = this.card.lifeHeight * G.lifeSizeRatio;
        }
        else
        {
            console.log("Too wide!");
            this.card.lifeWidth = this.card.lifeBoxWidth / (this.card.lives + (this.card.lives * G.lifeGapWidthRatio) - G.lifeGapWidthRatio);
            this.card.lifeHeight = this.card.lifeWidth / G.lifeSizeRatio;
        }

        this.card.lifeGap = this.card.lifeWidth * G.lifeGapWidthRatio;

        console.log(this.card);
    }

    addPlayerCard(player)
    {
        this.playerCards[player.name] = new PlayerCard(player, this.scene, this.fontLoader, this.card);
    }

    resize()
    {
        for (let card in this.playerCards)
            this.playerCards[card].setPosition();
        if (window.innerWidth <= (this.card.width + this.card.sideMargin) * 2 && this.addedToScene == true)
            this.removeFromScene();
        if (window.innerWidth > (this.card.width + this.card.sideMargin) * 2 && this.addedToScene == false)
            this.addToScene();
    }

    addToScene()
    {
        for (let card in this.playerCards)
            this.playerCards[card].addToScene();
        this.addedToScene = true;
    }

    removeFromScene()
    {
        for (let card in this.playerCards)
            this.playerCards[card].removeFromScene();
        this.addedToScene = false;
    }
}