import { Direction } from "./direction";

import GameScene from ".";

export class Player {
  constructor(private sprite: Phaser.GameObjects.Sprite, private tilePos: Phaser.Math.Vector2) {
    const offsetX = GameScene.TILE_SIZE / 2;
    const offsetY = GameScene.TILE_SIZE;

    this.sprite.setOrigin(0.5, 1);
    this.sprite.setPosition(
      tilePos.x * GameScene.TILE_SIZE + offsetX,
      tilePos.y * GameScene.TILE_SIZE + offsetY,
    );
    this.sprite.setFrame(55);
  }

  getPosition(): Phaser.Math.Vector2 {
    return this.sprite.getBottomCenter();
  }

  setPosition(position: Phaser.Math.Vector2): void {
    this.sprite.setPosition(position.x, position.y);
  }

  stopAnimation() {
    this.sprite.anims.stop();
  }

  startAnimation(direction: Direction) {
    console.log(direction);
    //this.sprite.anims.play(direction);
  }
}
