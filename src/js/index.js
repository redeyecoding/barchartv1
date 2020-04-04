import { select, selectAll } from 'd3';
import { min, max, range, csv, line } from 'd3';
import { 
    scaleLinear, 
    arc, 
    svg,
    scaleBand,
    axisBottom,
    axisLeft} from 'd3';

const canvasDemensions = {
    w: 1000,
    h: 600,
    grpX: 30,
    grpY: 30
}
const margins = {top: 20, right:20, bottom:20, left:20}
const innerWidth = canvasDemensions.w - (margins.right - margins.left)
const innerHeight = canvasDemensions.h - (margins.top - margins.bottom);
let yScale = scaleLinear().rangeRound([innerHeight, 0]);
let xScale = scaleLinear().rangeRound([innerWidth, 0]);
const chartData = {};

const rmvChar = /(\"|\]|\[)/g; 
const processData = d => Object.values(d).join('').trim().replace(rmvChar,'')
const gdpDataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  


csv(gdpDataURL)
    .then(rawGdpData => rawGdpData.map(processData))            
    .then(data => {
        
    const date = /^\d{4}\W\d{2}\W\d{2}$/;
    const gdp = /^\d+(\W\d+)?$/;
    const rmvUndef = d => d !== undefined;
    const addAbillion = match => ' Billion';
    const gdpAmount = d => d;


    const gdpData = data.map(e => {
        //GET YEAR
            if (e.match(date)) {
                const gdpYear = new Date(e);
                return gdpYear.getUTCFullYear()
        
        //CONVERT TO GDP BILLIONS FOR  HOVER OUTPUT
            } else if (e.match(gdp)) {
                return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
                            .format(e.match(gdp)[0])
                            .replace(/0$/, addAbillion)
            }
        }).filter(rmvUndef)

    //CONVERT TO FULL YEAR X-AXIS 
    const xAxisYear = gdpData.filter(d => typeof(d) === 'number').map(y => ['year',y])

    //CONVERT TO GDP Y-AXIS
    const yAxisGDP = data.filter(d => d.match(gdp)).map(d => ['gdp', Math.round(d)]);

    xAxisYear.forEach((e,i) => {
        chartData[i] = {
            [e[0]]: e[1],
            [yAxisGDP[0][0]]: yAxisGDP[i][1]
        }
        return;
    })
    console.log(chartData)








        yScale.domain(yAxisGDP) // Returns an array of (Gdp)
        xScale.domain(xAxisYear) // Returns an array of values ( years )

        const svg = select('body')
                        .append('g')
                        .attr('transform', `translate(${canvasDemensions.grpX},${canvasDemensions.grpY})`)
                            .append('svg')
                            .attr('width', canvasDemensions.w)
                            .attr('height', canvasDemensions.h)
        
        const bars = svg.selectAll('.bar')
                        .data(data)
                        .enter()
                        .append('rect')
                        .attr('x',xScale(d => d))
                        .attr('y',yScale(d => d))
                        .attr('height', innerHeight)
                        // .attr('weight', )
  });