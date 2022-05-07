import { Direction } from "@/features/game/main/direction";

export interface IData {
  client_id: string;
  name: string;
  direction: Direction;
  message: string;
}
