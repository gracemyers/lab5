let margin = { top: 40, right: 20, bottom: 40, left: 50 },
width = document.querySelector(".chart").clientWidth - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;
width = width > 600 ? 600 : width;

let svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let x = d3
  .scaleBand()
  .range([0, width])
  .paddingInner(0.1);

let y = d3.scaleLinear().range([height, 0]);

let xAxis = d3
  .axisBottom()
  .scale(x)

let yAxis = d3.axisLeft().scale(y);
let xAxisGroup = svg.append("g").attr("class", "x-axis axis");
let yAxisGroup = svg.append("g").attr("class", "y-axis axis");


d3.csv("coffee-house-chains.csv", (d)=>{
	return {
		...d,
		revenue : +d.revenue,
		stores : +d.stores
	}
}).then((Sales)=>{
	data = Sales;
  updateVis();
});

let sorter = false;

d3.select ("#group-by")
	.on("change", function(){
	updateVis()
});

d3.select('#sorting')
	.on('click', function(){
		sorter = !sorter;
		updateVis();
	})

  let title = svg.append('text')
    .attr("class", "axis-title")
    .attr('x', 0)
    .attr('y', -10)
    .attr("text-anchor", "middle");


 

function updateVis() {
    let type = document.querySelector('#group-by');
    type = type.options[type.selectedIndex].value;

    if (sorter == false){
        data.sort(function(a,b){ return b[type] - a[type];})
    }
    else{
        data.sort(function(a,b){ return a[type] - b[type];})
    }

    x.domain(
        data.map(function(d) { return d.company;}));
      y.domain([
        0,d3.max(data, function(d) {return d[type];})]);
  
     
    let bars = svg.selectAll('.bar')
      .data(data, function(d){return d.company});
    
      bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr('y', height)
        .attr('height', 1)
        .merge(bars)
        .transition()
        .duration(1000)
        .attr('y', function(d){return y(d[type])})
        .attr('x', function(d){return x(d.company)})
        .attr('width', x.bandwidth())
        .attr('height', function(d){return height - y(d[type])});
        
   

      if (type == 'revenue'){title.text('Billions USD');}
      else{title.text('Stores')}

      xAxisGroup = svg
        .select(".x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
      yAxisGroup = svg.select(".y-axis").call(yAxis);
        }

 updateVis()
  