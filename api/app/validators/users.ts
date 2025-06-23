import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
    phoneNumber: vine.string().mobile(),
    fullName: vine.string(),
  })
)

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().optional().requiredIfMissing('phoneNumber'),
    phoneNumber: vine.string().mobile().optional().requiredIfMissing('email'),
    password: vine.string().minLength(6),
  })
)
