import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const addUser = async(username, weight, age, fitnessLevel, healthCondition, sex) => {
    try {
        const result = await pool.query(
            'INSERT INTO public."UserInfo" ("ID", "Name", "Weight", "Age", "FitnessLevel", "HealthCondition", "Sex") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [uuidv4(), username, weight, age, fitnessLevel, healthCondition, sex]
        )
        

        return result.rows[0];
    } catch (err) {
        console.error("Error in addUser helper function:", err.message);
        return null;
    }
}

export const addUserInfo = async(req, res) => {
    try {
        const { username, weight, age, fitnessLevel, healthCondition, sex} = req.body;
        if(!username || !weight || !age || !fitnessLevel || !sex){
            return res.status(400).json({ error: "All fields must be defined"})            
        } else {
            await addUser(username, weight, age, fitnessLevel, healthCondition, sex);
            res.status(200).json({success: "Data added successfully"});
        }
    } catch {
        return res.status(500).json({ error: "Internal Server Error"})
    }
}
