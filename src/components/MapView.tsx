import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";

const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState(false);

  // タイムゾーンオプション
  const timezoneOptions = [
    "+00:00",
    "+01:00",
    "+02:00",
    "+03:00",
    "+03:30",
    "+04:00",
    "+04:30",
    "+05:00",
    "+05:30",
    "+05:45",
    "+06:00",
    "+06:30",
    "+07:00",
    "+08:00",
    "+08:45",
    "+09:00",
    "+09:30",
    "+10:00",
    "+10:30",
    "+11:00",
    "+12:00",
    "+12:45",
    "+13:00",
    "+14:00",
    "-01:00",
    "-02:00",
    "-03:00",
    "-03:30",
    "-04:00",
    "-05:00",
    "-06:00",
    "-07:00",
    "-08:00",
    "-09:00",
    "-09:30",
    "-10:00",
    "-11:00"
  ];

  // 経度15度ごとの経線GeoJSONデータを生成
  const createMeridianLines = (): GeoJSON.FeatureCollection => {
    const features: GeoJSON.Feature[] = [];
    for (let lng = -180; lng <= 180; lng += 15) {
      features.push({
        type: "Feature",
        properties: { longitude: lng },
        geometry: {
          type: "LineString",
          coordinates: [[lng, -85], [lng, 85]]
        }
      });
    }
    return {
      type: "FeatureCollection",
      features
    };
  };

  // 経線上の時差ラベル用ポイントデータを生成
  const createMeridianLabels = (): GeoJSON.FeatureCollection => {
    const features: GeoJSON.Feature[] = [];
    for (let lng = -180; lng <= 180; lng += 15) {
      // 理論的な時差を計算（経度15度 = 1時間の時差）
      const hourOffset = lng / 15;
      const offsetText = hourOffset >= 0 ? `+${hourOffset.toFixed(2)}` : hourOffset.toFixed(2);
      
      features.push({
        type: "Feature",
        properties: { 
          longitude: lng,
          offset: offsetText
        },
        geometry: {
          type: "Point",
          coordinates: [lng, -60] // 南緯60度
        }
      });
    }
    return {
      type: "FeatureCollection",
      features
    };
  };

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

      // timezone-fillレイヤーのクリックイベントを追加
      map.on("click", "timezone-fill", (e) => {
        console.log("Timezone clicked:", e.features); // デバッグ用
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const utcOffset = feature.properties?.UTC_offset;
          console.log("UTC Offset:", utcOffset); // デバッグ用
          if (utcOffset && timezoneOptions.includes(utcOffset)) {
            setSelectedTimezone(utcOffset);
          }
        }
      });

      // マウスカーソルをpointerに変更
      map.on("mouseenter", "timezone-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "timezone-fill", () => {
        map.getCanvas().style.cursor = "";
      });

      setMapLoaded(true);
    });

    return () => {
      map.remove();
    };
  }, []);

  // タイムゾーン選択時の処理
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      // fill-opacityを動的に更新して選択されたタイムゾーンのみ表示
      mapRef.current.setPaintProperty("timezone-fill", "fill-opacity", [
        "case",
        ["==", ["get", "UTC_offset"], selectedTimezone || ""],
        selectedTimezone ? 0.5 : 0,
        0
      ]);
    }
  }, [selectedTimezone, mapLoaded]);

  return (
    <>
      {/* タイムゾーン選択プルダウン */}
      <div style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1000,
        background: "white",
        padding: "8px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
      }}>
        <label htmlFor="timezone-select" style={{ display: "block", marginBottom: "4px", fontSize: "14px", fontWeight: "bold" }}>
          Time Zone
        </label>
        <select
          id="timezone-select"
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          style={{
            padding: "4px 8px",
            borderRadius: "2px",
            border: "1px solid #ccc",
            fontSize: "14px",
            minWidth: "120px"
          }}
        >
          <option value="">-- 選択してください --</option>
          {timezoneOptions.map(tz => (
            <option key={tz} value={tz}>
              UTC{tz}
            </option>
          ))}
        </select>
      </div>

      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
    </>
  );
};

export default MapView;
