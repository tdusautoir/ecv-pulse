import type { HttpContext } from '@adonisjs/core/http'
import Contact from '#models/contact'
import User from '#models/user'
import { createContactValidator, updateContactValidator } from '#validators/contacts'
import { Exception } from '@adonisjs/core/exceptions'

export default class ContactsController {
  /**
   * Display a list of user's contacts
   */
  async index({ auth }: HttpContext) {
    const user = auth.user!
    const contactsRaw = await Contact.query()
      .where('userId', user.id)
      .preload('contactUser', (query) => {
        query.select('id', 'fullName', 'email', 'avatarUrl', 'phoneNumber')
      })
      .select('id', 'nickname', 'isFavorite', 'contactUserId')
      .orderBy('createdAt', 'desc')

    const contacts = contactsRaw.map((contact) => {
      const contactUser = contact.contactUser
      return {
        id: contactUser.id,
        email: contactUser.email,
        phoneNumber: contactUser.phoneNumber,
        fullName: contactUser.fullName,
        avatarUrl: contactUser.avatarUrl,
        nickname: contact.nickname,
        isFavorite: contact.isFavorite,
      }
    })

    return contacts
  }

  /**
   * Add a new contact
   */
  async store({ request, response, auth }: HttpContext) {
    const user = auth.user!
    const payload = await createContactValidator.validate(request.all())

    let contactUser = await User.findBy('phoneNumber', payload.phoneNumber)
    if (!contactUser) {
      contactUser = await User.create({
        phoneNumber: payload.phoneNumber,
        fullName: payload.nickname,
        password: 'temp-password-' + Math.random().toString(36).substring(2), // Temporary password
        balance: 0,
        level: 0,
        xp: 0,
      })
    }

    if (contactUser.id === user.id) {
      throw new Exception('Cannot reference to yourself as a contact', { status: 400 })
    }

    const existingContact = await Contact.query()
      .where('userId', user.id)
      .where('contactUserId', contactUser.id)
      .first()

    if (existingContact) {
      throw new Exception('Contact already exists', { status: 409 })
    }

    const contact = await Contact.create({
      userId: user.id,
      contactUserId: contactUser.id,
      nickname: payload.nickname,
      isFavorite: payload.isFavorite || false,
    })

    await contact.load('contactUser', (query) => {
      query.select('id', 'fullName', 'email', 'avatarUrl')
    })

    return response.created(contact)
  }

  /**
   * Show individual contact
   */
  async show({ params, auth }: HttpContext) {
    const user = auth.user!

    const contact = await Contact.query()
      .where('id', params.id)
      .where('userId', user.id)
      .preload('contactUser', (query) => {
        query.select('id', 'fullName', 'email', 'avatarUrl')
      })
      .firstOrFail()

    return contact
  }

  /**
   * Update contact
   */
  async update({ params, request, auth }: HttpContext) {
    const user = auth.user!
    const payload = await updateContactValidator.validate(request.all())

    const contact = await Contact.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    contact.merge(payload)
    await contact.save()

    await contact.load('contactUser', (query) => {
      query.select('id', 'fullName', 'email', 'avatarUrl')
    })

    return contact
  }

  /**
   * Delete contact
   */
  async destroy({ params, auth, response }: HttpContext) {
    const user = auth.user!

    const contact = await Contact.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await contact.delete()

    return response.ok
  }
}
