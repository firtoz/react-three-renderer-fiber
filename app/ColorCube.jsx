import React, { PureComponent } from 'react';

// fun to change the color state in React Devtools ;)
export default class ColorCube extends PureComponent {
  constructor(...args) {
    super(...args);

    this.state = {
      color: '#00FF00',
    };
  }

  render() {
    const {
      color,
    } = this.state;

    const {
      rotation
    } = this.props;

    return (<mesh
      rotation={rotation}
    >
      <boxGeometry
        width={1}
        height={1}
        depth={1}
      />
      <meshBasicMaterial
        color={color}
      />
    </mesh>);
  }
}
