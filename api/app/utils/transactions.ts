import User from '#models/user'
import Transaction from '#models/transaction'
import SavingsObjective from '#models/savings_objective'
import { Exception } from '@adonisjs/core/exceptions'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { randomUUID } from 'node:crypto'

type P2PTransactionPayload = {
  senderId: number
  receiverId: number
  amount: number
  description?: string | null
  message?: string | null
}

type SavingTransactionPayload = {
  userId: number
  savingsObjectiveId: number
  amount: number
  description?: string | null
  message?: string | null
}

/**
 * Executes a peer-to-peer (P2P) transaction between two users.
 * This function must be called within a database transaction.
 *
 * @param payload The transaction details.
 * @param trx The database transaction client.
 * @returns The created transaction record for the sender.
 */
export async function createP2PTransaction(
  payload: P2PTransactionPayload,
  trx: TransactionClientContract
) {
  const { senderId, receiverId, amount, description, message } = payload

  const sender = await User.query({ client: trx }).forUpdate().where('id', senderId).firstOrFail()
  const receiver = await User.query({ client: trx })
    .forUpdate()
    .where('id', receiverId)
    .firstOrFail()

  if (sender.balance < amount) {
    throw new Exception('insufficient_funds', { status: 400 })
  }

  await User.query({ client: trx }).where('id', sender.id).decrement('balance', amount)
  await User.query({ client: trx }).where('id', receiver.id).increment('balance', amount)

  const commonDetails = {
    senderId: sender.id,
    receiverId: receiver.id,
    amount: amount,
    type: 'p2p' as const,
    status: 'completed' as const,
    description: description,
    message: message,
  }

  const transaction = await Transaction.create(
    { id: randomUUID(), ...commonDetails },
    { client: trx }
  )

  return transaction
}

/**
 * Executes a saving transaction to add money to a savings objective.
 * This function must be called within a database transaction.
 *
 * @param payload The transaction details.
 * @param trx The database transaction client.
 * @returns The created transaction record.
 */
export async function createSavingTransaction(
  payload: SavingTransactionPayload,
  trx: TransactionClientContract
) {
  const { userId, savingsObjectiveId, amount, description, message } = payload

  const user = await User.query({ client: trx }).forUpdate().where('id', userId).firstOrFail()
  const objective = await SavingsObjective.query({ client: trx })
    .forUpdate()
    .where('id', savingsObjectiveId)
    .andWhere('userId', userId)
    .firstOrFail()

  if (user.balance < amount) {
    throw new Exception('insufficient_funds', { status: 400 })
  }

  // Deduct from user balance and add to savings objective
  await User.query({ client: trx }).where('id', user.id).decrement('balance', amount)
  await SavingsObjective.query({ client: trx })
    .where('id', objective.id)
    .increment('currentAmount', amount)

  const transaction = await Transaction.create(
    {
      id: randomUUID(),
      senderId: user.id,
      receiverId: savingsObjectiveId,
      amount: amount,
      type: 'saving',
      status: 'completed',
      description: description,
      message: message,
    },
    { client: trx }
  )

  return transaction
}

/**
 * Executes a transaction to remove money from a savings objective.
 * This function must be called within a database transaction.
 *
 * @param payload The transaction details.
 * @param trx The database transaction client.
 * @returns The created transaction record.
 */
export async function removeFromSavingTransaction(
  payload: SavingTransactionPayload,
  trx: TransactionClientContract
) {
  const { userId, savingsObjectiveId, amount, description, message } = payload

  const user = await User.query({ client: trx }).forUpdate().where('id', userId).firstOrFail()
  const objective = await SavingsObjective.query({ client: trx })
    .forUpdate()
    .where('id', savingsObjectiveId)
    .andWhere('userId', userId)
    .firstOrFail()

  if (objective.currentAmount < amount) {
    throw new Exception('insufficient_savings', { status: 400 })
  }

  // Add to user balance and deduct from savings objective
  await User.query({ client: trx }).where('id', user.id).increment('balance', amount)
  await SavingsObjective.query({ client: trx })
    .where('id', objective.id)
    .decrement('currentAmount', amount)

  const transaction = await Transaction.create(
    {
      id: randomUUID(),
      senderId: savingsObjectiveId,
      receiverId: user.id,
      amount: amount,
      type: 'saving',
      status: 'completed',
      description: description,
      message: message,
    },
    { client: trx }
  )

  return transaction
}
