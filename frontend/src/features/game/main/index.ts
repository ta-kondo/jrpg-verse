import { Socket, io } from "socket.io-client";

import { Member } from "@/common/types/member";
import { IData } from "@/common/types/messagedata";
import "phaser";

import { Direction } from "./direction";
import { CharaGridControls, GridControls } from "./physics/grid_controls";
import { GridPhysics } from "./physics/grid_physics";
import { Charactor } from "./players/charactor";
import { Player } from "./players/player";

// https://zenn.dev/citrono_lemon/scraps/7862df38f8851a

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 528;

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: "Game",
};

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
  private socket!: Socket;

  private members: Array<Member> = [];
  private userinfo = {
    client_id: "",
    username: "",
  };

  constructor() {
    super(sceneConfig);
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
    // その他のキャラ
    this.load.spritesheet("charactor", "assets/chara/pipo-charachip001a.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  /**
   * ゲーム画面の作成処理やイベントアクションを記述する処理
   */
  async create() {
    this.add.text(10, 10, "Hello, phaser");

    // ソケット生成
    this.socket = io("http://localhost:3030", { path: "/api/socketio" });
    // connect to socket server
    // const socket = io(`/api/socketio`);
    const socket = this.socket;

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
    this.gridPhysics = new GridPhysics(player, vacantLandTilemap);
    this.gridControls = new GridControls(this.input, this.gridPhysics);

    // プレイヤーの動作設定
    this.createPlayerAnimation("player", Direction.UP, 9, 11);
    this.createPlayerAnimation("player", Direction.RIGHT, 6, 8);
    this.createPlayerAnimation("player", Direction.DOWN, 0, 2);
    this.createPlayerAnimation("player", Direction.LEFT, 3, 5);

    // 参加用関数
    const joined = (msg: IData) => {
      console.log(`wellcome!! ${msg.client_id}`);
      // if (joininfo.client_id == msg.client_id) {
      //   // 自分の参加イベントは無視
      //   return;
      // }
      const joined = this.members.find((member) => {
        return member.client_id == msg.client_id;
      });
      if (joined) {
        // 既に処理済み
        return;
      }
      // 参加者のキャラ生成
      const charaSprite = this.add.sprite(0, 0, "charactor");
      charaSprite.setDepth(2);
      charaSprite.scale = MainScene.DEFAULT_SCALE;
      const charactor = new Charactor(charaSprite, new Phaser.Math.Vector2(10, 10));
      const charaId = charactor.charaId.toString();
      const physics = new GridPhysics(charactor, vacantLandTilemap);
      // 動作の生成
      this.createPlayerAnimation("charactor", `${charaId}:${Direction.UP}`, 9, 11);
      this.createPlayerAnimation("charactor", `${charaId}:${Direction.RIGHT}`, 6, 8);
      this.createPlayerAnimation("charactor", `${charaId}:${Direction.DOWN}`, 0, 2);
      this.createPlayerAnimation("charactor", `${charaId}:${Direction.LEFT}`, 3, 5);
      //キャラの保持
      this.members.push({
        client_id: msg.client_id,
        username: msg.name,
        charactor: charactor,
        physics: physics,
        controls: new CharaGridControls(physics),
      } as Member);
    };

    // サーバー接続イベント
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      // setConnected(true);
    });

    this.userinfo.username = "tekitou name";
    // 参加実行
    await fetch(`/api/join/?username=${this.userinfo.username}`).then(async (response) => {
      await response.json().then((data: { client_id: string; users: Array<IData> }) => {
        // 参加済
        data.users.forEach((msg) => {
          if (data.client_id == msg.client_id) {
            // 自分
            this.userinfo.client_id = msg.client_id;
          } else {
            // 参加者のキャラ追加
            joined(msg);
          }
        });
      });
    });

    // 参加イベント
    socket.on("joined", joined);
    // キャラ移動イベント
    socket.on("updated", (data: IData) => {
      this.members
        .filter((member) => {
          return member.client_id != this.userinfo.client_id && member.client_id == data.client_id;
        })
        .forEach((member) => {
          member.controls.update(data.directions);
          member.physics.update(data.delta);
        });
    });
  }

  private createPlayerAnimation(key: string, name: string, startFrame: number, endFrame: number) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNumbers(key, {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true,
    });
  }

  private standingCount = 0;
  /**
   * メインループ
   */
  update(_time: number, delta: number): void {
    this.gridControls.update();
    this.gridPhysics.update(delta);

    const data = this.makeDirection();
    data.delta = delta;

    const MAX_COUNT = 20;

    // 棒立ちを数える
    if (data.directions == 0) {
      this.standingCount++;
    } else {
      this.standingCount = 0;
    }
    // オーバーフロー対策
    if (data.directions > 100000) {
      this.standingCount = MAX_COUNT;
    }
    // 動いていればキーを送信
    const resp =
      this.standingCount < MAX_COUNT
        ? fetch("/api/move", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
        : undefined;
  }

  private makeDirection = (): IData => {
    const cursors = this.input.keyboard.createCursorKeys();
    let direction = 0;
    if (cursors.left.isDown) {
      direction += 1; // Direction.LEFT;
    } else if (cursors.right.isDown) {
      direction += 2; // Direction.RIGHT;
    } else if (cursors.up.isDown) {
      direction += 4; // Direction.UP;
    } else if (cursors.down.isDown) {
      direction += 8; // Direction.DOWN;
    }
    return {
      client_id: this.userinfo.client_id,
      name: this.userinfo.username,
      directions: direction,
    } as IData;
  };
}

export default MainScene;
