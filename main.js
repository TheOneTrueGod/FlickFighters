import { Game } from "./js/game.js";
import { GameData } from "./js/gameData.js";
import { CONTROLLER_TYPES, GoblinUnitDef, PlayerUnitDef } from "./js/units/unitDefs.js";
import { UNIT_TEAMS } from "./js/units/unitManager.js";

function SetupGame() {
    const gameData = new GameData({
        units: [
            { x: 200, y: 400, controller: CONTROLLER_TYPES.PLAYER, team: UNIT_TEAMS.PLAYER, type: PlayerUnitDef.defName },
            { x: 450, y: 50, controller: CONTROLLER_TYPES.AI, team: UNIT_TEAMS.ENEMY, type: GoblinUnitDef.defName },
            { x: 300, y: 20, controller: CONTROLLER_TYPES.AI, team: UNIT_TEAMS.ENEMY, type: GoblinUnitDef.defName }
        ],
        map: {
            size: { x: 800, y: 600 }
        }
    });
    const game = new Game(gameData);
    game.createWalls(gameData);
    game.createUnits(gameData);
    game.runEngine();
}

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(() => {
    SetupGame();
})