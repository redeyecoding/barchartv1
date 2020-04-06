import { select, selectAll } from 'd3';
import '../styles/style.scss'
import { min, max, range, csv, line } from 'd3';
import { 
    scaleLinear, 
    arc, 
    svg,
    scaleBand,
    axisBottom,
    axisLeft} from 'd3';

    const canvasDemensions = {
        w: 800,
        h: 400,
        grpX: 50,
        grpY: 10
    }
    const ytd = '1950 1955 1960 1965 1970 1975 1980 1985 1990 1995 2000 2005 2010 2015'.split(' ')
    const gdp = d => d.gdp;
    const margins = {top: 20, right:20, bottom:20, left:20}
    const innerWidth = canvasDemensions.w - margins.right - margins.left
    const innerHeight = canvasDemensions.h - margins.top - margins.bottom;
    const chartData = {};
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

    
csv(gdpDataURL)
  .then(rawGdpData => {   
    const data = rawGdpData.map(processData)

    const gdpData = data.map(e => {
        //GET YEAR
            if (e.match(dateRegex)) {
                const gdpYear = new Date(e);
                return gdpYear.getUTCFullYear()
        
        //CONVERT TO GDP BILLIONS FOR  HOVER OUTPUT
            } else if (e.match(gdpRegex)) {
                return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
                            .format(e.match(gdpRegex)[0])
                            .replace(/0$/, addAbillion)
            }
        }).filter(rmvUndef)

   
        //CONVERT TO FULL YEAR X-AXIS 
        const xAxisYear = gdpData.filter(d => typeof(d) === 'number').map(y => ['year',y])

                //CONVERT TO FULL YEAR X-AXIS 
        const hoverOutput = gdpData.filter(d => typeof(d) === 'string')
    
        //CONVERT TO GDP Y-AXIS
        const yAxisGDP = data.filter(d => d.match(gdpRegex)).map(d => ['gdp', Math.round(d)]);
    
        xAxisYear.forEach((e,i) => {
            chartData[i] = {
                        [e[0]]: e[1],
                        [yAxisGDP[0][0]]: yAxisGDP[i][1]
            }
            return;
        })
        console.log(Object.values(chartData))




        Object.values(chartData).forEach(e => {         
          let quarter = `Q${cnt}`

          if (newObject.hasOwnProperty(e.year)){
              newObject[e.year][quarter] = e.gdp
              newObject[e.year][e.year] = e.year
              cnt += 1

              if (cnt > 4) {
                cnt = 1
              }; 
          } else{              
              newObject[e.year] = {[quarter]: e.gdp};
              cnt += 1
          }
          return;
        })


        const yScale = scaleLinear()
                        .domain([0, max(Object.values(chartData),d => d.gdp)])
                        .range([innerHeight, 0]);         

        const xScale = scaleBand()
                        .domain(Object.values(chartData).map(d => d.gdp))
                        .range([0, innerWidth])
                        .padding(.1)
       
       // const xScale = scaleBand()
       //                  .domain(ytd.map(d => d))
       //                  .range([0,innerWidth])
       //                  .padding(.2)


        const svg = select('body')
                            .append('svg')
                            .attr('width', canvasDemensions.w)
                            .attr('id', 'canvas')
                            .attr('height', canvasDemensions.h)
                              .append('g')
                              .attr('transform', `translate(${canvasDemensions.grpX},${canvasDemensions.grpY})`)

        
      
        svg.append('g').call(axisLeft(yScale))
                        .attr('transform', `translate(-1,0)`)

        svg.append('g').call(axisBottom(xScale))
                        .attr('transform', `translate(0,360)`)
                        
    
        const bar = svg.selectAll('rect')
                        .data(Object.values(chartData))
                        .enter()
                        .append('rect')
                        .attr('x',d => xScale(d.gdp))
                        .attr('width',xScale.bandwidth())
                        .attr('y',d => yScale(d.gdp))
                        .attr('height', d => innerHeight - yScale(gdp(d)))

                        .attr('class',  'bar')
                        
      });