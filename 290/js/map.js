// 渲染地图
$.getJSON('./data/year_data.json', function (data) {
	// 时间轴
	var timeline = {
		axisType: 'category',
		orient: 'horizontal',
		autoPlay: false,
		playInterval: 500,
		loop: false,
		data: year
	}
	// 地图设置
	var series = [{
		type: 'map3D',
		map: 'world',
		regionHeight: 0.1,
		roam: false,
		emphasis: { //当鼠标放上去  地区区域是否显示名称
			label: {
				show: true,
				formatter: '{b},{c}'
			}
		},
		viewControl: {
			// distance: 65,
			zoomSensitivity: 0
		},
		// 渲染
		light: {
			main: {
				intensity: 1,
				shadow: true,
				shadowQuality: 'low',
				alpha: 50
			},
			ambientCubemap: {
				texture: './data/canyon.hdr',
				diffuseIntensity: 0.4
			}
		},
		// groundPlane: {
		// 	show: true,
		// 	color: '#999'
		// },
		//后期处理
		postEffect: {
			enable: true,
			bloom: {
				enable: false
			},
			depthOfField: {
				enable: false,
				focalRange: 10,
				blurRadius: 10,
				fstop: 1
			},
			SSAO: {
				radius: 1,
				intensity: 1,
				enable: true
			}
		},
	}]
	gdp_option = {
		timeline: timeline,
		baseOption: {
			title: {
				text: 'GDP(per capita)',
				left: 'center'
			},
			visualMap: {
				min: 0,
				max: 120000,
				text: ['High', 'Low'],
				calculable: false,
				realtime: false,
				inRange: {
					color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
						'#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027',
						'#a50026'
					]
				}
			},
			series: series
		},
		options: []
	}
	ec_option = {
		timeline: timeline,
		baseOption: {
			title: {
				text: 'Energy consumption(per capita)',
				left: 'center'
			},
			visualMap: {
				min: 0,
				max: 20000,
				text: ['High', 'Low'],
				calculable: false,
				realtime: false,
				inRange: {
					color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
						'#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027',
						'#a50026'
					]
				}
			},
			series: series
		},
		options: []
	}
	year.forEach(index => {
		var gdp_data = [];
		var ec_data = [];
		data[index].forEach(element => {
			gdp_data.push({
				name: element.country,
				value: element.gdp,
				height: element.gdp / 5000 + 0.1
			});
			ec_data.push({
				name: element.country,
				value: element.ec,
				height: element.ec / 5000 + 0.1
			});
		});
		gdp_option.options.push({
			series: {
				data: gdp_data
			}
		});
		ec_option.options.push({
			series: {
				data: ec_data
			}
		});
	});
	gdp_map.setOption(gdp_option);
	ec_map.setOption(ec_option);
});