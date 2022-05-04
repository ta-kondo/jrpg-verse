import { Direction } from "./direction";
import { Player } from "./player";

import GameScene from ".";

const Vector2 = Phaser.Math.Vector2;
type Vector2 = Phaser.Math.Vector2;

export class GridPhysics {
  private lastMovementIntent = Direction.NONE;
  private movementDirection: Direction = Direction.NONE;
  private readonly speedPixelsPerSecond: number = GameScene.TILE_SIZE * 4;
  private tileSizePixelsWalked = 0;
  constructor(private player: Player) {}

  private movementDirectionVectors: {
    [key in Direction]: Vector2;
  } = {
    [Direction.UP]: Vector2.UP,
    [Direction.DOWN]: Vector2.DOWN,
    [Direction.LEFT]: Vector2.LEFT,
    [Direction.RIGHT]: Vector2.RIGHT,
    [Direction.NONE]: Vector2.ZERO,
  };

  movePlayer(direction: Direction): void {
    this.lastMovementIntent = direction;
    if (!this.isMoving()) {
      this.startMoving(direction);
    }
  }

  private isMoving(): boolean {
    return this.movementDirection != Direction.NONE;
  }

  private startMoving(direction: Direction): void {
    this.player.startAnimation(direction);
    this.movementDirection = direction;
  }

  private stopMoving(): void {
    this.player.stopAnimation();
    this.movementDirection = Direction.NONE;
  }

  update(delta: number) {
    this.lastMovementIntent = Direction.NONE;
    if (this.isMoving()) {
      this.updatePlayerPosition(delta);
    }
  }

  private updatePlayerPosition(delta: number) {
    const pixelsToWalkThisUpdate = this.getPixelsToWalkThisUpdate(delta);
    if (
      this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate) &&
      !this.shouldContinueMoving()
    ) {
      this.movePlayerSprite(GameScene.TILE_SIZE - this.tileSizePixelsWalked);
      this.stopMoving();
    } else {
      this.movePlayerSprite(pixelsToWalkThisUpdate);
    }
  }

  private willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate: number): boolean {
    return this.tileSizePixelsWalked + pixelsToWalkThisUpdate >= GameScene.TILE_SIZE;
  }

  private shouldContinueMoving(): boolean {
    return this.movementDirection == this.lastMovementIntent;
  }

  private movePlayerSprite(pixelsToMove: number) {
    const directionVec = this.movementDirectionVectors[this.movementDirection].clone();
    const movementDistance = directionVec.multiply(new Vector2(pixelsToMove));
    const newPlayerPos = this.player.getPosition().add(movementDistance);
    this.player.setPosition(newPlayerPos);
    this.tileSizePixelsWalked += pixelsToMove;
    this.tileSizePixelsWalked %= GameScene.TILE_SIZE;
  }

  private getPixelsToWalkThisUpdate(delta: number): number {
    const deltaInSeconds = delta / 1000;
    return this.speedPixelsPerSecond * deltaInSeconds;
  }
}
