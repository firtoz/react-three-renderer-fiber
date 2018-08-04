import {Geometry } from "three";
import {GeometryContainerType, GeometryWrapperBase} from "./geometryBase";
import {WrappedEntityDescriptor} from "./ObjectWrapper";

export default <TProps, TInstance extends Geometry>(
  createInstance: (props: TProps) => TInstance,
  constructorParameters: string[],
  geometryTypeToWrap: any,
): any => {
  class GeneratedGeometryWrapper extends GeometryWrapperBase<TProps, TInstance> {
    protected constructGeometry(props: TProps): TInstance {
      return createInstance(props);
    }
  }

  return class GeneratedGeometryDescriptor extends WrappedEntityDescriptor<GeneratedGeometryWrapper,
    TProps,
    TInstance,
    GeometryContainerType> {
    constructor() {
      super(GeneratedGeometryWrapper, geometryTypeToWrap);

      this.hasRemountProps(...constructorParameters);
    }
  };
};
