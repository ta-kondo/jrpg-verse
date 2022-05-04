import "phaser";

import { Direction } from "./direction";
import { GridControls } from "./grid_controls";
import { GridPhysics } from "./grid_physics";
import { Player } from "./player";

// https://zenn.dev/citrono_lemon/scraps/7862df38f8851a

/**
 * メインシーン
 * 一応説明しておくと、
 * init⇒preload⇒create⇒update⇒update⇒...
 * のようなライフサイクルで動作する
 */
class MainScene extends Phaser.Scene {
  static readonly DEFAULT_SCALE = 2.0;
  static readonly TILE_SIZE = 16 * MainScene.DEFAULT_SCALE;

  private gridControls!: GridControls;
  private gridPhysics!: GridPhysics;

  constructor() {
    super({
      key: "Main",
    });
  }

  /**
   * 初期処理
   */
  init(): void {
    console.log("init");
  }

  /**
   * アセットデータ読込などを行う処理
   */
  preload(): void {
    // 空地マップ
    this.load.image("map_png", "assets/town/CastleTownBF-A2.png");
    this.load.image("tiles1", "assets/town/CastleTown-B.png");
    this.load.tilemapTiledJSON("vacant-land-map", "assets/town/map.json");

    // プレイヤー
    this.load.spritesheet("player", "assets/chara/pipo-charachip001.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  /**
   * ゲーム画面の作成処理やイベントアクションを記述する処理
   */
  create(): void {
    this.add.text(10, 10, "Hello, phaser");

    // 空地マップ
    const vacantLandTilemap = this.make.tilemap({ key: "vacant-land-map" });
    const tilesetNames = ["city1", "city2", "city1", "city2"];
    const tilesetImageKeys = ["map_png", "tiles1", "map_png", "tiles1"];
    for (let i = 0; i < vacantLandTilemap.layers.length; i++) {
      vacantLandTilemap.addTilesetImage(tilesetNames[i], tilesetImageKeys[i]);
      const layer = vacantLandTilemap.createLayer(i, tilesetNames[i], 0, 0);
      layer.setDepth(i);
      layer.scale = MainScene.DEFAULT_SCALE;
    }

    // プレイヤー
    const playerSprite = this.add.sprite(0, 0, "player");
    playerSprite.setDepth(2);
    playerSprite.scale = MainScene.DEFAULT_SCALE;
    this.cameras.main.startFollow(playerSprite);
    this.cameras.main.roundPixels = true;
    const player = new Player(playerSprite, new Phaser.Math.Vector2(10, 10));

    // プレイヤーの操作
    this.gridPhysics = new GridPhysics(player);
    this.gridControls = new GridControls(this.input, this.gridPhysics);
    this.createPlayerAnimation(Direction.UP, 90, 92);
    this.createPlayerAnimation(Direction.RIGHT, 78, 80);
    this.createPlayerAnimation(Direction.DOWN, 54, 56);
    this.createPlayerAnimation(Direction.LEFT, 66, 68);
  }

  private createPlayerAnimation(name: string, startFrame: number, endFrame: number) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers("player", {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true,
    });
  }

  /**
   * メインループ
   */
  update(_time: number, delta: number): void {
    this.gridControls.update();
    this.gridPhysics.update(delta);
  }
}

export default MainScene;
