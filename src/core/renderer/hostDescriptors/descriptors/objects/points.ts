import {
  Geometry,
  Material,
  MaterialParameters,
  Points,
} from "three";

import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase, IObject3DProps} from "../../common/object3DBase";
import {IRenderableProp, RefWrapper, SimplePropertyWrapper} from "../../common/RefWrapper";
import {IGeometryElementProps} from "./mesh";

export interface IPointsProps extends IObject3DProps {
  geometry?: IRenderableProp<Geometry, IGeometryElementProps>;
  material?: IRenderableProp<Material, MaterialParameters>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      points: IThreeElementPropsBase<Points> & IPointsProps;
    }
  }
}

export type PointsMaterialType = Material;

export type PointsChildType = Geometry |
  PointsMaterialType;

class PointsDescriptor extends Object3DDescriptorBase<IPointsProps, Points, PointsChildType> {
  constructor() {
    super();

    new RefWrapper(["material", "geometry"], this)
      .wrapProperties([
          new SimplePropertyWrapper("material", [
            Material,
          ]),
          new SimplePropertyWrapper("geometry", [
            Geometry,
          ]),
        ],
      );
  }

  public createInstance(props: IPointsProps) {
    let geometry: Geometry | undefined;
    let material: any;

    if (props.geometry instanceof Geometry) {
      geometry = props.geometry;
    }

    if (props.material instanceof Material) {
      material = props.material;
    }

    return new Points(geometry, material);
  }

  public appendInitialChild(instance: Points, child: PointsChildType): void {
    console.log("append initial", child);
    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (child instanceof Material) {
      instance.material = child;
    } else {
      super.appendInitialChild(instance, child);
    }
  }

  public appendChild(instance: Points, child: PointsChildType): void {
    console.log("append", child);

    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (child instanceof Material) {
      instance.material = child;
    } else {
      super.appendChild(instance, child);
    }
  }

  public insertBefore(instance: Points, child: PointsChildType, before: any): void {

    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (child instanceof Material) {
      instance.material = child;
    } else {
      super.insertBefore(instance, child, before);
    }
  }

  public removeChild(instance: Points, child: PointsChildType): void {
    if (child instanceof Geometry) {
      instance.geometry = null as any;
    } else if (child instanceof Material) {
      instance.material = null as any;
    } else {
      super.removeChild(instance, child);
      // throw new Error('cannot remove ' + (child as any)[r3rFiberSymbol].type + ' as a childInstance from mesh');
    }
  }
}

export default PointsDescriptor;
