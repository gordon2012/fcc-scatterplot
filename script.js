let data;

const w = 800;
const h = 600;
const padding = 50;

drawChart = () => {
    const svg = d3.select('.svg-target')
        .html('')
        .append('svg')
        .attr('class', 'card')
        .attr('width', w)
        .attr('height', h)

    // x axis
    // const xScale = d3.scaleLinear()
    //     .doma
    svg.append('g')
        .attr('transform', `translate(0, ${h - padding})`)
        .attr('id', 'x-axis');


};

const req = new XMLHttpRequest();
req.open('GET', 'cyclist-data.json', true);
req.send();
req.onload = function() {
    data = JSON.parse(req.responseText);

    // console.log(dataset);
    // draw
    drawChart();

};

