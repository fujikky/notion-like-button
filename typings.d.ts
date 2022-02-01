declare module "embeded-settings" {
  const settings: {
    readonly manifest: {
      readonly name: string;
      readonly description: string;
      readonly version: string;
    };
    readonly apiToken?: string;
    readonly likeProp?: string;
  };
  export default settings;
}
