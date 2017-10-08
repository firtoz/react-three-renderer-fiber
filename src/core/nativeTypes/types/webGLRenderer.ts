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

function getWrappedAttributes(property: PropertyDescriptor,
                              objectToWrap: any,
                              propertyName: string): PropertyDescriptor {
  const attributes: PropertyDescriptor = {
    configurable: property.configurable,
    enumerable: property.enumerable,
  };

  if (property.set !== undefined) {
    attributes.set = createSetterFromExisting(objectToWrap, property.set);
  } else if (property.writable !== undefined && property.writable) {
    attributes.set = createSetter(objectToWrap, propertyName);
  }

  if (property.get !== undefined) {
    attributes.get = createGetterFromExisting(objectToWrap, property.get);
  } else {
    attributes.get = createGetter(objectToWrap, propertyName);
  }
  return attributes;
}

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

  public abstract willBeRemovedFromParent(instance: TWrapped, container: any): void;

  protected abstract recreateInstance(newProps: any): TWrapped;
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

class RendererWrapperDetails extends WrapperDetails<IWebGLRendererProps, WebGLRenderer> {
  private containerIsCanvas: boolean;

  public appendToContainer(instance: WebGLRenderer, container: Node): void {
    const propsToUse: IWebGLRendererProps = Object.assign({}, this.props);

    if (container instanceof HTMLCanvasElement) {
      this.containerIsCanvas = true;
      // canvas = container;

      propsToUse.canvas = container;
    }

    const webglRenderer = createRendererWithoutLogging(propsToUse);

    if (!this.containerIsCanvas) {
      container.appendChild(webglRenderer.domElement);
    }

    this.wrapObject(webglRenderer);
  }

  public willBeRemovedFromParent(instance: WebGLRenderer, container: any): void {
    const actualRenderer = this.wrappedObject;

    if (actualRenderer !== null) {
      const contextLossExtension = actualRenderer.extensions.get("WEBGL_lose_context");

      if (contextLossExtension) {
        // noinspection JSUnresolvedFunction
        contextLossExtension.loseContext();
      }

      actualRenderer.dispose();

      if (!this.containerIsCanvas && actualRenderer.domElement.parentNode !== null) {
        actualRenderer.domElement.parentNode.removeChild(actualRenderer.domElement);
      }
    }
  }

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
              && args[1].match(/^\s*$/) !== null) {
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
    const lastRenderer = this.wrappedObject;

    if (lastRenderer !== null) {
      const contextLossExtension = lastRenderer.extensions.get("WEBGL_lose_context");

      if (contextLossExtension) {
        // noinspection JSUnresolvedFunction
        contextLossExtension.loseContext();
      }

      lastRenderer.dispose();

      const propsToUse = Object.assign({}, newProps);

      if (this.containerIsCanvas) {
        propsToUse.canvas = lastRenderer.domElement;
      }

      const newRenderer = createRendererWithoutLogging(propsToUse);

      if (!this.containerIsCanvas) {
        const parentNode: Node | null = lastRenderer.domElement.parentNode;
        if (parentNode !== null) {
          parentNode.removeChild(lastRenderer.domElement);
          parentNode.appendChild(newRenderer.domElement);
        }
      }

      // otherwise we don't need to do anything, a new context should have been created

      return newRenderer;
    }

    // it's not even mounted yet...
    throw new Error("props were modified before webGLRenderer could be mounted...\n" +
      "How did this happen?\n" +
      "Please create an issue with details!");
  }
}

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
  private remountTrigger: (instance: TInstance,
                           newValue: any,
                           oldProps: TProps,
                           newProps: TProps) => void;

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

    this.remountTrigger = (instance: TInstance,
                           newValue: any,
                           oldProps: TProps,
                           newProps: TProps) => {
      remountFunction(instance, newProps);
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

  public willBeRemovedFromParent(instance: TInstance, parent: TParent): void {
    // super.willBeRemovedFromParent(instance, parent);
    const wrapperDetails = this.wrapperType.get(instance);

    wrapperDetails.willBeRemovedFromParent(instance, parent);
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

    // this.hasMultiProp(["width", "height"], (instance: WebGLRenderer,
    //                                         newSize: { width: number, height: number }) => {
    //   const updatedSize: { width: number, height: number } = Object.assign({}, instance.getSize(), newSize);
    //
    //   instance.setSize(updatedSize.width, updatedSize.height);
    // });

    this.hasProp("width", (instance: WebGLRenderer,
                           newValue: number,
                           oldProps: IWebGLRendererProps,
                           newProps: IWebGLRendererProps): void => {
      if (newValue === null) {
        // error!
        return;
      }

      // if the height has changed, it will handle the update in the next step
      if (newProps.height === oldProps.height) {
        // can apply height

        instance.setSize(newValue, instance.getSize().height);
      }
    });

    this.hasProp<number>("height", (instance: WebGLRenderer,
                                    newValue: number,
                                    oldProps: IWebGLRendererProps,
                                    newProps: IWebGLRendererProps): void => {
      if (newValue === null) {
        return;
      }

      if (newProps.width === null || newProps.width === oldProps.width) {
        // can apply height, otherwise apply them together

        instance.setSize(instance.getSize().width, newValue);
      } else {
        instance.setSize(newProps.width, newValue);
      }
    });

    this.hasRemountProp("antialias");

    this.hasProp("devicePixelRatio", (instance: WebGLRenderer,
                                      newValue: number): void => {
      instance.setPixelRatio(newValue);
    });

    this.hasProp("clearColor", (instance: WebGLRenderer,
                                newValue: number): void => {
      instance.setClearColor(newValue);
    }, true);

    this.hasProp("clearAlpha", (instance: WebGLRenderer,
                                newValue: number): void => {
      instance.setClearAlpha(newValue);
    }, false);
  }
}

export default new WebGLRendererDescriptor();
