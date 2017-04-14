import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import R3R from '../core/index';
import React3 from './React3';

// import ReactFiber from 'react-dom/lib/ReactFiber';
// // import ReactElementSymbol from 'react-dom/lib/ReactElementSymbol';
//
// function React3Type() {
//   debugger;
//
//   console.log("whaa");
// }

// const FakeFiber = ReactFiber.createHostRootFiber();


class TestClass3D extends PureComponent {
  componentWillUpdate() {
    console.log('>>>> TestClass3D will update');
  }

  componentDidUpdate() {
    console.log('>>>> TestClass3D did update');
  }

  componentWillMount() {
    console.log('>>>> TestClass3D will mount');
  }

  componentDidMount() {
    console.log('>>>> TestClass3D did mount');
  }

  render() {
    return <object3D name="testclass3d" />;
  }
}

class React2D extends PureComponent {
  componentWillUpdate() {
    console.log('>>>> React2D will update');
  }

  componentDidUpdate() {
    console.log('>>>> React2D did update');
  }

  componentWillMount() {
    console.log('>>>> React2D will mount');
  }

  componentDidMount() {
    console.log('>>>> React2D did mount');
  }

  render() {
    return <div name="react2d">{this.props.children}</div>;
  }
}

class Children extends PureComponent {
  componentWillUpdate() {
    console.log('>>>> Children will update');
  }

  componentDidUpdate() {
    console.log('>>>> Children did update');
  }

  componentWillMount() {
    console.log('>>>> Children will mount');
  }

  componentDidMount() {
    console.log('>>>> Children did mount');
  }

  render() {
    return this.props.children;
  }
}

class TestClass extends PureComponent {
  componentWillUpdate() {
    console.log('>>>> TestClass will update');
  }

  componentDidUpdate() {
    console.log('>>>> TestClass did update');
  }

  componentWillMount() {
    console.log('>>>> TestClass will mount');
  }

  componentDidMount() {
    console.log('>>>> TestClass did mount');
  }

  render() {
    return <div name="testclass">this be a test</div>;
  }
}

console.log('pre render 1');

ReactDOM.render(
  <div>
    <React2D>
      <div>
        <span />
        <TestClass />
      </div>
    </React2D>
  </div>,
  document.getElementById('root'),
  () => {
    console.log('post render callback 1');

    ReactDOM.render(
      <div>
        <React2D foo="bar">
          <div>
            <span />
            <TestClass baz="boo" />
          </div>
        </React2D>
      </div>,
      document.getElementById('root'),
      () => {
        console.log('post render callback 2');

        R3R.render(<Children>
          <scene>
            <object3D />
            <TestClass3D />
          </scene>
        </Children>, document.getElementById("canvas"), () => {
          console.log('post render callback 3');

          R3R.render(<Children foo="bar">
            <scene>
              <object3D />
              <TestClass3D baz="boo" />
            </scene>
          </Children>, document.getElementById("canvas"), () => {
            console.log('post render callback 4');

            ReactDOM.render(
              <div>
              </div>,
              document.getElementById('root'),
              () => {
                console.log('post render callback 5');

                ReactDOM.render(
                  <div>
                    <React3>
                      <Children yarr="garr">
                        <scene>
                          <object3D>
                            <TestClass3D />
                          </object3D>
                        </scene>
                      </Children>
                    </React3>
                  </div>,
                  document.getElementById('root'),
                  () => {
                    console.log('post render callback 6');

                    ReactDOM.render(
                      <div>
                        <React3>
                          <Children foo="bar" yarr="garr">
                            <scene>
                              <object3D>
                                <TestClass3D bar="baz" />
                              </object3D>
                            </scene>
                          </Children>
                        </React3>
                      </div>,
                      document.getElementById('root'),
                      () => {
                        console.log('post render callback 7');
                        console.log('post render callback 7 fin');
                      });
                    console.log('post render callback 6 fin');
                  });
                console.log('post render callback 5 fin');
              });
            console.log('post render callback 4 fin');
          });

          console.log('post render callback 3 fin');
        });

        console.log('post render callback 2 fin');
      }
    );

    console.log('post render callback 1 fin');
  }
);

console.log('pre render 1 fin');


//
// R3R.render(<canvas a="b" />, document.getElementById('r3r-root'), () => {
//   console.log('wut');
//
//   R3R.render(<canvas b="c" />, document.getElementById('r3r-root'));
// });
