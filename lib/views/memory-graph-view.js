"use strict";

var _ = require("lodash");

var BaseLineGraph = require("./base-line-graph");
var utils = require("../utils");

var MemoryGraphView = function MemoryGraphView(options) {
  BaseLineGraph.call(this, _.merge({
    unit: "%",
    maxY: 100,
    series: {
      heap: { color: "green" },
      resident: {}
    }
  }, options));
};

MemoryGraphView.prototype = Object.create(BaseLineGraph.prototype);

MemoryGraphView.prototype.getDefaultLayoutConfig = function () {
  return {
    borderColor: "cyan",
    title: "memory",
    limit: 30
  };
};

// discardEvent is needed so that the memory guage view can be
// updated real-time while some graphs are aggregate data
MemoryGraphView.prototype.onEvent = function (data, discardEvent) {
  var mem = data.mem;
  if (discardEvent) {
    return;
  }
  this.update({
    heap: utils.getPercentUsed(mem.heapUsed, mem.heapTotal),
    resident: utils.getPercentUsed(mem.rss, mem.systemTotal)
  });
};

MemoryGraphView.prototype.onMetricData = function () {
  var mapper = function mapper(rows) {
    return _.map(rows, function (row) {
      return {
        heap: utils.getPercentUsed(row.mem.heapUsed, row.mem.heapTotal),
        resident: utils.getPercentUsed(row.mem.rss, row.mem.systemTotal)
      };
    });
  };

  this.changeMetricData(mapper);
};

module.exports = MemoryGraphView;
