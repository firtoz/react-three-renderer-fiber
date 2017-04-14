import * as THREE from 'three';

export default function createInstanceInternal(type, createdInstance, rootContainerInstance, props) {
  switch (type) {
    default:
      throw new Error('cannot create this type yet: ' + type);
    case 'webglRenderer': {
      createdInstance = new THREE.WebGLRenderer({
        canvas: rootContainerInstance,
      });
      break;
    }
    case 'scene':
      createdInstance = new THREE.Scene();

      break;
    case 'mesh':
      createdInstance = new THREE.Mesh();
      break;
    case 'meshBasicMaterial':
      const {
        color,
      } = props;

      createdInstance = new THREE.MeshBasicMaterial({
        color,
      });

      break;
    case 'boxGeometry':
      const {
        width,
        height,
        depth,
      } = props;

      createdInstance = new THREE.BoxGeometry(width, height, depth);

      break;
    case 'perspectiveCamera':
      const {
        fov,
        aspect,
        near,
        far,
      } = props;

      createdInstance = new THREE.PerspectiveCamera(
        fov,
        aspect,
        near,
        far
      );

      break;
  }
  return createdInstance;
};
