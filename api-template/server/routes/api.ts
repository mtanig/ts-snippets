import express from 'express';
import { userActionController } from '../controllers/UserActionController';

const router = express.Router();

router.post('/v1/userActions', userActionController.registerUserAction.bind(userActionController));
router.get('/v1/userIds/:userId/userActions', userActionController.getUserActions.bind(userActionController));

export default router;
