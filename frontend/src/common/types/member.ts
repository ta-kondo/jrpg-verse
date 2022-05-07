import { CharaGridControls } from "@/features/game/main/physics/grid_controls";
import { GridPhysics } from "@/features/game/main/physics/grid_physics";
import { Charactor } from "@/features/game/main/players/charactor";

export type Member = {
  client_id: string;
  username: string;
  charactor: Charactor;
  physics: GridPhysics;
  controls: CharaGridControls;
};
