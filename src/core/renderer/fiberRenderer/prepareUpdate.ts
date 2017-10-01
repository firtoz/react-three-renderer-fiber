function diffProperties(lastProps: any, nextProps: any) {
  // if (process.env.NODE_ENV !== 'production') {
  //   validatePropertiesInDevelopment(tag, nextRawProps); // TODO
  // }

  let updatePayload: (string | null)[] | null = null;

  const lastPropsKeys = Object.keys(lastProps);

  for (let i = 0; i < lastPropsKeys.length; ++i) {
    const propKey = lastPropsKeys[i];

    if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
      continue;
    }
    (updatePayload = updatePayload || []).push(propKey, null);
  }

  const nextPropsKeys = Object.keys(nextProps);

  const hasLastProps = !!lastProps;

  for (let i = 0; i < nextPropsKeys.length; ++i) {
    const propKey = nextPropsKeys[i];

    const nextProp = nextProps[propKey];
    const lastProp = hasLastProps ? lastProps[propKey] : undefined;
    if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (!nextProp) && (!lastProp)) {
      continue;
    }

    if (propKey === 'children') {
      if (lastProp !== nextProp && (typeof nextProp === 'string' || typeof nextProp === 'number')) {
        (updatePayload = updatePayload || []).push(propKey, '' + nextProp);
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }

  return updatePayload;
}


export default function prepareUpdate(instance: any, type: any, oldProps: any, newProps: any, rootContainerInstance: any, hostContext: any) {
  return diffProperties(
    oldProps,
    newProps,
  );
}
