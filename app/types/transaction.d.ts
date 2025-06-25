type TransactionCategory = 'shopping' | 'video_games' | 'food' | 'bar' | 'transport' | 'entertainment' | 'health' | 'education' | 'utilities' | 'other'
type TransactionType = 'p2p' | 'group' | 'subscription' | 'deposit' | 'withdrawal' | 'saving'
type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'

type Transaction = {
    category: TransactionCategory | null,
    type: TransactionType,
    status: TransactionStatus,
    message: string | null,
    description: string | null,
    amount: string,
    receiverId: number | null,
    senderId: number | null,
    createdAt: string,
    id: string
} & ({
    type: 'withdrawal',
    receiverId: null,
    message: null,
    description: string,
    category: TransactionCategory
} | {
    type: 'p2p',
    receiverId: number,
    message: string,
    description: null,
    category: null,
    sender: {
        fullName: string | null,
        phoneNumber: string
    },
    receiver: {
        fullName: string | null,
        phoneNumber: string
    }
})