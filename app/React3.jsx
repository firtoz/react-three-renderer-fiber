import React, { PureComponent } from 'react';
import ReactPortal from 'react-dom/lib/ReactPortal';

import R3R from '../core/index';

class React3 extends PureComponent {
  constructor(...args) {
    super(...args);

    this.div = null;
    // const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //
    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // // document.body.appendChild( renderer.domElement );
    //
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    //
    // camera.position.z = 5;
    //
    // renderer.render(scene, camera);

    // this.createdCanvas = renderer.domElement; // document.createElement('canvas');
    this.createdCanvas = document.createElement('canvas');
    // this.createdCanvas.setAttribute("width")
    // this.container = document.createElement('div');

    this.state = {
      mounted: false,
    };

    // this.implementation = function () {
    //   debugger;
    //
    //   console.log('impl?', arguments);
    // };

    // this.something = function () {
    //   console.log('sooomethiiiing');
    // };

    this.renderCount = 0;

    this.canvasContainerInfo = {
      // test: "test",
      tagName: 'r3r3r3r',
      // react3Component,
      // ReactDOM,
      appendChild: (child) => {
        // console.log('append that child');
        // debugger;

        // const internalInstance = getInstanceFromNode(child);

        // ReactDOM.render(<div>test</div>, child);
        //
        R3R.rendererInternal.performWithPriority(1, () => {
          R3R.render(this.props.children, this.createdCanvas);
        });

        // this.container = child;
      },
      removeChild: (child) => {
        // console.log('remove that child');
      },
      ownerDocument: {
        createElement: (name) => {
          // debugger;

          // console.log('proxy create element', name);

          if (name === 'react-three-renderer-proxy') {
            return {
              setAttribute: (name, value) => {
                // debugger;

                // console.log('try a render here?');


              }
            };
          }

          const createdElement = document.createElement(name);

          createdElement.appendChild = (child) => {
            // debugger;

            // console.log('fake append child');


            // R3R.rendererInternal.performWithPriority(1, () => {
            //   R3R.render(this.props.children, this.createdCanvas, () => {
            //     console.log('wut');
            //
            //     // R3R.render(<canvas b="c" />, document.getElementById('r3r-root'));
            //   });
            // });
          };

          createdElement.removeChild = () => {
            // console.log('fake remove child');
          };

          return createdElement;
        }
      },
    };
  }


  componentDidMount() {
    this.div.appendChild(this.createdCanvas);
  }

  divRef = (div) => {
    this.div = div;
  };

  render() {
    this.renderCount++;

    return <div ref={this.divRef}>{
      ReactPortal.createPortal(
        <react-three-renderer-proxy key={this.renderCount} />,
        this.canvasContainerInfo,
        null,
      )
    }</div>
  }
}

export default React3;
