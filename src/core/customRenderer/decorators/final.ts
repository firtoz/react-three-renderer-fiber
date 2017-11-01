export default function final(instanceParameterIndex: number = 0): any {
  return (target: any,
          propertyKey: string,
          descriptor: PropertyDescriptor): void => {
    descriptor.writable = false;
    descriptor.configurable = false;
  };
}
