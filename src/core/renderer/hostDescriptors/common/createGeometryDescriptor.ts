import {BufferGeometry, Geometry} from "three";
import {GeometryContainerType, GeometryWrapperBase} from "./geometryBase";
import {WrappedEntityDescriptor} from "./ObjectWrapper";

export function createGeometryDescriptor<TProps>() {
  function create<
    TInstance extends Geometry | BufferGeometry,
  >(
    geometryClass: new () => TInstance,
  ): any;
  function create<
    TInstance extends Geometry | BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1]) => TInstance,
    key1: TKey1,
  ): any;
  function create<
    TInstance extends Geometry | BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2]) => TInstance,
    key1: TKey1,
    key2: TKey2,
  ): any;
  function create<
    TInstance extends Geometry | BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3]) => TInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
  ): any;
  function create<
    TInstance extends Geometry | BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
    TKey4 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                        param4: TProps[TKey4]) => TInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
    key4: TKey4,
  ): any;
  function create<
    TInstance extends Geometry | BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
    TKey4 extends Extract<keyof TProps, string>,
    TKey5 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                        param4: TProps[TKey4], param5: TProps[TKey5]) => TInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
    key4: TKey4,
    key5: TKey5,
  ): any;
  function create<
    TInstance extends Geometry | BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
    TKey4 extends Extract<keyof TProps, string>,
    TKey5 extends Extract<keyof TProps, string>,
    TKey6 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                        param4: TProps[TKey4], param5: TProps[TKey5], param6: TProps[TKey6]) => TInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
    key4: TKey4,
    key5: TKey5,
    key6: TKey6,
  ): any;
  function create<
    TInstance extends Geometry | BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
    TKey4 extends Extract<keyof TProps, string>,
    TKey5 extends Extract<keyof TProps, string>,
    TKey6 extends Extract<keyof TProps, string>,
    TKey7 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                        param4: TProps[TKey4], param5: TProps[TKey5], param6: TProps[TKey6],
                        param7: TProps[TKey7]) => TInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
    key4: TKey4,
    key5: TKey5,
    key6: TKey6,
    key7: TKey7,
  ): any;
  function create<
    TInstance extends Geometry | BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
    TKey4 extends Extract<keyof TProps, string>,
    TKey5 extends Extract<keyof TProps, string>,
    TKey6 extends Extract<keyof TProps, string>,
    TKey7 extends Extract<keyof TProps, string>,
    TKey8 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                        param4: TProps[TKey4], param5: TProps[TKey5], param6: TProps[TKey6],
                        param7: TProps[TKey7], param8: TProps[TKey8]) => TInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
    key4: TKey4,
    key5: TKey5,
    key6: TKey6,
    key7: TKey7,
    key8: TKey8,
  ): any;
  function create<TInstance extends Geometry | BufferGeometry>(
    geometryClass: new (...args: Array<TProps[Extract<keyof TProps, string>]>) => TInstance,
    ...args: Array<Extract<keyof TProps, string>>) {
    class GeneratedGeometryWrapper extends GeometryWrapperBase<TProps, TInstance> {
      protected constructGeometry(props: TProps): TInstance {
        return new geometryClass(...args.map((arg) => props[arg]));
      }
    }

    return class GeneratedGeometryDescriptor extends WrappedEntityDescriptor<GeneratedGeometryWrapper,
      TProps,
      TInstance,
      GeometryContainerType> {
      constructor() {
        super(GeneratedGeometryWrapper, geometryClass);

        this.hasRemountProps(...args);
      }
    };
  }
  return create;
}

