import fiberSymbol from "./utils/r3rFiberSymbol";
import r3rRootContainerSymbol from "./utils/r3rRootContainerSymbol";

import ReactThreeFiberRenderer from "./fiberRenderer";
import "./utils/DevtoolsHelpers";

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

    root = newRoot;

    console.log("rooot", root);

    ReactThreeFiberRenderer.unbatchedUpdates(() => {
      ReactThreeFiberRenderer.updateContainer(children, newRoot, parentComponent, callback);
    });
  } else {
    ReactThreeFiberRenderer.updateContainer(children, root, parentComponent, callback);
  }

  return ReactThreeFiberRenderer.getPublicRootInstance(root);
}

class ReactThreeRenderer {
  public static render(element: any, container: any, callback?: any) {
    return renderSubtreeIntoContainer(null, element, container, false, callback);
  }

  public static unmountComponentAtNode(container: any): any {
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
          container[r3rRootContainerSymbol] = null;
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