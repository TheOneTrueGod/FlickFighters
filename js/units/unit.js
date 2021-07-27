import BaseAbility, { DELAY_TIME } from "../abilities/baseAbility.js";
import { LOOP_DELTA } from "../game.js";
import { CONTROLLER_TYPES } from "./unitDefs.js";

var Bodies = Matter.Bodies;
export default class Unit {
    constructor(unitData) {
        this.team = unitData.team;
        this.controller = unitData.controller;
        this.startPosition = { x: unitData.x, y: unitData.y };
        this.unitDef = unitData.unitDef;
        this.physicsBody = this.createPhysicsBody(unitData);
        this.nextAction = 0;
        this.unsetAbility();

        if (this.controller === CONTROLLER_TYPES.PLAYER) { this.nextAction = 5000; }
    }

    unsetAbility() {
        this.ability = {
            abilityClass: undefined,
            startTime: 0,
            targets: []
        }
    }

    useAbility(abilityClass, targets, currTime) {
        this.ability.abilityClass = abilityClass;
        this.ability.targets = [...targets];
        this.ability.startTime = currTime;

        this.nextAction = currTime + LOOP_DELTA * abilityClass.getTotalTicksTaken();

        abilityClass.onAbilityUse(this, this.ability);
    }

    createPhysicsBody(unitData) {
        const body = Bodies.circle(unitData.x, unitData.y, unitData.unitDef.radius);
        body.frictionAir = 0.04;
        return body;
    }
    
    getPhysicsBody() {
        return this.physicsBody;
    }

    readyForAction(currTime) {
        //console.log(this.nextAction, currTime);
        return this.nextAction <= currTime;
    }

    physicsTick(deltaTime, currTime) {
        if (this.ability.abilityClass) {
            this.ability.abilityClass.physicsTick(this, deltaTime, currTime, this.ability);
        }
    }

    logicTick(deltaTime, unitManager, currTime) {
        if (this.controller === CONTROLLER_TYPES.AI && this.readyForAction(currTime)) {
            runAI(this, unitManager, currTime);
        } else if (this.readyForAction(currTime)) {
            // PLACEHOLDER
            this.nextAction = currTime + 1000;
        }
    }
}

function runAI(unit, unitManager, currTime) {
    const enemyUnits = unitManager.getUnitsOnOppositeTeam(unit.team);
    if (!enemyUnits) {
        unit.nextAction += DELAY_TIME;
        return;
    }
    const target = enemyUnits[0];
    unit.useAbility(BaseAbility, [{ ...target.physicsBody.position }], currTime)
}