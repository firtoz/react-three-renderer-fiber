import {Camera} from "three";
import {IObject3DProps} from "./object3DBase";
import {IElement} from "./RefWrapper";

// tslint:disable-next-line no-empty-interface
export interface ICameraProps extends IObject3DProps {

}

export type CameraElementProps = IThreeElementPropsBase<Camera> & ICameraProps;

export type CameraElement = IElement<Camera, CameraElementProps>;
