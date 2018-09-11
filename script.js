let data;

const maxW = 800;
const maxH = 600;

const maxPadding = 50;
const minPadding = 50;
const wrapPadding = 15;

let w = 800;
let h = 600;
let padding = maxPadding;

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if(!immediate) {
                func.apply(context, args);
            }
        }
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if(callNow) {
            func.apply(context, args);
        }
    };
};

var resize = debounce(function () {
    const title = document.getElementById('title');
    const titleStyle = getComputedStyle(title);
    const titleHeight = title.offsetHeight + parseInt(titleStyle.marginTop) + parseInt(titleStyle.marginBottom);

    if(window.innerWidth < 900) {
        w = window.innerWidth - (wrapPadding * 2);
        h = window.innerHeight - titleHeight - (wrapPadding * 2) - 5;
        padding = minPadding;
    } else {
        w = maxW;
        h = maxH;
        padding = maxPadding;
    }

    drawGraph();
}, 100);

// Tooltip
const tooltip = d3.select('body').append('div')
    .attr('id', 'tooltip')
    .attr('class', 'card')
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
    const parsedTime = data.map(d => d3.timeParse('%M:%S')(d.Time));
    const yScale = d3.scaleTime()
        .domain(d3.extent(parsedTime))
        .range([h - padding, padding]);

    const yAxis = d3.axisLeft(yScale)
        .tickValues(parsedTime)
        .tickFormat((d,i) => data[i].Time);

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
            .attr('cy', d => yScale(d3.timeParse('%M:%S')(d.Time)))
            .attr('r', 5)
            .attr('fill', 'red')
            .on('mouseover', (d,i,a) => {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                tooltip.html(`
                    <div class="tooltip-name"><strong>${d.Name}</strong></div><br>
                    <div class="tooltip-time">${d.Time}</div><br>
                    <div class="tooltip-place">#${d.Place}</div>
                `)
                    .style('top', `${d3.event.pageY}px`)
                    .attr('data-year', a[i].dataset.xvalue);

                    if(d3.event.pageX + tooltip._groups[0][0].offsetWidth > w + parseFloat(window.getComputedStyle(document.getElementsByTagName('svg')[0]).marginLeft)) {
                        tooltip._groups[0][0].style.removeProperty('left');
                        tooltip.style('right', `${document.body.clientWidth - d3.event.pageX + 15}px`);
                    } else {
                        tooltip._groups[0][0].style.removeProperty('right');
                        tooltip.style('left', `${d3.event.pageX}px`);
                    }
                })
            .on('mouseout', d => {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .attr('class', 'dot')
            .attr('data-xvalue', d => d.Year)
            .attr('data-yvalue', d => d3.timeParse('%M:%S')(d.Time));
};

const req = new XMLHttpRequest();
req.open('GET', 'cyclist-data.json', true);
req.send();
req.onload = function() {
    data = JSON.parse(req.responseText);
    resize();
};

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', resize);
});
