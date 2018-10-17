var margin = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	},
	width = document.querySelector('.squareScatter').offsetWidth - margin.left - margin.right,
	height = document.querySelector('.squareScatter').offsetHeight - margin.top - margin.bottom;


// setup x 
var xValue = function (d) {
		return d.coordX;
	}, // data -> value
	xScale = d3.scaleLinear().range([0, width]); // value -> display

// setup y
var yValue = function (d) {
		return d.coordY;
	}, // data -> value
	yScale = d3.scaleLinear().range([height, 0]); // value -> display


// add the graph canvas to the body of the webpage
var svgPlot = d3.select(".squareScatter").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.attr("id", "scatter")
//	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

// load data
d3.csv("../data/dataset.csv").then(function (data) {

	// change string (from CSV) into number format
	data.forEach(function (d) {
		d.coordX = +d.coordX;
		d.coordY = +d.coordY;
		//d.delta = +d.delta;
		d.influency = parseFloat(parseFloat(d.influency).toFixed(2)); // Round to 2 decimals
	});

	// don't want dots overlapping axis, so add in buffer to data domain
	xScale.domain([d3.min(data, xValue) - 3, d3.max(data, xValue) + 3]);
	yScale.domain([d3.min(data, yValue) - 3, d3.max(data, yValue) + 3]);

	// min-max dots size
	var dimDots = d3.scaleLinear()
		.domain(d3.extent(data, function (d) {
			return d.influency;
		})) // Domain is the min to max influence values
		.range([2, 6]) // Range is how the values in the domain are mapped to the radius value of the circles in the plot
		.clamp(true);

	// draw dots
	svgPlot.selectAll(".dot")
		.data(data)
		.enter() // Enter() because there is no class .dot in index.html
		.append("circle")
		.attr("class", "dot")
		.attr('r', function (d) {
			return dimDots(d.influency);
		})
		.attr("cx", function (d) {
			return xScale(d.coordX);
		})

		.attr("cy", function (d) {
			return yScale(d.coordY);
		})

		.attr("id", function (d) {
			return d.word;
		})

		// On mouseover show tooltip (=box with some infos)
		.on("mouseover", function (d) {
			tooltip.transition()
				.duration(200)
				.style("opacity", .9);
			tooltip.html(d["word"] + "<br/>Influency: " + d["influency"])
				.style("left", (d3.event.pageX + 5) + "px")
				.style("top", (d3.event.pageY - 28) + "px");

		})
		
	// On mouseout make tooltip disappear
		.on("mouseout", function (d) {
			tooltip.transition()
				.duration(500)
				.style("opacity", 0);
		})

		.on('click', function (d) {
			//word_has_been_clicked = true;
			//	select keyword becomes black
			d3.selectAll(".rectangles")
				.style('opacity', 0.1)
				.filter("#" + d.word)
				.style('opacity', 1)
				.style('stroke', "blue")
				.attr("stroke-width", 5);

			d3.selectAll(".dot")
				.style('opacity', 0.1)
				.filter("#" + d.word)
				.style('opacity', 1)
				.style('fill', "blue");

		})

});


// grid 1
var count = 10;
// lines
for (var i = 15; i < height; i = i + 60) {
	var lineaGrossa = svgPlot.append("line")
		.attr("class", "lineaGrossa")
		.attr("x1", 0)
		.attr("x2", width)
		.attr("y1", i)
		.attr("y2", i)
	
};
// column
for (var i = 15; i < width; i = i + 60) {
	var lineaGrossa = svgPlot.append("line")
		.attr("class", "lineaGrossa")
		.attr("x1", i)
		.attr("x2", i)
		.attr("y1", 0)
		.attr("y2", height)
	
};

// grid 2
var count = 10;
// line
for (var i = 15; i < height; i = i + 30) {
	var lineaPiccola = svgPlot.append("line")
		.attr("class", "lineaPiccola")
		.attr("x1", 0)
		.attr("x2", width)
		.attr("y1", i)
		.attr("y2", i)

};
// column
for (var i = 15; i < width; i = i + 30) {
	var lineaPiccola = svgPlot.append("line")
		.attr("class", "lineaPiccola")
		.attr("x1", i)
		.attr("x2", i)
		.attr("y1", 0)
		.attr("y2", height)

};

// grid 3
var count = 10;
// line
for (var i = 15; i < height; i = i + 15) {
	var lineaPiccola2 = svgPlot.append("line")
		.attr("class", "lineaPiccola2")
		.attr("x1", 0)
		.attr("x2", width)
		.attr("y1", i)
		.attr("y2", i)

};
// columm
for (var i = 15; i < width; i = i + 15) {
	var lineaPiccola2 = svgPlot.append("line")
		.attr("class", "lineaPiccola2")
		.attr("x1", i)
		.attr("x2", i)
		.attr("y1", 0)
		.attr("y2", height)

};
