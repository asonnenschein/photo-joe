var HomeImageItem = React.createClass({
  render: function () {
    return (
      <div className="pure-u-1-3 pure-u-lg-1-5">
        <a href={this.props.filepath}>
          <img className="pure-img" src={this.props.thumbpath} />
        </a>
      </div>
    );
  }
});

var Home = React.createClass({
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
    return <HomeImageItem thumbpath={image.submissionThumbnail.directory}
      filepath={"/images/" + image.name} />
  },
  render: function () {
    var images = this.state.data.map(this.generateImageItem);
    return (
      <div className="content-container pure-g">
        <div className="pure-u-1 pure-u-md-1-1">
          <div className="header">
          </div>
        </div>
        <div className="pure-u-1-1 pure-u-lg-1-1">
          {images}
        </div>
      </div>
    );
  }
});
