import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllWorkouts = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const userResult = await pool.query('SELECT "ID" FROM public."Users" WHERE "Email" = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const userId = userResult.rows[0].ID;
        const workoutsResult = await pool.query('SELECT "WorkoutID", "UserID", "WorkoutName", "Weight", "Sets", "Reps" FROM public."Workouts" WHERE "UserID" = $1', [userId]);
        if (workoutsResult.rows.length === 0) {
            return res.status(404).json({ error: "No workouts found for this user" });
        }
        return res.status(200).json(workoutsResult.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while fetching workouts" });
    }
};

export const addWorkout = async (req, res) => {
    try {
        const { email, workoutName, weight, sets, reps } = req.body;
        if (!email || !workoutName || !weight || !sets || !reps) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const userResult = await pool.query('SELECT "ID" FROM public."Users" WHERE "Email" = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const userId = userResult.rows[0].ID;
        const workoutId = uuidv4();
        await pool.query(
            'INSERT INTO public."Workouts" ("WorkoutID", "UserID", "WorkoutName", "Weight", "Sets", "Reps") VALUES ($1, $2, $3, $4, $5, $6)',
            [workoutId, userId, workoutName, weight, sets, reps]
        );
        return res.status(201).json({ message: "Workout added successfully", workoutId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while adding the workout" });
    }
};

export const updateWorkout = async (req, res) => {
    try {
        const { workoutId, workoutName, weight, sets, reps } = req.body;
        if (!workoutId || !workoutName || !weight || !sets || !reps) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const result = await pool.query(
            'UPDATE public."Workouts" SET "WorkoutName" = $1, "Weight" = $2, "Sets" = $3, "Reps" = $4 WHERE "WorkoutID" = $5',
            [workoutName, weight, sets, reps, workoutId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Workout not found" });
        }
        return res.status(200).json({ message: "Workout updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while updating the workout" });
    }
};

export const deleteWorkout = async (req, res) => {
    try {
        const { workoutId } = req.body;
        if (!workoutId) {
            return res.status(400).json({ error: "Workout ID is required" });
        }
        const result = await pool.query('DELETE FROM public."Workouts" WHERE "WorkoutID" = $1', [workoutId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Workout not found" });
        }
        return res.status(200).json({ message: "Workout deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while deleting the workout" });
    }
};