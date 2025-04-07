import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useStore } from '@/store/useStore';
import { format } from 'date-fns';
import { Plus, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const { groups, expenses } = useStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBalance = expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const totalOwed = expenses.reduce((acc, expense) => {
    const isOwed =
      expense.splits[expense.paidBy] >
      expense.amount / Object.keys(expense.splits).length;
    return isOwed
      ? acc +
          (expense.splits[expense.paidBy] -
            expense.amount / Object.keys(expense.splits).length)
      : acc;
  }, 0);

  const totalReceivable = expenses.reduce((acc, expense) => {
    const isReceivable =
      expense.splits[expense.paidBy] <
      expense.amount / Object.keys(expense.splits).length;
    return isReceivable
      ? acc +
          (expense.amount / Object.keys(expense.splits).length -
            expense.splits[expense.paidBy])
      : acc;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense Tracker</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/expense/new')}
        >
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#64748b"
        />
      </View>

      <View style={styles.balanceContainer}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text
            style={[
              styles.balanceAmount,
              { color: totalBalance >= 0 ? '#059669' : '#dc2626' },
            ]}
          >
            ${Math.abs(totalBalance).toFixed(2)}
          </Text>
          <Text style={styles.balanceType}>
            {totalBalance >= 0 ? 'you are owed' : 'you owe'}
          </Text>
        </View>
        <View style={styles.balanceDetailsContainer}>
          <View style={[styles.balanceDetailCard, styles.owedCard]}>
            <Text style={styles.detailLabel}>You are owed</Text>
            <Text style={[styles.detailAmount, styles.owedAmount]}>
              ${totalOwed.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.balanceDetailCard, styles.oweCard]}>
            <Text style={styles.detailLabel}>You owe</Text>
            <Text style={[styles.detailAmount, styles.oweAmount]}>
              ${totalReceivable.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Groups</Text>
      <ScrollView
        style={styles.groupList}
        contentContainerStyle={styles.groupListContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredGroups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupCard}
            onPress={() => router.push(`/group/${group.id}`)}
          >
            <View style={styles.groupInfo}>
              <View style={styles.groupAvatar}>
                <Text style={styles.groupAvatarText}>
                  {group.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.groupDetails}>
                <Text
                  style={styles.groupName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {group.name}
                </Text>
                <Text style={styles.groupMembers}>
                  {group.members.length}{' '}
                  {group.members.length === 1 ? 'member' : 'members'}
                </Text>
              </View>
            </View>
            <View style={styles.groupBalance}>
              <Text
                style={[
                  styles.groupAmount,
                  { color: group.totalExpenses >= 0 ? '#059669' : '#dc2626' },
                ]}
              >
                ${Math.abs(group.totalExpenses).toFixed(2)}
              </Text>
              <Text style={styles.groupDate}>
                {format(new Date(group.createdAt), 'MMM d, yyyy')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
  },
  addButton: {
    backgroundColor: '#0891b2',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0f172a',
  },
  balanceContainer: {
    marginBottom: 24,
  },
  balanceCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  balanceType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  balanceDetailsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  balanceDetailCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  owedCard: {
    borderColor: '#059669',
    borderWidth: 1,
  },
  oweCard: {
    borderColor: '#dc2626',
    borderWidth: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    marginBottom: 4,
  },
  detailAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  owedAmount: {
    color: '#059669',
  },
  oweAmount: {
    color: '#dc2626',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
    marginBottom: 16,
  },
  groupList: {
    flex: 1,
  },
  groupListContent: {
    paddingBottom: 16,
  },
  groupCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  groupAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  groupDetails: {
    flex: 1,
    marginRight: 4,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0f172a',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  groupBalance: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  groupAmount: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  groupDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
});
