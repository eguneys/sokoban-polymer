/* globals GameModel, PlayerController */

'use strict';

function GameController() {
    this.model = new GameModel();
    this.model.generateMap();

    this.playerController = new PlayerController(this.model.getPlayer());

    // tracks the boxes on target.
    this.currentDone = 0;
}

GameController.Direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

GameController.prototype.getModel = function() {
    return this.model.getMapModel();
};

GameController.prototype.move = function(dir) {
    if (!this.playerController.canMove()) { return false; }
    
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
    case GameModel.ViewTypes.BOXDARK:
        canMove = this.moveBox(toBox, delta);
        break;        
    }

    if (canMove) {
        this.playerController.move(this.directionString(dir));
    }

    return canMove;
};

GameController.prototype.moveBox = function(box, delta) {
    var nextPos = { x: box.position.x + delta.x, y: box.position.y + delta.y };

    var nextBox = this.model.getBoxAt(nextPos.x, nextPos.y);

    if (nextBox.type ===  GameModel.ViewTypes.EMPTY) {

        if (box.type === GameModel.ViewTypes.BOXDARK) {
            this.currentDone--;
        }
        
        nextBox.bgType = GameModel.ViewTypes.EMPTY;
        nextBox.type = GameModel.ViewTypes.BOX;

        box.type = box.bgType || GameModel.ViewTypes.EMPTY;

        return true;
    } else if (nextBox.type === GameModel.ViewTypes.TARGET) {
        // TODO ugly hack

        if (box.type === GameModel.ViewTypes.BOX) {
            this.currentDone++;
        }
        
        nextBox.bgType = GameModel.ViewTypes.TARGET;
        nextBox.type = GameModel.ViewTypes.BOXDARK;

        box.type = box.bgType || GameModel.ViewTypes.EMPTY;
        
        return true;
    }
    return false;
};

GameController.prototype.isGameOver = function() {
    return this.currentDone === this.model.getTarget();
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


GameController.prototype.directionString = function(dir) {
    var result;
    switch (dir) {
    case GameController.Direction.UP:
        result = 'up';
        break;
    case GameController.Direction.DOWN:
        result = 'down';
        break;
    case GameController.Direction.LEFT:
        result = 'left';
        break;
    case GameController.Direction.RIGHT:
        result = 'right';
        break;
    }

    return result;
};
