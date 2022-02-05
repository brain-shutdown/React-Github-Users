// STEP 1 - Include Dependencies
// Include react
import React from 'react';

// Include the react-fusioncharts component
import ReactFC from 'react-fusioncharts';

// Include the fusioncharts library
import FusionCharts from 'fusioncharts';

// Include the chart type
import Chart from 'fusioncharts/fusioncharts.charts';

// Include the theme as fusion
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

const ChartComponent = ({ data }) => {
	const chartConfigs = {
		type: 'pie2d', // The chart type
		width: '100%', // Width of the chart
		height: '400', // Height of the chart
		dataFormat: 'json', // Data type
		dataSource: {
			// Chart Configuration
			chart: {
				caption: 'Languages',
				theme: 'fusion',
				decimals: 0,
				pieRadius: '40%',
				paletteColors: '#2CADB9, #5D62B5, #FFC533, #F2726F, #8C6E63',
				labelFontColor: '#627D98',
				valueFontSize: '18rem',
				plotHoverEffect: false,
			},
			// Chart Data
			data,
		},
	};
	return <ReactFC {...chartConfigs} />;
};

export default ChartComponent;
