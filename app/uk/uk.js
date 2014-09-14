'use strict';

angular.module('myApp.uk', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/uk', {
    templateUrl: 'uk/uk.html',
    controller: 'UkCtrl'
  });
}])

.controller('UkCtrl', ['$scope', '$routeParams', '$http', '$location', 'Country',
  function($scope, $routeParams, $http, $location, Country) {

    function renderChart(divName, data, maxValue) {
      //var data = RegionData;
      //var data = d3.csv.parse(d3.select('#csv').text());

      var valueLabelWidth = 40; // space reserved for value labels (right)
      var barHeight = 20; // height of one bar
      var barLabelWidth = 0; // space reserved for bar labels
      var barLabelPadding = -5; // padding between bar and bar labels (left)
      var gridLabelHeight = 18; // space reserved for gridline labels
      var gridChartOffset = 3; // space between start of grid and first bar
      var maxBarWidth = 240; // width of the bar with the max value
       
      // accessor functions 
      var barLabel = function(d) { return d['LA_name']; };
      var barValue = function(d) { return parseFloat(d['kw_per_household']); };
       
      // scales
      var yScale = d3.scale.ordinal().domain(d3.range(0, data.length)).rangeBands([0, data.length * barHeight]);
      var y = function(d, i) { return yScale(i); };
      var yText = function(d, i) { return y(d, i) + yScale.rangeBand() / 2; };
      var x = d3.scale.linear().domain([0, maxValue]).range([0, maxBarWidth]);
      //var x = d3.scale.linear().domain([0, d3.max(data, barValue)]).range([0, maxBarWidth]);
      // svg container element
      var chart = d3.select(divName).append("svg")
        .attr('width', maxBarWidth + barLabelWidth + valueLabelWidth)
        .attr('height', gridLabelHeight + gridChartOffset + data.length * barHeight);
      // bar labels
      var labelsContainer = chart.append('g')
        .attr('transform', 'translate(' + (barLabelWidth - barLabelPadding) + ',' + (gridLabelHeight + gridChartOffset) + ')'); 
      labelsContainer.selectAll('text').data(data).enter().append('text')
        .attr('y', yText)
        .attr('stroke', 'none')
        .attr('fill', 'black')
        .attr("dy", ".35em") // vertical-align: middle
        .attr('text-anchor', 'start')
        .text(barLabel)
        .on("click", function(d){
            document.location.href = "/#/council/" + d['LA_id'];
        });
      // bars
      var barsContainer = chart.append('g')
        .attr('transform', 'translate(' + barLabelWidth + ',' + (gridLabelHeight + gridChartOffset) + ')'); 
      barsContainer.selectAll("rect").data(data).enter().append("rect")
        .attr('y', y)
        .attr('height', yScale.rangeBand())
        .attr('width', function(d) { return x(barValue(d)); })
        .attr('stroke', 'white')
        .attr('fill', 'red')
        .style('opacity', .2)
        .on("click", function(d){
            document.location.href = "/#/council/" + d['LA_id'];
        })
        ;
      // bar value labels
      barsContainer.selectAll("text").data(data).enter().append("text")
        .attr("x", function(d) { return x(barValue(d)); })
        .attr("y", yText)
        .attr("dx", 3) // padding-left
        .attr("dy", ".35em") // vertical-align: middle
        .attr("text-anchor", "start") // text-align: right
        .attr("fill", "black")
        .attr("stroke", "none")
        .on("click", function(d){
            document.location.href = "/#/council/" + d['LA_id'];
        })
        //.text(function(d) { return d3.round(barValue(d), 2); })
        ;

      }

    $scope.regions =  [
      { name: "London", id: "London"},
      { name: "South West", id: "South West"},
      { name: "South East", id: "South East"},
      { name: "North West", id: "North West"},
      { name: "North East", id: "North East"},
      {name: "Yorkshire and The Humber", id: "Yorkshire and the Humber"},
      {name: "East Midlands", id: "East Midlands"},
      {name: "West Midlands", id: "West Midlands"},
      {name: "East of England", id: "East of England"},
      { name: "Scotland", id: "Scotland"},
      ];




    Country.query({}, function(councils) {
      console.log(councils);
      $scope.top_councils = _(councils).sortBy("national_rank").take(5).value();
      $scope.bottom_councils = _(councils).sortBy("national_rank").reverse().take(5).value();
      console.log($scope.top_councils);

      var partData = _(councils).sortBy("national_rank").take(5).value()
      renderChart('#chartTop', partData, d3.max(councils, function(d) { return d['kw_per_household']; }));
      partData = _(councils).sortBy("national_rank").reverse().take(5).value()
      renderChart('#chartBottom', partData, d3.max(councils, function(d) { return d['kw_per_household']; }));

    });

  }]);
