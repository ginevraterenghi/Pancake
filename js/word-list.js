d3.csv("./data/dataset.csv").then(function (data) {
	var ul = d3.selectAll(".listFrame")
		.append("nav")
		.append("ul")
		.attr("class", "wordList")
        .attr("id", "ul_word_list")

	ul.selectAll("li")
		.data(data.sort(function (a, b) {
			return d3.ascending(a.word, b.word)
		}))
		.enter()
		.append('li')
		.append('a')
		.attr("class", "wordListElement")	
		.text(function (d) {
			return d.word;
		})

		//mouseover
		.on("mouseover", function (d) {
			d3.selectAll(".dot")
				.filter("#" + d.word)
				.attr("class", "dot activeDotWord"); // on mouseover, assign "activeDot" class to the dot element			
		})
		.on("mouseout", function (d) {
			d3.selectAll(".dot")
				.filter("#" + d.word)
				//.attr("class", "dot"); // on mouseout, remove the "activeDot" class from the dot element
				.attr("class", function (d) {
					if (euclidean_distance(circle, d) > circle.attr("r")) {
						return "dot hidden";
					} else {
						return "dot";
					}
				});
		})

});
