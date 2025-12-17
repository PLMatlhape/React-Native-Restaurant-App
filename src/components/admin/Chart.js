import { useMemo } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {
    BarChart,
    ContributionGraph,
    LineChart,
    PieChart
} from 'react-native-chart-kit';
import { COLORS } from '../../utils/constants';

const screenWidth = Dimensions.get('window').width;

/**
 * Chart Component
 * 
 * A reusable chart wrapper component that supports multiple chart types
 * for the admin dashboard analytics.
 * 
 * @param {Object} props
 * @param {string} props.type - Chart type: 'line', 'bar', 'pie', 'contribution'
 * @param {Object} props.data - Chart data (structure depends on chart type)
 * @param {string} props.title - Chart title
 * @param {number} props.height - Chart height (default: 220)
 * @param {number} props.width - Chart width (default: screen width - 40)
 * @param {Object} props.style - Additional container styles
 * @param {Object} props.chartConfig - Custom chart configuration
 * @param {boolean} props.bezier - For line charts, use bezier curve
 * @param {boolean} props.showValuesOnTopOfBars - For bar charts, show values on top
 * @param {boolean} props.showLegend - Show legend for pie charts
 */
const Chart = ({
  type = 'line',
  data,
  title,
  height = 220,
  width,
  style,
  chartConfig: customChartConfig,
  bezier = true,
  showValuesOnTopOfBars = true,
  showLegend = true,
  accessor = 'value',
  backgroundColor = COLORS.white,
  paddingLeft = '15',
  absolute = false
}) => {
  const chartWidth = width || screenWidth - 40;

  // Default chart configuration with coffee shop theme
  const defaultChartConfig = useMemo(() => ({
    backgroundColor: backgroundColor,
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.cream,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(111, 78, 55, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(62, 39, 35, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: COLORS.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: COLORS.border,
      strokeOpacity: 0.3,
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '500',
    },
    fillShadowGradient: COLORS.primary,
    fillShadowGradientOpacity: 0.3,
  }), [backgroundColor]);

  const chartConfig = { ...defaultChartConfig, ...customChartConfig };

  // Generate pie chart colors
  const pieChartColors = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.accent,
    COLORS.success,
    COLORS.warning,
    '#2196F3',
    '#9C27B0',
    '#00BCD4',
    '#FF5722',
    '#607D8B',
  ];

  // Transform pie data if needed
  const getPieData = () => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item, index) => ({
      name: item.name || item.label || `Item ${index + 1}`,
      population: item.value || item.count || item.population || 0,
      color: item.color || pieChartColors[index % pieChartColors.length],
      legendFontColor: COLORS.text,
      legendFontSize: 12,
    }));
  };

  // Validate line/bar chart data structure
  const getLineBarData = () => {
    if (!data) {
      return {
        labels: [],
        datasets: [{ data: [0] }],
      };
    }
    
    // If data already has labels and datasets, return as is
    if (data.labels && data.datasets) {
      return {
        ...data,
        datasets: data.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.length > 0 ? dataset.data : [0],
        })),
      };
    }
    
    // If data is an array, transform it
    if (Array.isArray(data)) {
      return {
        labels: data.map(item => item.label || item.name || ''),
        datasets: [{
          data: data.map(item => item.value || item.count || 0),
        }],
      };
    }
    
    return {
      labels: [],
      datasets: [{ data: [0] }],
    };
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart
            data={getLineBarData()}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            bezier={bezier}
            style={styles.chart}
            withDots={true}
            withShadow={true}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
          />
        );

      case 'bar':
        return (
          <BarChart
            data={getLineBarData()}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars={showValuesOnTopOfBars}
            fromZero
            withInnerLines={true}
            yAxisLabel=""
            yAxisSuffix=""
          />
        );

      case 'pie':
        const pieData = getPieData();
        if (pieData.length === 0) {
          return (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No data available</Text>
            </View>
          );
        }
        return (
          <PieChart
            data={pieData}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            accessor={accessor}
            backgroundColor="transparent"
            paddingLeft={paddingLeft}
            absolute={absolute}
            hasLegend={showLegend}
          />
        );

      case 'contribution':
        return (
          <ContributionGraph
            values={data || []}
            endDate={new Date()}
            numDays={105}
            width={chartWidth}
            height={height}
            chartConfig={chartConfig}
            style={styles.chart}
            tooltipDataAttrs={() => ({})}
          />
        );

      default:
        return (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Unsupported chart type</Text>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartWrapper}>
        {renderChart()}
      </View>
    </View>
  );
};

// Preset chart components for common use cases
export const RevenueLineChart = ({ data, ...props }) => (
  <Chart 
    type="line" 
    data={data} 
    title="Revenue Over Time" 
    bezier 
    {...props} 
  />
);

export const OrdersBarChart = ({ data, ...props }) => (
  <Chart 
    type="bar" 
    data={data} 
    title="Orders by Status" 
    showValuesOnTopOfBars 
    {...props} 
  />
);

export const CategoryPieChart = ({ data, ...props }) => (
  <Chart 
    type="pie" 
    data={data} 
    title="Sales by Category" 
    {...props} 
  />
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 12,
  },
  chart: {
    borderRadius: 12,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
});

export default Chart;
