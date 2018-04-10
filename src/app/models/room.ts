import { Player } from './player';
import { Answer } from './answer';

export class Room {
  players: Player[];
  turn: number;
  winner: number;
  answers: Answer[];  
}


