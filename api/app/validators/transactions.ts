import vine from '@vinejs/vine'

export const createP2PTransactionValidator = vine.compile(
  vine.object({
    receiverId: vine.number(),
    amount: vine.number().positive(),
    description: vine.string().optional(),
    message: vine.string().optional(),
  })
)
