var word_obj;

d3.csv("./data/dataset.csv").then(function (data) {

	// data to adapt to dataset*
	var most_similar_words_columns = data.columns.slice(4, 103);
	var most_similar_values_columns = data.columns.slice(103, 202);
	var deltas_values_columns = data.columns.slice(202, 301);

	// min-max font dimension
	var dimWord = d3.scaleLinear() // Scales transform numbers from numbers space to pixel space
		.domain(d3.extent(data, function (d) {
			return parseFloat(d.influency);
		})) // equivalent of .domain([min_influence, max_influence])
		.range([10, 30])
		.clamp(true);

	console.log(dimWord.domain());

	// cx e cy scale setting for each dot selected
	xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]); // xValue defined in plot.js
	yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]); // yValue defined in plot.js

	// select first ten word by influency
	// dimension and order
	d3.selectAll(".keywordRight")
		.data(data.sort(function (a, b) {
			return d3.descending(parseFloat(a.influency), parseFloat(b.influency))
		}).slice(0, 10))
		.attr("class", "keywordRight keyList")
		.attr("style", function (d) {
			return "font-size:" + dimWord(parseFloat(d.influency)) + "px;";
		})
		.append("a")
		.attr("class", "keyWord")
		.text(function (d) {
			return d.word;
		})
		.style("cursor", "pointer")
		.attr("id", function (d) {
			return d.word
		})

		//	on click:
		.on('click', function (d) {

			//	select word become black
			d3.selectAll(".keyWord")
				.style('opacity', 0.3)
				.filter("#" + d.word)
				.style('opacity', 1);

			d3.selectAll(".svgSlider")
				.selectAll('*')
				.style('pointer-events', "none");

			d3.selectAll(".svgSlider")
				.filter("#" + d.word)
				.selectAll('*')
				.style('pointer-events', "auto");

			d3.selectAll(".selectedDot")
				.attr('class', "dot hidden"); // Hide all the points

			//	select dot corrisponding with key-word clicked
			d3.selectAll('.dot')
				.attr('class', "dot hidden") // Hide all the points
				.filter("#" + d.word)
				.attr("class", "selectedDot");

			//	slideBar appears
			d3.selectAll(".svgSlider")
				.attr('class', "svgSlider hidden")
				.filter("#" + d.word)
				.attr("class", "svgSlider")
				.style('opacity', 1);

			//	[view all] opacity
			d3.selectAll(".deselect")
				.style('opacity', 1);

			//	selection circle takes key-word selected x and y
			d3.select("#similarityCircle")
				.style('opacity', 0.7)
				.attr("cx", xScale(d.coordX))
				.attr("cy", yScale(d.coordY));

			//	print dot inside the circle selection
			d3.selectAll('.dot')
				.filter(function (d) {
					return euclidean_distance(circle, d) <= circle.attr("r")
				})
				.attr("class", "dot");

			//	key-word dot selected class
			d3.selectAll('.dot')
				.filter("#" + d.word)
				.attr("class", "dot selectedDot");

			word_obj = get_selected_word_features(d, most_similar_words_columns, most_similar_values_columns, deltas_values_columns);

			color_circles_based_on_deltas(word_obj);

			// plot on the lineplot key-word selected values 
			show_one_line_plot_from_word(word_obj);
			if (handle_pos == 1) {
				adapt_line_plot(1, 0.8999999999999999);
			};

		});

});

//[view all]
d3.selectAll(".deselect")
	.style('opacity', 1)
	.on('click', function (d) {
	//instead of refresh (line plot value does not start again from zero)
		//word_has_been_clicked = false;

				d3.selectAll(".deselect")
					.style('opacity', 1)
		
//				d3.selectAll(".svgSlider")
//					.attr('class', "svgSlider hidden");
//				
//				d3.selectAll('.selectedDot')
//					.style('opacity', 1)
//					.attr('class', "dot");
//				
//				d3.selectAll('.dot')
//					.style('opacity', 1)
//					.attr('class', "dot")
//					.style("fill", "blue");
//		
//				d3.selectAll(".keyWord")
//					.style('opacity', 0.3);
//				
//				d3.select("#similarityCircle")
//					.style('opacity', 0);
//		    
//		        document.getElementById("search_input").value = "";
//			
//				d3.selectAll(".rectangles")
//						.style('opacity', 0)
//						

	//page refresh to reset all parameters 
		location.reload();

	});
