declare global {
  interface ObjectConstructor {
    hasProperty(obj: any, prop: string): boolean;
  }
}

Object.hasProperty = function (obj: any, prop: string): boolean {
  return prop in obj;
};

export {};
