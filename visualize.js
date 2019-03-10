'use strict';
console.log('Hello!');

const color_scale = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'];
dc.config.defaultColors(color_scale);

const addkey = (obj, key, v) => obj[key] = obj[key] ? obj[key] + v : v;

let group;
d3.csv('apps.csv').then(apps => {
    d3.csv('reviews.csv').then(reviews => {
        reviews = reviews.reduce((acc, v) => {
            if (!acc[v.App]) acc[v.App] = {};
            const i = v['Sentiment_Polarity'];
            const j = v['Sentiment_Subjectivity'];
            let obj = acc[v.App];
            if (+i) {
                obj.count = obj.count ? obj.count + 1 : 1;
                obj.avg_pol = obj.avg_pol || 0;
                obj.avg_pol += (+i - obj.avg_pol) / obj.count;
                obj.avg_sub = obj.avg_sub || 0;
                obj.avg_sub += (+j - obj.avg_sub) / obj.count;
            }
            return acc;
        }, {});

        apps = apps.reduce((acc, d) => {
            const r = reviews[d.App];
            if (r) {
                d.Polarity = r.avg_pol;
                d.Subjectivity = r.avg_sub;
                acc = acc.concat(d);
            } else {
                acc = acc.concat(d);
            }
            return acc;
        }, []);

        apps = crossfilter(apps);

        const ratingDim = apps.dimension(d => +d.Rating);
        const catDim = apps.dimension(d => d.Category);
        const sizeDim = apps.dimension(d => +d.Size);
        const polDim = apps.dimension(d => [d.Polarity, +d.Rating]);
        const subDim = apps.dimension(d => [d.Subjectivity, +d.Rating]);

        dc.barChart('#ratingchart')
            .x(d3.scaleLinear().domain([1, 5.1]))
            .elasticY(true)
            .barPadding(15)
            .dimension(ratingDim)
            .group(ratingDim.group())
            .render();

        dc.pieChart('#catchart')
            .width(500)
            .height(300)
            .cap(19)
            .legend(dc.legend())
            .dimension(catDim)
            .group(catDim.group())
            .render();

        dc.barChart('#sizechart')
            .x(d3.scaleLinear().domain([0, 100]))
            .elasticY(true)
            .barPadding(15)
            .dimension(sizeDim)
            .group(sizeDim.group())
            .render();

        dc.scatterPlot('#polscatter')
            .x(d3.scaleLinear().domain([0, 1]))
            .dimension(polDim)
            .group(polDim.group())
            .render();

        dc.scatterPlot('#subscatter')
            .x(d3.scaleLinear().domain([0, 1]))
            .dimension(subDim)
            .group(subDim.group())
            .render();

    }).catch(err => console.error(err));
}).catch(err => console.error(err));
