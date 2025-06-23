import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import { InferInput } from '@vinejs/vine/types'
import { registerUserValidator } from '#validators/users'

const password = 'demo-app-2025'
export const fakeAccounts: Array<InferInput<typeof registerUserValidator>> = [
  { email: 'jean.dupont@cic-account.fr', fullName: 'Jean Dupont', password },
  { email: 'marie.durand@cic-account.fr', fullName: 'Marie Durand', password },
  { email: 'pierre.lefebvre@cic-account.fr', fullName: 'Pierre Lefebvre', password },
  { email: 'camille.moreau@cic-account.fr', fullName: 'Camille Moreau', password },
  { email: 'lucas.girard@cic-account.fr', fullName: 'Lucas Girard', password },
  { email: 'emma.lambert@cic-account.fr', fullName: 'Emma Lambert', password },
  { email: 'antoine.fontaine@cic-account.fr', fullName: 'Antoine Fontaine', password },
  { email: 'julie.rousseau@cic-account.fr', fullName: 'Julie Rousseau', password },
  { email: 'thomas.chevalier@cic-account.fr', fullName: 'Thomas Chevalier', password },
  { email: 'claire.faure@cic-account.fr', fullName: 'Claire Faure', password },
  { email: 'nicolas.bonnet@cic-account.fr', fullName: 'Nicolas Bonnet', password },
  { email: 'laura.dupuis@cic-account.fr', fullName: 'Laura Dupuis', password },
  { email: 'maxime.martin@cic-account.fr', fullName: 'Maxime Martin', password },
  { email: 'sophie.legrand@cic-account.fr', fullName: 'Sophie Legrand', password },
  { email: 'alexandre.garnier@cic-account.fr', fullName: 'Alexandre Garnier', password },
  { email: 'manon.renard@cic-account.fr', fullName: 'Manon Renard', password },
  { email: 'vincent.gerard@cic-account.fr', fullName: 'Vincent Gérard', password },
  { email: 'lucie.petit@cic-account.fr', fullName: 'Lucie Petit', password },
  { email: 'julien.marchand@cic-account.fr', fullName: 'Julien Marchand', password },
  { email: 'chloe.dupuy@cic-account.fr', fullName: 'Chloé Dupuy', password },
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
