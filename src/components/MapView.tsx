import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import TimezoneSelect from "./TimezoneSelect";
import { createMeridianLines, createMeridianLabels } from "../utils/geoDataUtils";
import { TIMEZONE_OPTIONS } from "../constants/timezones";
import { useMapEvents } from "../hooks/useMapEvents";
import { useTimezoneSelection } from "../hooks/useTimezoneSelection";

const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState(false);

  // カスタムフックを使用
  useMapEvents(mapRef.current, mapLoaded, TIMEZONE_OPTIONS, setSelectedTimezone);
  useTimezoneSelection(mapRef.current, mapLoaded, selectedTimezone);

  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: "styles/style.json",
      center: [139.21, 37.18],
      zoom: 1,
      minZoom: 1,
      hash: true,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      // 経線データソースを追加
      map.addSource("meridians", {
        type: "geojson",
        data: createMeridianLines()
      });

      // 経線ラベルデータソースを追加
      map.addSource("meridian-labels", {
        type: "geojson",
        data: createMeridianLabels()
      });

      // 経線レイヤーを追加
      map.addLayer({
        id: "meridian-lines",
        type: "line",
        source: "meridians",
        paint: {
          "line-color": "#666666",
          "line-width": 1,
          "line-opacity": 0.6,
          "line-dasharray": [2, 2]
        }
      });

      // 経線ラベルレイヤーを追加
      map.addLayer({
        id: "meridian-labels",
        type: "symbol",
        source: "meridian-labels",
        layout: {
          "text-field": ["get", "offset"],
          "text-size": 12,
          "text-font": ["Noto Sans Regular"],
          "text-anchor": "center",
          "text-justify": "center"
        },
        paint: {
          "text-color": "#333333",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1
        }
      });

      setMapLoaded(true);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <TimezoneSelect
        selectedTimezone={selectedTimezone}
        onTimezoneChange={setSelectedTimezone}
        timezoneOptions={TIMEZONE_OPTIONS}
      />
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
    </>
  );
};

export default MapView;
