import { Text2D } from './Text2D.js';
import { PlayerCard } from './PlayerCard.js';

export class UserInterface
{
    constructor(scene, fontLoader)
    {
        this.scene = scene;
        this.fontLoader = fontLoader;
        this.textObjects = {};
        this.playerCards = {};
    }

    addTextObject(scene, name, text, position, size, color)
    {
        const textObject = new Text2D(scene, text, position, size, color, this.fontLoader);
        this.textObjects[name] = textObject;
    }

    updateTextObject(name, newText)
    {
        if (this.textObjects[name])
        {
            this.textObjects[name].update2DText(newText);
        }
    }

    addPlayerCard(player)
    {
        let playerCard = new PlayerCard(player, this.scene, this.fontLoader);
        this.playerCards[player.name] = playerCard;
    }
}