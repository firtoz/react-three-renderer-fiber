import {
  Camera,
  RenderTarget,
  Scene,
  WebGLRenderer,
  WebGLRendererParameters,
} from "three";
import {PropertyDescriptorBase} from "../common/IPropertyDescriptor";
import {ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

type GetterFunction = () => any;
type SetterFunction = (value: any) => void;

function createGetterFromExisting(instance: any, getFunction: GetterFunction): GetterFunction {
  return () => {
    return getFunction.call(instance);
  };
}

function createGetter(instance: any, propertyName: string): GetterFunction {
  return () => {
    return (instance)[propertyName];
  };
}

function createSetterFromExisting(instance: any, setFunction: SetterFunction): SetterFunction {
  return (value: any) => {
    return setFunction.call(instance, value);
  };
}

function createSetter(instance: any, propertyName: string): SetterFunction {
  return (value: any) => {
    (instance)[propertyName] = value;
  };
}

const wrapperDetailsSymbol = Symbol("react-three-renderer-details");
const wrapperSymbol = Symbol("react-three-renderer-wrapper");

abstract class WrapperDetails<TProps, TWrapped> {
  public static get<TProps,
    TWrapped,
    TWrapperDetails extends WrapperDetails<TProps, TWrapped>>(this: { new(...args: any[]): TWrapperDetails },
                                                              wrapper: TWrapped): TWrapperDetails {
    return (wrapper as any)[wrapperDetailsSymbol];
  }

  public static set<TProps,
    TWrapped,
    TWrapperDetails extends WrapperDetails<TProps, TWrapped>>(this: { new(...args: any[]): TWrapperDetails },
                                                              wrapper: TWrapped,
                                                              details: TWrapperDetails): void {
    details.wrapper = wrapper;
    (wrapper as any)[wrapperDetailsSymbol] = details;
  }

  public static getWrappedType<TProps,
    TWrapped,
    TWrapperDetails extends WrapperDetails<TProps,
      TWrapped>>(this: { new(...args: any[]): TWrapperDetails }): new () => any {
    if (typeof (this as any)[wrapperSymbol] === "undefined") {
      (this as any)[wrapperSymbol] = class {
      };
    }

    return (this as any)[wrapperSymbol];
  }

  public wrappedObject: TWrapped | null;
  public wrapper: any;

  constructor(public props: TProps) {
    const staticType = (this.constructor as IWrapperType<TProps, TWrapped, any>);

    staticType.set(new (staticType.getWrappedType())(), this);
  }

  public setWrapper(wrapper: any) {
    this.wrapper = wrapper;
  }

  public wrapObject(rendererInstance: TWrapped) {
    this.wrappedObject = rendererInstance;

    Object.getOwnPropertyNames(rendererInstance)
      .forEach((propertyName: string) => {
        const property = Object.getOwnPropertyDescriptor(rendererInstance, propertyName);
        const attributes = getWrappedAttributes(property, rendererInstance, propertyName);

        Object.defineProperty(this.wrapper, propertyName, attributes);
      });
  }

  public remount(newProps: any) {
    this.wrapObject(this.recreateInstance(newProps));
  }

  public abstract appendToContainer(instance: TWrapped, container: any): void;

  protected abstract recreateInstance(newProps: any): TWrapped;

}

//
// class WebglRendererWrapperDummy {
//   constructor() {
//     /* noop */
//   }
// }

class RendererWrapperDetails extends WrapperDetails<IWebGLRendererProps, WebGLRenderer> {
  private containerIsCanvas: boolean;

  constructor(props: IWebGLRendererProps) {
    super(props);

    // RendererWrapperDetails.set(new WebglRendererWrapperDummy(), this);

    // let canvas: HTMLCanvasElement | null = null;
    //
    // const containerIsCanvas = rootContainerInstance instanceof HTMLCanvasElement;
    // if (containerIsCanvas) {
    //   canvas = rootContainerInstance;
    //   // return new WebGLRenderer({
    //   //   canvas: rootContainerInstance,
    //   // });
    // }
    //
    // const propsToUse = Object.assign({}, props);
    //
    // if (canvas !== null) {
    //   propsToUse.canvas = canvas;
    // }

    // fake-abstract it
    // return new WebglRendererWrapper(propsToUse, containerIsCanvas);
    // super();
  }

  public appendToContainer(instance: WebGLRenderer, container: Node): void {
    const propsToUse: IWebGLRendererProps = Object.assign({}, this.props);

    if (container instanceof HTMLCanvasElement) {
      this.containerIsCanvas = true;
      // canvas = container;

      propsToUse.canvas = container;
    }

    const webglRenderer = createRendererWithoutLogging(this.props);

    if (!this.containerIsCanvas) {
      container.appendChild(webglRenderer.domElement);
    }

    this.wrapObject(webglRenderer);
  }

  // public createWrapped(props: IWebGLRendererProps, container: any): WebGLRenderer {
  // return undefined;

  // }

  public wrapObject(rendererInstance: WebGLRenderer) {
    super.wrapObject(rendererInstance);

    const property = Object.getOwnPropertyDescriptor(rendererInstance, "render");

    // if (propertyName === "render" && typeof window !== "undefined" && typeof window.console !== "undefined") {
    Object.defineProperty(this.wrapper, "render", {
      configurable: property.configurable,
      enumerable: property.enumerable,
      get: () => {
        return (scene: Scene, camera: Camera, renderTarget?: RenderTarget, forceClear?: boolean) => {
          const oldWarn = window.console.warn;

          // get rid of useless message but warn about everything else
          window.console.warn = (...args: string[]) => {
            if (args.length === 2
              && args[0] === "THREE.WebGLProgram: gl.getProgramInfoLog()"
              && args[1].match(/^\s*$/)) {
              return;
            }

            oldWarn.call(window.console, ...args);
          };

          rendererInstance.render(scene, camera, renderTarget, forceClear);

          window.console.warn = oldWarn;

          // redefine to wrap
          Object.defineProperty(this.wrapper, "render", getWrappedAttributes(property, rendererInstance, "render"));
        };
      },
    });
  }

  protected recreateInstance(newProps: WebGLRendererParameters): WebGLRenderer {
    const actualRenderer = this.wrappedObject;

    if (actualRenderer !== null) {
      const contextLossExtension = actualRenderer.extensions.get("WEBGL_lose_context");

      if (contextLossExtension) {
        // noinspection JSUnresolvedFunction
        contextLossExtension.loseContext();
      }

      actualRenderer.dispose();

      const propsToUse = Object.assign({}, newProps);

      if (this.containerIsCanvas) {
        propsToUse.canvas = actualRenderer.domElement;
      }

      const newRenderer = createRendererWithoutLogging(propsToUse);

      if (!this.containerIsCanvas) {
        const parentNode: Node | null = actualRenderer.domElement.parentNode;
        if (parentNode !== null) {
          parentNode.removeChild(actualRenderer.domElement);
          parentNode.appendChild(newRenderer.domElement);
        }
      }

      // otherwise we don't need to do anything, a new context should have been created

      return newRenderer;
    }

    // it's not even mounted yet...
    throw new Error("unhandled");
    // return null;
  }
}

//
// class ObjectWrapper<T> {
//   constructor(details: WrapperDetails<T>, wrappedObject: T) {
//     WrapperDetails.set(this, details);
//
//     details.wrapObject(wrappedObject);
//   }
// }

function createRendererWithoutLogging(parameters: WebGLRendererParameters): WebGLRenderer {
  const oldLog = window.console.log;

  window.console.log = () => {
    /* no-op on purpose */
  };

  const renderer = new WebGLRenderer(parameters);

  window.console.log = oldLog;

  return renderer;
}

function getWrappedAttributes(property: PropertyDescriptor,
                              objectToWrap: any,
                              propertyName: string): PropertyDescriptor {
  const attributes: PropertyDescriptor = {
    configurable: property.configurable,
    enumerable: property.enumerable,
  };

  if (typeof property.set !== "undefined") {
    attributes.set = createSetterFromExisting(objectToWrap, property.set);
  } else if (property.writable) {
    attributes.set = createSetter(objectToWrap, propertyName);
  }

  if (typeof property.get !== "undefined") {
    attributes.get = createGetterFromExisting(objectToWrap, property.get);
  } else {
    attributes.get = createGetter(objectToWrap, propertyName);
  }
  return attributes;
}

// class WebglRendererWrapper extends ObjectWrapper<WebGLRenderer> {
//   public static createInstance(props: IWebGLRendererProps,
//                                rootContainerInstance: HTMLCanvasElement): WebglRendererWrapper {
//     let canvas: HTMLCanvasElement | null = null;
//
//     const containerIsCanvas = rootContainerInstance instanceof HTMLCanvasElement;
//     if (containerIsCanvas) {
//       canvas = rootContainerInstance;
//       // return new WebGLRenderer({
//       //   canvas: rootContainerInstance,
//       // });
//     }
//
//     const propsToUse = Object.assign({}, props);
//
//     if (canvas !== null) {
//       propsToUse.canvas = canvas;
//     }
//
//     // fake-abstract it
//     return new WebglRendererWrapper(propsToUse, containerIsCanvas);
//   }
//
//   constructor(parameters: WebGLRendererParameters, containerIsCanvas: boolean) {
//     const rendererInstance = createRendererWithoutLogging(parameters);
//
//     super(new RendererWrapperDetails(
//       containerIsCanvas,
//     ), rendererInstance);
//   }
// }
//
// function createWrapper<T>(typeToWrap: new (...params: any[]) => T,
//                           detailsClass: () => WrapperDetails<T>): new () => ObjectWrapper<T> {
//   const wrapperClass = class extends ObjectWrapper<T> {
//     constructor() {
//       super(detailsClass(), null as any);
//     }
//   };
//
//   const typeToWrapInstanceOf = typeToWrap[Symbol.hasInstance];
//
//   Object.defineProperty(typeToWrap, Symbol.hasInstance, {
//     value: (type: any) => {
//       // yes let's completely abuse javascript
//       return typeToWrapInstanceOf.call(typeToWrap, type) || type instanceof wrapperClass;
//     },
//   });
//
//   return wrapperClass;
// }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      webGLRenderer: IReactThreeRendererElement<WebGLRenderer> & IWebGLRendererProps;
    }
  }
}

