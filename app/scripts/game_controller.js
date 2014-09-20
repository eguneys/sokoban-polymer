/* globals GameModel */

'use strict';

function GameController() {}

GameController.Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

GameController.prototype.getModel = function() {
    if (!this.mapModel) {

        if (!this.model) {
            this.model = new GameModel();
            this.model.generateMap();
        }
        
        this.mapModel = this.model.getMapModel();
    }

    return this.mapModel;
};

GameController.prototype.move = function(dir) {
    var delta = this.getDeltas(dir);

    var playerPos = this.model.getPlayerPos();

    var current = { x: playerPos.x, y: playerPos.y };

    var next = { x: current.x - 0 + delta.x, y: current.y - 0 + delta.y };

    var toBox = this.model.getBoxAt(next.x, next.y);

    var canMove = false;

    switch (toBox.type) {
    case GameModel.ViewTypes.EMPTY:
        canMove = true;
        break;
    case GameModel.ViewTypes.WALL:
        break;
    case GameModel.ViewTypes.TARGET:
        canMove = true;
        break;
    case GameModel.ViewTypes.BOX:
        canMove = false;
        break;        
    }

    if (canMove) {
        this.model.setPlayerPos(next.x, next.y);
        
        this.model.removeBoxAt(next.x, next.y);
        this.model.setBoxAt(current.x, current.y, GameModel.ViewTypes.EMPTY);
    }

    return canMove;
};

GameController.prototype.getDeltas = function(dir) {
    var dx = 0, dy = 0;
    switch (dir) {
    case GameController.Direction.UP:
        dy--;
        break;
    case GameController.Direction.DOWN:
        dy++;
        break;
    case GameController.Direction.LEFT:
        dx--;
        break;
    case GameController.Direction.RIGHT:
        dx++;
        break;
    }

    return {
        x: dx,
        y: dy
    };
};
