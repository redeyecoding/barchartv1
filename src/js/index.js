import { select, selectAll } from 'd3';
import '../styles/style.scss'
import { max, csv, } from 'd3';
import { 
    scaleLinear, 
    scaleTime,
    axisBottom,
    axisLeft} from 'd3';


const canvasDemensions = {
w: 900,
h: 600,
grpX: 50,
grpY: 10
}


const gdp = d => d['data-gdp'];
const margins = {top: 20, right:20, bottom:20, left:20}
const innerWidth = canvasDemensions.w - margins.right - margins.left
const innerHeight = canvasDemensions.h - margins.top - margins.bottom;    
const rmvChar = /(\"|\]|\[)/g;
const dateRegex = /^\d{4}\W\d{2}\W\d{2}$/;
const gdpRegex = /^\d+(\W\d+)?$/;
const rmvUndef = d => d !== undefined;
const addAbillion = match => ' Billion';
const processData = d => Object.values(d).join('').trim().replace(rmvChar,'')
const gdpDataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let cnt = 1;

let chartData = {
      displayData:{}
};

      
csv(gdpDataURL)
.then(rawGdpData => {   
      const data = rawGdpData.map(processData)

      const gdpData = data.map(e => {
      //GET YEAR
            if (e.match(dateRegex)) {
                  return e;
      
      //CONVERT TO GDP BILLIONS FOR  HOVER OUTPUT
            } else if (e.match(gdpRegex)) {
                  return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
                              .format(e.match(gdpRegex)[0])
                              .replace(/0$/, addAbillion)
            }
      }).filter(rmvUndef)

      
      //CONVERT TO FULL YEAR X-AXIS 
      const xAxisYear = gdpData.filter(d => d.match(dateRegex)).map(y => ['data-data',y])
      const hoverOutput = gdpData.filter(d => !d.match(dateRegex));    
      const yAxisGDP = data.filter(d => d.match(gdpRegex)).map(d => ['data-gdp', Math.round(d)]);

            
      xAxisYear.forEach((e,i) => {
            let quarter = `Q${cnt}`;
            let year = new Date(e[1]).getUTCFullYear();


            if (chartData['displayData'].hasOwnProperty(year)){
                  chartData['displayData'][year].push([year + ' ' + quarter,hoverOutput[i]]);

                  chartData[i] = {
                        [e[0]]: [e[1], { [year]: [[year + ' ' + quarter,hoverOutput[i]]]}],
                        [yAxisGDP[0][0]]: yAxisGDP[i][1],
                        'displayData': [[year + ' ' + quarter,hoverOutput[i]]]                       
                  };
                  cnt += 1;
                  
                  if (cnt > 4) cnt = 1;                  

            } else {

                  chartData[year] = [[year + ' ' + quarter,hoverOutput[i]]];                        
                  chartData[i] = {
                        [e[0]]: e[1],
                        [yAxisGDP[0][0]]: yAxisGDP[i][1],
                        'displayData': [[year + ' ' + quarter,hoverOutput[i]]]
                  }
                  cnt += 1;
                  if (cnt > 4) cnt = 1;                
            };            
            return;
      });


      
      chartData = Object.values(chartData)

      const xScaleDate = gdpData.filter(d => d.match(dateRegex))

      const yScale = scaleLinear()
                        .domain([0, max(chartData,d => d['data-gdp'])])
                        .range([innerHeight, 80]);         
            
      const xScale = scaleTime()
                  .domain([new Date(xScaleDate[0]), new Date(xScaleDate[xScaleDate.length - 1])])
                  .range([0, 760]);
      
      const xAxisTickGenerator = axisBottom(xScale)
      const yAxisTickGenerator = axisLeft(yScale)


      const svg = select('#inner-chart-container')     
                              .attr('class','inner-chart-container')       
                              .append('svg')
                              .attr('width', canvasDemensions.w)
                              .attr('id', 'canvas')
                              .attr('height', canvasDemensions.h)

      const chartGroup = svg.append('g')
                              .attr('transform', 'translate(80, -30)')
                              .attr('id','chart-group')
                                                            
                                    
      chartGroup.append('g').call(yAxisTickGenerator)
                        .attr('transform', `translate(0,0)`)
                        .attr('id', 'y-axis')
                        .append('text')
                              .attr('class', 'side-title-gdp')
                              .attr('transform', 'translate(25,100) rotate(-90)')
                              .text('Gross Domestic Product') 

      chartGroup.append('g').call(xAxisTickGenerator)
                        .attr('transform', `translate(0,${canvasDemensions.h - 40})`)
                        .attr('id', 'x-axis')
                                                
      const bar = chartGroup 
                        .selectAll('rect')
                        .data(chartData)
                        .enter()
                        .append('g').attr('transform', 'translate(0,0)')
                        .append('rect')
                        .attr('x',d => xScale(new Date(d['data-data'])))
                        .attr('width', 2.2)
                        .attr('y',d => yScale(d['data-gdp']))
                        .attr('height', d => innerHeight - yScale(gdp(d)))
                        .attr('class', 'bar')
                        .append('title').attr('class','toolTip')
                        .text(d => d['displayData'][0].join(' '))
});
    
    