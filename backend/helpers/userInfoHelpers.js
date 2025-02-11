import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const addUser = async(username, weight, age, fitnessLevel, healthCondition, sex) => {
    try {
        const result = await pool.query(
            'INSERT INTO public."UserInfo" ("ID", "Name", "Weight", "Age", "FitnessLevel", "HealthCondition", "Sex") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [uuidv4(), username, weight, age, fitnessLevel, healthCondition, sex]
        );
          
        

        return result.rows[0];
    } catch (err) {
        console.error("Error in addUser helper function:", err.message);
        return null;
    }
}