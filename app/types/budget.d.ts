
type Budget = {
    id: number;
    totalAmount: number;
    description: string | null;
    totalSpent: number;
    remainingAmount: number;
    utilizationPercentage: number;
    isExceeded: boolean;
    categories: BudgetCategory[];
}

type BudgetCategory = {
    id: number;
    category: string;
    allocatedAmount: number;
    spentAmount: number;
    remainingAmount: number;
    utilizationPercentage: number;
    isExceeded: boolean;
}