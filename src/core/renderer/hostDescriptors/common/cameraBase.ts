import {Camera} from "three";
import {ITestProps} from "../descriptors/objects/mesh";
import {IThreeElementPropsBase} from "./IReactThreeRendererElement";
import {IObject3DProps} from "./object3DBase";
import {IElement} from "./RefWrapper";

// tslint:disable-next-line no-empty-interface
export interface ICameraProps extends IObject3DProps, ITestProps<Camera> {

}

export type CameraElementProps = IThreeElementPropsBase<Camera> & ICameraProps;

export type CameraElement = IElement<Camera, CameraElementProps>;

export const cameraEventsSymbol: any = Symbol("camera-events");
export const cameraEventProjectionMatrixUpdated = "camera-event-projection-matrix-updated";
