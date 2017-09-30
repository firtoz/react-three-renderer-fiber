export default function appendChildToContainer(parentInstance: any, child: any): any {
  console.log('appendChildToContainer');

  if (parentInstance instanceof HTMLCanvasElement) {
    // party time!
    return;
  }

  throw new Error('appendChildToContainer');
  // return false;
};
