var UserWelcome = React.createClass({
  render: function () {
    return (
      <div className="user-welcome">
        <h5>Welcome back, {this.props.username}</h5>
      </div>
    );
  }
});

var User = React.createClass({
  generateWelcome: function (item) {
    return <UserWelcome username={item.username} />
  },
  render: function () {
    console.log(this.props.usersData);
    var welcome = this.props.usersData.map(this.generateWelcome);
    return (
      <div className="content-container pure-g">
        <div className="pure-u-1 pure-u-md-1-1">
          {welcome}
        </div>
      </div>
    );
  }
});

React.render(
  <User usersData={usersData}/>,
  document.getElementById('content')
);