export function createGeometryAndBufferGeometryDescriptors<TProps>() {

  function create<
    TInstance extends Geometry,
    TBufferInstance extends BufferGeometry,
  >(
    geometryClass: new () => TInstance,
    bufferGeometryClass: new () => TBufferInstance,
  ): any;
  function create<
    TInstance extends Geometry,
    TBufferInstance extends BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1]) => TInstance,
    bufferGeometryClass: new (param1: TProps[TKey1]) => TBufferInstance,
    key1: TKey1,
  ): any;
  function create<
    TInstance extends Geometry,
    TBufferInstance extends BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2]) => TInstance,
    bufferGeometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2]) => TBufferInstance,
    key1: TKey1,
    key2: TKey2,
  ): any;
  function create<
    TInstance extends Geometry,
    TBufferInstance extends BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3]) => TInstance,
    bufferGeometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3]) => TBufferInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
  ): any;
  function create<
    TInstance extends Geometry,
    TBufferInstance extends BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
    TKey4 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                        param4: TProps[TKey4]) => TInstance,
    bufferGeometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                              param4: TProps[TKey4]) => TBufferInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
    key4: TKey4,
  ): any;
  function create<
    TInstance extends Geometry,
    TBufferInstance extends BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
    TKey4 extends Extract<keyof TProps, string>,
    TKey5 extends Extract<keyof TProps, string>,
    >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                        param4: TProps[TKey4], param5: TProps[TKey5]) => TInstance,
    bufferGeometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                              param4: TProps[TKey4], param5: TProps[TKey5]) => TBufferInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
    key4: TKey4,
    key5: TKey5,
  ): any;
  function create<
    TInstance extends Geometry,
    TBufferInstance extends BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
    TKey4 extends Extract<keyof TProps, string>,
    TKey5 extends Extract<keyof TProps, string>,
    TKey6 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                        param4: TProps[TKey4], param5: TProps[TKey5], param6: TProps[TKey6]) => TInstance,
    bufferGeometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                              param4: TProps[TKey4], param5: TProps[TKey5], param6: TProps[TKey6]) => TBufferInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
    key4: TKey4,
    key5: TKey5,
    key6: TKey6,
  ): any;
  function create<
    TInstance extends Geometry,
    TBufferInstance extends BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
    TKey4 extends Extract<keyof TProps, string>,
    TKey5 extends Extract<keyof TProps, string>,
    TKey6 extends Extract<keyof TProps, string>,
    TKey7 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                        param4: TProps[TKey4], param5: TProps[TKey5], param6: TProps[TKey6],
                        param7: TProps[TKey7]) => TInstance,
    bufferGeometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                              param4: TProps[TKey4], param5: TProps[TKey5], param6: TProps[TKey6],
                              param7: TProps[TKey7]) => TBufferInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
    key4: TKey4,
    key5: TKey5,
    key6: TKey6,
    key7: TKey7,
  ): any;
  function create<
    TInstance extends Geometry,
    TBufferInstance extends BufferGeometry,
    TKey1 extends Extract<keyof TProps, string>,
    TKey2 extends Extract<keyof TProps, string>,
    TKey3 extends Extract<keyof TProps, string>,
    TKey4 extends Extract<keyof TProps, string>,
    TKey5 extends Extract<keyof TProps, string>,
    TKey6 extends Extract<keyof TProps, string>,
    TKey7 extends Extract<keyof TProps, string>,
    TKey8 extends Extract<keyof TProps, string>,
  >(
    geometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                        param4: TProps[TKey4], param5: TProps[TKey5], param6: TProps[TKey6],
                        param7: TProps[TKey7], param8: TProps[TKey8]) => TInstance,
    bufferGeometryClass: new (param1: TProps[TKey1], param2: TProps[TKey2], param3: TProps[TKey3],
                              param4: TProps[TKey4], param5: TProps[TKey5], param6: TProps[TKey6],
                              param7: TProps[TKey7], param8: TProps[TKey8]) => TBufferInstance,
    key1: TKey1,
    key2: TKey2,
    key3: TKey3,
    key4: TKey4,
    key5: TKey5,
    key6: TKey6,
    key7: TKey7,
    key8: TKey8,
  ): any;
  function create<TInstance extends Geometry, TBufferInstance extends BufferGeometry>(
    geometryClass: new (...args: Array<TProps[Extract<keyof TProps, string>]>) => TInstance,
    bufferGeometryClass: new (...args: Array<TProps[Extract<keyof TProps, string>]>) => TBufferInstance,
    ...args: Array<Extract<keyof TProps, string>>) {
    return {
      bufferGeometryDescriptor: (createGeometryDescriptor<TProps>() as any)(
        bufferGeometryClass,
        ...args,
      ),
      geometryDescriptor: (createGeometryDescriptor<TProps>() as any)(
        geometryClass,
        ...args,
      ),
    };
  }
  return create;
}
