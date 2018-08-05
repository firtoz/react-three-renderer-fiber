import {BufferGeometry, Geometry} from "three";
import {BufferGeometryWrapperBase, GeometryContainerType, GeometryWrapperBase} from "./geometryBase";
import {WrappedEntityDescriptor} from "./ObjectWrapper";

export const createGeometryDescriptor = <TProps, TInstance extends Geometry>(
  createInstance: (props: TProps) => TInstance,
  constructorParameters: Array<keyof TProps>,
  geometryTypeToWrap: new (...args: any[]) => TInstance,
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

      this.hasRemountProps(...constructorParameters as string[]);
    }
  };
};

export const createBufferGeometryDescriptor = <TProps, TInstance extends BufferGeometry>(
  createInstance: (props: TProps) => TInstance,
  constructorParameters: Array<keyof TProps>,
  geometryTypeToWrap: new (...args: any[]) => TInstance,
): any => {
  class GeneratedGeometryWrapper extends BufferGeometryWrapperBase<TProps, TInstance> {
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

      this.hasRemountProps(...constructorParameters as string[]);
    }
  };
};

export const createGeometryAndBufferGeometryDescriptors = <
  TProps,
  TInstance extends Geometry,
  TBufferInstance extends BufferGeometry
>(
  createInstance: (props: TProps) => TInstance,
  createBufferInstance: (props: TProps) => TBufferInstance,
  constructorParameters: Array<keyof TProps>,
  geometryTypeToWrap: new (...args: any[]) => TInstance,
  bufferGeometryTypeToWrap: new (...args: any[]) => TBufferInstance,
): any => ({
    bufferGeometryDescriptor: createBufferGeometryDescriptor<TProps, TBufferInstance>(
      createBufferInstance, constructorParameters, bufferGeometryTypeToWrap),
    geometryDescriptor: createGeometryDescriptor<TProps, TInstance>(
      createInstance, constructorParameters, geometryTypeToWrap),
  });
