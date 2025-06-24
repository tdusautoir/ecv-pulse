import vine from '@vinejs/vine'
import { categories } from '../../constants.js'

export const createBudgetValidator = vine.compile(
  vine.object({
    totalAmount: vine.number().positive(),
    description: vine.string().trim().maxLength(500).optional(),
    categories: vine
      .array(
        vine.object({
          category: vine.enum(categories),
          allocatedAmount: vine.number().positive(),
        })
      )
      .optional(),
  })
)

export const updateBudgetValidator = vine.compile(
  vine.object({
    totalAmount: vine.number().positive().optional(),
    description: vine.string().trim().maxLength(500).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const updateBudgetCategoryValidator = vine.compile(
  vine.object({
    allocatedAmount: vine.number().positive(),
  })
)
