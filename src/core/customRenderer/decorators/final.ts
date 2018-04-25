export default function final(): any {
  return (target: any,
          propertyKey: string,
          descriptor: PropertyDescriptor): void => {
    descriptor.writable = false;
    descriptor.configurable = false;
  };
}
