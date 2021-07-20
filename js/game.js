var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

export class Game {
    constructor(gameData) {
        this.engine = Engine.create({
            gravity: { x: 0, y: 0, scale: 0.001 },
        });
        // create a renderer
        var render = Render.create({
            element: document.body,
            engine: this.engine
        });

        // run the renderer
        Render.run(render);

        // create runner
        this.runner = Runner.create();
    }

    runEngine() {
        // run the engine
        Runner.run(this.runner, this.engine);
    }

    createWalls(gameData) {
        var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

        // add all of the bodies to the world
        Composite.add(this.engine.world, [ground]);
    }

    createUnits(gameData) {
        // create two boxes and a ground
        Composite.add(this.engine.world, 
            gameData.units.map((unitData) => Bodies.circle(unitData.x, unitData.y, unitData.unitDef.radius)
        ));
    }
}