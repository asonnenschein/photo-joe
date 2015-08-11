var About = React.createClass({displayName: "About",
  render: function () {
    return (
      React.createElement("div", {className: "content-container pure-g"}, 
        React.createElement("div", {className: "pure-u-1 pure-u-md-1-1"}, 
          React.createElement("div", {className: "header"}, 
            React.createElement("h1", null, "About")
          )
        ), 
        React.createElement("div", {className: "pure-u-1 pure-u-md-1-1"}, 
          React.createElement("p", null, 
            "Joseph Sonnenschein is a photographer based out of the greater" + ' ' +
            "New York City metropolitan area.  He specializes in animal" + ' ' +
            "portraits and architectural photography."
          )
        )
      )
    );
  }
});