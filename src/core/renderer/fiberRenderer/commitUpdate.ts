export default function commitUpdateInternal(instance: any,
                                             updatePayload: any,
                                             type: any,
                                             /* oldProps: any, */
                                             /* newProps: any, */
                                             /* internalInstanceHandle: any */) {
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
            throw new Error("Cannot update prop " + propName + " for " + type);
        }

        break;
      case "mesh":
        switch (propName) {
          case "rotation":
            instance.rotation.copy(newValue);
            break;
          default:
            throw new Error("Cannot update prop " + propName + " for " + type);
        }

        break;
      case "perspectiveCamera":

        switch (propName) {
          case "aspect":
            instance.aspect = newValue;
            instance.updateProjectionMatrix();
            break;
          default:
            throw new Error("Cannot update prop " + propName + " for " + type);
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
        throw new Error("Cannot update prop " + propName + " for " + type);
    }
  }

  if (type === "webglRenderer" && sizeUpdates) {
    const newSize = Object.assign({}, instance.getSize(), sizeUpdates);

    instance.setSize(newSize.width, newSize.height);
  }
}
