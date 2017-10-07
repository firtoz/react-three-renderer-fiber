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
  let sizeUpdates: any = null;

  for (let i = 0; i < updatePayload.length; i += 2) {
    const propName = updatePayload[i];
    const newValue = updatePayload[i + 1];

    switch (type) {
      case "meshBasicMaterial":
        switch (propName) {
          case "color":
            instance.color.set(newValue);
            break;
          default:
          // throw new Error("Cannot update prop " + propName + " for " + type);
        }

        break;
      case "perspectiveCamera":
        switch (propName) {
          case "aspect":
            instance.aspect = newValue;
            instance.updateProjectionMatrix();
            break;
          default:
          // throw new Error("Cannot update prop " + propName + " for " + type);
        }
        break;
      case "webglRenderer":
        if (propName === "width" || propName === "height") {
          if (!sizeUpdates) {
            sizeUpdates = {};
          }

          sizeUpdates[propName] = newValue;
        }

        break;
      default:
      // throw new Error("Cannot update prop " + propName + " for " + type);
    }
  }

  if (type === "webglRenderer" && sizeUpdates) {
    const newSize = Object.assign({}, instance.getSize(), sizeUpdates);

    instance.setSize(newSize.width, newSize.height);
  }
}
