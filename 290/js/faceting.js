const bar = echarts.init(document.getElementById('bar')),
    line_group = echarts.init(document.getElementById('line_group'));
// country
const country = ['Argentina', 'Australia', 'Brazil', 'Canada', 'China', 'Dem. Rep. Congo', 'Germany', 'Spain',
    'Ethiopia', 'Finland', 'France', 'United Kingdom', 'Indonesia', 'India', 'Iraq', 'Iceland', 'Israel',
    'Italy', 'Japan', 'Dem. Rep. Korea', 'Kuwait', 'Luxembourg', 'Morocco', 'Mexico', 'Norway', 'Nepal',
    'Pakistan', 'Qatar', 'Russia', 'Saudi Arabia', 'Sweden', 'Syria', 'Trinidad and Tobago', 'Turkey',
    'United States', 'Zimbabwe'
];

const close_country = {
    "Argentina": false,
    "Australia": false,
    "Brazil": false,
    "Canada": false,
    "China": false,
    "Dem. Rep. Congo": false,
    "Germany": false,
    "Spain": false,
    "Ethiopia": false,
    "Finland": false,
    "France": false,
    "United Kingdom": false,
    "Indonesia": false,
    "India": false,
    "Iraq": false,
    "Iceland": false,
    "Israel": false,
    "Italy": false,
    "Japan": false,
    "Dem. Rep. Korea": false,
    "Kuwait": false,
    "Luxembourg": false,
    "Morocco": false,
    "Mexico": false,
    "Norway": false,
    "Nepal": false,
    "Pakistan": false,
    "Qatar": false,
    "Russia": false,
    "Saudi Arabia": false,
    "Sweden": false,
    "Syria": false,
    "Trinidad and Tobago": false,
    "Turkey": false,
    "United States": false,
    "Zimbabwe": false
}

var labelOption = {

    normal: {
        show: true,
        position: 'bottom',
        rotate: -30,
        distance: 30,
        formatter: '{name|{a}}',
        fontSize: 16,
        rich: {
            name: {
                textBorderColor: '#fff'
            }
        }
    }

};

