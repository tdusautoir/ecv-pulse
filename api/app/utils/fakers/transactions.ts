import { DateTime } from 'luxon'
import Transaction from '#models/transaction'
import type { TransactionCategory } from '#models/transaction'
import Contact from '#models/contact'
import { randomUUID } from 'node:crypto'

interface FakeTransactionData {
  senderId: number | null
  receiverId: number | null
  amount: number
  category: TransactionCategory
  description: string
  type: 'p2p' | 'deposit' | 'withdrawal' | 'subscription'
  createdAt: DateTime
}

const categoryData: Record<
  TransactionCategory,
  { descriptions: string[]; minAmount: number; maxAmount: number }
> = {
  shopping: {
    descriptions: [
      'Achat Amazon',
      'Courses Carrefour',
      'Vêtements Zara',
      'Électronique Fnac',
      'Meubles IKEA',
      'Articles de sport Decathlon',
      'Cosmétiques Sephora',
      'Mode H&M',
    ],
    minAmount: 15,
    maxAmount: 200,
  },
  video_games: {
    descriptions: [
      'Achat Steam',
      'PlayStation Store',
      'Xbox Game Pass',
      'Nintendo eShop',
      'Epic Games Store',
      'Achat GOG',
      'Achat GameStop',
      'Ubisoft Connect',
    ],
    minAmount: 10,
    maxAmount: 80,
  },
  food: {
    descriptions: [
      "McDonald's",
      'KFC',
      'Subway',
      'Pizza Hut',
      "Domino's",
      'Burger King',
      'Starbucks',
      'Restaurant local',
      'Livraison de repas',
    ],
    minAmount: 8,
    maxAmount: 50,
  },
  bar: {
    descriptions: [
      'Bar Le Petit Paris',
      "Pub O'Connell",
      'Bar à cocktails',
      'Bar à vin',
      'Biergarten',
      'Entrée en boîte de nuit',
      'Boissons happy hour',
    ],
    minAmount: 5,
    maxAmount: 100,
  },
  transport: {
    descriptions: [
      'Ticket métro RATP',
      'Billet de train SNCF',
      'Course Uber',
      'Taxi Bolt',
      'Location vélo Vélib',
      'Ticket de bus',
      'Frais de parking',
      'Station-service',
    ],
    minAmount: 2,
    maxAmount: 80,
  },
  entertainment: {
    descriptions: [
      'Billet de cinéma',
      'Billet de concert',
      'Entrée musée',
      'Spectacle de théâtre',
      'Bowling',
      'Escape game',
      "Parc d'attractions",
      'Comedy club',
    ],
    minAmount: 10,
    maxAmount: 150,
  },
  health: {
    descriptions: [
      'Achat pharmacie',
      'Consultation médecin',
      'Contrôle dentaire',
      'Visite opticien',
      'Abonnement salle de sport',
      'Cours de yoga',
      'Séance de massage',
    ],
    minAmount: 15,
    maxAmount: 200,
  },
  education: {
    descriptions: [
      'Cours en ligne',
      'Achat de livre',
      'Cours de langue',
      "Frais d'atelier",
      'Billet de conférence',
      'Licence logicielle',
      "Matériel d'étude",
    ],
    minAmount: 20,
    maxAmount: 300,
  },
  utilities: {
    descriptions: [
      "Facture d'électricité",
      "Facture d'eau",
      'Abonnement internet',
      'Facture de téléphone',
      'Facture de gaz',
      'Paiement assurance',
      'Paiement loyer',
    ],
    minAmount: 30,
    maxAmount: 500,
  },
  other: {
    descriptions: [
      'Retrait DAB',
      'Virement bancaire',
      'Don à une association',
      'Achat de cadeau',
      'Service de réparation',
      'Service de ménage',
      'Soins pour animaux',
    ],
    minAmount: 5,
    maxAmount: 100,
  },
}

const incomeData: Record<string, { descriptions: string[]; minAmount: number; maxAmount: number }> =
  {
    job: {
      descriptions: ['Petit boulot', 'Stage payé', 'Job étudiant'],
      minAmount: 100,
      maxAmount: 800,
    },
    allowance: {
      descriptions: ['Argent de poche', 'Aide parentale'],
      minAmount: 20,
      maxAmount: 200,
    },
    gift: {
      descriptions: ["Cadeau d'anniversaire", 'Cadeau'],
      minAmount: 10,
      maxAmount: 150,
    },
    resale: {
      descriptions: ['Vente Vinted', 'Vente Leboncoin'],
      minAmount: 5,
      maxAmount: 100,
    },
    other: {
      descriptions: ['Remboursement ami', 'Virement reçu'],
      minAmount: 5,
      maxAmount: 100,
    },
  }

/**
 * Generates an array of fake withdrawal transactions for a given user.
 *
 * @param userId - The ID of the user for whom to generate transactions.
 * @param count - The number of transactions to generate (default: 50).
 * @returns An array of FakeTransactionData objects.
 */
