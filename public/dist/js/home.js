var HomeImageItem = React.createClass({displayName: "HomeImageItem",
  render: function () {
    return (
      React.createElement("div", {className: "pure-u-1-3 pure-u-lg-1-5"}, 
        React.createElement("a", {href: this.props.filepath}, 
          React.createElement("img", {className: "pure-img", src: this.props.thumbpath})
        )
      )
    );
  }
});

var Home = React.createClass({displayName: "Home",
  loadImagesFromServer: function () {
    $.ajax({
      url: this.props.source,
      type: 'GET',
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.source, status, error.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    this.props.source = "/submissions/all/files/all/";
    return {data: []};
  },
  componentDidMount: function () {
    this.loadImagesFromServer();
  },
  generateImageItem: function (image) {
    return React.createElement(HomeImageItem, {thumbpath: image.submissionThumbnail.directory, 
      filepath: "/images/" + image.name})
  },
  render: function () {
    var images = this.state.data.map(this.generateImageItem);
    return (
      React.createElement("div", {className: "content-container pure-g"}, 
        React.createElement("div", {className: "pure-u-1 pure-u-md-1-1"}, 
          React.createElement("div", {className: "header"}
          )
        ), 
        React.createElement("div", {className: "pure-u-1-1 pure-u-lg-1-1"}, 
          images
        )
      )
    );
  }
});
