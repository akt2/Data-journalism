// @TODO: YOUR CODE HERE!
function makeResponsive() {
    var svgArea=d3.select('body').select('svg');
    if (!svgArea.empty()) {
        svgArea.remove();
    }
};

var width=window.innerWidth-100;
var height=window.innerHeight-100;

var svg=d3.select('.scatter').append('svg').attr('width',window.innerWidth)
    .attr('height',window.innerHeight);

var group=svg.append('g').attr('transform',`translate(${margin.left}, ${margin.top})`);

d3.csv('../data/data.csv')
    .then(function(povdata) {
        povdata.forEach(function(data) {
            data.income=+data.income;
            data.smokes=+data.smokes;
        });

        var xscale=d3.scaleLinear().domain([0,d3.max(povdata,d=>d.income)])
        .range([0,width]);
        var yscale=d3.scaleLinear()
        .domain([0,d3.max(povdata,d=>d.smokes)]).range([height,0]);
        var xaxis=d3.axisBottom(xscale);
        var yaxis=d3.axisLeft(yscale);

        group.append('g').attr('transform',`translate(0, ${height})`).call(xaxis);
        group.append('g').call(yaxis);

        var circs=group.selectAll('circle').data(povdata).enter().append('circle')
            .attr('circx',d=>xLinearScale(d.income)).attr('circy',d=>yLinearScale(d.smokes))
            .attr('r','10').attr('fill','grey');
        
        var toolTip=d3.tip().attr('class','tooltip').offset([80,-60]).html(function(d) {
            return(`${d.abbr}<br>Income: $${d.income}<br>Smokers: ${d.smokes}%`);
        });

    group.call(toolTip);
    circs.on('click',function(data) {
        toolTip.show(data,this);
    }).on('mouseout',function(data,index) {
        toolTip.hide(data);
    });

    group.append('text').attr('transform','rotate(-90)').attr('y').attr('x')
        .attr('dy','1em').attr('class','axisText').text('Percentage of Smokers');
    group.append('text').attr('transform',`translate(${width/2},${height+75})`)
        .attr('class','axisText').text('Average Household Income');
    });