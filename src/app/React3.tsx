import * as React from "react";
import {PureComponent} from "react";

import * as ReactDOM from "react-dom";
import ReactThreeRenderer from "../core/renderer/reactThreeRenderer";

interface IContextWrapperProps {
  testProps: number;
  onContextUpdate: (newContext: any) => void;
}

class ContextReceiver extends React.Component<IContextWrapperProps, any> {
  public static contextTypes: any;

  constructor(props: IContextWrapperProps, context: any) {
    super(props, context);

    props.onContextUpdate(context);
  }

  public componentWillUpdate(nextProps: Readonly<IContextWrapperProps>,
                             nextState: Readonly<any>,
                             nextContext: any): void {
    this.props.onContextUpdate(nextContext);
  }

  public componentWillReceiveProps(nextProps: Readonly<IContextWrapperProps>, nextContext: any): void {
    // super.componentWillReceiveProps(nextProps, nextContext);
    this.props.onContextUpdate(nextContext);
  }

  /* tslint:disable */
  // private _reactInternalFiber: IFiber;
  /* tslint:enable */

  public render() {
    // if (this._reactInternalFiber.return && this._reactInternalFiber.return.return) {
    //   this._reactInternalFiber.return = this._reactInternalFiber.return.return;
    // }

    return <react-three-renderer-proxy testProps={this.props.testProps} />;
  }
}

interface IContextForwarderProps {
  context: any;
}

class ReactThreeRendererContext extends React.Component<IContextForwarderProps> {
  public static childContextTypes: any;

  public getChildContext() {
    return this.props.context;
  }

  public render(): any {
    return this.props.children;
  }
}

interface IReact3Properties {
  contextPassThrough?: any;
}

class React3 extends PureComponent<IReact3Properties, any> {
  private renderCount: number;
  private div: any;
  private fakeDOMContainerInfo: any;
  private passThroughContext: any;

  constructor(props: IReact3Properties, context: any) {
    super(props, context);

    this.div = null;

    // the canvas gets created here so that it can be rendered into even before the component gets mounted.
    // this.canvas = document.createElement("canvas");

    this.renderCount = 0;

    this.fakeDOMContainerInfo = {
      appendChild: () => {
        // the child is fake, but...
        // for unknown reasons, this seems to be the best spot to render into r3r here.

        // I'll need to study to find out why exactly.
        // Until then, assume fiber sorcery.

        // Also, priority hack to ensure lifecycle guarantees.. ( not sure if necessary?, to be confirmed )
        // Basically doing this worked before and I just kept it.
        // TODO try to remove priority elevation and see what happens.
        // R3R.rendererInternal.performWithPriority(1, () => {
        // console.log('appended childed');

        if (this.div) {
          // console.log('rendered on append child');
          // R3R.render(this.props.children, this.canvas);
        }

        // });
      },
      nodeType: document.ELEMENT_NODE,
      ownerDocument: {
        createElement: (name: any) => {
          return ({
            name,
            setAttribute: (/* ...args: any[] */) => {
              // console.log('set attribute: ', ...args);

              if (this.div) {
                if (this.props.contextPassThrough) {
                  ReactThreeRendererContext.childContextTypes = this.props.contextPassThrough;

                  ReactThreeRenderer.render(<ReactThreeRendererContext
                    context={this.passThroughContext}>
                    {this.props.children}
                  </ReactThreeRendererContext>, this.div);
                } else {
                  ReactThreeRenderer.render(this.props.children as any, this.div);
                }
              }
            },
          });
        }, // fake element gets created here
      },
      setAttribute: () => {

        // R3R.render(this.props.children, this.canvas);
      },
      tagName: "react-three-renderer-fake-container",
      removeChild(/* child: any */) {
        // Doing nothing here but still need to have a stub
      },
    };
  }

  public divRef = (div: any) => {
    this.div = div;
  }

  public componentDidMount() {

    if (this.props.contextPassThrough) {
      ReactThreeRendererContext.childContextTypes = this.props.contextPassThrough;

      ReactThreeRenderer.render(<ReactThreeRendererContext
        context={this.passThroughContext}>
        {this.props.children}
      </ReactThreeRendererContext>, this.div);
    } else {
      ReactThreeRenderer.render(this.props.children as any, this.div);
    }
  }

  public componentWillUnmount() {
    ReactThreeRenderer.unmountComponentAtNode(this.div);
  }

  public onContextUpdate = (newContext: any) => {
    this.passThroughContext = newContext;
  }

  public render() {
    this.renderCount++;

    // Create a fake element that will keep remounting every render.
    // Whenever it gets remounted, we can use that as an opportunity to render into R3R context
    // I am guessing that should be solved by the `implementation` property?
    // I.e. I'd love to get a callback for a moment to be able to call `R3R.render`.

    const implementation: any = null;

    if (this.props.contextPassThrough) {
      ContextReceiver.contextTypes = this.props.contextPassThrough;

      return (<div ref={this.divRef}>{
        (ReactDOM as any).createPortal(
          <ContextReceiver testProps={this.renderCount}
                           onContextUpdate={this.onContextUpdate} />,
          this.fakeDOMContainerInfo,
          implementation,
        )
      }</div>);
    } else {
      return (<div ref={this.divRef}>{
        (ReactDOM as any).createPortal(
          <react-three-renderer-proxy testProps={this.renderCount} />,
          this.fakeDOMContainerInfo,
          implementation,
        )
      }</div>);
    }
  }
}

export default React3;
