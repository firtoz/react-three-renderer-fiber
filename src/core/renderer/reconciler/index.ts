import {IRenderer} from "react-fiber-export";
import createReconciler from "../../customRenderer/createReconciler";
import r3rReconcilerConfig from "./r3rReconcilerConfig";

const ReactThreeFiberRenderer: IRenderer = createReconciler(r3rReconcilerConfig);

export default ReactThreeFiberRenderer;
