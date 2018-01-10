import {LightShadow, Matrix4, PerspectiveCamera, Vector2} from "three";
import {PointLight, PointLightShadow} from "three";
import {IThreeElementPropsBase} from "../../../../common/IReactThreeRendererElement";
import ReactThreeRendererDescriptor from "../../../../common/ReactThreeRendererDescriptor";
import {IRenderableProp, RefWrapper, SimplePropertyWrapper} from "../../../../common/RefWrapper";
import {IPerspectiveCameraProps} from "../../perspectiveCamera";

export interface IPointLightShadowProps {
  camera: IRenderableProp<PerspectiveCamera, IPerspectiveCameraProps>;
  bias: any;
  map: any;
  mapSize: Vector2;
  matrix: Matrix4;
  radius: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      pointLightShadow: IThreeElementPropsBase<LightShadow> & IPointLightShadowProps;
    }
  }
}

const defaultPointLightCamera = new PointLight().shadow.camera;

class PointLightShadowDescriptor extends ReactThreeRendererDescriptor<IPointLightShadowProps,
  LightShadow,
  PointLight> {
  constructor() {
    super();

    new RefWrapper(["camera"], this).wrapProperty(new SimplePropertyWrapper("camera", [PerspectiveCamera]));
  }

  public createInstance(props: IPointLightShadowProps) {
    if (props.camera == null || !(props.camera instanceof PerspectiveCamera)) {
      return new PointLightShadow(new PerspectiveCamera().copy(defaultPointLightCamera));
    }

    return new PointLightShadow(props.camera);
  }

  public willBeAddedToParent(instance: PointLightShadow, container: PointLight): void {
    container.shadow = instance;
  }
}

export default PointLightShadowDescriptor;
