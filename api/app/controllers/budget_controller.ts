import type { HttpContext } from '@adonisjs/core/http'
import Budget from '#models/budget'
import BudgetCategory from '#models/budget_category'
import {
  createBudgetValidator,
  updateBudgetValidator,
  updateBudgetCategoryValidator,
} from '../validators/budgets.js'
import db from '@adonisjs/lucid/services/db'

export default class BudgetController {
  /**
   * Get user's active budget with current month stats
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!

    const budget = await Budget.query()
      .where('userId', user.id)
      .where('isActive', true)
      .preload('categories')
      .preload('user')
      .first()

    if (!budget) {
      return response.notFound()
    }

    const totalSpent = await user.getCurrentMonthSpent()
    const remainingAmount = await budget.getCurrentMonthRemaining()
    const utilizationPercentage = await budget.getCurrentMonthUtilization()
    const isExceeded = await budget.isCurrentMonthExceeded()

    const categoriesWithStats = await Promise.all(
      budget.categories.map(async (category) => {
        const spent = await category.getCurrentMonthSpent()
        const remaining = await category.getCurrentMonthRemaining()
        const utilization = await category.getCurrentMonthUtilization()
        const exceeded = await category.isCurrentMonthExceeded()

        return {
          ...category.toJSON(),
          spentAmount: spent,
          remainingAmount: remaining,
          utilizationPercentage: utilization,
          isExceeded: exceeded,
        }
      })
    )

    return {
      ...budget.toJSON(),
      totalSpent,
      remainingAmount,
      utilizationPercentage,
      isExceeded,
      categories: categoriesWithStats,
    }
  }

  /**
   * Create or update user's budget
   */
  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const data = request.all()
    const payload = await createBudgetValidator.validate(data)

    const trx = await db.transaction()

    try {
      // First, check if there's already an active budget and deactivate it
      const activeBudget = await Budget.query({ client: trx })
        .where('userId', user.id)
        .where('isActive', true)
        .first()

      if (activeBudget) {
        activeBudget.isActive = false
        await activeBudget.save()
      }

      if (payload.categories !== undefined) {
        const totalAllocated = payload.categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0)
        if (totalAllocated > payload.totalAmount) {
          return response.badRequest({
            message: 'Total allocated amount cannot exceed the total budget amount',
          })
        }
      }

      const budget = await Budget.create(
        {
          userId: user.id,
          totalAmount: payload.totalAmount,
          description: payload.description,
          isActive: true,
        },
        { client: trx }
      )

      if (payload.categories !== undefined) {
        const budgetCategories = payload.categories.map((cat) => ({
          budgetId: budget.id,
          category: cat.category,
          allocatedAmount: cat.allocatedAmount,
        }))

        await BudgetCategory.createMany(budgetCategories, { client: trx })
      }

      await trx.commit()

      // Return the created budget with categories
      const createdBudget = await Budget.query()
        .where('id', budget.id)
        .preload('categories')
        .firstOrFail()

      return response.created(createdBudget)
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  /**
   * Update budget
   */
  async update({ params, request, auth }: HttpContext) {
    const user = auth.user!
    const data = request.all()
    const payload = await updateBudgetValidator.validate(data)

    const budget = await Budget.query()
      .where('id', params.id)
      .andWhere('userId', user.id)
      .firstOrFail()

    budget.merge(payload)
    await budget.save()

    return budget
  }

  /**
   * Update budget category allocation
   */
  async updateCategory({ params, request, auth }: HttpContext) {
    const user = auth.user!
    const data = request.all()
    const payload = await updateBudgetCategoryValidator.validate(data)

    const budget = await Budget.query()
      .where('userId', user.id)
      .andWhere('isActive', true)
      .firstOrFail()

    const budgetCategory = await BudgetCategory.query()
      .where('id', params.categoryId)
      .andWhere('budgetId', budget.id)
      .firstOrFail()

    budgetCategory.allocatedAmount = payload.allocatedAmount
    await budgetCategory.save()

    return budgetCategory
  }

  /**
   * Delete budget
   */
  async destroy({ auth }: HttpContext) {
    const user = auth.user!

    const budget = await Budget.query().where('userId', user.id).firstOrFail()

    await budget.delete()
    return { message: 'Budget deleted successfully' }
  }
}
