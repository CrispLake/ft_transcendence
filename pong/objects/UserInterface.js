import { Text } from './Text.js';

export class UserInterface
{
    constructor(scene, fontLoader)
    {
        this.scene = scene;
        this.fontLoader = fontLoader;
        this.textObjects = {};
    }

    addTextObject(scene, name, text, position, size, color)
    {
        const textObject = new Text(scene, text, position, size, color, this.fontLoader);
        this.textObjects[name] = textObject;
    }

    updateTextObject(name, newText)
    {
        if (this.textObjects[name])
        {
            this.textObjects[name].updateText(newText);
        }
    }
}