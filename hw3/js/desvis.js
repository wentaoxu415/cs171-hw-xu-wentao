/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */

var global_avg = [];

var find_average = function(unique_data){
  var avg = d3.range(0,16).map(function(){
    return 0;
  })

  var num_days = 0

  unique_data.forEach(function(d) {
          d3.range(16).forEach(function (a){
              if (d.prios[a]!= "undefined"){
                avg[a] += d.prios[a];  
              }
          })
      num_days += 1
    });

  avg.forEach(function(d, i){
    avg[i] = d/num_days
  })
  return avg
}

 // constructor
DesVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];
    this.initVis();
}



//Method that sets up the SVG and the variables
DesVis.prototype.initVis = function(){

    var that = this; 

    // selects svg, sets parameters
    this.svg = this.parentElement.selectAll("svg")
    this.margin = {top: 20, right: 20, bottom: 30, left: 50},
    this.width = this.svg.attr("width") - this.margin.left - this.margin.right,
    this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom;

     //.appends ("g")
    this.svg = this.svg.append("g") 
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // creates axis and scales
    this.x = d3.scale.ordinal()
      .rangeRoundBands([0, this.width - 50], .1).domain(d3.range(0,16));

    this.y = d3.scale.linear()
      .range([this.height - 150,0]);

    this.color = d3.scale.category20();

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .ticks(6)
      .orient("left");

    // Add axes visual elements
    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (this.height - 150) + ")")
        .call(this.xAxis)
        .selectAll("text")
    
          .attr("y", 5)
          .attr("x", 10)
          .attr("transform", "rotate(45)")
          .attr("text-anchor",  "start")
          .style("text-anchor", "start")
          .text(function(d,i) { return that.metaData.priorities[i]["item-title"]})
          .attr("font-size", 8);

    this.svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")

    global_avg = find_average(that.data);
    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}


// wrangles data
DesVis.prototype.wrangleData= function(_filterFunction){

    // adds filtered/aggregated data to data to be visualized
    this.displayData = this.filterAndAggregate(_filterFunction);
}

// updates bar visualization
DesVis.prototype.updateVis = function(){

    var that = this;

    // set y scale domain to max value of count aggregate
    
    function temp_max(global, local){
      var temp = []

      if (d3.max(global) > d3.max(local)){
        temp = global
      }
      else{
        temp = local
      }
      return temp
    }

    // var local_avg;
    // local_avg = find_average(this.displayData);
    
    // var temp_displayData;
    // temp_displayData = temp_max(global_avg, local_avg) 

    this.y.domain([0, d3.max(global_avg)]);

    // calls y Axis
    this.svg.select(".y.axis")
        .call(this.yAxis)

     // Data join
    var bar = this.svg.selectAll(".bar")
      .data(global_avg);



    // removes unneeded bars
    bar.exit()
      .remove();

    // Append new bar groups, if required
    bar.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(global_avg,i){
            return  that.x(i);
        })
       .attr("width", (that.width/16));

    // adds bar features
    bar
        .attr("y", function(d) {
            return (that.y(d));
        })
       .attr("height", function(d){ return 10;})
       // .style("fill", function(d,i) {
       //      return that.metaData.priorities[i]["item-color"];
       //  });
}

 // wrangles data based on region selected in response to event handler
DesVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

  // filter data based on selected time range
    var filter = function (d) {
        return (d.time >= selectionStart) && (d.time <= selectionEnd);
    }

    // if no region is selected (start and end are equal), use all data
    if (selectionStart.getTime () === selectionEnd.getTime ()) {
        var wrangled = this.wrangleData (null);
    }

    // else filter by selected region
    else {
        var wrangled = this.wrangleData(filter);
    }
     
    // update visualization
    this.updateVis();
}


// filters and aggregates data 
DesVis.prototype.filterAndAggregate = function(_filter){

    var that = this;
    
    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
    
    // initializes count array
    var res = d3.range(0,16). map(function(){return 0;});

    // Convert data into filtered summary count format
    var filtered_data= that.data.filter(filter)
      .forEach(function(d) {
            d3.range(16).forEach(function (a){
                res[a] += d.prios[a];
            })
      });

    // return filetered aggregate data
    return res;

}