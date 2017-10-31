import {IHostContext} from "../../renderer/reactThreeRenderer";
import {CustomReconcilerConfig, IPropMap} from "../../customRenderer/createReconciler";
import {IFiber} from "react-fiber-export";
import {hookDevtools} from "../../customRenderer/utils/DevtoolsHelpers";
import ReactThreeRendererDescriptor from "../../renderer/hostDescriptors/common/ReactThreeRendererDescriptor";
import {INativeElement} from "../../customRenderer/customRenderer";

export class WRConfig extends CustomReconcilerConfig<ReactThreeRendererDescriptor> {

}

const wrConfig: WRConfig = new WRConfig();

hookDevtools(wrConfig);

export default wrConfig;
