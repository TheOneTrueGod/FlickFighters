export const UNIT_TEAMS = {
    ENEMY: 'ENEMY',
    PLAYER: 'PLAYER',
}

export default class UnitManager {
    constructor() {
        this.units = [];
        this.unitsByTeam = {};
    }

    addUnit(unit) {
        this.units.push(unit)
        if (!this.unitsByTeam[unit.team]) {
            this.unitsByTeam[unit.team] = [];
        }
        this.unitsByTeam[unit.team].push(unit);
    }

    physicsTick(deltaTime, currTime) {
        // Should we separate this?  Probably at some point...
        this.logicTick(deltaTime, currTime);

        this.units.forEach((unit) => {
            unit.physicsTick(deltaTime, currTime);
        });
    }

    logicTick(deltaTime, currTime) {
        this.units.forEach((unit) => {
            unit.logicTick(deltaTime, this, currTime);
        });
    }

    waitingForUnitAction(currTime) {
        return this.units.some((unit) => {
            return unit.readyForAction(currTime);
        })
    }

    getUnitsOnOppositeTeam(team) {
        if (team === UNIT_TEAMS.PLAYER) {
            return this.unitsByTeam[UNIT_TEAMS.ENEMY];
        } else if (team === UNIT_TEAMS.ENEMY) {
            return this.unitsByTeam[UNIT_TEAMS.PLAYER];
        }
    }
}