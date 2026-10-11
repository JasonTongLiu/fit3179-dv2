const chartOptions = {
  actions: false,
  renderer: 'svg'
};

// Change this value when chart specifications are updated so local previews
// and GitHub Pages do not keep an older cached JSON specification.
const chartVersion = '20261012-5';

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
  vegaEmbed(selector, `${specification}?v=${chartVersion}`, chartOptions).catch((error) => {
    console.error(`Could not render ${selector}`, error);
  });
});
