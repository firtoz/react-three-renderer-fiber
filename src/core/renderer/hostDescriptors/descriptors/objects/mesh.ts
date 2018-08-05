import {
  BufferGeometry, DirectionalLightShadow,
  Geometry,
  Material,
  MaterialParameters,
  Mesh,
  MeshDepthMaterial,
  MeshMaterial,
} from "three";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase, IObject3DProps} from "../../common/object3DBase";
import {IRenderableProp, PropertyWrapper, RefWrapper, SimplePropertyWrapper} from "../../common/RefWrapper";

// tslint:disable-next-line
export interface ITestProps<TInstance> {
}

// tslint:disable-next-line
export interface IGeometryElementProps extends ITestProps<Geometry> {
}

export interface IMeshProps extends IObject3DProps {
  geometry?: IRenderableProp<Geometry, IGeometryElementProps>;
  material?: IRenderableProp<MeshMaterial, MaterialParameters>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: IThreeElementPropsBase<Mesh> & IMeshProps;
    }
  }
}

export type MeshChildType = Geometry | BufferGeometry | MeshMaterial;

class MeshDescriptor extends Object3DDescriptorBase<IMeshProps, Mesh, MeshChildType> {
  constructor() {
    super();

    new RefWrapper(["material", "customDepthMaterial", "geometry"], this)
      .wrapProperties([
          new SimplePropertyWrapper("material", [Material]),
          new SimplePropertyWrapper("customDepthMaterial", [MeshDepthMaterial]),
          new SimplePropertyWrapper("geometry", [Geometry, BufferGeometry]),
        ],
      );
  }

  public createInstance(props: IMeshProps) {
    let geometry: Geometry | BufferGeometry | undefined;
    let material: MeshMaterial | undefined;

    if (props.geometry instanceof Geometry || props.geometry instanceof BufferGeometry) {
      geometry = props.geometry;
    }

    if (props.material instanceof Material) {
      material = props.material;
    }

    return new Mesh(geometry, material);
  }

  public appendInitialChild(instance: Mesh, child: MeshChildType): void {
    if (child instanceof Geometry || child instanceof BufferGeometry) {
      instance.geometry = child;
    } else if ((child as any) instanceof Material) {
      // Materials can take care of themselves
    } else {
      super.appendInitialChild(instance, child);
    }
  }

  public appendChild(instance: Mesh, child: MeshChildType): void {
    if (child instanceof Geometry || child instanceof BufferGeometry) {
      instance.geometry = child;
    } else if ((child as any) instanceof Material) {
      // Materials can take care of themselves
    } else {
      super.appendChild(instance, child);
    }
  }

  public insertBefore(instance: Mesh, child: MeshChildType, before: any): void {

    if (child instanceof Geometry || child instanceof BufferGeometry) {
      instance.geometry = child;
    } else if ((child as any) instanceof Material) {
      // Materials can take care of themselves
    } else {
      super.insertBefore(instance, child, before);
    }
  }

  public removeChild(instance: Mesh, child: MeshChildType): void {
    if (child instanceof Geometry || child instanceof BufferGeometry) {
      instance.geometry = null as any;
    } else if ((child as any) instanceof Material) {
      // Materials can take care of themselves
    } else {
      super.removeChild(instance, child);
      // throw new Error('cannot remove ' + (child as any)[r3rFiberSymbol].type + ' as a childInstance from mesh');
    }
  }
}

export default MeshDescriptor;
