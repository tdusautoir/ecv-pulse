type UserStats = {
    currentMonthSpent: number;
    currentMonthGain: number;
    spendingByCategory: Record<string, number>;
    currentMonthGainSpentDiff: number;
}

type User = {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    balance: number;
    level: number;
    xp: number;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
    stats: UserStats;
}
