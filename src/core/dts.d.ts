type HostContext = HostContextDev | HostContextProd;

type HostContextDev = {
    namespace: string,
    ancestorInfo: any,
};

type HostContextProd = string;

declare interface IReactFiberRendererConfig {
    getRootHostContext(rootContainerInstance: any): any,

    getChildHostContext(parentHostContext: any, type: any): any,

    shouldSetTextContent(props: any): boolean,

    shouldDeprioritizeSubtree(type: any, props: any): boolean,

    createInstance(type: any, props: any, rootContainerInstance: any, hostContext: any, internalInstanceHandle: any): any,

    finalizeInitialChildren(r3rElement: any, type: any, props: any, rootContainerInstance: any): boolean,

    prepareForCommit(): void,

    resetAfterCommit(): void,

    prepareUpdate(instance: any, type: any, oldProps: any, newProps: any, rootContainerInstance: any, hostContext: any): any,

    commitUpdate(instance: any, updatePayload: any, type: any, oldProps: any, newProps: any, internalInstanceHandle: any): void,

    appendChild(parentInstance: any, child: any): any,

    appendInitialChild(parentInstance: any, child: any): void,

    getPublicInstance(instance: any): any,

    scheduleDeferredCallback: any,

    useSyncScheduling: boolean,

    commitMount(): any,

    resetTextContent(): any,

    commitTextUpdate(): any,

    appendChildToContainer(parent: any, child: any): any,

    insertBefore(): any,

    insertInContainerBefore(): any,

    removeChild(): any,

    removeChildFromContainer(): any,
}

declare module 'react-fiber-export/lib/renderers/shared/fiber/ReactFiberReconciler.js' {
    function ReactFiberReconciler(config: IReactFiberRendererConfig): any;

    export = ReactFiberReconciler;
}

declare module 'react-fiber-export/lib/renderers/shared/fiber/isomorphic/ReactPortal.js' {
    class ReactDOMFrameScheduling {
        static createPortal(a: any, b: any, c: any): any;
    }

    export = ReactDOMFrameScheduling;
}

declare module 'react-fiber-export/lib/renderers/shared/ReactDOMFrameScheduling.js' {
    // function ReactFiberReconciler(config: IReactFiberRendererConfig): any;
    //
    // export = ReactFiberReconciler;

    class ReactDOMFrameScheduling {
        static rIC(): number;
    }

    export = ReactDOMFrameScheduling;
}


interface Window {
    __DEV__: Boolean
}
