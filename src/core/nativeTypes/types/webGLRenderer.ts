import {
  Camera,
  RenderTarget,
  Scene,
  WebGLRenderer,
  WebGLRendererParameters,
} from "three";
import {PropertyDescriptorBase} from "../common/IPropertyDescriptor";
import {DescriptorType, ReactThreeRendererDescriptor} from "../common/ReactThreeRendererDescriptor";

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

  public wrappedObject: TWrapped | null;
  public wrapper: any;

  constructor(public props: TProps) {
  }

  // public abstract createInstance(params: TParams, container: any): T;

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

class WebglRendererWrapperDummy {
  constructor() {
    /* noop */
  }
}

class RendererWrapperDetails extends WrapperDetails<IWebGLRendererProps, WebGLRenderer> {
  private containerIsCanvas: boolean;

  constructor(props: IWebGLRendererProps) {
    super(props);

    RendererWrapperDetails.set(new WebglRendererWrapperDummy(), this);

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

// const webglRendererInstanceOf = WebGLRenderer[Symbol.hasInstance];
//
// Object.defineProperty(WebGLRenderer, Symbol.hasInstance, {
//   value: (type: any) => {
//     // yes let's completely abuse javascript
//     return webglRendererInstanceOf.call(WebGLRenderer, type) || type instanceof WebglRendererWrapper;
//   },
// });

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

  get(v: TWrapped): TWrapperDetails;
}

class WrappedEntityDescriptor<TProps = any,
  TInstance = any,
  TParent = any,
  TChild = never,
  TWrapper extends WrapperDetails<TProps, TInstance> = any> extends ReactThreeRendererDescriptor<TProps,
  TInstance,
  TParent,
  TChild> {

  constructor(private wrapperType: IWrapperType<TProps, TInstance, TWrapper>) {
    super();
  }

  public createInstance(props: TProps, rootContainerInstance: any): any {
    return new this.wrapperType(props).wrapper;
  }

  public appendToContainer(instance: any, container: any): void {
    const wrapperDetails = this.wrapperType.get(instance);

    wrapperDetails.appendToContainer(instance, container);

    console.log("and now applying initial props!");

    super.applyInitialPropUpdates(instance, wrapperDetails.props);

    // super.appendToContainer(instance, container);
  }
}

class WebGLRendererDescriptor extends ReactThreeRendererDescriptor<IWebGLRendererProps,
  any,
  HTMLCanvasElement,
  Scene> {
  constructor() {
    super();

    const self = this;

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

    this.hasProp<boolean>("antialias",
      class extends PropertyDescriptorBase<IWebGLRendererProps, WebGLRenderer, boolean> {
        // noinspection JSUnusedLocalSymbols
        public update(instance: WebGLRenderer,
                      newValue: boolean,
                      oldProps: IWebGLRendererProps,
                      newProps: IWebGLRendererProps): void {
          RendererWrapperDetails.get(instance).remount(newProps);

          self.applyInitialPropUpdates(instance, newProps);
        }
      }, false);

    this.hasProp<number>("devicePixelRatio",
      class extends PropertyDescriptorBase<IWebGLRendererProps, WebGLRenderer, number> {
        public update(instance: WebGLRenderer,
                      newValue: number): void {
          instance.setPixelRatio(newValue);
        }
      });
  }

  public createInstance(props: IWebGLRendererProps, rootContainerInstance: HTMLCanvasElement): any {
    return new RendererWrapperDetails(props).wrapper;
    // return WebglRendererWrapper.createInstance(props, rootContainerInstance);
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

  public appendInitialChild(instance: WebGLRenderer, child: Scene): void {
    // if (!instance.userData) {
    //   instance.userData = {};
    // }
    //
    // if (child instanceof Scene) {
    //   instance.userData._scene = child;
    // } else {
    //   throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
    // }
    // super.appendInitialChild(instance, child);
  }

  public appendChild(instance: WebGLRenderer, child: Scene): void {
    // if (!instance.userData) {
    //   instance.userData = {};
    // }
    //
    // if (child instanceof Scene) {
    //   instance.userData._scene = child;
    // } else {
    //   throw new Error('cannot add ' + childType + ' as a childInstance to ' + parentType);
    // }
    // super.appendInitialChild(instance, child);
  }

  public applyInitialPropUpdates(instance: any, props: IWebGLRendererProps): void {
    // super.applyInitialPropUpdates(instance, props);
    // this will be done on append
  }

  public appendToContainer(instance: WebGLRenderer, container: HTMLCanvasElement): void {
    const wrapperDetails = RendererWrapperDetails.get(instance);

    wrapperDetails.appendToContainer(instance, container);

    console.log("and now applying initial props!");

    super.applyInitialPropUpdates(instance, wrapperDetails.props);
    // and NOW we create an instance?
    // if (instance.domElement === container) {
    //   /* nothing to do here, as it will be passed in via the constructor */
    // } else if (container instanceof Element) {
    //   container.appendChild(instance.domElement);
    // } else {
    //   throw new Error("Trying to mount a <webglRenderer/> into an invalid object");
    // }
  }
}

export default new WebGLRendererDescriptor();
