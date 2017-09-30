/// <reference path="../../node_modules/@types/react/index.d.ts"/>
declare module ReactFiber {


  export interface ReactFiberRendererConfig {
    getRootHostContext(rootContainerInstance: any): any,

    getChildHostContext(parentHostContext: any, type: any): any,

    shouldSetTextContent(props: any): boolean,

    shouldDeprioritizeSubtree(type: any, props: any): boolean,

    createInstance(type: string, props: any, rootContainerInstance: any, hostContext: any, internalInstanceHandle: any): any,

    finalizeInitialChildren(r3rElement: any, type: any, props: any, rootContainerInstance: any): boolean,

    prepareForCommit(): void,

    resetAfterCommit(): void,

    prepareUpdate(instance: any, type: any, oldProps: any, newProps: any, rootContainerInstance: any, hostContext: any): any,

    commitUpdate(instance: any, updatePayload: any, type: any, oldProps: any, newProps: any, internalInstanceHandle: any): void,

    appendChild(parentInstance: any, child: any): any,

    appendInitialChild(parentInstance: any, child: any): void,

    getPublicInstance(instance: any): any,

    scheduleDeferredCallback: any,

    createTextInstance(text: string, rootContainerInstance: any, internalInstanceHandle: any): any,

    useSyncScheduling: boolean,

    commitMount(): any,

    resetTextContent(): any,

    commitTextUpdate(): any,

    appendChildToContainer(parent: any, child: any): any,

    insertBefore(): any,

    insertInContainerBefore(): any,

    removeChild(parent: any, child: any): any,

    removeChildFromContainer(container: any, child: any): void;
  }


  enum TypeOfWork {
    IndeterminateComponent = 0, // Before we know whether it is functional or class
    FunctionalComponent = 1,
    ClassComponent = 2,
    HostRoot = 3, // Root of a host tree. Could be nested inside another node.
    HostPortal = 4, // A subtree. Could be an entry point to a different renderer.
    HostComponent = 5,
    HostText = 6,
    CoroutineComponent = 7,
    CoroutineHandlerPhase = 8,
    YieldComponent = 9,
    Fragment = 10
  }

  enum PriorityLevel {
    NoWork, // No work is pending.
    SynchronousPriority, // For controlled text inputs. Synchronous side-effects.
    TaskPriority, // Completes at the end of the current tick.
    HighPriority, // Interaction that needs to complete pretty soon to feel responsive.
    LowPriority, // Data fetching, or result from updating stores.
    OffscreenPriority, // Won't be visible but do the work in case it becomes visible.
  }

  interface $Subtype<State> {

  }

  type PartialState<State, Props> =
    | $Subtype<State>
    | ((prevState: State, props: Props) => $Subtype<State>);

  interface Update {
    priorityLevel: PriorityLevel,
    partialState: PartialState<any, any>,
    callback: Function | null,
    isReplace: boolean,
    isForced: boolean,
    isTopLevelUnmount: boolean,
    next: Update | null,
  }

  interface UpdateQueue {

    first: Update | null,
    last: Update | null,
    hasForceUpdate: boolean,
    callbackList: null | Array<() => any>,

    // Dev only
    isProcessing?: boolean,
  }

  enum TypeOfInternalContext {
    NoContext = 0,
    AsyncUpdates = 1,
  }

  enum TypeOfSideEffect {
    // Don't change these two values:
    NoEffect = 0, //           0b00000000
    PerformedWork = 1, //      0b00000001
    // You can change the rest (and add more).
    Placement = 2, //          0b00000010
    Update = 4, //             0b00000100
    PlacementAndUpdate = 6, // 0b00000110
    Deletion = 8, //           0b00001000
    ContentReset = 16, //      0b00010000
    Callback = 32, //          0b00100000
    Err = 64, //               0b01000000
    Ref = 128, //              0b10000000
  }

  type DebugID = number;

  interface Source {
    fileName: string,
    lineNumber: number,
  }

  interface Fiber {
    // These first fields are conceptually members of an Instance. This used to
    // be split into a separate type and intersected with the other Fiber fields,
    // but until Flow fixes its intersection bugs, we've merged them into a
    // single type.

    // An Instance is shared between all versions of a component. We can easily
    // break this out into a separate object to avoid copying so much to the
    // alternate versions of the tree. We put this on a single object for now to
    // minimize the number of objects created during the initial render.

    // Tag identifying the type of fiber.
    tag: TypeOfWork,

    // Unique identifier of this child.
    key: null | string,

    // The function/class/module associated with this fiber.
    type: any,

    // The local state associated with this fiber.
    stateNode: any,

    // Conceptual aliases
    // parent : Instance -> return The parent happens to be the same as the
    // return fiber since we've merged the fiber and instance.

    // Remaining fields belong to Fiber

