(function(document) {
  'use strict';

    document.addEventListener('polymer-ready', function() {

    });

    document.querySelector('soko-ban').addEventListener('finished', function(e) {
        alert('Congratz you have pushed all ' + e.detail.target + ' boxes!');

        e.target.refresh();
        
    });

    // wrap document so it plays nice with other libraries
    // http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));
