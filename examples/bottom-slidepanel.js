/** @jsx React.DOM */

var BottomPanel = React.createClass({

    renderTab: function () {
	//When an image is used for the tab, the width/height must be specified in the JS(X).
    return (
		<img src="menutab.png" width="32" height="32"/>
        );
    },

    renderContents: function () {
    return (
        <div>
			<h2>Here lives the slidepanel's contents</h2>
        </div>
        );
    },

    render: function () {
    return (
		<div>
			<h1>Bottom Slidepanel example</h1>
			In this example, the slidepanel starts minimized along the bottom. Click the tab (hamburger icon) to open it. Dragging has been disabled via the clickOnly prop. The tab location has been styled by passing in a CSS class to tabClass.<br/><br/>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/>

			<ReactSlidepanel ref="slidepanel" panelPosition="bottom" defaultHeight={200} startMinimized={true} clickOnly={true}
						tab={this.renderTab()}
						tabClass="centerTab"
						contents={this.renderContents()}
						panelContentsStyle={ {backgroundColor: 'lightgrey', opacity: '0.8'} } />
		</div>
		);
    }
});