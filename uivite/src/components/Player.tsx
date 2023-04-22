import { createContext } from "react";

export interface Player {
    id: number,
    name?: string
    email?: string
}

export interface PlayerState {
    player: Player
    setPlayer?: any
}

export const defaultPlayer: Player = { id: 0 };

export const playerReducer = (state: Player, player: Player) => {
    state.id = player.id
    state.name = player.name;
    state.email = player.email;
    return { ...state };
}

const PlayerContext = createContext<PlayerState>({ player: { id: 0 } });
export default PlayerContext;
