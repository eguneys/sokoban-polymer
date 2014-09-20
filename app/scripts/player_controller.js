/* global TweenLite */
'use strict';

function PlayerController(model) {
    this.model = model;
    this.timer = { t: 100 };
}

PlayerController.prototype.beginAnimation= function() {
    // disable move in the middle of animation
    if (!this.canMove()) {
        return false;
    }
    
    this.timer.t = 0;
    return true;
};

PlayerController.prototype.canMove = function() {
    return this.timer.t >= 100;
};

PlayerController.prototype.move= function(direction) {
    if (!this.beginAnimation()) { return; }

    var delta = this.getDelta(direction);
    
    this.prevPos = {x: this.model.position.x, y: this.model.position.y };
    
    TweenLite.to(this.timer, 0.2, { t: 100, onUpdate: this.updatePlayer.bind(this, direction, delta.x, delta.y), onComplete: this.stopPlayer.bind(this, direction)});
};

PlayerController.prototype.updatePlayer = function(direction, dx, dy) {
    var keyVal = (Math.floor(this.timer.t / 40) % 2) + 1;
    if (direction + keyVal !== this.model.frameKey) { 
        this.model.frameKey = direction + keyVal;
    }

    this.model.position.x = this.prevPos.x - 0 + (dx * (this.timer.t / 100));
    this.model.position.y = this.prevPos.y - 0 + (dy * (this.timer.t / 100));
};

PlayerController.prototype.stopPlayer = function() {
    this.model.frameKey = this.model.frameKey.replace(/\d/, '');
    if (this.model.frameKey === 'left' || this.model.frameKey === 'right') {
        this.model.frameKey = 'down';
    }
    this.model.frameKey += '0';
};


PlayerController.prototype.getDelta = function(direction) {
    var delta = { x: 0, y: 0 };
    
    switch(direction) {
    case 'up':
        delta.y = -1;
        break;
    case 'down':
        delta.y = 1;
        break;
    case 'left':
        delta.x = -1;
        break;
    case 'right':
        delta.x = 1;
        break;
    }
    
    return delta;
};
