import { select, selectAll } from 'd3';
import '../styles/style.scss'
import { min, max, range, csv, line } from 'd3';
import { 
    scaleLinear, 
    arc, 
    svg,
    scaleTime,
    axisBottom,
    axisLeft} from 'd3';

    const canvasDemensions = {
        w: 855,
        h: 400,
        grpX: 50,
        grpY: 10
    }


    const gdp = d => d['date-gdp'];
    const margins = {top: 20, right:20, bottom:20, left:20}
    const innerWidth = canvasDemensions.w - margins.right - margins.left
    const innerHeight = canvasDemensions.h - margins.top - margins.bottom;    
    const rmvChar = /(\"|\]|\[)/g;
    const dateRegex = /^\d{4}\W\d{2}\W\d{2}$/;
    const gdpRegex = /^\d+(\W\d+)?$/;
    const rmvUndef = d => d !== undefined;
    const addAbillion = match => ' Billion';
    const gdpAmount = d => d;
    const processData = d => Object.values(d).join('').trim().replace(rmvChar,'')
    const gdpDataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
    let newArray = [], newObject = {}
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
        const xAxisYear = gdpData.filter(d => d.match(dateRegex)).map(y => ['date-date',y])
       

                //CONVERT TO FULL YEAR X-AXIS 
        const hoverOutput = gdpData.filter(d => !d.match(dateRegex));    
        //CONVERT TO GDP Y-AXIS
        const yAxisGDP = data.filter(d => d.match(gdpRegex)).map(d => ['date-gdp', Math.round(d)]);
            
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
                        .domain([0, max(chartData,d => d['date-gdp'])])
                        .range([innerHeight, 0]);         
            
        const xScale = scaleTime()
                    .domain([new Date(xScaleDate[0]), new Date(xScaleDate[xScaleDate.length - 1])])
                    .range([0, 800]);
        
        const xAxisTickGenerator = axisBottom(xScale)
        const yAxisTickGenerator = axisLeft(yScale)


        const svg = select('body')
                            .append('svg')
                            .attr('width', canvasDemensions.w)
                            .attr('id', 'canvas')
                            .attr('height', canvasDemensions.h)
                              .append('g')
                              .attr('transform', `translate(${canvasDemensions.grpX},${canvasDemensions.grpY})`)

      
        svg.append('g').call(yAxisTickGenerator)
                        .attr('transform', `translate(0,0)`)
                        .attr('id', 'y-axis')
                        .append('text')
                           .attr('class', 'side-title-gdp')
                           .attr('transform', 'translate(25,40) rotate(-90)')
                           .text('Gross Domestic Product')                             

 
        svg.append('g').call(xAxisTickGenerator)
                        .attr('transform', `translate(0,360)`)
                        .attr('id', 'x-axis')
                                             
        const bar = svg .append('g').attr('transform', 'translate(0,-10)')
                        .selectAll('rect')
                        .data(chartData)
                        .enter()
                        .append('g').attr('transform', 'translate(0,10)')
                        .append('rect')
                        .attr('x',d => xScale(new Date(d['date-date'])))
                        .attr('width', 2.2)
                        .attr('y',d => yScale(d['date-gdp']))
                        .attr('height', d => innerHeight - yScale(gdp(d)))
                        .attr('class', 'bar')
                        .on('mouseover',function(d){
                              let toolTipHover = d['displayData'][0][0] + ' ' + d['displayData'][0][1]
                              console.log(toolTipHover)
                              //return hoverOut;
                        })
                        //.on("mouseover", function(){select(this).style("fill", "green");})
});