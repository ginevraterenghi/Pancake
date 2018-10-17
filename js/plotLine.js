var marginLine = {
	top: 50,
	right: 50,
	bottom: 0,
	left: 50
};

var widthLine = document.querySelector('.scatterOrizzontale').offsetWidth - marginLine.left - marginLine.right;
var heightLine = document.querySelector('.scatterOrizzontale').offsetHeight;

//insert svg
var svgLine = d3.select('.scatterOrizzontale')
	.append('svg')
	.attr("class", "svgLinePlot")
	.attr('width', widthLine + marginLine.left + marginLine.right)
	.attr('height', heightLine)
	.append('g')
	.attr("class", "rectGroup")
	.attr('transform', 'translate(' + marginLine.left + ',' + marginLine.top + ')');

//axes dimensions
var xScaleLine = d3.scaleLinear()
	.domain([-1, 1])
	.range([widthLine, 0])
	.nice();

var yScaleLine = d3.scaleLinear()
	.range([0, 0])
	.nice();

//axes values
var xAxis = d3.axisBottom()
	.scale(xScaleLine)
	.tickPadding(20)
	.tickSize(30)
	.tickSizeOuter(0)
	.tickSizeInner(30)

var yAxis = d3.axisLeft()
	.scale(yScaleLine);

svgLine.append('g')
	.attr('class', 'x axis')
	.call(xAxis)

	//gradient color line
	.append("linearGradient")
	.attr("id", "line-gradient")
	.attr("gradientUnits", "userSpaceOnUse")
	.attr("x1", "0%")
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
