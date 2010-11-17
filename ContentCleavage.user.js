// ==UserScript==
// @name          ContentCleavage
// @description   See the split between comments and primary content
// @namespace     http://github.com/chrisberkhout/ContentCleavage
// @include       *
// ==/UserScript==
//
// -----------------------------------------------------------------------------
//
// The MIT License
// 
// Copyright (c) 2010 Chris Berkhout
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//
// -----------------------------------------------------------------------------

var findPos = function (obj) { // http://www.quirksmode.org/js/findpos.html
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curleft, curtop];
    } else {
        return false;
    }
};

var getDocHeight = function () {
    if (unsafeWindow.document.height > 0) { 
        // Doing this because document.body.clientHeight gives the wrong height, e.g. for:
        // http://www.aaronboodman.com/2009/04/content-scripts-in-chromium.html
        return unsafeWindow.document.height; 
    } else { 
        // Doing this because document.height isn't always defined, e.g. for: http://sivers.org/itunes/
        return unsafeWindow.document.body.clientHeight; 
    }
};

var getCommentsElem = function () {
    var patterns = [
        // The first matching pattern triggers the return of the first matched element within the document.
        // Patterns with more chance of a correct match should be earlier in this list.
        { tag: 'div',     attrib: 'class', re: /^discussion-column$/i, reject: true },
        { tag: 'div',     attrib: 'id',    re: /^idc-container.*$/i },
        { tag: 'div',     attrib: 'id',    re: /^comments$/i },
        { tag: 'div',     attrib: 'class', re: /\bcomments\b/i },
        { tag: 'div',     attrib: 'id',    re: /^discussion$/i },
        { tag: 'ul',      attrib: 'id',    re: /^comments$/i },
        { tag: 'h4',      attrib: 'id',    re: /^comments$/i },
        { tag: 'h3',      attrib: 'id',    re: /^comments$/i },
        { tag: 'h1',      attrib: 'id',    re: /^comments$/i },
        { tag: 'h2',      attrib: 'id',    re: /^comments$/i },
        { tag: 'h2',      attrib: 'class', re: /\bcomments\b/i },
        { tag: 'div',     attrib: 'class', re: /\bcommentsList\b/i },
        { tag: 'div',     attrib: 'id',    re: /^jcWrapper$/i },
        { tag: 'div',     attrib: 'id',    re: /^comment_container$/i },
        { tag: 'div',     attrib: 'class', re: /\bcomments-section\b/i },
        { tag: 'div',     attrib: 'class', re: /\bmainComments\b/i },
        { tag: 'section', attrib: 'class', re: /\bcomments\b/i },
        { tag: 'ul',      attrib: 'id',    re: /^dsq-comments$/i },
        { tag: 'div',     attrib: 'id',    re: /^disqus_thread$/i },
        { tag: 'div',     attrib: 'class', re: /\bcommentarea\b/i },
        { tag: 'div',     attrib: 'class', re: /\bcomments?_holder\b/i },
        { tag: 'a',       attrib: 'name',  re: /^comments$/i },
        { tag: 'a',       attrib: 'id',    re: /^comment-\d+$/i },
        { tag: 'li',      attrib: 'id',    re: /^comment-\d+$/i },
        { tag: 'div',     attrib: 'id',    re: /^TalkbackDiv$/i },
        { tag: 'p',       attrib: 'class', re: /\bcomments\b/i },
        { tag: 'div',     attrib: 'class', re: /\bcomment_list\b/i },
        { tag: 'div',     attrib: 'class', re: /\bfacebook_comments?\b/i },
        { tag: 'div',     attrib: 'id',    re: /^commentsWell$/i },
        { tag: 'div',     attrib: 'id',    re: /^readerComments$/i },
        { tag: 'div',     attrib: 'id',    re: /^notes$/i },
        { tag: 'div',     attrib: 'id',    re: /^remarks$/i },
        { tag: 'div',     attrib: 'id',    re: /^commentsLink$/i },
        { tag: 'div',     attrib: 'class', re: /\bSTR_StripComments\b/i },
        { tag: 'div',     attrib: 'class', re: /\bfluxcomment\b/i },
        { tag: 'a',       attrib: 'id',    re: /^comments$/i },
        { tag: 'span',    attrib: 'class', re: /\b.+-comments\b/i }
    ];
    var elems, ei, pi, attrib, re;

    for (pi = 0; pi < patterns.length; pi += 1) {
        elems = unsafeWindow.document.getElementsByTagName(patterns[pi]['tag']);
        for (ei=0; ei < elems.length; ei += 1) {
            attrib = patterns[pi]['attrib'];
            re = patterns[pi]['re'];
            if (elems[ei].attributes[attrib] && elems[ei].attributes[attrib].value.match(re)) {
                if (patterns[pi]['reject']) { return false; }
                else { 
                    return elems[ei];
                }
            }
        }
    }
    return false;
};

var insertBar = function () {
    var commentsElem, 
        pos,
        winHeight, 
        docHeight, 
        articlePartHeight, 
        commentsPartHeight, 
        articlePart, 
        commentsPart, 
        bar;
    
    winHeight = unsafeWindow.innerHeight;
    docHeight = getDocHeight();
    commentsElem = getCommentsElem();
    articlePartHeight = winHeight * (findPos(commentsElem)[1] / docHeight);
    commentsPartHeight = winHeight - articlePartHeight;

    articlePart = unsafeWindow.document.createElement('div');
    articlePart.id = 'readingRegionArticle';
    articlePart.style.cssText = 
        'height: ' + articlePartHeight + 'px;' +
        'width: 10px;' +
        'background-color: green;';

    commentsPart = unsafeWindow.document.createElement('div');
    commentsPart.id = 'readingRegionComments';
    commentsPart.style.cssText = 
        'height: ' + commentsPartHeight + 'px;' +
        'width: 10px;' +
        'background-color: red;';

    bar = unsafeWindow.document.createElement('div');
    bar.id = 'ContentCleavageBar';
    bar.style.cssText = 
        'position: fixed;' +
        'z-index: 10;' +
        'top: 0px;' +
        'right: 0px;' +
        'height: ' + winHeight + 'px;' +
        'width: 10px;';

    bar.appendChild(articlePart);
    bar.appendChild(commentsPart);
    unsafeWindow.document.body.appendChild(bar);
};

var redrawBar = function () {
    var oldBar = unsafeWindow.document.getElementById('ContentCleavageBar');
    if (oldBar !== null) { unsafeWindow.document.body.removeChild(oldBar); }
    insertBar();
};

var elem = getCommentsElem();
if (elem) { 
    insertBar();
    unsafeWindow.addEventListener('resize',redrawBar,false);
    // These redraws are to correct for pages that are extended after load (e.g. pages using DISQUS).
    setTimeout(redrawBar,500); 
    setTimeout(redrawBar,1500);
    setTimeout(redrawBar,5000);
}
