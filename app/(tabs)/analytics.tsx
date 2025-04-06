import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useStore } from '@/store/useStore';
import { VictoryPie, VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory-native';
import { format } from 'date-fns';

export default function AnalyticsScreen() {
  const { expenses } = useStore();

  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
    x: category,
    y: amount,
  }));

  // Calculate monthly totals
  const monthlyTotals = expenses.reduce((acc, expense) => {
    const month = format(new Date(expense.date), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(monthlyTotals).map(([month, amount]) => ({
    x: month,
    y: amount,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Expenses by Category</Text>
          <View style={styles.chartContainer}>
            <VictoryPie
              data={pieData}
              width={Dimensions.get('window').width - 64}
              height={300}
              colorScale={['#0891b2', '#0284c7', '#0369a1', '#075985', '#0c4a6e']}
              style={{
                labels: {
                  fill: '#64748b',
                  fontSize: 14,
                  fontFamily: 'Inter-Medium',
                },
              }}
            />
          </View>
          <View style={styles.legendContainer}>
            {pieData.map((data, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: ['#0891b2', '#0284c7', '#0369a1', '#075985', '#0c4a6e'][index % 5] }]} />
                <Text style={styles.legendText}>{data.x}</Text>
                <Text style={styles.legendAmount}>${data.y.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Expenses</Text>
          <VictoryChart
            theme={VictoryTheme.material}
            width={Dimensions.get('window').width - 64}
            height={300}
            domainPadding={20}>
            <VictoryAxis
              style={{
                tickLabels: {
                  angle: -45,
                  fontSize: 12,
                  fontFamily: 'Inter-Regular',
                  padding: 20,
                },
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                tickLabels: {
                  fontSize: 12,
                  fontFamily: 'Inter-Regular',
                },
              }}
            />
            <VictoryBar
              data={barData}
              style={{
                data: {
                  fill: '#0891b2',
                },
              }}
            />
          </VictoryChart>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginTop: 48,
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0f172a',
  },
  legendAmount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0891b2',
  },
});