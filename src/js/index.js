import { select, selectAll } from 'd3';
import '../styles/style.scss'
import { max, csv } from 'd3';
import { 
    scaleLinear, 
    scaleTime,
    axisBottom,
    axisLeft} from 'd3';

const gdpDataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
const svgCanvas = {width: 900, height: 600};
const chartPadding = {top: 70, right: 60, bottom: 40 ,left: 70, bar: 1};
const innerWidth = svgCanvas.width - chartPadding.right  - chartPadding.left;
const innerHeight = svgCanvas.height - chartPadding.top - chartPadding.bottom;


fetch(gdpDataURL)
        .then(response => response.json())
        .then(data => {
            const gdpData = data.data;
            const minDate = new Date(gdpData[0][0]);
            const maxDate = new Date(gdpData[gdpData.length - 1][0])


            // X AND Y AXES
            const yScale = d3.scaleLinear()
                        .domain([0, d3.max(gdpData, d => d[1])])
                        .range([innerHeight,0])            
            const yAxisGenerator = d3.axisLeft(yScale)



            const xScale = d3.scaleTime()
                        .domain([minDate, maxDate])
                        .range([0, innerWidth])            
            const xAxisGenerator = d3.axisBottom(xScale)

                    
            const svg = d3.select('#chart-container')
                    .append('svg')
                    .attr('width', svgCanvas.width)
                    .attr('height', svgCanvas.height) 
            
            const chartTitle = svg.append('text')
                                    .text('United States GDP: 1940\'s To 2015')
                                    .attr('transform', 'translate(200,85)')
                                    .attr('id', 'title')
            
            const chartGroup = svg.append('g')
                                    .attr('transform', `translate(${chartPadding.left}, ${chartPadding.top})`)
                                    .attr('id', 'chart-group')
            // yAxis
            chartGroup.append('g')
                        .call(yAxisGenerator)
                        .attr('transform', `translate(0,0)`)
                        .attr('id', 'y-axis')
                        .append('text')
                        .attr('class', 'side-title-gdp')
                        .attr('transform', 'translate(25,100) rotate(-90)')
                        .text('Gross Domestic Product') 
            
            // xAxis
            chartGroup.append('g')
                    .attr('transform', `translate(0, ${innerHeight})`)
                    .attr('id', 'x-axis')
                    .call(xAxisGenerator)
                                    

            chartGroup.selectAll('rect')
                    .data(gdpData)
                    .enter()
                    .append('rect')
                    .attr('data-date', function(d){ return d[0]})
                    .attr('data-gdp', function(d){ return d[1]})
                    //.attr('x', function(d,i){ return i * svgCanvas.width / gdpData.length })
                    .attr('x',d => xScale(new Date(d[0])))
                    .attr('width', svgCanvas.width / gdpData.length - chartPadding.bar)
                    .attr('height', function(d){ return innerHeight - yScale(d[1]) })
                    .attr('y',function(d){ return yScale(d[1]) })
                    .attr('class', 'bar')
})
    