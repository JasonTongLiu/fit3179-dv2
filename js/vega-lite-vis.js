const chartOptions = {
  actions: false
};

vegaEmbed('#road-deaths-target', 'js/road-deaths-target.vg.json', chartOptions)
  .catch(console.error);
