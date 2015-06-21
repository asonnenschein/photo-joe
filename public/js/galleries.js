var Galleries = React.createClass({
  render: function () {
    return (
      <div className="content-container pure-g">
        <div className="pure-u-1 pure-u-md-1-1">
          <div className="header">
            <h1>Galleries</h1>
            <h2>Coming soon!</h2>
          </div>
        </div>
      </div>
    );
  }
});

React.render(
  <Galleries />,
  document.getElementById('content')
);