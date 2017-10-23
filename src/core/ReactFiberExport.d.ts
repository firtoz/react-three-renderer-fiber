declare module "react-fiber-export" {
  export interface IReactFiberRendererConfig {
    scheduleDeferredCallback: any;
    useSyncScheduling: boolean;

    getRootHostContext(rootContainerInstance: any): any;

    getChildHostContext(parentHostContext: any, type: any): any;

    shouldSetTextContent(props: any): boolean;

    shouldDeprioritizeSubtree(type: any, props: any): boolean;

    createInstance(type: string,
                   props: any,
                   rootContainerInstance: any,
                   hostContext: any,
                   internalInstanceHandle: any): any;

    finalizeInitialChildren(r3rElement: any, type: any, props: any, rootContainerInstance: any): boolean;

    prepareForCommit(): void;

    resetAfterCommit(): void;

    prepareUpdate(instance: any,
                  type: any,
                  oldProps: any,
                  newProps: any,
                  rootContainerInstance: any,
                  hostContext: any): any;

    commitUpdate(instance: any,
                 updatePayload: any,
                 type: any,
                 oldProps: any,
                 newProps: any,
                 internalInstanceHandle: any): void;

    appendChild(parentInstance: any, child: any): any;

    appendInitialChild(parentInstance: any, child: any): void;

    getPublicInstance(instance: any): any;

    createTextInstance(text: string, rootContainerInstance: any, internalInstanceHandle: any): any;

    commitMount(): any;

    resetTextContent(): any;

    commitTextUpdate(): any;

    appendChildToContainer(parent: any, child: any): any;

    insertBefore(parentInstance: any, childInstance: any, before: any): any;

    insertInContainerBefore(container: any, childInstance: any, before: any): any;

    removeChild(parent: any, child: any): any;

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
    Fragment = 10,
  }

  enum PriorityLevel {
    NoWork, // No work is pending.
    SynchronousPriority, // For controlled text inputs. Synchronous side-effects.
    TaskPriority, // Completes at the end of the current tick.
    HighPriority, // Interaction that needs to complete pretty soon to feel responsive.
    LowPriority, // Data fetching, or result from updating stores.
    OffscreenPriority, // Won't be visible but do the work in case it becomes visible.
  }

  type PartialState<State, Props> =
    | {}
    | ((prevState: State, props: Props) => {});

  interface IUpdate {
    priorityLevel: PriorityLevel;
    partialState: PartialState<any, any>;
    callback: () => void | null;
    isReplace: boolean;
    isForced: boolean;
    isTopLevelUnmount: boolean;
    next: IUpdate | null;
  }

  interface IUpdateQueue {

    first: IUpdate | null;
    last: IUpdate | null;
    hasForceUpdate: boolean;
    callbackList: null | Array<() => any>;

    // Dev only
    isProcessing?: boolean;
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

  interface ISource {
    fileName: string;
    lineNumber: number;
  }

  interface IFiber<T = any> {
    // These first fields are conceptually members of an Instance. This used to
    // be split into a separate type and intersected with the other Fiber fields,
    // but until Flow fixes its intersection bugs, we've merged them into a
    // single type.

    // An Instance is shared between all versions of a component. We can easily
    // break this out into a separate object to avoid copying so much to the
    // alternate versions of the tree. We put this on a single object for now to
    // minimize the number of objects created during the initial render.

    // Tag identifying the type of fiber.
    tag: TypeOfWork;

    // Unique identifier of this child.
    key: null | string;

    // The function/class/module associated with this fiber.
    type: any;

    // The local state associated with this fiber.
    stateNode: any;

    // Conceptual aliases
    // parent : Instance -> return The parent happens to be the same as the
    // return fiber since we've merged the fiber and instance.

    // Remaining fields belong to Fiber

    // The Fiber to return to after finishing processing this one.
    // This is effectively the parent, but there can be multiple parents (two)
    // so this is only the parent of the thing we're currently processing.
    // It is conceptually the same as the return address of a stack frame.
    "return": IFiber | null;

    // Singly Linked List Tree Structure.
    child: IFiber | null;
    sibling: IFiber | null;
    index: number;

    // The ref last used to attach this node.
    // I'll avoid adding an owner field for prod and model that as functions.
    ref: React.Ref<T> | null;

    // Input is the data coming into process this fiber. Arguments. Props.
    pendingProps: any; // This type will be more specific once we overload the tag.
    memoizedProps: any; // The props used to create the output.

    // A queue of state updates and callbacks.
    updateQueue: IUpdateQueue | null;

    // The state used to create the output
    memoizedState: any;

    // Bitfield that describes properties about the fiber and its subtree. E.g.
    // the AsyncUpdates flag indicates whether the subtree should be async-by-
    // default. When a fiber is created, it inherits the internalContextTag of its
    // parent. Additional flags can be set at creation time, but after than the
    // value should remain unchanged throughout the fiber's lifetime, particularly
    // before its child fibers are created.
    internalContextTag: TypeOfInternalContext;

    // Effect
    effectTag: TypeOfSideEffect;

    // Singly linked list fast path to the next fiber with side-effects.
    nextEffect: IFiber | null;

    // The first and last fiber with side-effect within this subtree. This allows
    // us to reuse a slice of the linked list when we reuse the work done within
    // this fiber.
    firstEffect: IFiber | null;
    lastEffect: IFiber | null;

    // This will be used to quickly determine if a subtree has no pending changes.
    pendingWorkPriority: PriorityLevel;

    // This is a pooled version of a Fiber. Every fiber that gets updated will
    // eventually have a pair. There are cases when we can clean up pairs to save
    // memory if we need to.
    alternate: IFiber | null;

    // Conceptual aliases
    // workInProgress : Fiber ->  alternate The alternate used for reuse happens
    // to be the same as work in progress.
    // __DEV__ only
    _debugID?: DebugID;
    _debugSource?: ISource | null;
    _debugOwner?: IFiber | React.ReactInstance | null; // Stack compatible
    _debugIsCurrentlyTiming?: boolean;
  }

  interface IFiberRoot {
    // Any additional information from the host associated with this root.
    containerInfo: any;
    // The currently active root fiber. This is the mutable root of the tree.
    current: IFiber;
    // Determines if this root has already been added to the schedule for work.
    isScheduled: boolean;
    // The work schedule is a linked list.
    nextScheduledRoot: IFiberRoot | null;
    // Top context object, used by renderSubtreeIntoContainer
    context: object | null;
    pendingContext: object | null;
  }

  interface IRenderer {
    createContainer(container: any): any;

    unbatchedUpdates(callback: () => void): any;

    updateContainer(children: any, root: any, parentComponent: any, callback: () => void): void;

    getPublicRootInstance(root: any): any;

    findHostInstance(componentOrElement: any): any;
  }

  export function ReactFiberReconciler(config: IReactFiberRendererConfig): IRenderer;

  export class ReactFiberDevToolsHook {
    public static injectInternals(internals: ReactDevtools.IHookConfig): any;

    public static onCommitRoot(root: IFiberRoot): any;

    public static onCommitUnmount(): any;
  }

  export class ReactDOMFrameScheduling {
    public static rIC(): number;
  }

  export class ReactFiberContext {
    public static getUnmaskedContext(fiber: IFiber): any;
  }

  export class ReactFiber {
    public static createFiberFromHostInstanceForDeletion(): IFiber;

    public static createFiberFromElementType(type: any,
                                             key: null | string,
                                             internalContextTag: number,
                                             debugOwner?: IFiber | React.ReactInstance | null): IFiber;
  }

  export class ReactDebugCurrentFiber {
    public static getCurrentFiberStackAddendum(): string | null;
  }
}
