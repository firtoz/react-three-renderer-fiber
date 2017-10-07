import * as THREE from "three";
import {BoxGeometry, Mesh} from "three";
import {PropertyDescriptorBase} from "../common/IPropertyDescriptor";
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

    this.hasProp<number>("width",
      class extends PropertyDescriptorBase<IBoxGeometryProps, BoxGeometry, number> {
        // noinspection JSUnusedLocalSymbols
        public update(instance: BoxGeometry,
                      newValue: number,
                      oldProps: IBoxGeometryProps,
                      newProps: IBoxGeometryProps): void {
          // TODO remount :)
          throw new Error("Method not implemented.");
        }
      }, false);

    this.hasProp<number>("height",
      class extends PropertyDescriptorBase<IBoxGeometryProps, BoxGeometry, number> {
        // noinspection JSUnusedLocalSymbols
        public update(instance: BoxGeometry,
                      newValue: number,
                      oldProps: IBoxGeometryProps,
                      newProps: IBoxGeometryProps): void {
          throw new Error("Method not implemented.");
        }
      }, false);

    this.hasProp<number>("depth",
      class extends PropertyDescriptorBase<IBoxGeometryProps, BoxGeometry, number> {
        // noinspection JSUnusedLocalSymbols
        public update(instance: BoxGeometry,
                      newValue: number,
                      oldProps: IBoxGeometryProps,
                      newProps: IBoxGeometryProps): void {
          throw new Error("Method not implemented.");
        }
      }, false);

    this.hasProp<number>("widthSegments",
      class extends PropertyDescriptorBase<IBoxGeometryProps, BoxGeometry, number> {
        // noinspection JSUnusedLocalSymbols
        public update(instance: BoxGeometry,
                      newValue: number,
                      oldProps: IBoxGeometryProps,
                      newProps: IBoxGeometryProps): void {
          throw new Error("Method not implemented.");
        }
      }, false);

    this.hasProp<number>("heightSegments",
      class extends PropertyDescriptorBase<IBoxGeometryProps, BoxGeometry, number> {
        // noinspection JSUnusedLocalSymbols
        public update(instance: BoxGeometry,
                      newValue: number,
                      oldProps: IBoxGeometryProps,
                      newProps: IBoxGeometryProps): void {
          throw new Error("Method not implemented.");
        }
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

  public appendToContainer(instance: BoxGeometry, container: Mesh): void {
    throw new Error("the world is not ready");
  }
}

export default new BoxGeometryDescriptor();
