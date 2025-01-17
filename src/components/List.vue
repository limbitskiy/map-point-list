<script setup lang="ts">
import { ref, watch, computed } from "vue";

// types
import type { MapPoint } from "@/classes/MapPoint";

// store
import { useMapStore } from "@/store/map";
import { storeToRefs } from "pinia";

const store = useMapStore();

const { visibleMapPoints, selectedMapPoint, isMapPointsGenerated } = storeToRefs(store);
const { staticMapPoints, addVisibleMapPoint, removeVisibleMapPoint, selectMapPoint } = store;

const scrollListRef = ref();

const allVisible = ref(false);
const filterShown = ref(false);
const filter = ref("");

const filteredMapPoints = computed(() => {
  if (!filter.value) {
    return staticMapPoints;
  } else {
    return staticMapPoints.filter((item) => item.name.includes(filter.value) || item.adress.includes(filter.value));
  }
});

const onShowMarker = (point: MapPoint) => {
  if (visibleMapPoints.value.has(point)) {
    removeVisibleMapPoint(point);
  } else {
    addVisibleMapPoint(point);
  }
};

const onShowAllMarkers = () => {
  allVisible.value = !allVisible.value;

  if (allVisible.value) {
    filteredMapPoints.value.forEach((item) => {
      addVisibleMapPoint(item as MapPoint);
    });
  } else {
    selectMapPoint(null);
    visibleMapPoints.value.clear();
  }
};

const onSelect = (point: MapPoint) => {
  if (!visibleMapPoints.value.has(point)) return;
  selectMapPoint(point);
};

watch(selectedMapPoint, (mapPoint) => {
  if (!mapPoint) return;

  const idx = filteredMapPoints.value.findIndex((item) => item.id === mapPoint.id);

  scrollListRef.value.scrollTo(idx, "center");
});
</script>

<template>
  <div class="points-list h-full p-4 pr-0">
    <div class="header flex items-center justify-between gap-2 pr-4">
      <div class="title flex flex-col gap-1 flex-1">
        <Transition name="filter-toggle" mode="out-in">
          <q-input v-if="filterShown" v-model="filter" outlined dense clearable />
          <span v-else class="text-[22px]">Точки</span>
        </Transition>
      </div>
      <div class="filter-icon">
        <q-btn square color="grey" icon="manage_search" class="!p-2" flat rounded @click="filterShown = !filterShown" />
      </div>
    </div>

    <div class="select-all flex items-center gap-1 my-1">
      <input class="cursor-pointer" type="checkbox" :checked="allVisible" @click="onShowAllMarkers" />
      <span class="select-none">Выбрать все</span>
    </div>

    <q-virtual-scroll
      v-if="isMapPointsGenerated"
      ref="scrollListRef"
      class="pr-4"
      component="q-list"
      :items="filteredMapPoints"
      v-slot="{ item }"
      style="max-height: calc(100dvh - 101px)"
    >
      <q-item class="flex !p-0 cursor-pointer" :key="item.id" dense>
        <div
          class="pill flex flex-col gap-1 border rounded-xl mt-2 !p-2 flex-1 transition-all"
          :class="{ 'border-purple-500': selectedMapPoint?.id === item.id }"
          @click="onSelect(item)"
        >
          <div class="top flex items-center gap-1">
            <q-checkbox :model-value="visibleMapPoints.has(item)" color="purple" @update:model-value="onShowMarker(item)" />
            <span>{{ item.name }}</span>
          </div>

          <div class="bottom px-2 text-[var(--accent-color)]">
            {{ item.adress }}
          </div>
        </div>
      </q-item>
    </q-virtual-scroll>
  </div>
</template>

<style lang="scss">
.filter-toggle-enter-active,
.filter-toggle-leave-active {
  transition: transform 0.2s ease;
}

.filter-toggle-enter-from,
.filter-toggle-leave-to {
  transform: translateX(-100%);
}
</style>
