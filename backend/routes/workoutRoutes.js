const express = require('express');
const { getAllWorkouts, addWorkout, updateWorkout, deleteWorkout } = require('../controllers/workoutController.js');
const router = express.Router();

router.get('/allWorkouts', getAllWorkouts);
router.post('/', addWorkout);
router.put('/', updateWorkout);
router.delete('/', deleteWorkout);

module.exports = router;