export function generateFakeWithdrawalTransactions(
  userId: number,
  count: number = 50
): FakeTransactionData[] {
  const transactions: FakeTransactionData[] = []
  const categories: TransactionCategory[] = Object.keys(categoryData) as TransactionCategory[]

  // Generate transactions for the last 3 months
  const now = DateTime.now()
  const threeMonthsAgo = now.minus({ months: 3 })

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const categoryInfo = categoryData[category]
    const description =
      categoryInfo.descriptions[Math.floor(Math.random() * categoryInfo.descriptions.length)]
    const amount =
      Math.round(
        (Math.random() * (categoryInfo.maxAmount - categoryInfo.minAmount) +
          categoryInfo.minAmount) *
          100
      ) / 100

    // Random date within the last 3 months
    const randomDays = Math.floor(Math.random() * 90)
    const createdAt = threeMonthsAgo.plus({ days: randomDays })

    transactions.push({
      senderId: userId,
      receiverId: null,
      amount,
      category,
      description,
      type: 'withdrawal',
      createdAt,
    })
  }

  return transactions.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
}

/**
 * Creates fake withdrawal transactions in the database for a given user.
 *
 * @param userId - The ID of the user for whom to create transactions.
 * @param count - The number of transactions to create (default: 50).
 */
export async function createFakeWithdrawalTransactionsForUser(userId: number, count: number = 50) {
  const fakeTransactions = generateFakeWithdrawalTransactions(userId, count)

  const transactionsToCreate = fakeTransactions.map((tx) => ({
    id: crypto.randomUUID(),
    senderId: tx.senderId,
    receiverId: tx.receiverId,
    amount: tx.amount,
    type: tx.type,
    category: tx.category,
    status: 'completed' as const,
    description: tx.description,
    message: null,
    createdAt: tx.createdAt,
    processedAt: tx.createdAt,
  }))

  await Transaction.createMany(transactionsToCreate)
}

/**
 * Creates fake peer-to-peer (P2P) transactions in the database for a given user and their contacts.
 *
 * @param userId - The ID of the user who is sending the transactions.
 * @param contacts - An array of Contact objects representing the user's contacts.
 */
export async function createFakeP2PTransactionsForUser(userId: number, contacts: Contact[]) {
  const fakeTransactionsMessages: string[] = [
    'Merci pour le déjeuner !',
    "Pour le café d'hier ☕️",
    'Participation au cadeau 🎁',
    'Remboursement du cinéma',
    'Pour la pizza 🍕',
    'Merci pour ton aide !',
    'Pour le covoiturage 🚗',
    'Sortie du week-end',
    'Pour le livre prêté',
    "Petit cadeau d'amitié",
  ]

  const fakeTransactions = contacts.map((contact) => ({
    id: randomUUID(),
    amount: Math.floor(Math.random() * (50 - 10 + 1)) + 10,
    receiverId: contact.contactUserId,
    senderId: userId,
    message: fakeTransactionsMessages[Math.floor(Math.random() * fakeTransactionsMessages.length)],
    type: 'p2p' as const,
    status: 'completed' as const,
    createdAt: DateTime.fromMillis(
      Date.now() - Math.floor(Math.random() * 20 * 24 * 60 * 60 * 1000)
    ),
  }))

  await Transaction.createMany(fakeTransactions)
}

/**
 * Generates an array of fake income/deposit transactions for a given user.
 *
 * @param userId - The ID of the user for whom to generate income transactions.
 * @param count - The number of transactions to generate (default: 20).
 * @returns An array of FakeTransactionData objects.
 */
export function generateFakeIncomeTransactions(
  userId: number,
  count: number = 20
): FakeTransactionData[] {
  const transactions: FakeTransactionData[] = []
  const incomeTypes: string[] = Object.keys(incomeData)

  // Generate transactions for the last 3 months
  const now = DateTime.now()
  const threeMonthsAgo = now.minus({ months: 3 })

  for (let i = 0; i < count; i++) {
    const incomeType = incomeTypes[Math.floor(Math.random() * incomeTypes.length)]
    const incomeInfo = incomeData[incomeType]
    const description =
      incomeInfo.descriptions[Math.floor(Math.random() * incomeInfo.descriptions.length)]
    const amount =
      Math.round(
        (Math.random() * (incomeInfo.maxAmount - incomeInfo.minAmount) + incomeInfo.minAmount) * 100
      ) / 100

    // Random date within the last 3 months
    const randomDays = Math.floor(Math.random() * 90)
    const createdAt = threeMonthsAgo.plus({ days: randomDays })

    transactions.push({
      senderId: null,
      receiverId: userId,
      amount,
      category: 'other', // Income doesn't have specific categories like expenses
      description,
      type: 'deposit',
      createdAt,
    })
  }

  return transactions.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis())
}

/**
 * Creates fake income/deposit transactions in the database for a given user.
 *
 * @param userId - The ID of the user for whom to create income transactions.
 * @param count - The number of transactions to create (default: 20).
 */
export async function createFakeIncomeTransactionsForUser(userId: number, count: number = 20) {
  const fakeTransactions = generateFakeIncomeTransactions(userId, count)

  const transactionsToCreate = fakeTransactions.map((tx) => ({
    id: crypto.randomUUID(),
    senderId: tx.senderId,
    receiverId: tx.receiverId,
    amount: tx.amount,
    type: tx.type,
    category: tx.category,
    status: 'completed' as const,
    description: tx.description,
    message: null,
    createdAt: tx.createdAt,
    processedAt: tx.createdAt,
  }))

  await Transaction.createMany(transactionsToCreate)
}
