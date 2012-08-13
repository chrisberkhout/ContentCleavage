# ContentCleavage

See the split between comments and primary content.

## Introduction

ContentCleavage is an extension for Google Chrome and Mozilla Firefox (written 
as a Greasemonkey user script) that improves web page readability by providing
additional visual cues regarding page structure.

When comments can be detected in a page, ContentCleavage inserts a narrow bar
along the right side of the browser window. The bar is color-coded to indicate
the proprtions of vertical space consumed by primary content and by the 
following reader comments.

For screenshots, please see [http://skit.ch/9kk](http://skit.ch/9kk)

## Status

In August 2012 I noticed Google has changed Chrome's support for
greasemonkey scripts, so they can't be installed as described below.
I'm not sure if I'll submit this to the Chrome Web Store.

## Installation

For Google Chrome:

1. Visit [http://bit.ly/contentcleavage](http://bit.ly/contentcleavage)
2. When prompted, press 'Continue' to complete the installation.

For Mozilla Firefox:

1. If you don't already have the Greasemonkey extension, install it from
   [https://addons.mozilla.org/firefox/addon/748](https://addons.mozilla.org/firefox/addon/748)
2. Visit [http://bit.ly/contentcleavage](http://bit.ly/contentcleavage)
3. Click the pop-up install button, or in the menu bar select 
   'Tools > Greasemonkey > Install User Script...'.
4. Ensure that Greasemonkey is activated (the monkey icon in the bottom right
   of the browser window should be shown in color and in the Greasemonkey
   menu, 'Enabled' should have a tick next to it).

Repeating the installation will update you to the latest version. However, be
aware that the Chrome Extensions tab may continue to show the same version 
number.

## Accuracy

ContentCleavage uses a set of known patterns to look for page elements 
containing comments. The patterns are the result of checking a lot of blogs, and
will work for almost all other pages you might use. However, if a page uses 
non-typical markup for its comments, then ContentCleavage may not be able to 
detect them, and the bar will not be shown.

The inserted bar divides the full internal height of the browser window 
according to the article:comments ratio observed in the document. Since it
doesn't take the position of scrollbar buttons into account, the alignment of
the scrollbar 'thumb' with the regions in the ContentCleavage bar is not exact.
This difference will sometimes be more pronounced, but generally it's close
enough.

## Compatibility

ContentCleavage has been tested with:

- Mozilla Firefox 3.5.11 on OS X
- Google Chrome 7.0.517.44 on OS X

It should also work with other versions and operating systems.

## Copyright

ContentCleavage comes to you under the MIT license. See the code for details.

## Feedback

I would love to hear any feedback you have about ContentCleavage!
The best way to reach me is via email at gmail.com (chrisberkhout@).
