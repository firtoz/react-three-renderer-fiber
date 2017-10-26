import {Geometry, Material, MaterialParameters, Mesh} from "three";
import getDescriptorForInstance from "../../../renderer/utils/getDescriptorForInstance";
import {IThreeElementPropsBase} from "../../common/IReactThreeRendererElement";
import {default as Object3DDescriptorBase, IObject3DProps} from "../../common/object3DBase";
import {IRenderableProp, RefWrapper, SimplePropertyWrapper} from "../../common/RefWrapper";

// tslint:disable-next-line
export interface ITestProps<TInstance> {
}

// tslint:disable-next-line
interface IGeometryElementProps extends ITestProps<Geometry> {
}

interface IMeshProps extends IObject3DProps {
  geometry?: IRenderableProp<Geometry, IGeometryElementProps>;
  material?: IRenderableProp<Material, MaterialParameters>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: IThreeElementPropsBase<Mesh> & IMeshProps;
    }
  }
}

type MeshChildType = Geometry | Material;

class MeshDescriptor extends Object3DDescriptorBase<IMeshProps, Mesh, MeshChildType> {
  private refWrapper: RefWrapper;

  constructor() {
    super();

    this.refWrapper = new RefWrapper(["material", "geometry"], this);

    this.refWrapper.wrapProperties([
        new SimplePropertyWrapper("material", Material),
        new SimplePropertyWrapper("geometry", Geometry),
      ],
    );
  }

  public createInstance(props: IMeshProps) {
    let geometry: Geometry | undefined;
    let material: Material | undefined;

    if (props.geometry instanceof Geometry) {
      geometry = props.geometry;
    }

    if (props.material instanceof Material) {
      material = props.material;
    }

    return new Mesh(geometry, material);
  }

  public appendInitialChild(instance: Mesh, child: MeshChildType): void {
    (getDescriptorForInstance(child) as any).addedToParent(child, instance);

    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (child instanceof Material) {
      instance.material = child;
    } else {
      super.appendInitialChild(instance, child);
    }
  }

  public appendChild(instance: Mesh, child: MeshChildType): void {
    (getDescriptorForInstance(child) as any).addedToParent(child, instance);

    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (child instanceof Material) {
      instance.material = child;
    } else {
      super.appendChild(instance, child);
    }
  }

  public insertBefore(instance: Mesh, child: MeshChildType, before: any): void {
    (getDescriptorForInstance(child) as any).addedToParent(child, instance);

    if (child instanceof Geometry) {
      instance.geometry = child;
    } else if (child instanceof Material) {
      instance.material = child;
    } else {
      super.insertBefore(instance, child, before);
    }
  }

  public removeChild(instance: Mesh, child: MeshChildType): void {
    getDescriptorForInstance(child).willBeRemovedFromParent(child, instance);

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

export default MeshDescriptor;
