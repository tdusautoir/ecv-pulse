import vine from '@vinejs/vine'

export const createContactValidator = vine.compile(
  vine.object({
    nickname: vine.string().optional(),
    phoneNumber: vine.string().mobile(),
    isFavorite: vine.boolean().optional(),
  })
)

export const updateContactValidator = vine.compile(
  vine.object({
    nickname: vine.string().optional(),
    isFavorite: vine.boolean().optional(),
  })
)
