import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import { InferInput } from '@vinejs/vine/types'
import { registerUserValidator } from '#validators/users'

const password = 'demo-app-2025'
export const fakeAccounts: Array<InferInput<typeof registerUserValidator>> = [
  {
    email: 'jean.dupont@cic-account.fr',
    fullName: 'Jean Dupont',
    password,
    phoneNumber: '+33600000001',
  },
  {
    email: 'marie.durand@cic-account.fr',
    fullName: 'Marie Durand',
    password,
    phoneNumber: '+33600000002',
  },
  {
    email: 'pierre.lefebvre@cic-account.fr',
    fullName: 'Pierre Lefebvre',
    password,
    phoneNumber: '+33600000003',
  },
  {
    email: 'camille.moreau@cic-account.fr',
    fullName: 'Camille Moreau',
    password,
    phoneNumber: '+33600000004',
  },
  {
    email: 'lucas.girard@cic-account.fr',
    fullName: 'Lucas Girard',
    password,
    phoneNumber: '+33600000005',
  },
  {
    email: 'emma.lambert@cic-account.fr',
    fullName: 'Emma Lambert',
    password,
    phoneNumber: '+33600000006',
  },
  {
    email: 'antoine.fontaine@cic-account.fr',
    fullName: 'Antoine Fontaine',
    password,
    phoneNumber: '+33600000007',
  },
  {
    email: 'julie.rousseau@cic-account.fr',
    fullName: 'Julie Rousseau',
    password,
    phoneNumber: '+33600000008',
  },
  {
    email: 'thomas.chevalier@cic-account.fr',
    fullName: 'Thomas Chevalier',
    password,
    phoneNumber: '+33600000009',
  },
  {
    email: 'claire.faure@cic-account.fr',
    fullName: 'Claire Faure',
    password,
    phoneNumber: '+33600000010',
  },
  {
    email: 'nicolas.bonnet@cic-account.fr',
    fullName: 'Nicolas Bonnet',
    password,
    phoneNumber: '+33600000011',
  },
  {
    email: 'laura.dupuis@cic-account.fr',
    fullName: 'Laura Dupuis',
    password,
    phoneNumber: '+33600000012',
  },
  {
    email: 'maxime.martin@cic-account.fr',
    fullName: 'Maxime Martin',
    password,
    phoneNumber: '+33600000013',
  },
  {
    email: 'sophie.legrand@cic-account.fr',
    fullName: 'Sophie Legrand',
    password,
    phoneNumber: '+33600000014',
  },
  {
    email: 'alexandre.garnier@cic-account.fr',
    fullName: 'Alexandre Garnier',
    password,
    phoneNumber: '+33600000015',
  },
  {
    email: 'manon.renard@cic-account.fr',
    fullName: 'Manon Renard',
    password,
    phoneNumber: '+33600000016',
  },
  {
    email: 'vincent.gerard@cic-account.fr',
    fullName: 'Vincent Gérard',
    password,
    phoneNumber: '+33600000017',
  },
  {
    email: 'lucie.petit@cic-account.fr',
    fullName: 'Lucie Petit',
    password,
    phoneNumber: '+33600000018',
  },
  {
    email: 'julien.marchand@cic-account.fr',
    fullName: 'Julien Marchand',
    password,
    phoneNumber: '+33600000019',
  },
  {
    email: 'chloe.dupuy@cic-account.fr',
    fullName: 'Chloé Dupuy',
    password,
    phoneNumber: '+33600000020',
  },
]

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const trx = await db.transaction()

    try {
      const usersPayload = fakeAccounts.map((account) => {
        return {
          ...account,
          balance: Math.round((Math.random() * (10000 - 1000) + 1000) * 100) / 100,
          level: Math.floor(Math.random() * 11),
          xp: Math.floor(Math.random() * 1001),
        }
      })

      await User.createMany(usersPayload, { client: trx })

      await trx.commit()
    } catch (error) {
      await trx.rollback()

      if (error instanceof Error) {
        if (error.message.includes('violates unique constraint "users_email_unique"')) return
      }

      throw error
    }
  }
}
