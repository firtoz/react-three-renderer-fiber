import {Geometry, Material, MaterialParameters, Mesh} from "three";
import ReactThreeRenderer from "../../../renderer/reactThreeRenderer";
import getDescriptorForInstance from "../../../renderer/utils/getDescriptorForInstance";
import {default as Object3DDescriptorBase, IObject3DProps} from "../../common/object3DBase";
import {IElement, RefWrapper} from "../../common/RefWrapper";

// tslint:disable-next-line
interface IGeometryElementProps {
}

interface IMeshProps extends IObject3DProps {
  geometry?: IElement<Geometry, IGeometryElementProps> | Geometry | null;
  material?: IElement<Material, MaterialParameters> | Material | null;
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

    this.refWrapper = new RefWrapper(["material", "geometry"]);

    this.hasPropGroup(["material", "geometry"],
      (instance: Mesh, newValue: any, oldProps: IMeshProps, newProps: IMeshProps) => {
        this.updateGeometryAndMaterial(instance, newProps);
      });
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

  private updateGeometryAndMaterial(instance: Mesh, props: IMeshProps) {
    const material = props.material;
    const geometry = props.geometry;

    let materialElement: React.ReactElement<MaterialParameters> | null = null;
    let geometryElement: React.ReactElement<IGeometryElementProps> | null = null;

    if (material !== undefined && material !== null) {
      if ((material instanceof Material)) {
        instance.material = material;
      } else {
        materialElement = this.refWrapper.wrapElementAndReturn("material", material);
      }
    }

    if (geometry !== undefined && geometry !== null) {
      if ((geometry instanceof Geometry)) {
        instance.geometry = geometry;
      } else {
        geometryElement = this.refWrapper.wrapElementAndReturn("geometry", geometry);
      }
    }

    if (props.children !== undefined) {
      throw new Error("There is a mesh object" +
        " with both material/geometry properties and material/property children.\n" +
        "This is not allowed.");
    }

    ReactThreeRenderer.render([materialElement, geometryElement], instance, () => {
      if (geometry !== undefined && geometry !== null && geometry instanceof Geometry) {
        instance.geometry = geometry;
      }

      if (material !== undefined && material !== null && material instanceof Material) {
        instance.material = material;
      }
    });
  }
}

export default MeshDescriptor;
