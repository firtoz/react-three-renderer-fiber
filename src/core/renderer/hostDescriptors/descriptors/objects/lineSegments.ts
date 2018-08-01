import {
  BufferGeometry,
  Geometry,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  MaterialParameters,
  ShaderMaterial,
} from "three";

import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase, IObject3DProps} from "../../common/object3DBase";
import {IRenderableProp, RefWrapper, SimplePropertyWrapper} from "../../common/RefWrapper";
import {IGeometryElementProps} from "./mesh";

export interface ILineSegmentsProps extends IObject3DProps {
  geometry?: IRenderableProp<LineSegmentsGeometryType, IGeometryElementProps>;
  material?: IRenderableProp<LineSegmentsMaterialType, MaterialParameters>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      lineSegments: IThreeElementPropsBase<LineSegments> & ILineSegmentsProps;
    }
  }
}

export type LineSegmentsGeometryType = Geometry |
  BufferGeometry;

export type LineSegmentsMaterialType = LineDashedMaterial |
  LineBasicMaterial |
  ShaderMaterial;

export type LineSegmentsChildType = LineSegmentsGeometryType |
  LineSegmentsMaterialType;

function isLineSegmentsGeometry(geometry: any): geometry is LineSegmentsGeometryType {
  return geometry !== undefined && (
    geometry instanceof Geometry ||
    geometry instanceof BufferGeometry
  );
}

function isLineSegmentsMaterial(material: any): material is LineSegmentsMaterialType {
  return material !== undefined && (
    material instanceof LineDashedMaterial ||
    material instanceof LineBasicMaterial ||
    material instanceof ShaderMaterial
  );
}

class LineDescriptor extends Object3DDescriptorBase<ILineSegmentsProps, LineSegments, LineSegmentsChildType> {
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
            BufferGeometry,
          ]),
        ],
      );
  }

  public createInstance(props: ILineSegmentsProps) {
    let geometry: any;
    let material: any;

    if (isLineSegmentsGeometry(props.geometry)) {
      geometry = props.geometry;
    }

    if (isLineSegmentsMaterial(props.material)) {
      material = props.material;
    }

    return new LineSegments(geometry, material);
  }

  public appendInitialChild(instance: LineSegments, child: LineSegmentsChildType): void {
    if (isLineSegmentsGeometry(child)) {
      instance.geometry = child;
    } else if (isLineSegmentsMaterial(child)) {
      instance.material = child;
    } else {
      super.appendInitialChild(instance, child);
    }
  }

  public appendChild(instance: LineSegments, child: LineSegmentsChildType): void {
    if (isLineSegmentsGeometry(child)) {
      instance.geometry = child;
    } else if (isLineSegmentsMaterial(child)) {
      instance.material = child;
    } else {
      super.appendChild(instance, child);
    }
  }

  public insertBefore(instance: LineSegments, child: LineSegmentsChildType, before: any): void {
    if (isLineSegmentsGeometry(child)) {
      instance.geometry = child;
    } else if (isLineSegmentsMaterial(child)) {
      instance.material = child;
    } else {
      super.insertBefore(instance, child, before);
    }
  }

  public removeChild(instance: LineSegments, child: LineSegmentsChildType): void {
    if (isLineSegmentsGeometry(child)) {
      instance.geometry = null as any;
    } else if (isLineSegmentsMaterial(child)) {
      instance.material = null as any;
    } else {
      super.removeChild(instance, child);
    }
  }
}

export default LineDescriptor;
