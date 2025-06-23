import vine from '@vinejs/vine'

export const createSavingsObjectiveValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),
    targetAmount: vine.number().positive(),
    targetDate: vine.date().optional(),
    description: vine.string().trim().optional(),
  })
)

export const updateSavingsObjectiveValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100).optional(),
    targetAmount: vine.number().positive().optional(),
    targetDate: vine.date().optional(),
    description: vine.string().trim().optional(),
    isActive: vine.boolean().optional(),
  })
)

export const addToSavingsValidator = vine.compile(
  vine.object({
    amount: vine.number().positive(),
    description: vine.string().trim().optional(),
    message: vine.string().trim().optional(),
  })
)

export const removeFromSavingsValidator = vine.compile(
  vine.object({
    amount: vine.number().positive(),
    description: vine.string().trim().optional(),
    message: vine.string().trim().optional(),
  })
)
