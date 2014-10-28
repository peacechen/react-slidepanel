/** @jsx React.DOM */

/*
  React Slidepanel component
  Requires React, JSX, jQuery + UI

  Supported props:
        clickOnly : if true, panel can only be opened/closed with a click (default false).
        panelPosition : edge where SlidePanel lives (top, bottom, left, right).
        startMinimized : if true, panel initially is initially hidden or minimized (default false).
        zIndex : z-index of panel to customize layering (default 10).

    ------------------------------------------------------------------
    Widths & heights may be numbers, percentages, px or em. If a number,
    it must be a true number and not a string number.
    Height/width includes the the dimensions of the tab.
    ------------------------------------------------------------------
        defaultHeight
        defaultWidth
        maxHeight //ToDo
        maxWidth //ToDo
        minHeight : minimum height of panel contents, even when hidden. Note that minHeight must be <= defaultHeight
        minWidth : minimum width of panel contents, even when hidden. Note that minWidth must be <= defaultWidth

    ------------------------------------------------------------------
    Passed-in rendering properties.
    ------------------------------------------------------------------
        tab : JS(X) render of clickable/draggable tab.
        contents : JS(X) render of contents displayed inside panel.

    ------------------------------------------------------------------
    Typically choose either inline styling or a CSS class for styling.
    If both are used, be watchful of styling conflicts.
    The tab size & position, as well as panel size & placement along an
    edge, may be set using one of these styling methods.
    ------------------------------------------------------------------
        tabStyle : styling object for tab.
        panelContentsStyle : styling object for contents shown inside panel.
        slidepanelStyle : styling object for the containing panel.

        tabClass : CSS class for tab.
        panelContentsClass : CSS class for contents.
        slidepanelClass : CSS class for containing panel.

 */

