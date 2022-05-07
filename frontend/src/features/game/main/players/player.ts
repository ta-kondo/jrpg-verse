import { Math as phaserMath } from "phaser";

import GameScene from "..";
import { Direction } from "../direction";

const randomDataGenerator = new phaserMath.RandomDataGenerator();

export class Player {
  public charaId = randomDataGenerator.integerInRange(100000, 100000000);
  public CHARACTOR_ICON = 1;
  constructor(private sprite: Phaser.GameObjects.Sprite, private tilePos: Phaser.Math.Vector2) {
    const offsetX = GameScene.TILE_SIZE / 2;
    const offsetY = GameScene.TILE_SIZE;

    this.sprite.setOrigin(0.5, 1);
    this.sprite.setPosition(
      tilePos.x * GameScene.TILE_SIZE + offsetX,
      tilePos.y * GameScene.TILE_SIZE + offsetY,
    );
    this.sprite.setFrame(this.CHARACTOR_ICON);
  }

  getPosition(): Phaser.Math.Vector2 {
    return this.sprite.getBottomCenter();
  }

  setPosition(position: Phaser.Math.Vector2): void {
    this.sprite.setPosition(position.x, position.y);
  }

  stopAnimation(direction: Direction) {
    const animationManager = this.sprite.anims.animationManager;
    // ここもエラーになるのでコメントアウト(^^)v
    const standingFrame = animationManager.get(direction).frames[1].frame.name;
    this.sprite.anims.stop();
    this.sprite.setFrame(standingFrame);
  }

  startAnimation(direction: Direction) {
    // console.log(direction);
    // ここでエラーが出るのでキャラが1方向しか向かない😢
    this.sprite.anims.play(direction);
  }

  getTilePos(): Phaser.Math.Vector2 {
    return this.tilePos.clone();
  }

  setTilePos(tilePosition: Phaser.Math.Vector2): void {
    this.tilePos = tilePosition.clone();
  }
}
