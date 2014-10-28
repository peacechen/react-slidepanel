/** @jsx React.DOM */

var LeftPanel = React.createClass({

    renderTab: function () {
	//When an image is used for the tab, the width/height must be specified in the JS(X).
    return (
		<img src="menutab.png" width="32" height="32"/>
        );
    },

    renderContents: function () {
    return (
        <div>
			<h3>Slidepanel's contents</h3>
			<h4>Click or drag the tab</h4>
			<li>Menu item 1</li>
			<li>Menu item 2</li>
			<li>Menu item 3</li>
			<li>Menu item 4</li>
			<li>Menu item 5</li>
        </div>
        );
    },

    render: function () {
    return (
		<div>
			<div style={ {padding: '40px'} }>
				<h1>Left Slidepanel example</h1>
				In this example, the slidepanel starts opened along the left. Click or drag the tab (hamburger icon) to open/close it. The top of the tab sits 5% below the top of the viewport. The tab style could alternatively be set via CSS using the tabClass prop instead of tabStyle.<br/><br/>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/>
			</div>

			<ReactSlidepanel ref="slidepanel" panelPosition="left" defaultWidth={300} minWidth={200} startMinimized={false}
						tab={this.renderTab()}
						tabStyle={ {top: '5%'} }
						contents={this.renderContents()}
						panelContentsStyle={ {backgroundColor: 'lightgrey', opacity: '0.9'} } />
		</div>
		);
    }
});