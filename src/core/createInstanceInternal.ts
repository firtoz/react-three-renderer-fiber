import * as THREE from 'three';

interface R3RElementCreator<TProps, TType> {
  createInstance(props: TProps, rootContainerInstance: HTMLCanvasElement): TType;
}

class WebGLRendererCreator implements R3RElementCreator<THREE.WebGLRendererParameters, THREE.WebGLRenderer> {
  createInstance(props: THREE.WebGLRendererParameters, rootContainerInstance: HTMLCanvasElement): THREE.WebGLRenderer {
    return new THREE.WebGLRenderer({
      canvas: rootContainerInstance,
    });
  }
}

export default function createInstanceInternal(type: string, createdInstance: any, rootContainerInstance: HTMLCanvasElement, props: any) {
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
