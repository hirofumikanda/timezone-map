// 経度15度ごとの経線GeoJSONデータを生成
export const createMeridianLines = (): GeoJSON.FeatureCollection => {
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
export const createMeridianLabels = (): GeoJSON.FeatureCollection => {
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