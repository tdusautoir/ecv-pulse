type UserStats = {
    currentMonthSpent: number;
    spendingByCategory: Record<string, number>;
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
