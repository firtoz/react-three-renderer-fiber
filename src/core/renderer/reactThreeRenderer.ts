import {default as r3rFiberSymbol} from "./utils/r3rFiberSymbol";
import r3rRootContainerSymbol from "./utils/r3rRootContainerSymbol";

import {IFiber} from "react-fiber-export";
import {Scene} from "three";
import {SceneElementProps} from "../hostDescriptors/descriptors/objects/scene";
import {RenderAction} from "../hostDescriptors/descriptors/render";
import ReactThreeFiberRenderer from "./fiberRenderer";
import {IHostContext} from "./fiberRenderer/createInstance";
import "./utils/DevtoolsHelpers";
import r3rContextSymbol from "./utils/r3rContextSymbol";

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

class ReactThreeRenderer {
  public static render(element: React.ReactElement<SceneElementProps>,
                       container: any,
                       callback?: any): Scene | null;

  public static render<TProps>(element: React.ReactElement<TProps> | null,
                               container: any,
                               callback?: any): any | null;

  public static render(elements: Array<React.ReactElement<any> | null>,
                       container: any,
                       callback?: any): any[] | null ;

  public static render<TProps>(element: //
                                 React.ReactElement<TProps>
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

          if (callback != null) {
            callback();
          }
        });
      });
      // If you call unmountComponentAtNode twice in quick succession, you'll
      // get `true` twice. That's probably fine?
      return true;
    } else {
      if (callback != null) {
        callback();
      }
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

  public static findTHREEObject(componentOrElement: any) {
    if (componentOrElement == null) {
      return null;
    }

    if (componentOrElement[r3rFiberSymbol] !== undefined) {
      // must be a host instance already then
      return componentOrElement;
    }

    const fiber: IFiber = componentOrElement._reactInternalFiber;
    if (fiber !== null && fiber !== undefined) {
      return ReactThreeFiberRenderer.findHostInstance(fiber);
    }

    if (typeof componentOrElement.render === "function") {
      throw new Error("Unable to find node on an unmounted component.");
    } else {
      throw new Error("Element appears to be" +
        " neither ReactComponent nor DOMNode. Keys: %s" + Object.keys(componentOrElement));
    }
  }
}

export default ReactThreeRenderer;