    // The Fiber to return to after finishing processing this one.
    // This is effectively the parent, but there can be multiple parents (two)
    // so this is only the parent of the thing we're currently processing.
    // It is conceptually the same as the return address of a stack frame.
    return: Fiber | null,

    // Singly Linked List Tree Structure.
    child: Fiber | null,
    sibling: Fiber | null,
    index: number,

    // The ref last used to attach this node.
    // I'll avoid adding an owner field for prod and model that as functions.
    ref: null | (((handle: any) => void) & { _stringRef: string | null }),

    // Input is the data coming into process this fiber. Arguments. Props.
    pendingProps: any, // This type will be more specific once we overload the tag.
    memoizedProps: any, // The props used to create the output.

    // A queue of state updates and callbacks.
    updateQueue: UpdateQueue | null,

    // The state used to create the output
    memoizedState: any,

    // Bitfield that describes properties about the fiber and its subtree. E.g.
    // the AsyncUpdates flag indicates whether the subtree should be async-by-
    // default. When a fiber is created, it inherits the internalContextTag of its
    // parent. Additional flags can be set at creation time, but after than the
    // value should remain unchanged throughout the fiber's lifetime, particularly
    // before its child fibers are created.
    internalContextTag: TypeOfInternalContext,

    // Effect
    effectTag: TypeOfSideEffect,

    // Singly linked list fast path to the next fiber with side-effects.
    nextEffect: Fiber | null,

    // The first and last fiber with side-effect within this subtree. This allows
    // us to reuse a slice of the linked list when we reuse the work done within
    // this fiber.
    firstEffect: Fiber | null,
    lastEffect: Fiber | null,

    // This will be used to quickly determine if a subtree has no pending changes.
    pendingWorkPriority: PriorityLevel,

    // This is a pooled version of a Fiber. Every fiber that gets updated will
    // eventually have a pair. There are cases when we can clean up pairs to save
    // memory if we need to.
    alternate: Fiber | null,

    // Conceptual aliases
    // workInProgress : Fiber ->  alternate The alternate used for reuse happens
    // to be the same as work in progress.
    // __DEV__ only
    _debugID?: DebugID,
    _debugSource?: Source | null,
    _debugOwner?: Fiber | React.ReactInstance | null, // Stack compatible
    _debugIsCurrentlyTiming?: boolean,
  }

  interface FiberRoot {
    // Any additional information from the host associated with this root.
    containerInfo: any,
    // The currently active root fiber. This is the mutable root of the tree.
    current: Fiber,
    // Determines if this root has already been added to the schedule for work.
    isScheduled: boolean,
    // The work schedule is a linked list.
    nextScheduledRoot: FiberRoot | null,
    // Top context object, used by renderSubtreeIntoContainer
    context: Object | null,
    pendingContext: Object | null,
  }
}


declare module 'react-fiber-export/lib/renderers/shared/fiber/ReactFiberReconciler' {

  function ReactFiberReconciler(config: ReactFiber.ReactFiberRendererConfig): any;

  export = ReactFiberReconciler;
}

declare module 'react-fiber-export/lib/renderers/shared/fiber/isomorphic/ReactPortal' {
  class ReactDOMFrameScheduling {
    static createPortal(a: any, b: any, c: any): any;
  }

  export = ReactDOMFrameScheduling;
}

declare module 'react-fiber-export/lib/renderers/shared/ReactDOMFrameScheduling' {
  class ReactDOMFrameScheduling {
    static rIC(): number;
  }

  export = ReactDOMFrameScheduling;
}

declare module 'react-fiber-export/lib/renderers/shared/fiber/ReactFiberDevToolsHook' {

  export function injectInternals(internals: ReactDevtools.HookConfig): any;

  export function onCommitRoot(root: ReactFiber.FiberRoot): any;

  export function onCommitUnmount(): any;
}

declare namespace ReactDevtools {
  enum BundleType {
    PROD = 0,
    DEV = 1
  }

  interface HookConfig {
    findFiberByHostInstance: Function,
    findHostInstanceByFiber: Function,
    // This is an enum because we may add more (e.g. profiler build)
    bundleType: number,
    version: string,
    rendererPackageName: string,
  }

  interface RendererInfo {
    renderer: HookConfig;
    id: number;
  }

  interface Agent {
    on(event: string, callback: Function): any;
  }

  interface GlobalHook {
    sub(name: "react-devtools",
        callback: (agent: ReactDevtools.Agent) => void): Function;

    sub(name: "renderer",
        callback: (rendererInfo: ReactDevtools.RendererInfo) => void): Function;

    reactDevtoolsAgent: ReactDevtools.Agent;
  }
}

interface Process {
  env: {
    NODE_ENV: string,
    ENABLE_REACT_ADDON_HOOKS: string;
  };
}

declare const process: Process;

declare const __REACT_DEVTOOLS_GLOBAL_HOOK__: ReactDevtools.GlobalHook;

interface Window {
  __DEV__: Boolean,
}
