import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Member {
  id: string;
  name: string;
  email: string;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  date: string;
  category: string;
  paidBy: string;
  splitType: 'equal' | 'custom';
  splits: { [memberId: string]: number };
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  createdAt: string;
  totalExpenses: number;
}

interface ExpenseState {
  groups: Group[];
  expenses: Expense[];
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'totalExpenses'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (expenseId: string) => void;
  updateExpense: (expense: Expense) => void;
  deleteGroup: (groupId: string) => void;
  updateGroup: (group: Group) => void;
}

export const useStore = create<ExpenseState>()(
  persist(
    (set) => ({
      groups: [],
      expenses: [],
      addGroup: (group) =>
        set((state) => ({
          groups: [
            ...state.groups,
            {
              ...group,
              id: Math.random().toString(36).substring(7),
              createdAt: new Date().toISOString(),
              totalExpenses: 0,
            },
          ],
        })),
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: Math.random().toString(36).substring(7) },
          ],
          groups: state.groups.map((group) =>
            group.id === expense.groupId
              ? { ...group, totalExpenses: group.totalExpenses + expense.amount }
              : group
          ),
        })),
      deleteExpense: (expenseId) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== expenseId),
          groups: state.groups.map((group) => {
            const expense = state.expenses.find((e) => e.id === expenseId);
            return expense?.groupId === group.id
              ? { ...group, totalExpenses: group.totalExpenses - expense.amount }
              : group;
          }),
        })),
      updateExpense: (expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === expense.id ? expense : e
          ),
        })),
      deleteGroup: (groupId) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== groupId),
          expenses: state.expenses.filter((e) => e.groupId !== groupId),
        })),
      updateGroup: (group) =>
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === group.id ? group : g
          ),
        })),
        clearAllData: () => {
          set({ groups: [], expenses: [] });
        },
    }),
    {
      name: 'expense-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);