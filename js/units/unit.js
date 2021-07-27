import BaseAbility, { DELAY_TIME } from "../abilities/baseAbility.js";
import { LOOP_DELTA } from "../game.js";
import { UNIT_ELASTICITY, UNIT_GROUND_FRICTION } from "../physics/physicsConstants.js";
import { UNIT_STATES } from "./unitConstants.js";
import { CONTROLLER_TYPES } from "./unitDefs.js";
import { UNIT_TEAMS } from "./unitManager.js";

var Bodies = Matter.Bodies;
export default class Unit {
    constructor(unitData) {
        this.team = unitData.team;
        this.color = "#f5d259";
        if (this.team === UNIT_TEAMS.PLAYER) {
            this.color = "#063e7b";
        }
        this.controller = unitData.controller;
        this.startPosition = { x: unitData.x, y: unitData.y };
        this.unitDef = unitData.unitDef;
        this.physicsBody = this.createPhysicsBody(unitData);
        this.nextAction = 0;
        this.unitState = UNIT_STATES.NORMAL;
        this.unsetAbility();

        if (this.controller === CONTROLLER_TYPES.PLAYER) { this.nextAction = 5000; }
    }

    setUnitState(unitState) {
        this.unitState = unitState;
        switch (unitState) {
            case UNIT_STATES.NORMAL:
                this.physicsBody.render.fillStyle = this.color;
                this.physicsBody.frictionAir = UNIT_GROUND_FRICTION;
                this.unsetAbility();
                break;
            case UNIT_STATES.MOVING:
                this.physicsBody.render.fillStyle = "#FF0000";
                this.physicsBody.frictionAir = 0;
                break;
        }
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
        const body = Bodies.circle(unitData.x, unitData.y, unitData.unitDef.radius, {
            render: { fillStyle: this.color }
        });
        body.frictionAir = UNIT_GROUND_FRICTION;
        body.restitution = UNIT_ELASTICITY;
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