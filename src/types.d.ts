import "maptalks";

declare module "maptalks" {
  interface Layer {
    clear(): void;
  }
}

export interface MapOptions {
  pointAmount: number;
  center: number[];
  zoom: number;
}
