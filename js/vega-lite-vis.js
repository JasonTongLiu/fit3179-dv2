const chartOptions = {
  actions: false,
  renderer: 'svg'
};

// Change this value when chart specifications are updated so local previews
// and GitHub Pages do not keep an older cached JSON specification.
const chartVersion = '20261029-01';

const animatedMapSelectors = new Set(['#chart-4', '#chart-5']);
const activeMapAnimations = new WeakMap();

function animateMapZoom(view) {
  const oldFrame = activeMapAnimations.get(view);
  if (oldFrame) cancelAnimationFrame(oldFrame);

  const start = {
    zoom: view.signal('map_zoom'),
    x: view.signal('map_x'),
    y: view.signal('map_y')
  };
  const target = {
    zoom: view.signal('map_target_zoom'),
    x: view.signal('map_target_x'),
    y: view.signal('map_target_y')
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    view.signal('map_zoom', target.zoom)
      .signal('map_x', target.x)
      .signal('map_y', target.y)
      .run();
    return;
  }

  const duration = 650;
  const startTime = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = ease(progress);
    view.signal('map_zoom', start.zoom + (target.zoom - start.zoom) * eased)
      .signal('map_x', start.x + (target.x - start.x) * eased)
      .signal('map_y', start.y + (target.y - start.y) * eased)
      .run();

    if (progress < 1) {
      activeMapAnimations.set(view, requestAnimationFrame(step));
    } else {
      activeMapAnimations.delete(view);
    }
  }

  activeMapAnimations.set(view, requestAnimationFrame(step));
}

function addMapZoomAnimation(view) {
  view.addSignalListener('state_select', () => {
    requestAnimationFrame(() => animateMapZoom(view));
  });
}

function animateWorldMap(view) {
  const oldFrame = activeMapAnimations.get(view);
  if (oldFrame) cancelAnimationFrame(oldFrame);

  const start = {
    x: view.signal('map_center_x'),
    y: view.signal('map_center_y'),
    scale: view.signal('map_scale_factor')
  };
  const target = {
    x: view.signal('map_target_center_x'),
    y: view.signal('map_target_center_y'),
    scale: view.signal('map_target_scale_factor')
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    view.signal('map_center_x', target.x)
      .signal('map_center_y', target.y)
      .signal('map_scale_factor', target.scale)
      .run();
    return;
  }

  const duration = 1000;
  const startTime = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = ease(progress);
    view.signal('map_center_x', start.x + (target.x - start.x) * eased)
      .signal('map_center_y', start.y + (target.y - start.y) * eased)
      .signal('map_scale_factor', start.scale + (target.scale - start.scale) * eased)
      .run();

    if (progress < 1) {
      activeMapAnimations.set(view, requestAnimationFrame(step));
    } else {
      activeMapAnimations.delete(view);
    }
  }

  activeMapAnimations.set(view, requestAnimationFrame(step));
}

function addWorldMapAnimation(view) {
  view.addSignalListener('continent_view', () => {
    requestAnimationFrame(() => animateWorldMap(view));
  });
}

const charts = [
  ['#chart-1', 'js/chart-01-trend.vg.json'],
  ['#chart-2', 'js/chart-02-month-heatmap.vg.json'],
  ['#chart-3', 'js/chart-03-target.vg.json'],
  ['#chart-4', 'js/chart-04-state-map.vg.json'],
  ['#chart-5', 'js/chart-05-sa4-map.vg.json'],
  ['#chart-6', 'js/chart-06-ridgeline.vg.json'],
  ['#chart-7', 'js/chart-07-radial.vg.json'],
  ['#chart-8', 'js/chart-08-mosaic.vg.json'],
  ['#chart-9', 'js/chart-09-alluvial.vg.json'],
  ['#chart-10', 'js/chart-10-world.vg.json'],
  ['#chart-11', 'js/chart-11-bump.vg.json']
];

charts.forEach(([selector, specification]) => {
  vegaEmbed(selector, `${specification}?v=${chartVersion}`, chartOptions)
    .then(({view}) => {
      if (animatedMapSelectors.has(selector)) addMapZoomAnimation(view);
      if (selector === '#chart-10') addWorldMapAnimation(view);
    })
    .catch((error) => {
      console.error(`Could not render ${selector}`, error);
    });
});