interface IWebGLRendererProps extends WebGLRendererParameters {
  width: number;
  height: number;
}

interface IWrapperType<TProps, TWrapped, TWrapperDetails extends WrapperDetails<TProps, TWrapped>> {
  new(props: TProps): TWrapperDetails;

  get(wrapper: TWrapped): TWrapperDetails;

  set(wrapper: TWrapped, details: TWrapperDetails): void;

  getWrappedType(): new () => any;
}

class WrappedEntityDescriptor<TProps = any,
  TInstance = any,
  TParent = any,
  TChild = never,
  TWrapper extends WrapperDetails<TProps, TInstance> = any> extends ReactThreeRendererDescriptor<TProps,
  TInstance,
  TParent,
  TChild> {
  private remountTrigger: new () => PropertyDescriptorBase<TProps, TInstance, any>;

  constructor(private wrapperType: IWrapperType<TProps, TInstance, TWrapper>,
              private typeToWrap: any,
              private delayPropUpdatesUntilMount = false) {
    super();

    const typeToWrapInstanceOf = typeToWrap[Symbol.hasInstance];

    Object.defineProperty(typeToWrap, Symbol.hasInstance, {
      value: (type: any) => {
        // yes let's completely abuse javascript
        return typeToWrapInstanceOf.call(typeToWrap, type) || type instanceof wrapperType.getWrappedType();
      },
    });

    const remountFunction = (instance: TInstance, newProps: TProps) => {
      this.remount(instance, newProps);
    };

    this.remountTrigger = class RemountTrigger extends PropertyDescriptorBase<TProps, TInstance, any> {
      public update(instance: TInstance,
                    newValue: any,
                    oldProps: TProps,
                    newProps: TProps) {
        remountFunction(instance, newProps);
      }
    };
  }

  public createInstance(props: TProps, rootContainerInstance: any): any {
    return new this.wrapperType(props).wrapper;
  }

  public applyInitialPropUpdates(instance: TInstance, props: TProps): void {
    if (!this.delayPropUpdatesUntilMount) {
      super.applyInitialPropUpdates(instance, props);
    }
  }

  public addedToParent(instance: TInstance, container: any): void {
    const wrapperDetails = this.wrapperType.get(instance);

    wrapperDetails.appendToContainer(instance, container);

    if (this.delayPropUpdatesUntilMount) {
      super.applyInitialPropUpdates(instance, wrapperDetails.props);
    }
  }

  protected hasRemountProp(propName: string): void {
    this.hasProp<any>(propName, this.remountTrigger, false);
  }

  private remount(instance: TInstance, newProps: TProps) {
    this.wrapperType.get(instance).remount(newProps);

    super.applyInitialPropUpdates(instance, newProps);
  }
}

