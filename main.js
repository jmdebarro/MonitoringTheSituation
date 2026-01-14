import maplibregl from 'maplibre-gl';

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  center: [0, 20],
  zoom: 1.9
});

map.on('load', () => {
  map.addSource('countries', {
    type: 'geojson',
      data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson',
    generateId: true
  });

  map.addLayer({
    id: 'countries-clickable',
    type: 'fill',
    source: 'countries',
    paint: {
      'fill-color': 'transparent',
      'fill-opacity': 0
    }
  });
    
  map.addLayer({
    id: 'countries-hover',
    type: 'fill',
    source: 'countries',
    paint: {
      'fill-color': '#4a6fa5',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.5,
        0
      ]
    }
  });

  let hoveredCountryId = null;

  map.on('mousemove', 'countries-clickable', (e) => {
      if (e.features.length > 0) {
          let curentCountryId = e.features[0].id;
          if (curentCountryId !== hoveredCountryId) {
            // Clear previous hover
            if (hoveredCountryId !== null) {
                map.setFeatureState(
                { source: 'countries', id: hoveredCountryId },
                { hover: false }
                );
            }
            // Set new hover
            hoveredCountryId = e.features[0].id;
            map.setFeatureState(
                { source: 'countries', id: hoveredCountryId },
                { hover: true }
            );
          }
    }
  });

  map.on('mouseleave', 'countries-clickable', () => {
    if (hoveredCountryId !== null) {
      map.setFeatureState(
        { source: 'countries', id: hoveredCountryId },
        { hover: false }
      );
    }
    hoveredCountryId = null;
    map.getCanvas().style.cursor = '';
  });

  map.on('mouseenter', 'countries-clickable', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('click', 'countries-clickable', (e) => {
    console.log('Clicked:', e.features[0].properties.name);
  });
});