'use strict';
console.log('Hello!');

let group;
d3.csv('apps.csv').then(apps => {
    console.log(apps[0]);
    apps = crossfilter(apps);

    const ratingDim = apps.dimension(d => +d.Rating);

    const catDim = apps.dimension(d => d.Category);

    const sizeDim = apps.dimension(d => +d.Size);

    //group = catGroup;

    dc.barChart('#ratingchart')
        .width(768)
        .height(480)
        .x(d3.scaleLinear().domain([1, 5.1]))
        .elasticY(true)
        .barPadding(15)
        .dimension(ratingDim)
        .group(ratingDim.group())
        .render();

    dc.pieChart('#catchart')
        .width(800)
        .height(800)
        .cap(10)
        .innerRadius(100)
        .dimension(catDim)
        .group(catDim.group())
        .render();

    dc.barChart('#sizechart')
        .width(800)
        .height(800)
        .x(d3.scaleLinear().domain([0, 100]))
        .barPadding(15)
        .dimension(sizeDim)
        .group(sizeDim.group())
        .render()
        .label(function(d) {
            console.log(JSON.stringify(d));
        })
});
