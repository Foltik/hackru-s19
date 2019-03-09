console.log('Hello!');

let group;
d3.csv('apps.csv').then(apps => {
    d3.csv('reviews.csv').then(reviews => {
        console.log(apps[0]);
        apps = crossfilter(apps);
        reviews = crossfilter(reviews);

        const ratingDim = apps.dimension(d => +d.Rating);
        const ratingGroup = ratingDim.group();
        const reviewDim = apps.dimension(d => +d.Reviews);
        const reviewGroup = reviewDim.group();
        const freeDim = apps.dimension(d => d.Type);
        const freeGroup = freeDim.group();

        group = freeGroup;

        const ratingchart = dc.barChart('#ratingchart')
            .width(768)
            .height(480)
            .x(d3.scaleLinear().domain([1, 5.1]))
            .barPadding(15)
            .dimension(ratingDim)
            .group(ratingGroup)
            .render();

        const reviewchart = dc.barChart('#reviewchart')
            .width(768)
            .height(480 )
            .x(d3.scaleLinear().domain([0, 100000]))
            .y(d3.scaleLinear().domain([0,100]))
            .dimension(reviewDim)
            .group(reviewGroup)
            .render();

        const freechart = dc.barChart('#freechart')
            .width(768)
            .height(480)
            .elasticX(true)
            .x(d3.scaleBand())
            .dimension(freeDim)
            .group(freeGroup)
            .render();

        console.log(apps);
        console.log(reviews);
    });
});
