class UnitDef {
    static defName = 'DEFAULT_UNIT_ERROR';
    static radius = 30;
}

export class GoblinUnitDef extends UnitDef {
    static defName = 'Goblin';
    static radius = 20;
}

export class PlayerUnitDef extends UnitDef {
    static defName = 'Player';
    static radius = 30;
}

export const UnitDefMap = {
    [GoblinUnitDef.defName]: GoblinUnitDef,
    [PlayerUnitDef.defName]: PlayerUnitDef,
}

export const CONTROLLER_TYPES = {
    AI: 'AI',
    PLAYER: 'PLAYER',
}