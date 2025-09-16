import { useEffect } from "react";
import maplibregl from "maplibre-gl";

export const useTimezoneSelection = (
  map: maplibregl.Map | null,
  mapLoaded: boolean,
  selectedTimezone: string
) => {
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // fill-opacityを動的に更新して選択されたタイムゾーンのみ表示
    map.setPaintProperty("timezone-fill", "fill-opacity", [
      "case",
      ["==", ["get", "UTC_offset"], selectedTimezone || ""],
      selectedTimezone ? 0.5 : 0,
      0
    ]);
  }, [map, mapLoaded, selectedTimezone]);
};