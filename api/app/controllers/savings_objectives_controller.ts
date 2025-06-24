import type { HttpContext } from '@adonisjs/core/http'
import SavingsObjective from '#models/savings_objective'
import {
  createSavingsObjectiveValidator,
  updateSavingsObjectiveValidator,
  addToSavingsValidator,
  removeFromSavingsValidator,
} from '../validators/savings_objectives.js'
import db from '@adonisjs/lucid/services/db'
import { createSavingTransaction, removeFromSavingTransaction } from '../utils/transactions.js'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'

export default class SavingsObjectivesController {
  /**
   * Display a list of user's savings objectives
   */
  async index({ auth }: HttpContext) {
    const user = auth.user!
    const objectives = await SavingsObjective.query()
      .where('userId', user.id)
      .orderBy('createdAt', 'desc')

    return objectives.map((objective) => ({
      ...objective.$attributes,
      completed: objective.isCompleted,
      remainingAmount: objective.remainingAmount,
      progressPercentage: objective.progressPercentage,
    }))
  }

  /**
   * Create a new savings objective
   */
  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = request.all()
    const payload = await createSavingsObjectiveValidator.validate(data)

    const objective = await SavingsObjective.create({
      userId: user.id,
      name: payload.name,
      targetAmount: payload.targetAmount,
      targetDate: payload.targetDate ? DateTime.fromJSDate(payload.targetDate) : undefined,
      description: payload.description,
    })

    return response.created(objective)
  }

  /**
   * Show individual savings objective with transactions
   */
  async show({ params, auth }: HttpContext) {
    const user = auth.user!

    const objective = await SavingsObjective.query()
      .where('id', params.id)
      .andWhere('userId', user.id)
      .preload('incomingTransactions', (query) => {
        query.where('type', 'saving').orderBy('createdAt', 'desc')
      })
      .preload('outgoingTransactions', (query) => {
        query.where('type', 'saving').orderBy('createdAt', 'desc')
      })
      .firstOrFail()

    return objective
  }

  /**
   * Update a savings objective
   */
  async update({ params, request, auth }: HttpContext) {
    const user = auth.user!
    const data = request.all()
    const payload = await updateSavingsObjectiveValidator.validate(data)

    const objective = await SavingsObjective.query()
      .where('id', params.id)
      .andWhere('userId', user.id)
      .firstOrFail()

    objective.merge({
      ...payload,
      targetDate: payload.targetDate ? DateTime.fromJSDate(payload.targetDate) : undefined,
    })
    await objective.save()

    return objective
  }

  /**
   * Delete a savings objective
   */
  async destroy({ params, response, auth }: HttpContext) {
    const user = auth.user!

    const objective = await SavingsObjective.query()
      .where('id', params.id)
      .andWhere('userId', user.id)
      .firstOrFail()

    if (objective.currentAmount > 0) {
      return response.badRequest({
        message:
          'Cannot delete a savings objective that still has funds. Please withdraw all funds before deleting this objective.',
        currentAmount: objective.currentAmount,
      })
    }

    await objective.delete()
    return response.ok
  }

  /**
   * Add money to savings objective
   */
  async addToSavings({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = request.all()
    const payload = await addToSavingsValidator.validate(data)
    const trx = await db.transaction()

    console.log(request.param('id'))

    try {
      const transaction = await createSavingTransaction(
        {
          userId: user.id,
          savingsObjectiveId: request.param('id'),
          amount: payload.amount,
          description: payload.description,
          message: payload.message,
        },
        trx
      )

      await trx.commit()
      return response.created(transaction)
    } catch (error) {
      await trx.rollback()

      console.log(error)
      if (error instanceof Exception) {
        return response.status(error.status).send({ message: error.message })
      }

      return response.internalServerError({
        message: 'Failed to add to savings, please try again.',
      })
    }
  }

  /**
   * Remove money from savings objective
   */
  async removeFromSavings({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = request.all()
    const payload = await removeFromSavingsValidator.validate(data)
    const trx = await db.transaction()

    try {
      const transaction = await removeFromSavingTransaction(
        {
          userId: user.id,
          savingsObjectiveId: request.param('id'),
          amount: payload.amount,
          description: payload.description,
          message: payload.message,
        },
        trx
      )

      await trx.commit()
      return response.created(transaction)
    } catch (error) {
      await trx.rollback()

      console.log(error)
      if (error instanceof Exception) {
        return response.status(error.status).send({ message: error.message })
      }

      return response.internalServerError({
        message: 'Failed to remove from savings, please try again.',
      })
    }
  }
}
