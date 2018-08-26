import * as THREE from "three";
import {MeshLambertMaterial} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {MaterialDescriptorBase} from "./material";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLambertMaterial: IThreeElementPropsBase<THREE.MeshLambertMaterial> & THREE.MeshLambertMaterialParameters;
    }
  }
}

class MeshLambertMaterialDescriptor extends MaterialDescriptorBase<THREE.MeshLambertMaterialParameters,
  MeshLambertMaterial> {
  constructor() {
    super();

    this.hasMap();
  }

  public createInstance(props: THREE.MeshLambertMaterialParameters) {
    const propsClone = Object.assign({}, props);

    delete (propsClone as any).children;

    return new THREE.MeshLambertMaterial(propsClone);
  }
}

export default MeshLambertMaterialDescriptor;
