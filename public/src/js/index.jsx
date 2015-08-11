var NavBarLink = React.createClass({
  render: function () {
    return (
      <a href={this.props.url} className="pure-menu-link">{this.props.text}</a>
    );
  }
});

var NavBarItem = React.createClass({
  generateLink: function () {
    return <NavBarLink url={this.props.url} text={this.props.text} />;
  },
  render: function () {
    var content = this.generateLink();
    return (<li className="pure-menu-item">{content}</li>);
  }
});

var NavBar = React.createClass({
  getInitialState: function () {
    return {};
  },
  toggleHorizontal: function () {
    [].forEach.call(
      React.findDOMNode(this.refs.headerNav)
        .querySelectorAll('.custom-can-transform'),
      function (element) {
        element.classList.toggle('pure-menu-horizontal');
      }
    );
  },
  toggleMenu: function () {
    var element = React.findDOMNode(this.refs.headerNav);
    if (element.classList.contains('open')) {
      setTimeout(this.toggleHorizontal, 500);
    }
    else {
      this.toggleHorizontal();
    }
    element.classList.toggle('open');
    React.findDOMNode(this.refs.toggle).classList.toggle('x');
  },
  closeMenu: function () {
    var element = React.findDOMNode(this.refs.headerNav);
    if (element.classList.contains('open')) {
      this.toggleMenu();
    }
  },
  componentDidMount: function() {
    var self = this
      , toggle = React.findDOMNode(this.refs.toggle)
    ;

    toggle.addEventListener('click', function (e) {
      self.toggleMenu();
    });

    window.addEventListener('resize', this.closeMenu);
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.closeMenu);
  },
  generateItem: function (item) {
    return <NavBarItem text={item.text} url={item.url} />
  },
  render: function () {
    var items = [
      {"text": "About", "url": "/about"},
      {"text": "Galleries", "url": "/galleries"}
    ].map(this.generateItem);
    return (
      <div className="navigation-wrapper" ref="headerNav">
        <div className="content-container pure-g">
          <div className="pure-u-1 pure-u-md-1-2">
            <div className="pure-menu">
              <a href="/" className="pure-menu-heading custom-brand">
                Josef Sonnenschein
              </a>
              <a href="#" className="custom-toggle" ref="toggle">
                <s className="bar"></s>
                <s className="bar"></s>
              </a>
            </div>
          </div>
          <div className="pure-u-1 pure-u-md-1-2">
            <div className="pure-menu pure-menu-horizontal custom-menu-3
              custom-can-transform">
              <ul className="pure-menu-list">
                {items}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var App = React.createClass({
  render: function () {
    var Child;
    switch (this.props.route) {
      case '':
        Child = Home;
        break;
      case 'home':
        Child = Home;
        break;
      case 'about':
        Child = About;
        break;
      default:
        Child = Home;
    }

    return (
      <div>
          <nav>
            <NavBar />
          </nav>
          <div className="content-wrapper">
            <Child />
          </div>
      </div>
    )
  }
});

function render () {
  var route = window.location.pathname.split('/').filter(Boolean)[0];
  React.render(<App route={route} />, document.body);
}

window.addEventListener('hashchange', render);
render();