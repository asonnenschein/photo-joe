var LoginForm = React.createClass({
  render: function () {
    return (
      <div className="login">
        <form action="/users/login/" method="post"
          className="pure-form pure-form-stacked">
          <fieldset>
            <legend>Login To Account</legend>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" type="text"
              placeholder="Username" />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password"
              placeholder="Password" />
            <button type="submit" className="pure-button pure-button-primary">
              Login
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
});

var Register = React.createClass({
  render: function () {
    return (
      <div className="content-container pure-g">
        <div className="pure-u-1 pure-u-md-1-1">
          <div className="form-container">
            <div className="login-form">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

React.render(
  <Register />,
  document.getElementById('content')
);