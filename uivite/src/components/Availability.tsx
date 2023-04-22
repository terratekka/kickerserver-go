import { Player } from "./Player";

export interface Range {
    start: Date
    end: Date
}

export interface Availability {
    id: number;
    playerId: number,
    range: Range
}

export interface AvailabilityResult {
    players: Player[],
    range: Range
}
