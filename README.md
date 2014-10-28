React Slidepanel
=============
The Slidepanel React component creates a movable, hidable content area along any of the 4 edges within the viewport (left, right, top, bottom). It renders on top of other components and does not scroll out of view.  The tab and contents may contain any JS(X) and styled inline or with CSS classes.

The Slidepanel is responsive and will resize along with the browser. 

Requirements
==========
React, JSX, jQuery + UI

Supported Props
============
Customization of the slidepanel is supported via the following properties:

+   **clickOnly** : if true, panel can only be opened/closed with a click (default false).
+   **panelPosition** : edge where SlidePanel lives (top, bottom, left, right; default left).
+   **startMinimized** : if true, panel initially is initially hidden or minimized (default false).
+   **zIndex** : z-index of panel to customize layering (default 10).

> Widths & heights may be numbers, percentages, px or em. If a number, it must be a true number and not a string number.
> Height/width includes the dimensions of the tab.

+   **defaultHeight** : The default height of the tab when opened.
+   **defaultWidth** : The default width of the tab when opened.
+   **maxHeight** //ToDo
+   **maxWidth** //ToDo
+   **minHeight** : minimum height of panel contents, even when hidden. Note that minHeight must be <= defaultHeight
+   **minWidth** : minimum width of panel contents, even when hidden. Note that minWidth must be <= defaultWidth

> Passed-in rendering properties.

+   **tab** : JS(X) render of clickable/draggable tab. Note that if an image is used for the tab, the width/height must be specified in the JS(X).
+   **contents** : JS(X) render of contents displayed inside panel.

> Typically choose either inline styling or a CSS class for styling. If both are used, be watchful of styling conflicts.
> The tab size & position, as well as panel size & placement along an edge, may be set using one of these styling methods.

+   **tabStyle** : styling object for tab.
+   **panelContentsStyle** : styling object for contents shown inside panel.
+   **slidepanelStyle** : styling object for the containing panel.
+   **tabClass** : CSS class for tab.
+   **panelContentsClass** : CSS class for contents.
+   **slidepanelClass** : CSS class for containing panel.
		
Examples
========
The 'examples' folder has a couple samples showing how to instantiate the slidepanel with various props. Start a webserver in the root directory and open the link e.g. http://localhost/examples/left-slidepanel.html

Installation
========
Source file is in the 'src' folder.

To Do
=====
+   Build script to produce pre-compiled JS (remove JSX requirement).
+   Add bits to make this an NPM and be identified as a react-component.
+   Sliding animation.
+   Support MaxHeight & MaxWidth props.
+   Add prop to support inline slidepanel behavior (e.g. pushes other elements aside instead of overlaying).  This might be the hardest mod on the list.

Bugs
====

License
======
MIT open source license.
