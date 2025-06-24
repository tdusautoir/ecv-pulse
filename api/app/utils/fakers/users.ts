import { InferInput } from '@vinejs/vine/types'
import { registerUserValidator } from '#validators/users'
import User from '#models/user'
import Contact from '#models/contact'
import {
  createFakeP2PTransactionsForUser,
  createFakeWithdrawalTransactionsForUser,
} from './transactions.js'

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
  })

  // generate fake contacts
  const accounts = await User.query().whereNot('id', user.id).limit(5)
  let contacts: Contact[] = []
  for (const account of accounts) {
    const contact = await Contact.firstOrCreate(
      {
        userId: user.id,
        contactUserId: account.id,
      },
      {
        userId: user.id,
        contactUserId: account.id,
        isFavorite: false,
      }
    )

    contacts.push(contact)
  }

  createFakeP2PTransactionsForUser(user.id, contacts)
  createFakeWithdrawalTransactionsForUser(user.id, 50)

  return user
}
