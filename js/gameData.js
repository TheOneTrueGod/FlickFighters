import { UnitDefMap } from "./units/unitDefs.js";

class UnitData {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.unitDef = UnitDefMap[data.type];
        if (!this.unitDef) {
            throw new Error(`${data.type} isn't a valid unit def name.  See unitDefs.js for valid names.`)
        }
    }
}

export class GameData {
    constructor(jsonGameData) {
        this.units = jsonGameData.units ? jsonGameData.units.map((unitData) => new UnitData(unitData)) : [];
    }
}