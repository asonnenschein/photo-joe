var About = React.createClass({
  render: function () {
    return (
      <div className="content-container pure-g">
        <div className="pure-u-1 pure-u-md-1-1">
          <div className="header">
            <h1>About</h1>
          </div>
        </div>
        <div className="pure-u-1 pure-u-md-1-1">
          <p>
            Joseph Sonnenschein is a photographer based out of the greater
            New York City metropolitan area.  He specializes in animal
            portraits and architectural photography.
          </p>
        </div>
      </div>
    );
  }
});

React.render(
  <About />,
  document.getElementById("content")
);