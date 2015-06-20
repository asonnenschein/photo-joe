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
  generateItem: function (item) {
    return <NavBarItem text={item.text} url={item.url} />
  },
  render: function () {
    var items = this.props.data.map(this.generateItem);
    return (
      <div className="custom-wrapper pure-g">
        <div className="pure-u-1 pure-u-md-1-2">
          <div className="pure-menu">
            <a href="#" className="pure-menu-heading custom-brand">
              Joseph Sonnenschein Photography
            </a>
            <a href="#" className="custom-toggle" id="toggle">
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
    );
  }
});

var data = [
  {"text": "Home", "url": "/"},
  {"text": "Galleries", "url": "/galleries"},
  {"text": "About", "url": "/about"},
];

React.render(
  <NavBar data={data}/>,
  document.getElementById('header'),
  function () {
    (function (window, document) {
      var menu = document.getElementById('header'),
          WINDOW_CHANGE_EVENT = ('onorientationchange' in window) ? 'orientationchange':'resize';

      function toggleHorizontal() {
          [].forEach.call(
              document.getElementById('header').querySelectorAll('.custom-can-transform'),
              function(el){
                  el.classList.toggle('pure-menu-horizontal');
              }
          );
      };

      function toggleMenu() {
          // set timeout so that the panel has a chance to roll up
          // before the menu switches states
          if (menu.classList.contains('open')) {
              setTimeout(toggleHorizontal, 500);
          }
          else {
              toggleHorizontal();
          }
          menu.classList.toggle('open');
          document.getElementById('toggle').classList.toggle('x');
      };

      function closeMenu() {
          if (menu.classList.contains('open')) {
              toggleMenu();
          }
      }

      document.getElementById('toggle').addEventListener('click', function (e) {
          toggleMenu();
      });

      window.addEventListener(WINDOW_CHANGE_EVENT, closeMenu);
    })(this, this.document);
  }
);