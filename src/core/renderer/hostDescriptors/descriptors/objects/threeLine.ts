import {
  Geometry,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  MaterialParameters,
  ShaderMaterial,
} from "three";

import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase, IObject3DProps} from "../../common/object3DBase";
import {IRenderableProp, RefWrapper, SimplePropertyWrapper} from "../../common/RefWrapper";

// tslint:disable-next-line
export interface IGeometryElementProps {
}

export interface ILineProps extends IObject3DProps {
  geometry?: IRenderableProp<Geometry, IGeometryElementProps>;
  material?: IRenderableProp<LineDashedMaterial | LineBasicMaterial | ShaderMaterial, MaterialParameters>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      threeLine: IThreeElementPropsBase<Line> & ILineProps;
    }
  }
}

export type LineMaterialType = LineDashedMaterial |
  LineBasicMaterial |
  ShaderMaterial;

export type LineChildType = Geometry |
  LineMaterialType;

function isLineMaterial(material: any): boolean {
  return material !== undefined && (
    material instanceof LineDashedMaterial ||
    material instanceof LineBasicMaterial ||
    material instanceof ShaderMaterial
  );
}

class LineDescriptor extends Object3DDescriptorBase<ILineProps, Line, LineChildType> {
  constructor() {
    super();

    new RefWrapper(["material", "geometry"], this)
      .wrapProperties([
          new SimplePropertyWrapper("material", [
            LineDashedMaterial,
            LineBasicMaterial,
            ShaderMaterial,
          ]),
          new SimplePropertyWrapper("geometry", [
            Geometry,
          ]),
        ],
      );
  }

  public createInstance(props: ILineProps) {
    let geometry: Geometry | undefined;
    let material: any;

    if (props.geometry instanceof Geometry) {
      console.log("set prop geometry");
      geometry = props.geometry;
    }

    if (isLineMaterial(props.material)) {
      material = props.material;
    }

    return new Line(geometry, material);
  }

  public appendInitialChild(instance: Line, child: LineChildType): void {
    console.log("append initial", child);
    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (isLineMaterial(child)) {
      instance.material = child;
    } else {
      super.appendInitialChild(instance, child);
    }
  }

  public appendChild(instance: Line, child: LineChildType): void {
    console.log("append", child);

    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (isLineMaterial(child)) {
      instance.material = child;
    } else {
      super.appendChild(instance, child);
    }
  }

  public insertBefore(instance: Line, child: LineChildType, before: any): void {

    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (isLineMaterial(child)) {
      instance.material = child;
    } else {
      super.insertBefore(instance, child, before);
    }
  }

  public removeChild(instance: Line, child: LineChildType): void {
    if (child instanceof Geometry) {
      instance.geometry = null as any;
    } else if (isLineMaterial(child)) {
      instance.material = null as any;
    } else {
      super.removeChild(instance, child);
      // throw new Error('cannot remove ' + (child as any)[r3rFiberSymbol].type + ' as a childInstance from mesh');
    }
  }
}

export default LineDescriptor;
