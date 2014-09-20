'use strict';

function GameModel() {}

GameModel.Types = {
    EMPTY: ' ',
    WALL: '#',
    TARGET: '.',
    BOX: '$',
    PLAYER: '@'
};

GameModel.ViewTypes = {
    EMPTY: 'G',
    WALL: 'W',
    TARGET: 'T',
    BOX: 'B',
    PLAYER: 'P'
};

GameModel.prototype.generateMap = function() {
    this.rawModel  = '' +
        '    #####' + '\n' +
        '    #   #' + '\n' +
        '    #$  #' + '\n' +
        '  ###  $##' + '\n' +
        '  #  $ $ #' + '\n' +
        '### # ## #   ######' + '\n' +
        '#   # ## #####  ..#' + '\n' +
        '# $  $          ..#' + '\n' +
        '##### ### #@##  ..#' + '\n' +
        '    #     #########' + '\n' +
        '    #######' +
        '';

    this.getMapModel();
};

GameModel.prototype.getMapModel = function() {
    if (this.model) { return this.model; }

    
    var boxes = [], player;

    var model = this.rawModel.split('\n');

    model.forEach(function(line, row) {
        for (var col in line) {
            var ch = line[col];
            var boxType = this.mapBoxType(ch);

            var pos = {
                x: col - 0,
                y: row - 0
            };
            
            if (boxType === GameModel.ViewTypes.PLAYER) {
                player = {
                    position: pos,
                    frameKey: 'down0'
                };
            } else {
                boxes.push({
                    type: boxType,
                    position: pos
                });
            }
        }
    }, this);
    this.model = {
        player: player,
        boxes: boxes
    };

    return this.model;
};

GameModel.prototype.mapBoxType = function(ch) {
    var boxType;
    switch (ch) {
    case GameModel.Types.EMPTY:
        boxType = GameModel.ViewTypes.EMPTY;
        break;
    case GameModel.Types.WALL:
        boxType = GameModel.ViewTypes.WALL;
        break;
    case GameModel.Types.TARGET:
        boxType = GameModel.ViewTypes.TARGET;
        break;
    case GameModel.Types.BOX:
        boxType = GameModel.ViewTypes.BOX;
        break;
    case GameModel.Types.PLAYER:
        boxType = GameModel.ViewTypes.PLAYER;
        break;
    }

    return boxType;
};

GameModel.prototype.getPlayer = function() {
    return this.model.player;
};

GameModel.prototype.getPlayerPos = function() {
    return this.model.player.position;
};


GameModel.prototype.setPlayerPos = function(x, y) {
    this.model.player.position.x = x;
    this.model.player.position.y = y;
};

GameModel.prototype.getBoxAt = function(x, y) {
    var box = this.model.boxes.filter(function(box) {
        return box.position.x === x && box.position.y === y;
    });

    return box[0];
};

GameModel.prototype.setBoxAt = function(x, y, type) {
    var box = this.getBoxAt(x, y);

    if (!box) {
        box = {
            position: { x: x, y: y }
        };

        this.model.boxes.push(box);
    }
    
    box.type = type;
};

GameModel.prototype.removeBoxAt = function(x, y) {
    var box = this.getBoxAt(x, y);

    var boxes = this.model.boxes;

    boxes.splice(boxes.indexOf(box), 1);
};

GameModel.prototype.swapBoxes = function(box, box2) {
    var boxPos = { x: box.position.x, y: box.position.y };

    box.position.x = box2.position.x;
    box.position.y = box2.position.y;

    box2.position = boxPos;
};
