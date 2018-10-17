var all_dataset_words = [];
var all_x_coordinates = [];
var all_y_coordinates = [];

d3.csv("../data/dataset.csv").then(function (data) {
    for (i = 0; i < data.length; i++) {  
        all_dataset_words.push(String(data[i].word));
        all_x_coordinates.push(String(data[i].coordX));
        all_y_coordinates.push(String(data[i].coordY));
    };    
});
