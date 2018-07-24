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

  public createInstance(props: THREE.MeshLambertMaterialParameters) {
    delete (props as any).children;

    return new THREE.MeshLambertMaterial(props);
  }
}

export default MeshLambertMaterialDescriptor;
