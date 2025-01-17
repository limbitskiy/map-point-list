import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { MapPoint } from "@/classes/MapPoint";
import { TheMap } from "@/classes/TheMap";

export const useMapStore = defineStore("map", () => {
  const mapOptions = {
    pointAmount: 10000,
    center: [37.623072, 55.752458],
    zoom: 10,
  };

  const map = new TheMap(mapOptions);

  const state = ref({
    visibleMapPoints: new Set<MapPoint>(),
    selectedMapPoint: <MapPoint | null>null,
  });

  const visibleMapPoints = computed(() => state.value.visibleMapPoints);

  const selectedMapPoint = computed(() => state.value.selectedMapPoint);

  const addVisibleMapPoint = (point: MapPoint) => {
    state.value.visibleMapPoints.add(point);
  };

  const removeVisibleMapPoint = (point: MapPoint) => {
    state.value.visibleMapPoints.delete(point);
  };

  const selectMapPoint = (point: MapPoint | null) => {
    state.value.selectedMapPoint = point;
  };

  return {
    center: map.center,
    zoom: map.zoom,
    staticMapPoints: map.points,
    visibleMapPoints,
    selectedMapPoint,
    isMapPointsGenerated: map.isPointsGenerated,
    addVisibleMapPoint,
    removeVisibleMapPoint,
    selectMapPoint,
  };
});
