let data;

const w = 800;
const h = 600;
const padding = 50;

// Tooltip
const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

const drawGraph = () => {
    const svg = d3.select('.svg-target')
        .html('')
        .append('svg')
        .attr('class', 'card')
        .attr('width', w)
        .attr('height', h)

    // x axis
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
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

    data.forEach(d => {
        var date = new Date();
        date.setTime(d.Seconds * 1000);

        // console.log((new Date()).setTime(d.Seconds * 1000));
        // console.log(date);
        // console.log(d.Time);
        // console.log(d.Time.slice(0,2));
        // console.log(d.Time.slice(3,5));
    });

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
                // console.log(~~(d.Seconds / 60));
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                tooltip.html(`
                    <div><strong>${d.Name}</strong></div>
                    <div>${d.Time}</div>
                    <div>${d3.event.pageX}, ${d3.event.pageY}</div>
                    <pre>${~~(d.Seconds / 60)}</pre>
                `)
                    .style('left', `${d3.event.pageX}px`)
                    // TODO: to the left
                    // .style('left', `${d3.event.pageX + ( (w-160-20-d3.event.pageX)>0 ? 20 : -180      )}px`)
                    // .style('right', `${d3.event.pageX}px`)
                    .style('top', `${d3.event.pageY}px`);
                })
            .on('mouseout', d => {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .attr('class', 'dot')
            .attr('data-xvalue', d => d.Year)
            .attr('data-yvalue', d => {
                // let date = new Date();

                var date1 = (new Date(Date.UTC(1970, 0, 1, 0, parseInt(d.Time.slice(0,2)), parseInt(d.Time.slice(3,5))))).toISOString();
                // TODO: make it work!
                // var date2 = (new Date(Date.UTC(1970, 0, 1, 0, parseInt(d.Time.slice(0,2)), parseInt(d.Time.slice(3,5))))).toISOString();

                // console.log(yScale(d.Seconds));
                return date1;

                // console.log(   (new Date(Date.UTC(1970, 0, 1, 0, parseInt(d.Time.slice(0,2)), parseInt(d.Time.slice(3,5))))).toISOString()   );

                // return (new Date(Date.UTC(1970, 0, 1, 0, parseInt(d.Time.slice(0,2)), parseInt(d.Time.slice(3,5)))));

                // console.log(Date.UTC(1970, 0, 1, 0));
                // console.log(d.Time.slice(0,2));
                // console.log(d.Time.slice(3,5));

                // date.setTime(d.Seconds * 1000);
                // return date;
                // console.log((new Date()).setTime(d.Seconds * 1000));
                // console.log(date);
            })
};

const req = new XMLHttpRequest();
req.open('GET', 'cyclist-data.json', true);
req.send();
req.onload = function() {
    data = JSON.parse(req.responseText);
    console.log(data);
    drawGraph();
};
