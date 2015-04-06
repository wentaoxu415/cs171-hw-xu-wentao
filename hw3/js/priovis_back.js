/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */



/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
PrioVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];


    this.initVis();
}


/**
 * Method that sets up the SVG and the variables
 */
PrioVis.prototype.initVis = function(){

    var that = this; 

    this.svg = this.parentElement.selectAll("svg");
     //defines constants
    this.margin = {top: 20, right: 50, bottom: 150, left: 50},
    this.width = this.svg.attr("width")-this.margin.left - this.margin.right,
    this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom;
    
    this.svg = this.svg.append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.x = d3.scale.ordinal()
        .rangeRoundBands([0, this.width], .1)
        .domain(d3.range(0, 16));

    this.y = d3.scale.linear()
        .range([this.height, 0]);

    this.color = d3.scale.category20();

    this.xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom")

    this.yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left")

    this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height+ ")")
        .call(this.xAxis)
        .selectAll("text")
        .attr("y", 5)
        .attr("x", 10)
        .attr("transform", "rotate(45)")
        .attr("text-anchor", "start")
        .style("text-anchor", "start")
        .text(function(d, i){return that.metaData.priorities[i]["item-title"]})
        .attr("font-size", 10);

    this.svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        // .attr("y", 6)
        // .attr("dy", ".71em")
        // .style("text-anchor", "end")

    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
PrioVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);
    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};

}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
PrioVis.prototype.updateVis = function(){

    var that = this;

    this.y.domain([0, d3.max(this.displayData)]);


        // .selectAll("text")
        // .style()
        //  .attr("dx", "-.8em")
        //  .attr("dy", ".15em")
        //  .attr("transform", function(d) {
        //     return "rotate(-60)" 
        //  });

    this.svg.select(".y.axis")
        .call(this.yAxis);


    var bar = this.svg.selectAll(".bar")
        .data(this.displayData);
    

    bar.enter()
        .append("rect")
        .append("class", "bar");

    bar
        .attr("x", function(d,i){
            return that.x(i)
        })
        .attr("width", that.width/16)
        .attr("y", function(d){
           return that.y(d)
           
        })
        .attr("height", function(d, i){
            return that.height - that.y(d);
            
        })
        .style("fill", function(d, i){
            return that.metaData.priorities[i]["item-color"];
        });
    bar.exit()
        .remove();
}



/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
PrioVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // TODO: call wrangle function
    var filter = function(d){
        return (d.time >= selectionStart) && (d.time <= selectionEnd);
    }

    if (selectionStart.getTime() === selectionEnd.getTime()){
        var wrangled = this.wrangleData(null);
    } 
    else{
        var wrangled = this.wrangleData(filter)
    }

    this.updateVis();
}


/*
*
* ==================================
* From here on only HELPER functions
* ==================================
*
* */



/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
PrioVis.prototype.filterAndAggregate = function(_filter){
    var that = this;
    count = 0;

    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
    //Dear JS hipster, a more hip variant of this construct would be:
    // var filter = _filter || function(){return true;}

    var prios = d3.range(16).map(function(){
        return 0;
    });

    var filtered_data = that.data.filter(filter)
        .forEach(function(d){
            d3.range(16).forEach(function (a){
                prios[a] += d.prios[a]
            })
        })
    console.log(prios);
    return prios;
}