$.getJSON('./data/country_data.json', function (data) {

    // 处理所以数据
    var bar_data = [];
    var bar_gdp = [];
    var bar_ec = [];
    // 处理所以数据
    var line_group_data = [];
    var line_group_gdp = [];
    var line_group_ec = [];
    country.forEach((n, i) => {
        var gdp_year = [];
        var ec_year = [];
        var gdp_avg = 0;
        var ec_avg = 0;
        data[n].forEach(e => {
            gdp_year.push(e.gdp);
            ec_year.push(e.ec);
            gdp_avg += e.gdp;
            ec_avg += e.ec;
        });

        bar_data.push({
            name: n,
            type: 'bar',
            data: [Math.round(gdp_avg / 43)],
            // color: '#003366',
            label: labelOption
        }, {
            name: n,
            type: 'bar',
            data: [Math.round(ec_avg / 43)],
            // color: '#4cabce',
            yAxisIndex: 1
        });
        bar_gdp.push({
            name: n,
            type: 'bar',
            data: [Math.round(gdp_avg / 43)],
            // color: '#003366',
            label: labelOption
        });
        bar_ec.push({
            name: n,
            type: 'bar',
            data: [Math.round(ec_avg / 43)],
            // color: '#4cabce',
            label: labelOption
        });
        line_group_data.push({
            name: 'GDP',
            type: 'line',
            showSymbol: false,
            data: gdp_year,
            color: '#003366',
            xAxisIndex: i,
            yAxisIndex: i
        }, {
            name: 'EC',
            type: 'line',
            showSymbol: false,
            data: ec_year,
            color: '#4cabce',
            xAxisIndex: i,
            yAxisIndex: i
        });

        line_group_gdp.push({
            name: 'GDP',
            type: 'line',
            showSymbol: false,
            data: gdp_year,
            xAxisIndex: i,
            yAxisIndex: i
        });
        line_group_ec.push({
            name: 'EC',
            type: 'line',
            showSymbol: false,
            data: ec_year,
            xAxisIndex: i,
            yAxisIndex: i
        });
    });




    //柱状图
    bar_gdp = {
        xAxis: {
            type: 'category'
        },
        yAxis: {
            name: 'GDP(pc)',
            type: 'value'
        },
        tooltip: {
            // trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            }

        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 0,
            top: 20,
            bottom: 20,
            data: country,
            selected: close_country
        },
        grid: {
            right: '20%'
        },
        series: bar_gdp
    };
    bar_ec = {
        xAxis: {
            type: 'category'
        },
        yAxis: {
            name: 'Energy consumption(pc)',
            type: 'value'
        },
        tooltip: {
            // trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            }

        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 0,
            top: 20,
            bottom: 20,
            data: country,
            selected: close_country
        },
        grid: {
            right: '20%'
        },
        series: bar_ec
    };
    bar_all = {
        xAxis: [{
            type: 'category',
            data: []
        }, {
            type: 'category',
            data: []
        }],
        yAxis: [{
            name: 'GDP(pc)',
            type: 'value'
        }, {
            name: 'Energy consumption(pc)',
            type: 'value'
        }],
        tooltip: {
            // trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            }

        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 0,
            top: 20,
            bottom: 20,
            data: country,
            selected: close_country
        },
        grid: [{
            right: '20%'
        }, {
            right: '20%'
        }],
        series: bar_data
    };

    bar.setOption(bar_all);
    $('#bar_gdpb').click(function () {
        bar.clear();
        bar.setOption(bar_gdp);
    });
    $('#bar_ecb').click(function () {
        bar.clear();
        bar.setOption(bar_ec);
    });
    $('#bar_allb').click(function () {
        bar.clear();
        bar.setOption(bar_all);
    });


    // 分面图
    var grids = [];
    var titles = [];
    var xAxes = [];
    var yAxes = [];
    var yAxes2 = [];
    var x = [30, 31, 32, 33, 34, 35];
    var y = [0, 6, 12, 18, 24, 30];
    echarts.util.each(country, function (d, i) {
        grids.push({
            show: true,
            borderWidth: 0,
            backgroundColor: '#fff',
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowBlur: 2
        });
        titles.push({
            textAlign: 'center',
            text: d,
            textStyle: {
                fontSize: 12,
                fontWeight: 'normal'
            }
        });
        if (x.indexOf(i) != -1) {
            xAxes.push({
                type: 'category',
                show: true,
                gridIndex: i,
                data: year
            });
        } else {
            xAxes.push({
                type: 'category',
                show: false,
                gridIndex: i,
                data: year
            });
        }
        if (y.indexOf(i) != -1) {
            yAxes.push({
                gridIndex: i,
                show: true,
                min: 0,
                max: 120000,
                splitLine: {
                    show: false
                }
            });
        } else {
            yAxes.push({
                show: false,
                gridIndex: i,
                min: 0,
                max: 120000
            });
        }
        if (y.indexOf(i) != -1) {
            yAxes2.push({
                gridIndex: i,
                show: true,
                min: 0,
                max: 25000,
                splitLine: {
                    show: false
                }
            });
        } else {
            yAxes2.push({
                show: false,
                gridIndex: i,
                min: 0,
                max: 25000
            });
        }
    });
    var rowNumber = Math.ceil(Math.sqrt(35));
    echarts.util.each(grids, function (grid, idx) {
        grid.left = ((idx % rowNumber) / rowNumber * 95 + 5) + '%';
        grid.top = (Math.floor(idx / rowNumber) / rowNumber * 95 + 1) + '%';
        grid.width = (1 / rowNumber * 95 - 1) + '%';
        grid.height = (1 / rowNumber * 92 - 1) + '%';
        titles[idx].left = parseFloat(grid.left) + parseFloat(grid.width) / 2 + '%';
        titles[idx].top = parseFloat(grid.top) + '%';
    });
    line_group_all = {
        title: titles.concat([{
            // text: '分面图',
            top: 'bottom',
            left: 'center'
        }]),
        grid: grids,
        xAxis: xAxes,
        yAxis: yAxes,
        series: line_group_data
    };
    line_group_gdp = {
        title: titles.concat([{
            // text: '分面图',
            top: 'bottom',
            left: 'center'
        }]),
        grid: grids,
        xAxis: xAxes,
        yAxis: yAxes,
        visualMap: {
            min: 0,
            max: 120000,
            show: false,
            calculable: false,
            realtime: false,
            right: -30,
            itemWidth: 2,
            bottom: 20,
            align: 'left',
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
                    '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027',
                    '#a50026'
                ]
            }
        },
        series: line_group_gdp
    };
    line_group_ec = {
        title: titles.concat([{
            // text: '分面图',
            top: 'bottom',
            left: 'center'
        }]),
        grid: grids,
        xAxis: xAxes,
        yAxis: yAxes2,
        visualMap: {
            min: 0,
            max: 25000,
            show: false,
            calculable: false,
            realtime: false,
            right: -30,
            itemWidth: 2,
            align: 'left',
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
                    '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027',
                    '#a50026'
                ]
            }
        },
        series: line_group_ec
    };

    line_group.setOption(line_group_gdp);
    $('#lineg_gdpb').click(function () {
        line_group.clear();
        line_group.setOption(line_group_gdp);
        $('#line_group_legend').hide();
    });
    $('#lineg_ecb').click(function () {
        line_group.clear();
        line_group.setOption(line_group_ec);
        $('#line_group_legend').hide();
    });
    $('#lineg_allb').click(function () {
        line_group.clear();
        line_group.setOption(line_group_all);
        $('#line_group_legend').show();
    });
});