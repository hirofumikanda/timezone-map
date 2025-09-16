import { useEffect } from "react";
import maplibregl from "maplibre-gl";

export const useMapEvents = (
  map: maplibregl.Map | null,
  mapLoaded: boolean,
  timezoneOptions: string[],
  setSelectedTimezone: (timezone: string) => void
) => {
  useEffect(() => {
    if (!map || !mapLoaded) return;

    // timezone-fillレイヤーのクリックイベント
    const handleTimezoneClick = (e: maplibregl.MapLayerMouseEvent) => {
      console.log("Timezone clicked:", e.features);
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const utcOffset = feature.properties?.UTC_offset;
        console.log("UTC Offset:", utcOffset);
        if (utcOffset && timezoneOptions.includes(utcOffset)) {
          setSelectedTimezone(utcOffset);
        }
      }
    };

    // マウスカーソル変更イベント
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    // イベントリスナー追加
    map.on("click", "timezone-fill", handleTimezoneClick);
    map.on("mouseenter", "timezone-fill", handleMouseEnter);
    map.on("mouseleave", "timezone-fill", handleMouseLeave);

    // クリーンアップ
    return () => {
      map.off("click", "timezone-fill", handleTimezoneClick);
      map.off("mouseenter", "timezone-fill", handleMouseEnter);
      map.off("mouseleave", "timezone-fill", handleMouseLeave);
    };
  }, [map, mapLoaded, timezoneOptions, setSelectedTimezone]);
};