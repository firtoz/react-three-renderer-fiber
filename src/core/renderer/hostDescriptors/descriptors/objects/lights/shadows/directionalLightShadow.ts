import {LightShadow, Matrix4, OrthographicCamera, Vector2} from "three";
import {DirectionalLight, DirectionalLightShadow} from "three";
import {IThreeElementPropsBase} from "../../../../common/IReactThreeRendererElement";
import ReactThreeRendererDescriptor from "../../../../common/ReactThreeRendererDescriptor";
import {IRenderableProp, PropertyWrapper, RefWrapper, SimplePropertyWrapper} from "../../../../common/RefWrapper";
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

export const defaultDirectionalLightCamera = new DirectionalLight().shadow.camera;

// TODO LightShadow base descriptor
// TODO bias/map/mapsize/matrix/radius props
class DirectionalLightShadowDescriptor extends ReactThreeRendererDescriptor<IDirectionalLightShadowProps,
  LightShadow,
  DirectionalLight,
  OrthographicCamera> {
  constructor() {
    super();

    new RefWrapper(["camera"], this)
      .wrapProperty(new PropertyWrapper("camera",
        [OrthographicCamera], (instance: DirectionalLightShadow, newValue) => {
          instance.camera.copy(newValue);
        }).OnRender((instance, prop) => {
        if (instance !== null) {
          instance.camera.copy(prop);
        }
      }));

    this.hasProp<Vector2>("mapSize",
      (instance, newValue) => {
        instance.mapSize.copy(newValue);
      });
  }

  public createInstance(props: IDirectionalLightShadowProps) {
    if (props.camera == null || !(props.camera instanceof OrthographicCamera)) {
      return new DirectionalLightShadow(new OrthographicCamera(0, 0, 0, 0)
        .copy(defaultDirectionalLightCamera));
    }

    return new DirectionalLightShadow(props.camera);
  }

  public willBeAddedToParent(instance: DirectionalLightShadow, container: DirectionalLight): void {
    console.log("dir light shadow being added to parent");
    container.shadow = instance;
  }

  public appendInitialChild(instance: LightShadow, child: OrthographicCamera): void {
    console.log("?!", child);
    instance.camera.copy(child);
  }

  public appendChild(instance: DirectionalLightShadow, child: OrthographicCamera): void {
    console.log("?!", child);
    instance.camera.copy(child);
  }

  public removeChild(instance: DirectionalLightShadow, child: OrthographicCamera): void {
    if (instance.camera === child) {
      instance.camera.copy(defaultDirectionalLightCamera);
    }
  }
}

export default DirectionalLightShadowDescriptor;
