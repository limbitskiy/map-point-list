import { v4 as uuidv4 } from "uuid";

export class MapPoint {
  public readonly id: string;
  public readonly name: string;
  private readonly long: number;
  private readonly lat: number;
  public readonly adress: string;
  public selected: boolean;
  public markerRef?: maptalks.Marker;

  constructor(name: string, long: number, lat: number, adress: string) {
    this.id = uuidv4();
    this.name = name;
    this.long = long;
    this.lat = lat;
    this.adress = adress;
    this.selected = false;
  }

  get coords() {
    return [this.long, this.lat];
  }
}
