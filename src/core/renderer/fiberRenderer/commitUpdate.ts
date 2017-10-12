import {IFiber} from "react-fiber-export";
import nativeTypes from "../../nativeTypes";
import {IPropMap} from "./prepareUpdate";

export default function commitUpdate(instance: any,
                                     // update payload will never be null
                                     updatePayload: any[],
                                     type: string,
                                     oldProps: IPropMap,
                                     newProps: IPropMap,
                                     fiber: IFiber) {
  nativeTypes[fiber.type].commitUpdate(instance, updatePayload, oldProps, newProps);
}
