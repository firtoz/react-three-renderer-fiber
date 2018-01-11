import {OrthographicCamera} from "three";
import {CameraElementProps, ICameraProps} from "../../common/cameraBase";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase} from "../../common/object3DBase";

export interface IOrthographicCameraProps extends ICameraProps {
  zoom?: number;

  left: number;
  right: number;
  top: number;
  bottom: number;

  near?: number;
  far?: number;
}

export type OrthographicCameraElement =
  CameraElementProps
  & IThreeElementPropsBase<OrthographicCamera>
  & IOrthographicCameraProps;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      orthographicCamera: OrthographicCameraElement;
    }
  }
}

const defaultCamera = new OrthographicCamera(0, 0, 0, 0);

class OrthographicCameraDescriptor extends Object3DDescriptorBase<IOrthographicCameraProps,
  OrthographicCamera> {
  public constructor() {
    super();

    // TODO emit update event for properties to be used by camera helpers
    // TODO call update projection matrix only once, use property groups

    [
      "zoom",
      "left",
      "right",
      "top",
      "bottom",
      "near",
      "far",
    ].forEach((propName) => {
      this.hasProp(propName, (instance: OrthographicCamera, newValue: number) => {
        (instance as any)[propName] = newValue;
        instance.updateProjectionMatrix();
      }).withDefault((defaultCamera as any)[propName]);
    });
  }

  public createInstance(props: IOrthographicCameraProps) {
    const {
      left,
      right,
      top,
      bottom,
      near,
      far,
    } = props;

    return new OrthographicCamera(left, right, top, bottom, near, far);
  }
}

export default OrthographicCameraDescriptor;
