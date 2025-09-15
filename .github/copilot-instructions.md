# Timezone Map - AI Coding Agent Instructions

## Project Overview
This is a React-TypeScript timezone visualization application using MapLibre GL and PMTiles for efficient map rendering. The app displays global timezone boundaries with interactive filtering and theoretical timezone offset visualization via meridian lines.

## Architecture & Data Flow

### Core Components
- **`src/components/MapView.tsx`**: Single main component handling all map functionality
- **`public/styles/style.json`**: MapLibre style configuration with multiple data sources
- **`public/data/`**: Geospatial data files (PMTiles for vector tiles, GeoJSON for timezone boundaries)

### Key Data Sources
- `timezone.geojson`: Contains timezone polygons with `UTC_offset` properties (e.g., "+09:00", "-05:00")
- `country.pmtiles`: Vector tiles for country boundaries 
- `country_label.geojson`: Country name labels

## MapLibre GL Patterns

### Layer Management
- **Dynamic visibility**: Use `setLayoutProperty("layer-id", "visibility", "visible|none")`
- **Runtime filtering**: Use `setFilter("layer-id", ["==", ["get", "property"], value])`
- **Layer ordering**: Order matters - fill layers before line layers before symbol layers

### GeoJSON Generation Pattern
```typescript
const createGeoJSONData = (): GeoJSON.FeatureCollection => {
  const features: GeoJSON.Feature[] = [];
  // Generate features programmatically
  return { type: "FeatureCollection", features };
};
```

### Map Initialization Sequence
1. Register PMTiles protocol: `maplibregl.addProtocol("pmtiles", protocol.tile)`
2. Create map with style reference
3. Add sources and layers in `map.on("load")` callback
4. Set `mapLoaded` state for UI interactions

## Development Patterns

### State Management
- Use `mapRef.current` for direct MapLibre API access
- `mapLoaded` state prevents premature layer operations
- Component state for UI controls (timezone selection)

### Timezone Data Structure
Timezone options array mirrors the exact `UTC_offset` values in the GeoJSON:
```typescript
const timezoneOptions = ["+00:00", "+01:00", ..., "-11:00"];
```

### Text Rendering
- Use "Noto Sans Regular" font for Japanese/international text compatibility
- Apply text halos for readability: `"text-halo-color": "#ffffff", "text-halo-width": 1`

## Build & Deployment

### Commands
- `npm run dev`: Development server
- `npm run build`: TypeScript compilation + Vite build  
- `npm run deploy`: Automated GitHub Pages deployment

### Asset Handling
- Static assets in `public/` are served directly
- PMTiles files use custom protocol: `pmtiles:///timezone-map/data/file.pmtiles`
- Relative paths for other assets: `data/file.geojson`

## Integration Points

### PMTiles Integration
- Initialize Protocol before map creation
- Reference in style.json as: `"url": "pmtiles:///timezone-map/data/file.pmtiles"`
- Requires explicit protocol registration per map instance

### GitHub Pages Deployment
- Configured with `homepage` in package.json
- Uses `gh-pages` package for automated deployment
- Build output in `dist/` directory

## Critical Development Notes

- **Map operations**: Only call after `mapLoaded` state is true
- **Layer filters**: Use MapLibre expression syntax: `["==", ["get", "property"], value]`
- **Coordinate system**: [longitude, latitude] format for GeoJSON coordinates
- **Font references**: Must match available fonts in `public/font/` directory
- **Timezone offsets**: Include colons in format ("+09:00" not "+0900")