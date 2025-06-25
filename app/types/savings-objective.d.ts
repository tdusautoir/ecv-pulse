type SavingsObjective = {
    id: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string | null;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    completed: boolean;
    remainingAmount: number;
    progressPercentage: number;
};