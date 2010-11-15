// ==UserScript==
// @name          ContentCleavage
// @namespace     http://github.com/chrisberkhout/ContentCleavage
// @description   See the split between comments and primary content
// @include       *
// @copyright     Blah, blah.
// ==/UserScript==


var findPos = function (obj) { // http://www.quirksmode.org/js/findpos.html
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curleft, curtop];
    }
};

var getDocHeight = function () {
    if (document.height > 0) { 
        // Doing this because document.body.clientHeight gives the wrong height, e.g. for:
        // http://www.aaronboodman.com/2009/04/content-scripts-in-chromium.html
        return document.height; 
    } else { 
        // Doing this because document.height isn't always defined, e.g. for: http://sivers.org/itunes/
        return document.body.clientHeight; 
    }
}

var getCommentsElem = function () {
    var ids = [
        'comments', 
        'dsq-comments',
        'remarks'
    ];
    var i, elem;
    for (i = 0; i < ids.length; i += 1) {
        elem = document.getElementById(ids[i]);
        if (elem !== null) { return elem; }
    }
    return false;
}

var insertBar = function () {
    var commentsElem, 
        winHeight, 
        docHeight, 
        articlePartHeight, 
        commentsPartHeight, 
        articlePart, 
        commentsPart, 
        bar;
    
    commentsElem = getCommentsElem();
    winHeight = window.innerHeight;
    docHeight = getDocHeight();
    articlePartHeight = winHeight * (findPos(commentsElem)[1] / docHeight);
    commentsPartHeight = winHeight - articlePartHeight;
    
    articlePart = document.createElement('div');
    articlePart.id = 'readingRegionArticle';
    articlePart.style.cssText = 
        'height: ' + articlePartHeight + 'px;' +
        'width: 10px;' +
        'background-color: green;';

    commentsPart = document.createElement('div');
    commentsPart.id = 'readingRegionComments';
    commentsPart.style.cssText = 
        'height: ' + commentsPartHeight + 'px;' +
        'width: 10px;' +
        'background-color: red;';

    bar = document.createElement('div');
    bar.id = 'ContentCleavageBar';
    bar.style.cssText = 
        'position: fixed;' +
        'top: 0px;' +
        'right: 0px;' +
        'height: ' + winHeight + 'px;' +
        'width: 10px;';

    bar.appendChild(articlePart);
    bar.appendChild(commentsPart);
    document.body.appendChild(bar);
}

var redrawBar = function () {
    var oldBar = document.getElementById('ContentCleavageBar');
    if (oldBar !== null) { document.body.removeChild(oldBar); }
    insertBar();
}

var elem = getCommentsElem();
if (elem) { 
    insertBar();
    window.addEventListener('resize',redrawBar,false);
}
