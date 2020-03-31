import { select, selectAll } from 'd3';
import { min, max, range, csv, line } from 'd3';
import { scaleLinear, arc, svg} from 'd3';

console.log('testing123')

//svg canvas demensions
const cd = {
            height: 500,
            width: 500,
            padding: {left:100, top: 50, right:50, bottom:50},
            yAxis: 600
};
const years = '1950 1955 1960 1965 1970 1975 1980 1985 1990 1995 2000 2005 2010 2015'.split(' ')

const dataURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
const fectchData = csv(dataURL)
                        .then(rawGdpData => {                            
                            const re = /^(\d{4}-\d{2}-\d{2}$|\d*\W\d$)/
                            const rmvChar = /(\"|\]|\[)/g;
                            const rawData = rawGdpData.map(d =>  Object.values(d)
                                                                    .join('')
                                                                    .trim()
                                                                    .replace(rmvChar,''))
                            return rawData
                        })
                        
                        // convert Yearly GDP to Strng
                        .then(data => {
                            const re = /^\d*\W\d$/;
                            const gdpData = data.filter(d => d.match(re));
                            const convertedFunds = gdpData
                                    .map(annualGdp => 
                                        { return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
                                            .format(annualGdp)
                                            .replace(/0$/, ' Billion')
                                    });
                            console.log(convertedFunds)
                            // gdpData.forEach(d => {
                            //     const formatMoney =  //Remove Trailing Zero
                            // });
                            return gdpData;
                        });
                            
                            

                            // Convert money into dollar amount 



                        .then(gdpData => {
                            const countryCur = {
                                us: 'en-US',
                                jp: 'ja-JP',
                                dn: 'de-DE'
                            };

                            const re = /^(\d{4}-\d{2}-\d{2}$|\d*\W\d$)/
                            const rmvChar = /(\"|\]|\[)/g;

                            //Process RawData
                            const rawData = gdpData.map(d =>  Object.values(d)
                                                                    .join('')
                                                                    .trim()
                                                                    .replace(rmvChar,''))
                                                                    .filter(d => d.match(re))
                            
                            // Convert money into dollar amount
                            const formatMoney = Intl.NumberFormat(countryCur.us, { style: 'currency', currency: 'USD' })
                                                    .format(rawData[417])
                                                    .replace(/0$/, ' Billion'); //Remove Trailing Zero

                            console.log(rawData)

});

const canvas = select('#chart-container')
                .append('svg')
                    .attr('y', cd.yAxis)
                    .attr('x', cd.xAxis)
                    .attr('height', cd.height)
                    .attr('width', cd.width)
                    .attr('fill', 'blue')

const innerCanvas = select('svg')
                            .append('g')
                            .attr('transform', `translate(${cd.padding.left}, ${cd.padding.top})`)
                            .append('rect')
                                .attr('y',100)
                                .attr('x', 200)
                                .attr('width',200)
                                .attr('height',200);
