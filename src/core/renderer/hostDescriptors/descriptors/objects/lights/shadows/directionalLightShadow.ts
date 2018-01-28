import {LightShadow, Matrix4, OrthographicCamera, Vector2} from "three";
import {DirectionalLight, DirectionalLightShadow} from "three";
import {IThreeElementPropsBase} from "../../../../common/IReactThreeRendererElement";
import ReactThreeRendererDescriptor from "../../../../common/ReactThreeRendererDescriptor";
import {IRenderableProp, RefWrapper, SimplePropertyWrapper} from "../../../../common/RefWrapper";
import {IOrthographicCameraProps} from "../../orthographicCamera";

export interface IDirectionalLightShadowProps {
  camera: IRenderableProp<OrthographicCamera, IOrthographicCameraProps>;
  bias: any;
  map: any;
  mapSize: Vector2;
  matrix: Matrix4;
  radius: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      directionalLightShadow: IThreeElementPropsBase<LightShadow> & IDirectionalLightShadowProps;
    }
  }
}

const defaultDirectionalLightCamera = new DirectionalLight().shadow.camera;

// TODO LightShadow base descriptor
// TODO bias/map/mapsize/matrix/radius props
class DirectionalLightShadowDescriptor extends ReactThreeRendererDescriptor<IDirectionalLightShadowProps,
  LightShadow,
  DirectionalLight> {
  constructor() {
    super();

    new RefWrapper(["camera"], this)
      .wrapProperty(new SimplePropertyWrapper("camera", [OrthographicCamera]));
  }

  public createInstance(props: IDirectionalLightShadowProps) {
    if (props.camera == null || !(props.camera instanceof OrthographicCamera)) {
      return new DirectionalLightShadow(new OrthographicCamera(0, 0, 0, 0)
        .copy(defaultDirectionalLightCamera));
    }

    return new DirectionalLightShadow(props.camera);
  }

  public willBeAddedToParent(instance: DirectionalLightShadow, container: DirectionalLight): void {
    container.shadow = instance;
  }
}

export default DirectionalLightShadowDescriptor;
