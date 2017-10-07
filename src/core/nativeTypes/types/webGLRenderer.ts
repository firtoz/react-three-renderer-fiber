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

abstract class WrapperDetails<T> {
  public static get<T>(wrapper: ObjectWrapper<T>): WrapperDetails<T> {
    return (wrapper as any)[wrapperDetailsSymbol];
  }

  public static set<T>(wrapper: ObjectWrapper<T>, details: WrapperDetails<T>) {
    details.setWrapper(wrapper);
    (wrapper as any)[wrapperDetailsSymbol] = details;
  }

  public wrappedObject: T;
  protected wrapper: ObjectWrapper<T>;

  // public abstract createInstance(params: TParams, container: any): T;

  public setWrapper(wrapper: ObjectWrapper<T>) {
    this.wrapper = wrapper;
  }

  public wrapObject(rendererInstance: T) {
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

  protected abstract recreateInstance(newProps: any): T;
}

class RendererWrapperDetails extends WrapperDetails<WebGLRenderer> {
  constructor(public containerIsCanvas: boolean) {
    super();
  }

  // public createInstance(params: IWebGLRendererProps, container: any): WebGLRenderer {
  //   return undefined;
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
}

class ObjectWrapper<T> {
  constructor(details: WrapperDetails<T>, wrappedObject: T) {
    WrapperDetails.set(this, details);

    details.wrapObject(wrappedObject);
  }
}

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

class WebglRendererWrapper extends ObjectWrapper<WebGLRenderer> {
  public static createInstance(props: IWebGLRendererProps,
                               rootContainerInstance: HTMLCanvasElement): WebglRendererWrapper {
    let canvas: HTMLCanvasElement | null = null;

    const containerIsCanvas = rootContainerInstance instanceof HTMLCanvasElement;
    if (containerIsCanvas) {
      canvas = rootContainerInstance;
      // return new WebGLRenderer({
      //   canvas: rootContainerInstance,
      // });
    }

    const propsToUse = Object.assign({}, props);

    if (canvas !== null) {
      propsToUse.canvas = canvas;
    }

    // fake-abstract it
    return new WebglRendererWrapper(propsToUse, containerIsCanvas);
  }

  constructor(parameters: WebGLRendererParameters, containerIsCanvas: boolean) {
    const rendererInstance = createRendererWithoutLogging(parameters);

    super(new RendererWrapperDetails(
      containerIsCanvas,
    ), rendererInstance);
  }
}

const webglRendererInstanceOf = WebGLRenderer[Symbol.hasInstance];

Object.defineProperty(WebGLRenderer, Symbol.hasInstance, {
  value: (type: any) => {
    // yes let's completely abuse javascript
    return webglRendererInstanceOf.call(WebGLRenderer, type) || type instanceof WebglRendererWrapper;
  },
});

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

class WebGLRendererDescriptor extends ReactThreeRendererDescriptor<IWebGLRendererProps,
  WebglRendererWrapper,
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
          WrapperDetails.get(instance).remount(newProps);

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

  public createInstance(props: IWebGLRendererProps, rootContainerInstance: HTMLCanvasElement): WebglRendererWrapper {
    return WebglRendererWrapper.createInstance(props, rootContainerInstance);
  }

  public willBeRemovedFromParent(instance: WebglRendererWrapper, parent: HTMLCanvasElement): void {
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

  public appendToContainer(instance: WebGLRenderer, container: HTMLCanvasElement): void {
    if (instance.domElement === container) {
      /* nothing to do here, as it will be passed in via the constructor */
    } else if (container instanceof Element) {
      container.appendChild(instance.domElement);
    } else {
      throw new Error("Trying to mount a <webglRenderer/> into an invalid object");
    }
  }
}

export default new WebGLRendererDescriptor();
