import { WALL_ELASTICITY } from "./physics/physicsConstants.js";
import Unit from "./units/unit.js";
import UnitManager from "./units/unitManager.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

const PHYSICS_STATES = {
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
}
export const LOOP_DELTA = 30;
export class Game {
    constructor(gameData) {
        this.unitManager = new UnitManager();

        this.physicsState = PHYSICS_STATES.PAUSED;
        this.mapSize = { x: gameData.mapSize.x, y: gameData.mapSize.y };
        this.engine = Engine.create({
            gravity: { x: 0, y: 0, scale: 0.001 },
        });
        this.currTime = 0;

        this.setupMatterJS();
    }

    setupMatterJS() {
        // create a renderer
        var render = Render.create({
            element: document.body,
            engine: this.engine
        });

        // run the renderer
        Render.run(render);
    }

    runEngine() {
        // run the engine
        window.setTimeout(() => this.mainLoop(), LOOP_DELTA);
    }

    initializeListeners(canvas) {

    }


    createWalls(gameData) {
        const wallWidth = 20;
        const mapSize = { ...gameData.mapSize };
        var ground = [
            // top
            Bodies.rectangle(mapSize.x / 2, 0, mapSize.x, wallWidth, { isStatic: true }),
            // right
            Bodies.rectangle(mapSize.x, mapSize.y / 2, wallWidth, mapSize.y, { isStatic: true }),
            // bottom
            Bodies.rectangle(mapSize.x / 2, mapSize.y, mapSize.x, wallWidth, { isStatic: true }),
            // left
            Bodies.rectangle(0, mapSize.y / 2, wallWidth, mapSize.y, { isStatic: true }),
        ];

        ground.forEach((body) => {
            body.restitution = WALL_ELASTICITY;
        })

        // add all of the bodies to the world
        Composite.add(this.engine.world, ground);
    }

    createUnits(gameData) {
        Composite.add(this.engine.world, 
            gameData.units.map((unitData) => {
                const newUnit = new Unit(unitData);
                this.unitManager.addUnit(newUnit);
                return newUnit.getPhysicsBody();
            }
        ));
    }

    mainLoop() {
        if (this.physicsState == PHYSICS_STATES.RUNNING) {
            this.unitManager.physicsTick(LOOP_DELTA, this.currTime);
            if (this.unitManager.waitingForUnitAction(this.currTime)) {
                this.physicsState = PHYSICS_STATES.PAUSED;
            }

            Engine.update(this.engine, LOOP_DELTA);

            this.currTime += LOOP_DELTA;
        } else if (this.physicsState === PHYSICS_STATES.PAUSED) {
            this.unitManager.logicTick(LOOP_DELTA, this.currTime);
            if (!this.unitManager.waitingForUnitAction(this.currTime)) {
                this.physicsState = PHYSICS_STATES.RUNNING;
            }
        }

        this.runEngine();
    }
}