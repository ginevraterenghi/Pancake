var svgCircle = d3.select("#scatter"); // Select the svg element in where the plot is


// circle    
var circle = svgCircle.append("circle")  // create a circle to select dots around key-word selected
	.attr("class", "circleSelect")
	.attr("id", "similarityCircle")
