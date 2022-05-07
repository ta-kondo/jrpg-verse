import { Direction } from "../direction";
import { GridPhysics } from "./grid_physics";

export class GridControls {
  constructor(private input: Phaser.Input.InputPlugin, private gridPhysics: GridPhysics) {}

  update() {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridPhysics.movePlayer(Direction.LEFT);
    } else if (cursors.right.isDown) {
      this.gridPhysics.movePlayer(Direction.RIGHT);
    } else if (cursors.up.isDown) {
      this.gridPhysics.movePlayer(Direction.UP);
    } else if (cursors.down.isDown) {
      this.gridPhysics.movePlayer(Direction.DOWN);
    }
  }
}

export class CharaGridControls {
  constructor(private gridPhysics: GridPhysics) {}

  update(directions: number) {
    if (directions & 1 /* Direction.LEFT */) this.gridPhysics.movePlayer(Direction.LEFT);
    if (directions & 2 /* Direction.RIGHT */) this.gridPhysics.movePlayer(Direction.RIGHT);
    if (directions & 4 /* Direction.UP */) this.gridPhysics.movePlayer(Direction.UP);
    if (directions & 8 /* Direction.DOWN */) this.gridPhysics.movePlayer(Direction.DOWN);
  }
}
