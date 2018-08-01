import {SpriteMaterial, SpriteMaterialParameters} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {MaterialDescriptorBase} from "./material";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      spriteMaterial: IThreeElementPropsBase<SpriteMaterial> & SpriteMaterialParameters;
    }
  }
}

class SpriteMaterialDescriptor extends MaterialDescriptorBase<SpriteMaterialParameters, SpriteMaterial> {

  public createInstance(props: SpriteMaterialParameters) {
    return new SpriteMaterial(props);
  }
}

export default SpriteMaterialDescriptor;
