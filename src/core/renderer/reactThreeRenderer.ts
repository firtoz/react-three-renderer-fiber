import fiberSymbol, {default as r3rFiberSymbol} from "./utils/r3rFiberSymbol";
import r3rRootContainerSymbol from "./utils/r3rRootContainerSymbol";

import {Scene} from "three";
import {CameraElement} from "../nativeTypes/types/objects/perspectiveCamera";
import {SceneElementProps} from "../nativeTypes/types/objects/scene";
import {RenderAction} from "../nativeTypes/types/render";
import {WebGLRendererElementProps} from "../nativeTypes/types/webGLRenderer";
import ReactThreeFiberRenderer from "./fiberRenderer";
import {IHostContext} from "./fiberRenderer/createInstance";
import "./utils/DevtoolsHelpers";
import r3rContextSymbol from "./utils/r3rContextSymbol";

// const renderActionsSymbol = Symbol("r3r-render-actions");

function renderSubtreeIntoContainer(parentComponent: React.Component<any, any> | null,
                                    children: any,
                                    container: any,
                                    forceHydrate: boolean,
                                    callback: () => void) {
  if (forceHydrate) {
    throw new Error("forceHydrate not implemented yet");
  }

  let root = container[r3rRootContainerSymbol];

  if (!root) {
    const newRoot = ReactThreeFiberRenderer.createContainer(container);

    container[r3rRootContainerSymbol] = newRoot;
    container[fiberSymbol] = newRoot;

    const renderActionsForContainer: RenderAction[] = [];

    if (container[r3rContextSymbol] === undefined) {
      // noinspection UnnecessaryLocalVariableJS
      const rootContext: IHostContext = {
        triggerRender() {
          // console.log("render triggered for", renderActionsForContainer);

          renderActionsForContainer.forEach((action: RenderAction) => {
            action.triggerRender();
          });
        },
        renderActionFound(action: RenderAction) {
          // console.log("render action found", action);
          renderActionsForContainer.push(action);
        },
      };

      container[r3rContextSymbol] = rootContext;
    }

    root = newRoot;

    ReactThreeFiberRenderer.unbatchedUpdates(() => {
      ReactThreeFiberRenderer.updateContainer(children, newRoot, parentComponent, callback);
    });
  } else {
    ReactThreeFiberRenderer.updateContainer(children, root, parentComponent, callback);
  }

  return ReactThreeFiberRenderer.getPublicRootInstance(root);
}

type TRenderables = SceneElementProps | WebGLRendererElementProps | CameraElement;

class ReactThreeRenderer {
  public static render(element: React.ReactElement<SceneElementProps>,
                       container: any,
                       callback?: any): Scene | null;

  public static render<TProps extends TRenderables>(element: React.ReactElement<TProps> | null,
                                                    container: any,
                                                    callback?: any): any | null;

  public static render(elements: Array<React.ReactElement<any> | null>,
                       container: any,
                       callback?: any): any[] | null ;

  public static render<TProps extends TRenderables>(element: React.ReactElement<TProps>
    | Array<React.ReactElement<any> | null>
    | null,
                                                    container: any,
                                                    callback?: any): any | null {
    return renderSubtreeIntoContainer(null, element, container, false, callback);
  }

  public static unmountComponentAtNode(container: any, callback?: () => void): any {
    if (container[r3rRootContainerSymbol]) {
      // if (__DEV__) {
      //   const rootEl = getReactRootElementInContainer(container);
      //   const renderedByDifferentReact =
      //     rootEl && !ReactDOMComponentTree.getInstanceFromNode(rootEl);
      //   warning(
      //     !renderedByDifferentReact,
      //     "unmountComponentAtNode(): The node you're attempting to unmount " +
      //     'was rendered by another copy of React.',
      //   );
      // }

      // Unmount should not be batched.
      ReactThreeFiberRenderer.unbatchedUpdates(() => {
        renderSubtreeIntoContainer(null, null, container, false, () => {
          delete container[r3rRootContainerSymbol];
          delete container[r3rFiberSymbol];

          if (callback != null) {
            callback();
          }
        });
      });
      // If you call unmountComponentAtNode twice in quick succession, you'll
      // get `true` twice. That's probably fine?
      return true;
    } else {
      // if (__DEV__) {
      //   const rootEl = getReactRootElementInContainer(container);
      //   const hasNonRootReactChild = !!(rootEl &&
      //     ReactDOMComponentTree.getInstanceFromNode(rootEl));
      //
      //   // Check if the container itself is a React root node.
      //   const isContainerReactRoot =
      //     container.nodeType === 1 &&
      //     isValidContainer(container.parentNode) &&
      //     !!container.parentNode._reactRootContainer;
      //
      //   warning(
      //     !hasNonRootReactChild,
      //     "unmountComponentAtNode(): The node you're attempting to unmount " +
      //     'was rendered by React and is not a top-level container. %s',
      //     isContainerReactRoot
      //       ? 'You may have accidentally passed in a React root node instead ' +
      //       'of its container.'
      //       : 'Instead, have the parent component update its state and ' +
      //       'rerender in order to remove this component.',
      //   );
      // }

      return false;
    }
  }
}

export default ReactThreeRenderer;
