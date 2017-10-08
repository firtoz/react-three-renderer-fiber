import * as THREE from "three";
import {BoxBufferGeometry, BoxGeometry, Mesh} from "three";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

interface IBoxGeometryProps {
  width: number;
  height: number;
  depth: number;
  widthSegments?: number;
  heightSegments?: number;
  depthSegments?: number;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      boxGeometry: IReactThreeRendererElement<THREE.BoxGeometry> & IBoxGeometryProps;
    }
  }
}

class BoxGeometryDescriptor extends ReactThreeRendererDescriptor<IBoxGeometryProps,
  BoxGeometry,
  Mesh> {
  constructor() {
    super();

    // noinspection JSUnusedLocalSymbols
    this.hasProp<number>("width", (instance: BoxGeometry,
                                   newValue: number,
                                   oldProps: IBoxGeometryProps,
                                   newProps: IBoxGeometryProps): void => {
      // TODO remount :)
      throw new Error("Method not implemented.");
    }, false);

    // noinspection JSUnusedLocalSymbols
    this.hasProp<number>("height", (instance: BoxGeometry,
                                    newValue: number,
                                    oldProps: IBoxGeometryProps,
                                    newProps: IBoxGeometryProps): void => {
      throw new Error("Method not implemented.");
    }, false);

    // noinspection JSUnusedLocalSymbols
    this.hasProp<number>("depth", (instance: BoxGeometry,
                                   newValue: number,
                                   oldProps: IBoxGeometryProps,
                                   newProps: IBoxGeometryProps): void => {
      throw new Error("Method not implemented.");
    }, false);

    // noinspection JSUnusedLocalSymbols
    this.hasProp<number>("widthSegments",
      (instance: BoxGeometry,
       newValue: number,
       oldProps: IBoxGeometryProps,
       newProps: IBoxGeometryProps): void => {
        throw new Error("Method not implemented.");
      }, false);

    // noinspection JSUnusedLocalSymbols
    this.hasProp<number>("heightSegments", (instance: BoxGeometry,
                                            newValue: number,
                                            oldProps: IBoxGeometryProps,
                                            newProps: IBoxGeometryProps): void => {
      throw new Error("Method not implemented.");
    }, false);
  }

  public createInstance(props: IBoxGeometryProps) {
    const {
      width,
      height,
      depth,
      widthSegments,
      heightSegments,
      depthSegments,
    } = props;

    return new BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
  }

  protected addedToParent(instance: BoxGeometry, container: Mesh): void {
    // super.addedToParent(instance, container);
  }
}

export default new BoxGeometryDescriptor();
