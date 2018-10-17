var handle_pos = 1;

d3.csv("./data/dataset.csv").then(function (data) {

	var svgSlider = d3.selectAll(".sliderLeft")
		.data(data.sort(function (a, b) {
			return d3.descending(parseFloat(a.influency), parseFloat(b.influency))
		}).slice(0, 11))
		.append("svg")
		.attr("class", "svgSlider")
		.attr("transform", "translate(0," + 11 + ")")
		.attr("id", function (d) {
			return d.word
		});

	// Set id of the "extra" word //search box
	d3.selectAll(".svgSlider").nodes()[10].id = "searched_word_slider";

	var margin = {
			top: 5,
			bottom: 5,
			right: 8,
			left: 5
		},

		widthSlider = document.querySelector('.sliderLeft').offsetWidth - margin.left - margin.right, // 87px
		heightSlider = document.querySelector('.sliderLeft').offsetHeight - margin.top - margin.bottom; // 12px

	var x = d3.scaleLinear()
		.domain([1, 0]) // 1-0 space where handle moves
		.range([0, widthSlider]) // pixel space mapping (0,87)
		.clamp(true);

	var radiusScaler = d3.scaleLinear()
		.domain(x.range())
		.range([0, 600])
		.clamp(true);

	var oneLineZoomScaler = d3.scaleLinear()
		.domain([0, 1])
		.range([2, 0.1])
		.clamp(true);

	var slider = svgSlider.append("g")
		.attr("class", "slider")
		.attr("transform", "translate(" + margin.left + "," + heightSlider + ")");

	slider.append("line")
		.attr("class", "track")
		.attr("x1", x.range()[0])
		.attr("x2", x.range()[1])
		.select(function () {
			return this.parentNode.appendChild(this.cloneNode(true));
		})
		.attr("class", "track-inset")
		.select(function () {
			return this.parentNode.appendChild(this.cloneNode(true));
		})
		.attr("class", "track-overlay")
		.each(function (d, i) {
			var thisLine = d3.select(this)
				.call(d3.drag()
					.on("start.interrupt", function () {
						thisLine.interrupt();
					})
					.on("start drag", function () {
						//console.log(d3.event)
						hue(x.invert(d3.event.x), d3.event.x);
					}));
		});

	slider.insert("g", ".track-overlay")
		.attr("class", "ticks")
		.attr("transform", "translate(0," + 12 + ")") //margin between line and number
		.selectAll("text")
		.data(x.ticks(2))
		.enter().append("text")
		.attr("x", x)
		.attr("text-anchor", "middle")
		.text(function (d) {
			return d;
		});

	var handle = slider.insert("circle", ".track-overlay")
		.attr("class", "handle")
		.attr("r", 4);

	function hue(h, v) { // background color gradient
		handle_pos = h;

		d3.selectAll('.handle')
			.attr("cx", x(h)); // cs handle setted on drag h value
		circle.attr("r", radiusScaler(v)); // circle radius dimension [range = x ScaleLinear]

		d3.selectAll('.dot')
			.attr('class', "dot hidden") // Hide all the points
			.filter(function (d) {
				return euclidean_distance(circle, d) <= circle.attr("r")
			})
			.attr("class", "dot"); // Drop the hidden class

		color_circles_based_on_deltas(word_obj);

		adapt_line_plot(1, 1 - oneLineZoomScaler(h));
	}
});

function euclidean_distance(circle_obj, data_point) {

	var dot_elem = d3.selectAll(".dot").filter("#" + data_point.word);
	var x_coord = parseFloat(dot_elem.attr("cx"));
	var y_coord = parseFloat(dot_elem.attr("cy"));

	var a = parseFloat(circle_obj.attr("cx")) - x_coord;
	var b = parseFloat(circle_obj.attr("cy")) - y_coord;
	var distance = Math.sqrt(a * a + b * b);

	return distance;
};

function cosine_similarity(v1, v2) {
	var x = 0;
	var y = 0;
	var sumxx = 0;
	var sumxy = 0;
	var sumyy = 0;
	for (i = 0; i < v1.length; i++) {
		x = v1[i];
		y = v2[i];
		sumxx += x * x;
		sumyy += y * y;
		sumxy += x * y;
	}
	return sumxy / Math.sqrt(sumxx * sumyy);
};

function color_circles_based_on_deltas(data_obj) {
	d3.selectAll('.dot')
		.style("fill", function (d) {
			var idx = data_obj.words.indexOf(d.word);
			if (data_obj.deltas[idx] == 0) {
				return "#1c0e63";
			} else if (data_obj.deltas[idx] <= 0.5) {
				return "#452f96";
			} else if (data_obj.deltas[idx] <= 1) {
				return "#6454b5";
			} else if (data_obj.deltas[idx] <= 1.5) {
				return "#9595e8";
			} else if (data_obj.deltas[idx] <= 2) {
				return "#c3c1f4";
			} else {
				return "#d1cedf";
			};
		});

	d3.selectAll('.dot')
		.style("opacity", function (d) {
			var idx = data_obj.words.indexOf(d.word);
			if (data_obj.deltas[idx] == 0) {
				return "1";
			} else if (data_obj.deltas[idx] <= 0.5) {
				return ".8";
			} else if (data_obj.deltas[idx] <= 1) {
				return ".6";
			} else if (data_obj.deltas[idx] <= 1.5) {
				return ".4";
			} else if (data_obj.deltas[idx] <= 2) {
				return ".3";
			} else {
				return ".1";
			};
		});

};


function adapt_line_plot(min_domain, max_domain) {

	d3.select('.rectGroup').remove();

	var new_SvgLine = d3.select(".svgLinePlot")
		.append('g')
		.attr("class", "rectGroup")
		.attr('transform', 'translate(' + marginLine.left + ',' + marginLine.top + ')');

	//axes dimensions
	var new_xScaleLine = d3.scaleLinear()
		.domain([min_domain, max_domain])
		.range([0, widthLine]) //(max:1375)
		.nice();

	//axes values
	var new_xAxis = d3.axisBottom()
		.scale(new_xScaleLine)
		.tickPadding(20)
		.tickSize(30)
		.tickSizeOuter(0)
		.tickSizeInner(30);

	var color_perc_scaler = d3.scaleLinear()
		.domain([1, 0])
		.range([90, 0])
		.clamp(true);

	var yAxis = d3.axisLeft()
		.scale(yScaleLine);

	// adding axes is also simpler now, just translate x-axis to (0,heightLine) and it's alread defined to be a bottom axis. 
	new_SvgLine.append('g')
		.attr('class', 'x axis')
		.call(new_xAxis)

		//plot line color gradient 
		.append("linearGradient")
		.attr("id", "line-gradient")
		.attr("gradientUnits", "userSpaceOnUse")
		.attr("x1", function () {
			return String(color_perc_scaler(handle_pos)) + "%";
		})
		.attr("x2", "100%")
		.selectAll("stop")
		.data([
			{
				offset: "0%",
				color: "#ff008a"
		},
			{
				offset: "100%",
				color: "#ffe7c1"
		}
        ])
		.enter().append("stop")
		.attr("offset", function (d) {
			return d.offset;
		})
		.attr("stop-color", function (d) {
			return d.color;
		});

	svgLine = new_SvgLine;
	xScaleLine = new_xScaleLine;

	show_one_line_plot_from_word(word_obj);
};
