import { UnitDefMap } from "./units/unitDefs.js";

class UnitData {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.team = data.team;
        this.controller = data.controller;
        this.unitDef = UnitDefMap[data.type];
        if (!this.unitDef) {
            throw new Error(`${data.type} isn't a valid unit def name.  See unitDefs.js for valid names.`)
        }
    }
}

export class GameData {
    constructor({ units, map }) {
        this.units = units ? units.map((unitData) => new UnitData(unitData)) : [];
        this.mapSize = { x: map.size.x, y: map.size.y };
    }
}