class WebGLRendererDescriptor extends WrappedEntityDescriptor<IWebGLRendererProps,
  any,
  HTMLCanvasElement,
  Scene,
  RendererWrapperDetails> {
  constructor() {
    super(RendererWrapperDetails, WebGLRenderer, true);

    this.hasProp<number>("width",
      class extends PropertyDescriptorBase<IWebGLRendererProps, WebGLRenderer, number> {
        public update(instance: WebGLRenderer,
                      newValue: number,
                      oldProps: IWebGLRendererProps,
                      newProps: IWebGLRendererProps): void {
          if (newValue === null) {
            // error!
            return;
          }

          // if the height has changed, it will handle the update in the next step
          if (newProps.height === oldProps.height) {
            // can apply height

            instance.setSize(newValue, instance.getSize().height);
          }
        }
      });

    this.hasProp<number>("height",
      class extends PropertyDescriptorBase<IWebGLRendererProps, WebGLRenderer, number> {
        public update(instance: WebGLRenderer,
                      newValue: number,
                      oldProps: IWebGLRendererProps,
                      newProps: IWebGLRendererProps): void {
          if (newValue === null) {
            return;
          }

          if (newProps.width === null || newProps.width === oldProps.width) {
            // can apply height, otherwise apply them together

            instance.setSize(instance.getSize().width, newValue);
          } else {
            instance.setSize(newProps.width, newValue);
          }
        }
      });

    this.hasRemountProp("antialias");

    this.hasProp<number>("devicePixelRatio",
      class extends PropertyDescriptorBase<IWebGLRendererProps, WebGLRenderer, number> {
        public update(instance: WebGLRenderer,
                      newValue: number): void {
          instance.setPixelRatio(newValue);
        }
      });
  }

  public willBeRemovedFromParent(instance: any, parent: HTMLCanvasElement): void {
    // TODO
    if (parent instanceof HTMLCanvasElement) {
      /* */
    } else {
      /* */
    }
    // super.removedFromParent(parent);
  }

  //
  // public appendInitialChild(instance: WebGLRenderer, child: Scene): void {
  //   super.appendInitialChild(instance, child);
  //   // if (!instance.userData) {
  //   //   instance.userData = {};
  //   // }
  //   //
  //   // if (child instanceof Scene) {
  //   //   instance.userData._scene = child;
  //   // } else {
  //   //   throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
  //   // }
  //   // super.appendInitialChild(instance, child);
  // }
  //
  // public appendChild(instance: WebGLRenderer, child: Scene): void {
  //   super.appendChild(instance, child);
  //
  //   // if (!instance.userData) {
  //   //   instance.userData = {};
  //   // }
  //   //
  //   // if (child instanceof Scene) {
  //   //   instance.userData._scene = child;
  //   // } else {
  //   //   throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
  //   // }
  //   // super.appendInitialChild(instance, child);
  // }
}

export default new WebGLRendererDescriptor();
