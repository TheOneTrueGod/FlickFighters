import { LOOP_DELTA } from "../game.js";
import { UNIT_STATES } from "../units/unitConstants.js";

export const DELAY_TIME = 120;

export default class BaseAbility {
    static ACTIVE_TICKS = 10;
    static COOLDOWN_TICKS = 30;
    // deltaTime -- time since last physics tick
    // startTime -- when this ability was used
    // currTime -- current time.
    static physicsTick(unit, deltaTime, currTime, abilityData) {
        const abilityTime = currTime - abilityData.startTime;
        if (abilityTime > LOOP_DELTA * this.ACTIVE_TICKS) {
            unit.setUnitState(UNIT_STATES.NORMAL);
        }
    }

    static getTotalTicksTaken() {
        return this.ACTIVE_TICKS + this.COOLDOWN_TICKS;
    }

    static onAbilityUse(unit, abilityData) {
        let moveVector = Matter.Vector.create(
            abilityData.targets[0].x - unit.physicsBody.position.x,
            abilityData.targets[0].y - unit.physicsBody.position.y
        );
        moveVector = Matter.Vector.normalise(moveVector);
        moveVector = Matter.Vector.mult(moveVector, 3);
        
        Matter.Body.setVelocity(unit.physicsBody, moveVector);

        unit.setUnitState(UNIT_STATES.MOVING);
    }
}