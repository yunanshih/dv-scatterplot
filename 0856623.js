let selectedX = "sepal length";
let selectedY = "sepal width";
const svg = d3.select('svg');
const width = parseInt(svg.attr('width'));
const height = parseInt(svg.attr('height'));
let csvData = {};

d3.csv('iris.csv')
.then(data => {
    data.forEach(d => {
        d['sepal length'] = parseFloat(d['sepal length']);
        d['sepal width'] = parseFloat(d['sepal width']);
        d['petal length'] = parseFloat(d['petal length']);
        d['petal width'] = parseFloat(d['petal width']);
        // d.class = d.class;
    });
    data.pop();
    csvData = data;
    render(data);
});


const changeSelection = () => {
    selectedX = document.getElementById("select-x").value;
    selectedY = document.getElementById("select-y").value;
    svg.selectAll("*").remove();
    render(csvData);
}

const render = data => {
    const title = `Iris Scatter Plot: ${selectedX} vs. ${selectedY}`;
    
    const xValue = d => d[selectedX];
    const xAxisLabel = selectedX;
    
    const yValue = d => d[selectedY];
    const circleRadius = 10;
    const yAxisLabel = selectedY;

    const margin = { top: 60, right: 40, bottom: 88, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();
    
    const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();
    
    const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xAxis = d3.axisBottom(xScale)
    .tickSize(-innerHeight)
    .tickPadding(15);
    
    const yAxis = d3.axisLeft(yScale)
    .tickSize(-innerWidth)
    .tickPadding(10);
    
    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();
    
    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -93)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
    
    const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 75)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);
    
    g.selectAll('circle').data(data)
    .enter().append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius)
        .attr('fill', d => d.class === 'Iris-setosa' 
                        ? 'purple' 
                        : d.class === 'Iris-versicolor'
                            ? 'blue'
                            : 'black'
        );
    
    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text(title);
};