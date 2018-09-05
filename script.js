let data;

const w = 800;
const h = 600;
const padding = 50;

// Tooltip
const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

drawGraph = () => {
    const svg = d3.select('.svg-target')
        .html('')
        .append('svg')
        .attr('class', 'card')
        .attr('width', w)
        .attr('height', h)

    // x axis
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year)])
        .range([padding, w - padding]);

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'));

    svg.append('g')
        .attr('transform', `translate(0, ${h - padding})`)
        .attr('id', 'x-axis')
        .call(xAxis);

    // y axis
    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Seconds), d3.max(data, d => d.Seconds)])
        .range([h - padding, padding]);

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format('d'));

    svg.append('g')
        .attr('transform', `translate(${padding}, 0)`)
        .attr('id', 'y-axis')
        .call(yAxis);

    // Dots
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
            .attr('cx', d => xScale(d.Year))
            .attr('cy', d => yScale(d.Seconds))
            .attr('r', 5)
            .attr('fill', 'red')
            .on('mouseover', d => {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                tooltip.html(`${d.Year} | ${d.Seconds}`)
            });
};

const req = new XMLHttpRequest();
req.open('GET', 'cyclist-data.json', true);
req.send();
req.onload = function() {
    data = JSON.parse(req.responseText);
    console.log(data);
    drawGraph();
};
