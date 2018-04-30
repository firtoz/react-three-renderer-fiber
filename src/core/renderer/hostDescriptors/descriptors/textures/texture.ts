import {MeshBasicMaterial, SpriteMaterial, Texture, TextureLoader} from "three";
import {MeshPhongMaterial, MeshStandardMaterial, PointsMaterial} from "three/three-core";
import ReactThreeRendererDescriptor from "../../common/ReactThreeRendererDescriptor";

export interface ITextureProps {
  url: string;
}

export type TTextureParents =
  MeshBasicMaterial
  | MeshBasicMaterial
  | MeshStandardMaterial
  | MeshPhongMaterial
  | PointsMaterial
  | SpriteMaterial;

class TextureDescriptor extends ReactThreeRendererDescriptor<ITextureProps, Texture, TTextureParents> {
  public createInstance(props: ITextureProps, rootContainerInstance: any): Texture {
    return new TextureLoader().load(props.url);
  }

  public willBeAddedToParent(instance: Texture, parent: TTextureParents): void {
    parent.map = instance;
  }

  public willBeRemovedFromParent(instance: Texture, parent: TTextureParents): void {
    if (parent.map === instance) {
      // using "as any" here because it's assuming the map cannot be set to null, but it actually can
      (parent as any).map = null;
    }
  }
}

export default TextureDescriptor;
