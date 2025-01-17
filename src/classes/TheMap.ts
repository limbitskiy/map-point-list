import { MapPoint } from "@/classes/MapPoint";
import { ref } from "vue";
import type { MapOptions } from "@/types";

export class TheMap {
  public readonly center: number[] = [37.623072, 55.752458];
  public readonly zoom: number = 10;
  public points: MapPoint[] = [];
  public isPointsGenerated = ref(false);

  constructor({ pointAmount, center, zoom }: MapOptions) {
    this.center = center;
    this.zoom = zoom;
    this.generatePoints(pointAmount);
    this.isPointsGenerated.value = true;
  }

  generatePoints(amount: number) {
    for (let i = 1; i < amount + 1; i++) {
      const point = this.generateSinglePoint(i);
      this.points.push(point);
    }
  }

  generateSinglePoint(mapPointIdx: number) {
    const name = `Точка№ ${mapPointIdx}`;
    const xCoord = this.center[0] + (Math.random() - 0.5) * 0.5;
    const yCoord = this.center[1] + (Math.random() - 0.5) * 0.5;
    const adress = "ул. 5-я Парковая, 33-489";

    return new MapPoint(name, xCoord, yCoord, adress);
  }
}
