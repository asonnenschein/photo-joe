var ImageItem = React.createClass({
  render: function () {
    return (
      <div className="normalize-image pure-1-1 pure-u-md-1-1">
        <img className="pure-img" src={this.props.path} />
      </div>
    );
  }
});

var Images = React.createClass({
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
    return {data: []};
  },
  componentDidMount: function () {
    this.loadImagesFromServer();
  },
  generateImageItem: function (image) {
    return <ImageItem path={"/images/" + image.name} />
  },
  render: function () {
    var images = this.state.data.map(this.generateImageItem);
    return (
      <div className="content-container pure-g">
        <div className="pure-u-1 pure-u-md-1-1">
          <div className="header">
            <h1>Joseph Sonnenschein Photography</h1>
            <h2>New York City &#8226; New England</h2>
          </div>
        </div>
        <div className="pure-u-1 pure-u-md-1-1">
          {images}
        </div>
      </div>
    );
  }
});

React.render(
  <Images source="/submissions/dd2c4908-4389-42d4-841d-1fb4f320c77c/all/" />,
  document.getElementById('content')
);