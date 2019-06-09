 d3.csv('./data/all_data.csv').then(data =>
     draw(data));

 function draw(data) {
     const ENABLED_OPACITY = 1;
     const DISABLED_OPACITY = .2;

     const margin = {
         top: 20,
         right: 20,
         bottom: 50,
         left: 50
     };
     const width = 750;
     const height = 420 - margin.top - margin.bottom;


     const colorScale = d3.scaleOrdinal()
         .range(d3.schemeCategory10);

     data.forEach(function (d) {
         d.year = new Date(d.year);
     });
     gdp(data)

     function gdp(data) {

         const x = d3.scaleTime()
             .range([0, width]);

         const y = d3.scaleLinear()
             .range([height, 0]);


         const gdp = d3.select('.gdp')
             .append('svg')
             .attr('width', 750)
             .attr('height', 420)
             .append('g')
             .attr('transform', `translate(${ margin.left },${ margin.top })`);

         x.domain(d3.extent(data, d => d.year));
         y.domain([0, 120000]);

         const xAxis = d3.axisBottom(x)
             .ticks((width + 2) / (height + 2) * 5)
             .tickSize(-height)
             .tickPadding(10);

         const yAxis = d3.axisRight(y)
             .ticks(5)
             .tickSize(7 + width)
             .tickPadding(-11 - width)
             .tickFormat(d => d);

         gdp.append('g')
             .attr('class', 'axis x-axis')
             .attr('transform', `translate(0,${ height + 6 })`)
             .call(xAxis);

         gdp.append('g')
             .attr('transform', 'translate(-7, 0)')
             .attr('class', 'axis y-axis')
             .call(yAxis);

         gdp.append('g')
             .attr('transform', `translate(0,${ height })`)
             .call(d3.axisBottom(x).ticks(0));

         gdp.append('g')
             .call(d3.axisLeft(y).ticks(0));

         const nestBycountryId = d3.nest()
             .key(d => d.country)
             .sortKeys((v1, v2) => (parseInt(v1, 10) > parseInt(v2, 10) ? 1 : -1))
             .entries(data);

         const countryNamesById = {};

         nestBycountryId.forEach(item => {
             countryNamesById[item.key] = item.values[0].country;
         });

         const regions = {};

         d3.map(data, d => d.country)
             .keys()
             .forEach(function (d, i) {
                 regions[d] = {
                     data: nestBycountryId[i].values,
                     enabled: true
                 };
             });

         const regionsIds = Object.keys(regions);

         const lineGenerator = d3.line()
             .x(d => x(d.year))
             .y(d => y(d.GDP));

         const legendContainer = d3.select('.legend');

         const legends = legendContainer
             .append('svg')
             .attr('width', 500)
             .attr('height', 400)
             .selectAll('g')
             .data(regionsIds)
             .enter()
             .append('g')
             .attr('class', 'legend-item')
             .attr('transform', function (n, i) {
                 var translate = "";
                 if (i < 20) {
                     translate = `translate(0,${ i * 20 + 30 })`
                 } else {
                     translate = `translate(160,${ (i-20) * 20 + 30 })`
                 }
                 return translate
             })
             .on('click', clickLegendHandler);

         legends.append('rect')
             .attr('x', 0)
             .attr('y', 0)
             .attr('width', 12)
             .attr('height', 12)
             .style('fill', country => colorScale(country))
             .select(function () {
                 return this.parentNode;
             })
             .append('text')
             .attr('x', 20)
             .attr('y', 10)
             .text(country => countryNamesById[country])
             .attr('class', 'textselected')
             .style('text-anchor', 'start')
             .style('font-size', 12);

         const extraOptionsContainer = legendContainer.append('div')
             .attr('class', 'extra-options-container');

         extraOptionsContainer.append('div')
             .attr('class', 'hide-all-option')
             .text('hide all')
             .on('click', () => {
                 regionsIds.forEach(country => {
                     regions[country].enabled = false;
                 });

                 singleLineSelected = false;

                 redrawChart();
             });

         extraOptionsContainer.append('div')
             .attr('class', 'show-all-option')
             .text('show all')
             .on('click', () => {
                 regionsIds.forEach(country => {
                     regions[country].enabled = true;
                 });

                 singleLineSelected = false;

                 redrawChart();
             });

         const linesContainer = gdp.append('g');

         let singleLineSelected = false;

         const voronoi = d3.voronoi()
             .x(d => x(d.year))
             .y(d => y(d.GDP))
             .extent([
                 [0, 0],
                 [width, height]
             ]);

         const voronoiGroup = gdp.append('g')
             .attr('class', 'voronoi-parent')
             .append('g')
             .attr('class', 'voronoi');

         d3.select('#show-voronoi')
             .property('disabled', false)
             .on('change', function () {
                 voronoiGroup.classed('voronoi-show', this.checked);
             });

         redrawChart();

         function redrawChart(showingRegionsIds) {
             const enabledRegionsIds = showingRegionsIds || regionsIds.filter(country => regions[country]
                 .enabled);

             const paths = linesContainer
                 .selectAll('.line')
                 .data(enabledRegionsIds);

             paths.exit().remove();

             paths
                 .enter()
                 .append('path')
                 .merge(paths)
                 .attr('class', 'line')
                 .attr('id', country => `region-${ country }`)
                 .attr('d', country => lineGenerator(regions[country].data))
                 .style('stroke', country => colorScale(country));

             legends.each(function (country) {
                 const opacityValue = enabledRegionsIds.indexOf(country) >= 0 ? ENABLED_OPACITY :
                     DISABLED_OPACITY;

                 d3.select(this).attr('opacity', opacityValue);
             });

             const filteredData = data.filter(dataItem => enabledRegionsIds.indexOf(dataItem.country) >= 0);

             const voronoiPaths = voronoiGroup.selectAll('path')
                 .data(voronoi.polygons(filteredData));

             voronoiPaths.exit().remove();

             voronoiPaths
                 .enter()
                 .append('path')
                 .merge(voronoiPaths)
                 .attr('d', d => (d ? `M${ d.join('L') }Z` : null))
                 .on('click', voronoiClick);
         }

         function clickLegendHandler(country) {
             if (singleLineSelected) {
                 const newEnabledRegions = singleLineSelected === country ? [] : [singleLineSelected, country];

                 regionsIds.forEach(currentcountry => {
                     regions[currentcountry].enabled = newEnabledRegions.indexOf(currentcountry) >= 0;
                 });
             } else {
                 regions[country].enabled = !regions[country].enabled;
             }

             singleLineSelected = false;

             redrawChart();
         }

         function voronoiClick(d) {
             if (singleLineSelected) {
                 singleLineSelected = false;

                 redrawChart();
             } else {
                 const country = d.data.country;

                 singleLineSelected = country;

                 redrawChart([country]);
             }
         }

     }

     ec(data)

     function ec(data) {

         const x = d3.scaleTime()
             .range([0, width]);

         const y = d3.scaleLinear()
             .range([height, 0]);


         const ec = d3.select('.ec')
             .append('svg')
             .attr('width', 750)
             .attr('height', 420)
             .append('g')
             .attr('transform', `translate(${ margin.left },${ margin.top })`);


         x.domain(d3.extent(data, d => d.year));
         y.domain([0, 25000]);

         const xAxis = d3.axisBottom(x)
             .ticks((width + 2) / (height + 2) * 5)
             .tickSize(-height)
             .tickPadding(10);

         const yAxis = d3.axisRight(y)
             .ticks(5)
             .tickSize(7 + width)
             .tickPadding(-11 - width)
             .tickFormat(d => d);

         ec.append('g')
             .attr('class', 'axis x-axis')
             .attr('transform', `translate(0,${ height + 6 })`)
             .call(xAxis);

         ec.append('g')
             .attr('transform', 'translate(-7, 0)')
             .attr('class', 'axis y-axis')
             .call(yAxis);

         ec.append('g')
             .attr('transform', `translate(0,${ height })`)
             .call(d3.axisBottom(x).ticks(0));

         ec.append('g')
             .call(d3.axisLeft(y).ticks(0));

         const nestBycountryId = d3.nest()
             .key(d => d.country)
             .sortKeys((v1, v2) => (parseInt(v1, 10) > parseInt(v2, 10) ? 1 : -1))
             .entries(data);

         const countryNamesById = {};

         nestBycountryId.forEach(item => {
             countryNamesById[item.key] = item.values[0].country;
         });

         const regions = {};

         d3.map(data, d => d.country)
             .keys()
             .forEach(function (d, i) {
                 regions[d] = {
                     data: nestBycountryId[i].values,
                     enabled: true
                 };
             });

         const regionsIds = Object.keys(regions);

         const lineGenerator = d3.line()
             .x(d => x(d.year))
             .y(d => y(d.ec));

         const legendContainer = d3.select('.legend');

         const legends = legendContainer
             .append('svg')
             .attr('width', 500)
             .attr('height', 400)
             .attr('transform', 'translate(0,45)')
             .selectAll('g')
             .data(regionsIds)
             .enter()
             .append('g')
             .attr('class', 'legend-item')
             .attr('transform', function (n, i) {
                 var translate = "";
                 if (i < 20) {
                     translate = `translate(0,${ i * 20 + 30 })`
                 } else {
                     translate = `translate(160,${ (i-20) * 20 + 30 })`
                 }
                 return translate
             })
             .on('click', clickLegendHandler);

         legends.append('rect')
             .attr('x', 0)
             .attr('y', 0)
             .attr('width', 12)
             .attr('height', 12)
             .style('fill', country => colorScale(country))
             .select(function () {
                 return this.parentNode;
             })
             .append('text')
             .attr('x', 20)
             .attr('y', 10)
             .text(country => countryNamesById[country])
             .attr('class', 'textselected')
             .style('text-anchor', 'start')
             .style('font-size', 12);

         const extraOptionsContainer = legendContainer.append('div')
             .attr('class', 'extra-options-container1')


         extraOptionsContainer.append('div')
             .attr('class', 'hide-all-option')
             .text('hide all')
             .on('click', () => {
                 regionsIds.forEach(country => {
                     regions[country].enabled = false;
                 });

                 singleLineSelected = false;

                 redrawChart();
             });

         extraOptionsContainer.append('div')
             .attr('class', 'show-all-option')
             .text('show all')
             .on('click', () => {
                 regionsIds.forEach(country => {
                     regions[country].enabled = true;
                 });

                 singleLineSelected = false;

                 redrawChart();
             });

         const linesContainer = ec.append('g');

         let singleLineSelected = false;

         const voronoi = d3.voronoi()
             .x(d => x(d.year))
             .y(d => y(d.ec))
             .extent([
                 [0, 0],
                 [width, height]
             ]);

         const voronoiGroup = ec.append('g')
             .attr('class', 'voronoi-parent')
             .append('g')
             .attr('class', 'voronoi');

         d3.select('#show-voronoi')
             .property('disabled', false)
             .on('change', function () {
                 voronoiGroup.classed('voronoi-show', this.checked);
             });

         redrawChart();

         function redrawChart(showingRegionsIds) {
             const enabledRegionsIds = showingRegionsIds || regionsIds.filter(country => regions[country]
                 .enabled);

             const paths = linesContainer
                 .selectAll('.line')
                 .data(enabledRegionsIds);

             paths.exit().remove();

             paths
                 .enter()
                 .append('path')
                 .merge(paths)
                 .attr('class', 'line')
                 .attr('id', country => `region-${ country }`)
                 .attr('d', country => lineGenerator(regions[country].data))
                 .style('stroke', country => colorScale(country));

             legends.each(function (country) {
                 const opacityValue = enabledRegionsIds.indexOf(country) >= 0 ? ENABLED_OPACITY :
                     DISABLED_OPACITY;

                 d3.select(this).attr('opacity', opacityValue);
             });

             const filteredData = data.filter(dataItem => enabledRegionsIds.indexOf(dataItem.country) >= 0);

             const voronoiPaths = voronoiGroup.selectAll('path')
                 .data(voronoi.polygons(filteredData));

             voronoiPaths.exit().remove();

             voronoiPaths
                 .enter()
                 .append('path')
                 .merge(voronoiPaths)
                 .attr('d', d => (d ? `M${ d.join('L') }Z` : null))
                 .on('click', voronoiClick);
         }

         function clickLegendHandler(country) {
             if (singleLineSelected) {
                 const newEnabledRegions = singleLineSelected === country ? [] : [singleLineSelected, country];

                 regionsIds.forEach(currentcountry => {
                     regions[currentcountry].enabled = newEnabledRegions.indexOf(currentcountry) >= 0;
                 });
             } else {
                 regions[country].enabled = !regions[country].enabled;
             }

             singleLineSelected = false;

             redrawChart();
         }

         function voronoiClick(d) {
             if (singleLineSelected) {
                 singleLineSelected = false;

                 redrawChart();
             } else {
                 const country = d.data.country;

                 singleLineSelected = country;

                 redrawChart([country]);
             }
         }
     }

 }