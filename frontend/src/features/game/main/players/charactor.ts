import { Direction } from "../direction";
import { Player } from "./player";
export class Charactor extends Player {
  public CHARACTOR_ICON = 1;
  stopAnimation(direction: Direction) {
    const animationManager = this.sprite.anims.animationManager;
    const standingFrame = animationManager.get(`${this.charaId.toString()}:${direction}`).frames[1]
      .frame.name;
    this.sprite.anims.stop();
    this.sprite.setFrame(standingFrame);
  }

  startAnimation(direction: Direction) {
    this.sprite.anims.play(`${this.charaId.toString()}:${direction}`);
  }
}
