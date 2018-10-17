function show_one_line_plot_from_word(data_obj) {

    // Clear the previous ones
    svgLine.selectAll('.rectangles')
        .attr("class", "hidden");

    var ulHidden_obj = svgLine.append("ul")
        .attr("class", "ulHidden");

    for (i = 0; i < data_obj.words.length; i++) {
        svgLine.append('rect')
            .attr('class', 'rectangles')
		    .attr('transform', 'translate(0,-10)')
            .attr("id", data_obj.words[i])
            .attr('x', function () {
                return xScaleLine(data_obj.similarities[i]);
                })
            .attr('y', function () {
                return xScaleLine.bottom;
                })
		
		.style("fill", function () {
					if (data_obj.deltas[i] == 0) {
				return "#1c0e63";
			} else if (data_obj.deltas[i] <= 0.5) {
				return "#452f96";
			} else if (data_obj.deltas[i] <= 1) {
				return "#6454b5";
			} else if (data_obj.deltas[i] <= 1.5) {
				return "#9595e8";
			} else if (data_obj.deltas[i] <= 2) {
				return "#c3c1f4";
			} else {
				return "#d1cedf";
				}
			})
		
			.style("opacity", function () {
					if (data_obj.deltas[i] == 0) {
				return "1";
			} else if (data_obj.deltas[i] <= 0.5) {
				return ".8";
			} else if (data_obj.deltas[i] <= 1) {
				return ".6";
			} else if (data_obj.deltas[i] <= 1.5) {
				return ".4"
			} else if (data_obj.deltas[i] <= 2) {
				return ".3";
			} else {
				return ".1";
				}
			})
				
        ulHidden_obj.append("li")
            .attr('class', 'liHidden')
            //.attr('id', data_obj.words[i])
            .attr('id', function () {
                return data_obj.words[i];
            })
            .text(function () {
                return data_obj.similarities[i];
            })            
    };

    // Hide rectangles outside of the line
    svgLine.selectAll('.rectangles')
        .each(function(d) {
        // your update code here as it was in your example
            var d3_rect = d3.select(this); // Transform to d3 Object
            if (parseFloat(d3_rect.attr("x")) > widthLine) {
                d3_rect.attr('class', 'rectangles hidden')
            } else {
                d3_rect.attr('class', 'rectangles')
            }            
        });
    
    // Clear the previous ones
    svgLine.selectAll('.rectangles')
        //stampa PAROLA//VALORE dall'over del plotLine
        .on("mouseover", function () {
            var rect_word = this.id;  // Stringa senza #

            d3.select(".printWord").text(this.id);            
            
            d3.select(".printSimilarity").text(function () {
                //console.log(ulHidden_obj.selectAll('.liHidden').filter("#" + rect_word).nodes()[0].textContent);
                return parseFloat(ulHidden_obj.selectAll('.liHidden').filter("#" + rect_word).nodes()[0].textContent).toFixed(5);
            })
        })
        .on("mouseout", function () {
            var rect_word = this.id;  // Stringa senza #

            d3.select(".printWord").text(""); 
            d3.select(".printSimilarity").text("");           
        });
};

function get_selected_word_features(row, words_columns, sim_columns, deltas_columns) {
    var data_obj = {
        words: [],
        similarities: [],
        deltas: []
    };

    for (i = 0; i < words_columns.length; i++) { 
        data_obj.words.push(row[words_columns[i]]);
        data_obj.similarities.push(parseFloat(row[sim_columns[i]]));
        data_obj.deltas.push(parseFloat(row[deltas_columns[i]]));
    };

    return data_obj;
}
