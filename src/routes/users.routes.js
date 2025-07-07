import {Router} from 'express'
import usersController from '../controllers/users.controller.js';
import validate from '../validators/validate.js';
import { createUserSchema } from '../validators/user.validate.js';
import { authenticateToken } from '../middlewares/authenticate.js';

const router = Router();

//Routes
router
    .route('/')
    .get(usersController.getUsers)
    .post(validate(createUserSchema, 'body'), usersController.createUser)

router
    .route('/:id')
    .get(authenticateToken, usersController.getUser)
    .put(authenticateToken, usersController.updateUser)
    .delete(authenticateToken, usersController.deleteUser)
    .patch(authenticateToken, usersController.activateInactivate)
    
router.get('/:id/task',authenticateToken,usersController.getTask)
export default router;