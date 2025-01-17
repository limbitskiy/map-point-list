<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as maptalks from "maptalks";

// types
import "maptalks";
import type { MapPoint } from "@/classes/MapPoint";

// store
import { useMapStore } from "@/store/map";
import { storeToRefs } from "pinia";

// markers
import PurpleMarker from "@/assets/purple-marker.svg";
import RedMarker from "@/assets/red-marker.svg";
import InfoIcon from "@/assets/info.svg";

const store = useMapStore();
const { center, zoom, selectMapPoint } = store;
const { visibleMapPoints, selectedMapPoint } = storeToRefs(store);

let map: maptalks.Map;
let layer: maptalks.Layer;
let lastClickedMarker: maptalks.Marker;
let infoWindow: maptalks.ui.InfoWindow;

const mapContainer = ref();

const handleMarkerSelection = (marker: maptalks.Marker) => {
  lastClickedMarker?.updateSymbol({
    markerFile: PurpleMarker,
  });
  lastClickedMarker = marker;

  marker.updateSymbol({
    markerFile: RedMarker,
  });
};

const createMap = () => {
  return new maptalks.Map(mapContainer.value, {
    center,
    zoom,
    baseLayer: new maptalks.TileLayer("base", {
      urlTemplate: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c", "d"],
      attribution: '&copy; <a href="http://www.osm.org/copyright">OSM</a> contributors, ' + '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    }),
  });
};

const refreshMapPoints = () => {
  visibleMapPoints.value.forEach((_mapPoint) => {
    const mapPoint = _mapPoint as MapPoint;

    const marker = new maptalks.Marker(mapPoint.coords, {
      symbol: {
        markerFile: PurpleMarker,
        markerWidth: 30,
        markerHeight: 30,
        markerHorizontalAlignment: "middle",
        markerVerticalAlignment: "middle",
      },
    })
      .on("click", () => {
        selectMapPoint(mapPoint);
        selectMarker(mapPoint);
      })
      .addTo(layer);

    mapPoint.markerRef = <maptalks.Marker>marker;
  });
};

const openInfoWindow = (mapPoint: MapPoint) => {
  const windowOptions = {
    content: `<div class="info-content flex flex-col gap-1 text-[14px]"><div class="marker-name flex items-center gap-2"><img class="h-4" src="${InfoIcon}"/><span>${mapPoint.name}</span></div><div class="street-name flex  items-center gap-2"><img class="h-4" src="${PurpleMarker}"/><span>${mapPoint.adress}</span></div></div>`,
  };
  infoWindow = new maptalks.ui.InfoWindow({});
  infoWindow.setOptions(windowOptions);

  const markerRef = mapPoint.markerRef as maptalks.Marker;

  infoWindow.addTo(markerRef);
  infoWindow.show(markerRef.getCoordinates());
};

const selectMarker = (mapPoint: MapPoint) => {
  handleMarkerSelection(mapPoint.markerRef as maptalks.Marker);
  openInfoWindow(mapPoint);
};

watch(
  () => visibleMapPoints.value.size,
  () => {
    layer.clear();
    infoWindow?.hide();
    refreshMapPoints();
  }
);

watch(selectedMapPoint, (mapPoint) => {
  if (!mapPoint) {
    infoWindow?.hide();
    return;
  }
  selectMarker(mapPoint as MapPoint);
});

onMounted(() => {
  map = createMap();
  layer = new maptalks.VectorLayer("vector").addTo(map);
});
</script>

<template>
  <div ref="mapContainer" class="w-full h-full">map</div>
</template>

<style lang="scss">
.maptalks-msgBox {
  @apply bg-white text-black p-4 rounded-lg shadow-xl !w-[clamp(200px,_20vw,_320px)] !transition-all;
}

.maptalks-close {
  @apply absolute top-[.5rem] right-[1rem];
}
</style>
