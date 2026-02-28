import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { COLORS } from "../../utils/constants";

const screenWidth = Dimensions.get("window").width;

interface ChartDataset {
  data: number[];
  color?: (opacity: number) => string;
  strokeWidth?: number;
}

interface ChartDataProps {
  labels: string[];
  datasets: ChartDataset[];
}

interface PieChartDataItem {
  name: string;
  population: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

interface ChartProps {
  type: "line" | "bar" | "pie";
  data: ChartDataProps | PieChartDataItem[];
  title?: string;
  width?: number;
  height?: number;
  yAxisPrefix?: string;
  yAxisSuffix?: string;
  showLegend?: boolean;
  bezier?: boolean;
  style?: object;
}

const defaultChartConfig = {
  backgroundColor: COLORS.white,
  backgroundGradientFrom: COLORS.white,
  backgroundGradientTo: "#F5E6D3",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(111, 78, 55, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(62, 39, 35, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: COLORS.primary,
  },
  propsForBackgroundLines: {
    strokeDasharray: "",
    stroke: "#E8D5C4",
    strokeWidth: 1,
  },
};

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  width = screenWidth - 40,
  height = 220,
  yAxisPrefix = "",
  yAxisSuffix = "",
  showLegend = true,
  bezier = true,
  style,
}) => {
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart
            data={data as ChartDataProps}
            width={width}
            height={height}
            yAxisLabel={yAxisPrefix}
            yAxisSuffix={yAxisSuffix}
            chartConfig={defaultChartConfig}
            bezier={bezier}
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
          />
        );

      case "bar":
        return (
          <BarChart
            data={data as ChartDataProps}
            width={width}
            height={height}
            yAxisLabel={yAxisPrefix}
            yAxisSuffix={yAxisSuffix}
            chartConfig={{
              ...defaultChartConfig,
              barPercentage: 0.6,
            }}
            style={styles.chart}
            showBarTops={true}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            flatColor={false}
          />
        );

      case "pie":
        return (
          <PieChart
            data={data as PieChartDataItem[]}
            width={width}
            height={height}
            chartConfig={defaultChartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            hasLegend={showLegend}
            center={[0, 0]}
            absolute
          />
        );

      default:
        return <Text style={styles.errorText}>Unsupported chart type</Text>;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartWrapper}>{renderChart()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3E2723",
    marginBottom: 12,
  },
  chartWrapper: {
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 12,
  },
  chart: {
    borderRadius: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: "center",
    padding: 20,
  },
});

export default Chart;
