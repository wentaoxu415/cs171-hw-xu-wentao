PrioVis.prototype.updateVis = function(){
 var that = this;
 this.y.domain([0,900000]);
 this.x.domain(that.displayData.map(function (d) {return d.priority}));  
 this.color.domain(that.displayData.map(function (d) {return d.priority}));
// updates axis
 this.svg.select(".x.axis")
 .call(this.xAxis)
 .selectAll("text") 
 .style("text-anchor", "end")
 .attr("dx", "-.8em")
 .attr("dy", ".15em")
 .attr("transform", function(d) {
 return "rotate(-60)" 
 });
this.svg.select(".y.axis")
 .call(this.yAxis);
 // updates graph
// Data join
 var bar = that.svg.selectAll(".bar")
 .data(that.displayData); // BOUND COUNT DATA IS CORRECTLY FILTERED HERE AFTER BRUSH
// Append new bar groups, if required
 var bar_enter = bar.enter().append("g");
// Append a rect and a text only for the Enter set (new g)
 bar_enter.append("rect");
that = this; 
 // Add attributes (position) to all bars
 bar
 .attr("class", "bar")
 .transition()
 .attr("transform", function(d, i) { 
 return "translate(" + that.x(d.priority) + ",0)";
 })
// Remove the extra bars
 bar.exit().remove();
// Update all inner rects and texts (both update and enter sets)
bar.selectAll("rect")
 .attr("x", 0)
 .attr("y", function(d) {
 return that.y(d.count);})
 .attr("width", that.x.rangeBand())
 .style("fill", function(d) {
 return that.color(d.priority);
 })
 .transition()
 .attr("height", function(d) {
 var barheight=that.height-that.y(d.count);
 console.log(d.count); // COUNT ALWAYS UNFILTERED DATA AFTER BRUSH. WHY???
 return barheight;
 });
}