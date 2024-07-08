import { Text2D } from './Text2D.js';

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
      console.log(`Scene: ${scene} name: ${name} text: ${text} pos: ${position} size: ${size} col: ${color}`);
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
}