var ReactSlidepanel = React.createClass({

    propTypes: {
        clickOnly: React.PropTypes.bool,
        panelPosition: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
        tabPosition: React.PropTypes.string,
        startMinimized: React.PropTypes.bool,
        maxHeight: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        maxWidth: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        defaultHeight: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        defaultWidth: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        minHeight: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        minWidth: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
        tab: React.PropTypes.object,
        contents: React.PropTypes.object,
        tabStyle: React.PropTypes.object,
        panelContentsStyle: React.PropTypes.object,
        slidepanelStyle: React.PropTypes.object,
        tabClass: React.PropTypes.string,
        panelContentsClass: React.PropTypes.string,
        slidepanelClass: React.PropTypes.string
},

    handleResize: function(e) {
        var width = this.state.slidepanelStyle.width;
        var height = this.state.slidepanelStyle.height;
        if(typeof width != 'undefined') {
            if(typeof width === "string" && width.indexOf('%') >= 0)
            {}  //leave % alone
            else
                width = parseInt(width, 10);
        }
        if(typeof height != 'undefined') {
            if(typeof height === "string" && height.indexOf('%') >= 0)
            {}  //leave % alone
            else
                height = parseInt(height, 10);
        }
        this.updateSlidepanelContainer(width, height);
    },

    //------------------------------------------------------------------------
    //The overall container restricts the dragging bounds of the drag tab.
    //------------------------------------------------------------------------
    updateDragContainer: function () {
        var dragContainerStyle = {
            position: 'fixed',
            width: window.innerWidth + "px",
            height: window.innerHeight + "px",
            overflow: "hidden",
            top: 0,
            left: 0,
            pointerEvents: 'none', //Click-throughs for normal browsers
            background: 'none !important', //Click-throughs for IE...
            filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='img/transparent.png', sizingMethod='scale')",
            zIndex: this.props.zIndex
        };
        //Visible tab shouldn't block clicks either
        var tabStyle = {
            pointerEvents: 'none', //Click-throughs for normal browsers
            background: 'none !important', //Click-throughs for IE...
            filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='img/transparent.png', sizingMethod='scale')"
        };
        switch(this.props.panelPosition) {
            case 'left':
            case 'right':
                tabStyle.position = 'fixed';
                break;
        }
        $.extend(tabStyle, this.props.tabStyle, this.state.tabStyle);
        this.setState( {tabStyle: tabStyle, dragContainerStyle: dragContainerStyle} );
    },

    //------------------------------------------------------------------------
    //The (invisible) draggable tab.
    //Note that the drag tab size is based on the first child element of the
    //visible tab.
    //------------------------------------------------------------------------
    updateDragTab: function () {
        //Place drag tab over visible tab
        //Give React time to update the DOM since we're looking at the placement of the visible tab.
        setTimeout(function() {
            var dragTabStyle = {
//                backgroundColor: 'blue', //For dev & testing
//                opacity: '0.4',
                pointerEvents: 'fill',
                position: 'fixed'
            };
            $.extend(dragTabStyle, this.state.dragTabStyle);
            //Synchronize dimensions & placement with visible tab
            var tab = this.refs.tab.getDOMNode();
            var top, left;
            switch(this.props.panelPosition) {
                case 'left':
                    top = $(tab.firstChild).offset().top;
                    left = parseInt(this.state.slidepanelStyle.width, 10) - tab.firstChild.offsetWidth;
                    break;
                case 'right':
                    top = $(tab.firstChild).offset().top;
                    left = 0;
                    break;
                case 'top':
                case 'bottom':
                    top = tab.firstChild.offsetTop;
                    left = tab.firstChild.offsetLeft;
                    break;
            }
            dragTabStyle.top = parseInt(this.state.slidepanelStyle.top, 10) + top + "px";
            dragTabStyle.left = parseInt(this.state.slidepanelStyle.left, 10) + left + "px";
            dragTabStyle.width = tab.firstChild.offsetWidth + "px";
            dragTabStyle.height = tab.firstChild.offsetHeight + "px";
            this.setState( {dragTabStyle: dragTabStyle} );

            //Set up dragging
            if(this.props.clickOnly || this.dragParams)
                return; //no dragging desired, or already set up
            this.dragParams = {
                //start: function () {}, //NoOp
                drag: this.dragHandler,
                stop: this.dragHandler,
                containment: "parent"
            };
            switch(this.props.panelPosition) {
                default:
                case 'left':
                case 'right':
                    this.dragParams.axis = "x";
                    break;
                case 'top':
                case 'bottom':
                    this.dragParams.axis = "y";
                    break;
            }
            $(this.refs.dragTab.getDOMNode()).draggable(this.dragParams);
        }.bind(this), 80);
    },

    //Handlers for drag tab
    dragHandler: function (e, ui) {
        var dragTab = $(this.refs.dragTab.getDOMNode());
        //Constrain draggable boundary in case of scrolling document
        if(ui.position.top > window.innerHeight - dragTab.height())
            ui.position.top = window.innerHeight - dragTab.height();
        if(ui.position.top < 0)
            ui.position.top = 0;

        //Calculate new size of slidepanel
        var width, height, visible = 0;
        var tabStyle = $.extend({}, this.props.tabStyle, this.state.tabStyle);
        switch(this.props.panelPosition) {
            default:
            case 'left':
                width = visible = ui.position.left + dragTab.width();
                height = this.props.defaultHeight;
				tabStyle.left = ui.position.left;
                break;
            case 'right':
                width = visible = window.innerWidth - ui.position.left;
                height = this.props.defaultHeight;
				tabStyle.left = ui.position.left;
                break;
            case 'top':
                width = this.props.defaultWidth;
                height = visible = ui.position.top + dragTab.height();
				tabStyle.top = ui.position.top;
                break;
            case 'bottom':
                width = this.props.defaultWidth;
                height = window.innerHeight - ui.position.top;
                visible = height - dragTab.height();
				tabStyle.top = ui.position.top;
                break;
        }
        //tabStyle.transition = "0.5s"; //ToDo: Animate sliding
	    this.setState( {tabStyle: tabStyle} );
        this.visibleSlidepanel = visible;
        this.updateSlidepanelContainer(width, height);
    },

    //Click to open or minimize.
    dragTabClick: function (e) {
        var slidepanelContainer = this.refs.slidepanelContainer.getDOMNode();
        var dragTab = this.refs.dragTab.getDOMNode();
        var top, left, minimizedVal, openVal;
        var openRef1, openRef2;
		var initialPosition;
        switch(this.props.panelPosition) {
            default:
            case 'left':
                minimizedVal = 0;
                openVal = this.props.defaultWidth - $(dragTab).width();
                openRef1 = 0; //left clip of visible window
                openRef2 = $(dragTab).position().left; //slidepanel right
				initialPosition = openRef2;
                // Transition Minimized --> Open : Open --> Minimized
                left = openRef1 >= openRef2*.99? openVal : minimizedVal;
                break;
            case 'right':
                minimizedVal = window.innerWidth - $(dragTab).width();
                openVal = window.innerWidth - this.props.defaultWidth;
                openRef2 = window.innerWidth;
                openRef1 = $(dragTab).position().left + this.refs.tab.getDOMNode().firstChild.offsetWidth; //slidepanel right
				initialPosition = openRef1;
                left = openRef1 >= openRef2*.99? openVal : minimizedVal;
                break;
            case 'top':
                minimizedVal = 0;
                openVal = this.props.defaultHeight - $(dragTab).height();
                openRef2 = $(dragTab).position().top;
                openRef1 = 0;
				initialPosition = openRef2;
                // Transition Minimized --> Open : Open --> Minimized
                top = openRef1 >= openRef2*.99? openVal : minimizedVal;
                break;
            case 'bottom':
                minimizedVal = window.innerHeight - $(dragTab).height();
                openVal = window.innerHeight - this.props.defaultHeight;
                openRef1 = $(slidepanelContainer).position().top + $(dragTab).height(); //slidepanel top
                openRef2 = window.innerHeight; //bottom clip of visible window
				initialPosition = openRef1;
                top = openRef1 >= openRef2*.99? openVal : minimizedVal;
                break;
        }
		//Potentially animate w/ JS here
        this.dragHandler(null, {position: {top: top, left: left} });
    },

    //------------------------------------------------------------------------
    //Container for the sliding panel's visible tab and contents.
    //For left/right positions, width must be a true number.
    //For top/bottom positions, height must be a true number.
    //------------------------------------------------------------------------
    updateSlidepanelContainer: function (width, height) {
        var slidepanelStyle = {
            position: 'fixed'
        };
        $.extend(slidepanelStyle, this.props.slidepanelStyle, this.state.slidepanelStyle);
        if(typeof width != 'undefined')
            slidepanelStyle.width = typeof width === "number"? width+"px" : width; //latter should already be px, em or %.
        if(typeof height != 'undefined')
            slidepanelStyle.height = typeof height === "number"? height+"px" : height;

        var tab = this.refs.tab.getDOMNode();

        //slidepanelStyle.transition = "0.5s"; //ToDo: Animate sliding

        switch(this.props.panelPosition) {
            default:
            case 'left':
                slidepanelStyle.width = Math.max(width, this.props.minWidth);
                slidepanelStyle.left = this.visibleSlidepanel - slidepanelStyle.width;
                slidepanelStyle.width += "px";
                slidepanelStyle.left += "px";
                if(!slidepanelStyle.top)
                    slidepanelStyle.top = 0;
                break;
            case 'right':
                slidepanelStyle.width = Math.max(width, this.props.minWidth) + "px";
                slidepanelStyle.left = window.innerWidth - this.visibleSlidepanel + "px";
                if(!slidepanelStyle.top)
                    slidepanelStyle.top = 0;
                break;
            case 'top':
                slidepanelStyle.height = Math.max(height, this.props.minHeight);
                slidepanelStyle.top = slidepanelStyle.height > this.visibleSlidepanel ?
                                        this.visibleSlidepanel - this.props.minHeight : 0;
                slidepanelStyle.height += "px";
                slidepanelStyle.top += "px";
                if(!slidepanelStyle.left)
                    slidepanelStyle.left = 0;
                break;
            case 'bottom':
                slidepanelStyle.height = Math.max(height, this.props.minHeight) + "px";
                slidepanelStyle.top = window.innerHeight - this.visibleSlidepanel - tab.firstChild.offsetHeight + "px";
                if(!slidepanelStyle.left)
                    slidepanelStyle.left = 0;
                break;
        }
        this.setState({slidepanelStyle: slidepanelStyle}, function() {
            this.updatePanelContents();
            this.updateDragTab(); //Keep invisible drag tab placement in sync.
            this.updateDragContainer();
        });
    },

    //------------------------------------------------------------------------
    //The panel contents, not including the tab.
    //------------------------------------------------------------------------
    updatePanelContents: function () {
        var panelContentsStyle = {
            pointerEvents: 'fill',
            width: this.props.defaultWidth,
            height: this.props.defaultHeight,
            overflow: 'auto',
            boxShadow: 'inset 0 6px 4px -4px rgba(0,0,0,.075), 0 0 8px rgba(128, 128, 128, 0.8)'
        };
        $.extend(panelContentsStyle, this.props.panelContentsStyle, this.state.panelContentsStyle);
        var tab = this.refs.tab.getDOMNode();

        switch(this.props.panelPosition) {
            default:
            case 'right':
                panelContentsStyle.position = 'fixed';
                panelContentsStyle.left = $(tab).offset().left + $(tab).width() + "px";
                //pass-thru
            case 'left':
                panelContentsStyle.width = parseInt(this.state.slidepanelStyle.width, 10) - tab.firstChild.offsetWidth + "px";
                break;
            case 'top':
            case 'bottom':
                panelContentsStyle.height = parseInt(this.state.slidepanelStyle.height, 10) - tab.firstChild.offsetHeight + "px";
                break;
        }
        this.setState({panelContentsStyle: panelContentsStyle });
    },

    //------------------------------------------------------------------------
    getDefaultProps: function () {
        return {
            panelPosition: "left",
            defaultHeight: "100%",
            defaultWidth: "100%",
            minHeight: 100,
            minWidth: 100,
            startMinimized: false,
            zIndex: 10
        };
    },

    componentDidMount: function () {
        var panelContentsStyle = {}, tabStyle = {};
        $.extend(panelContentsStyle, this.props.panelContentsStyle);
        $.extend(tabStyle, this.props.tabStyle);
        var width, height;
        switch(this.props.panelPosition) {
            case 'left':
            case 'right':
                width = this.props.startMinimized? this.props.minWidth : this.props.defaultWidth;
                height = this.props.defaultHeight;
                this.visibleSlidepanel = this.props.startMinimized? this.refs.tab.getDOMNode().firstChild.offsetWidth : this.props.defaultWidth;
                //Side-by-side elements need inline-block so tab sits in the right place.
                panelContentsStyle.display = "inline-block";
                tabStyle.display = "inline-block";
                break;
            case 'top':
                width = this.props.defaultWidth;
                height = this.props.startMinimized? this.props.minHeight : this.props.defaultHeight;
                this.visibleSlidepanel = this.props.startMinimized? this.refs.tab.getDOMNode().firstChild.offsetHeight : this.props.defaultHeight;
                break;
            case 'bottom':
                width = this.props.defaultWidth;
                height = this.props.startMinimized? this.props.minHeight : this.props.defaultHeight;
                this.visibleSlidepanel = this.props.startMinimized?
                                            0 : this.props.defaultHeight - this.refs.tab.getDOMNode().firstChild.offsetHeight;
                break;
        }
        this.setState( {panelContentsStyle: panelContentsStyle,
                        tabStyle: tabStyle,
                        dragTabStyle: this.props.dragTabStyle},
                        function () {
                            this.updateSlidepanelContainer(width, height);
                        }.bind(this));

        window.addEventListener('resize', this.handleResize);
    },

    getInitialState: function () {
        return {slidepanelStyle: {}, tabStyle: {}, panelContentsStyle: {}, dragTabStyle: {} };
    },

    //------------------------------------------------------------------------
    //Create an invisible dragTab on top of displayed tab. This prevents the
    //dragging element from separating during dragging.
    //
    //The dragTab is rendered last to be on top of the other elements.
    //Note the order of rendering the visible tab depends on the panel's position.
    //------------------------------------------------------------------------
    render: function () {
    return (
        <div ref="dragContainer" style={this.state.dragContainerStyle}>
            <div ref="slidepanelContainer" style={this.state.slidepanelStyle} className={this.props.slidepanelClass}>
                {this.props.panelPosition=='right' || this.props.panelPosition=='bottom'?
                    <div ref="tab" style={this.state.tabStyle} className={this.props.tabClass}>{this.props.tab}</div> : null}
                <div ref="panelContents" style={this.state.panelContentsStyle} className={this.props.panelContentsClass}>
                    {this.props.contents}
                </div>
                {this.props.panelPosition=='left' || this.props.panelPosition=='top'?
                    <div ref="tab" style={this.state.tabStyle} className={this.props.tabClass}>{this.props.tab}</div> : null}
            </div>
            <div ref="dragTab" style={this.state.dragTabStyle} onClick={this.dragTabClick}/>
        </div>
        );
    }
});