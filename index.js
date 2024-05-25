const width = 550;
const height = 1200;

// Define a projection to center the map
const projection = d3.geoMercator()
    .center([106, 16]) // Center coordinates
    .scale(4000) // Zoom level
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const svg = d3.select('.container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Load GeoJSON data
// d3.json('https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json')
d3.json('https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json').then(function(data) {
    // Draw the map
    svg.selectAll('.province')
        .data(data.features)
        .enter()
        .append('path')
        .attr('class', 'province')
        .attr('d', path)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('fill', 'orange');
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .attr('fill', 'lightblue');
        });
}).catch(function(error) {
    console.log(error);
});