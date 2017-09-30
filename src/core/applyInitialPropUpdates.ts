export default function applyInitialPropUpdates(type: string, createdInstance: any, props: any) {
  switch (type) {
    case 'boxGeometry':
    case 'meshBasicMaterial':
    case 'scene':
      break;
    case 'webglRenderer': {
      const {
        width,
        height,
      } = props;

      createdInstance.setSize(width, height);

      break;
    }
    case 'mesh':
      const {
        rotation,
      } = props;

      createdInstance.rotation.copy(rotation);

      break;
    case 'perspectiveCamera':
      const {
        name,
        position,
      } = props;

      createdInstance.position.copy(position);
      createdInstance.name = name;

      break;
    default:
      throw new Error('cannot apply props for this type yet: ' + type);
  }
}
