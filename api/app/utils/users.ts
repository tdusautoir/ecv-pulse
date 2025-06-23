import { InferInput } from '@vinejs/vine/types'
import { registerUserValidator } from '#validators/users'
import User from '#models/user'
import Transaction, { TransactionStatus, TransactionType } from '#models/transaction'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

/**
 * Registers a fake CIC user and generates random data for them.
 *
 * @param payload - The user registration payload.
 * @returns The created user.
 */
export async function registerFakeCICUser(payload: InferInput<typeof registerUserValidator>) {
  const user = await User.create({
    ...payload,
    balance: Math.round((Math.random() * (10000 - 1000) + 1000) * 100) / 100,
    level: Math.floor(Math.random() * 11),
    xp: Math.floor(Math.random() * 1001),
  })

  const accounts = await User.query().whereNot('id', user.id).limit(5)

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

  const fakeTransactions = accounts.map((account) => ({
    id: randomUUID(),
    amount: Math.floor(Math.random() * (50 - 10 + 1)) + 10,
    receiverId: account.id,
    senderId: user.id,
    message: fakeTransactionsMessages[Math.floor(Math.random() * fakeTransactionsMessages.length)],
    type: 'p2p' as TransactionType,
    status: 'completed' as TransactionStatus,
    createdAt: DateTime.fromMillis(
      Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)
    ),
  }))

  await Transaction.createMany(fakeTransactions)

  return user
}
