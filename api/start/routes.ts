/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')

router
  .group(() => {
    // transactions routes
    router
      .group(() => {
        router.get('/by-category', '#controllers/transactions_controller.getTransactionsByCategory')
        router.get('categories', '#controllers/transactions_controller.getCategories')
      })
      .prefix('/transactions')
    router
      .resource('/transactions', '#controllers/transactions_controller')
      .apiOnly()
      .except(['destroy', 'update'])

    // contacts routes
    router.resource('/contacts', '#controllers/contacts_controller').apiOnly()

    // savings objectives routes
    router.resource('/savings-objectives', '#controllers/savings_objectives_controller').apiOnly()
    router
      .group(() => {
        router.post('/:id/add', '#controllers/savings_objectives_controller.addToSavings')
        router.post('/:id/remove', '#controllers/savings_objectives_controller.removeFromSavings')
      })
      .prefix('/savings-objectives')
  })
  .use(middleware.auth())
  .prefix('/me')
