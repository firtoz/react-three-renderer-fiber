window.__DEV__ = false;

import ReactFiberReconciler = require('react-fiber-export/lib/renderers/shared/fiber/ReactFiberReconciler.js');
import ReactDOMFrameScheduling = require('react-fiber-export/lib/renderers/shared/ReactDOMFrameScheduling.js');

import applyInitialPropUpdates from './applyInitialPropUpdates';
import diffProperties from './diffProperties';
import createInstanceInternal from './createInstanceInternal';
import commitUpdateInternal from './commitUpdateInternal';
import appendInitialChildInternal from './appendInitialChildInternal';

import r3rRootContainerSymbol from './r3rRootContainerSymbol';
import r3rInstanceSymbol from './r3rInstanceSymbol';

function precacheInstance(internalInstance: any, threeElement: any) {
    threeElement[r3rInstanceSymbol] = internalInstance;
}

const R3Renderer = ReactFiberReconciler({
    useSyncScheduling: true,
    getRootHostContext(rootContainerInstance: any) {
        // try to copy from the parents somehow if they're from ReactDOM?

        return {};
    },
    getChildHostContext(parentHostContext: any, type: any) {
        return parentHostContext;
    },
    shouldSetTextContent(props: any) {
        // TODO
        return false;
    },
    shouldDeprioritizeSubtree(type, props) {
        // TODO vis check
        return false;
    },
    createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
        let createdInstance = {};

        createdInstance = createInstanceInternal(type, createdInstance, rootContainerInstance, props);

        precacheInstance(internalInstanceHandle, createdInstance);
        applyInitialPropUpdates(type, createdInstance, props);

        return createdInstance;
    },
    finalizeInitialChildren(r3rElement, type, props, rootContainerInstance) {
        // TODO ?

        return false;
    },
    prepareForCommit() {
        // TODO ?
    },
    resetAfterCommit() {
        // TODO ?
    },
    prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) {
        return diffProperties(
            oldProps,
            newProps,
        );
    },
    commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
        commitUpdateInternal(updatePayload, type, instance);
    },
    appendChild(parentInstance, child) {
        console.log('appendChild');

        debugger;
        const parentInternalInstance = parentInstance[r3rInstanceSymbol];
        const childInternalInstance = child[r3rInstanceSymbol];

        const parentType = parentInternalInstance.type;
        const childType = childInternalInstance.type;

        if (parentInstance instanceof HTMLCanvasElement) {
            // party time!
            return;
        }

        switch (parentType) {
            default:
                throw new Error('cannot add ' + childType + ' as a child to ' + parentType);
            // break;
        }
    },
    appendInitialChild(parentInstance, child) {
        appendInitialChildInternal(parentInstance, child);
    },
    getPublicInstance(instance) {
        return instance;
    },
    scheduleDeferredCallback: ReactDOMFrameScheduling.rIC,

    commitMount(): any {
        console.log('commitMount');
        throw new Error('commitMount');
        // return false;
    },
    resetTextContent(): any {
        console.log('resetTextContent');
        throw new Error('resetTextContent');
        // return false;
    },
    commitTextUpdate(): any {
        console.log('commitTextUpdate');
        throw new Error('commitTextUpdate');
        // return false;
    },
    appendChildToContainer(parentInstance: any, child: any): any {
        console.log('appendChildToContainer');

        if (parentInstance instanceof HTMLCanvasElement) {
            // party time!
            return;
        }

        throw new Error('appendChildToContainer');
        // return false;
    },
    insertBefore(): any {
        console.log('insertBefore');
        throw new Error('insertBefore');
        // return false;
    },
    insertInContainerBefore(): any {
        console.log('insertInContainerBefore');
        throw new Error('insertInContainerBefore');
        // return false;
    },
    removeChild(): any {
        console.log('removeChild');
        throw new Error('removeChild');
        // return false;
    },
    removeChildFromContainer(): any {
        console.log('removeChildFromContainer');
        throw new Error('removeChildFromContainer');
        // return false;
    },
});

function renderSubtreeIntoContainer(parentComponent: any, children: any, containerNode: any, callback: any) {
    let root = containerNode[r3rRootContainerSymbol];

    if (!root) {
        const newRoot = R3Renderer.createContainer(containerNode);

        containerNode[r3rRootContainerSymbol] = newRoot;
        containerNode[r3rInstanceSymbol] = newRoot;

        root = newRoot;

        console.log('rooot', root);

        // needed to do increase priority to ensure the updates happen ASAP so that getPublicRootInstance will see us
        // R3Renderer.performWithPriority(1, () => {
        R3Renderer.updateContainer(children, newRoot, parentComponent, callback);
        // });
    } else {
        R3Renderer.updateContainer(children, root, parentComponent, callback);
    }

    return R3Renderer.getPublicRootInstance(root);
}

class R3R {
    static render(element: any, container: any, callback?: any) {
        return renderSubtreeIntoContainer(null, element, container, callback);
    }

    // TODO unmount :D

    static rendererInternal = R3Renderer;
}

export default R3R;
