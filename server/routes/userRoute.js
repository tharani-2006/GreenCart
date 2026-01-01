import express from 'express'
import { register, login } from '../controllers/userController.js'
import { isAuth } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth', isAuth)

export default userRouter