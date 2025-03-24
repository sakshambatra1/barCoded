import pool from '../db.js';

const addUser = async(id, username, weight, age, fitnessLevel, healthCondition, sex) => {
    try {
        const result = await pool.query(
            'INSERT INTO public."UserInfo" ("ID", "Name", "Weight", "Age", "FitnessLevel", "HealthCondition", "Sex") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [id, username, weight, age, fitnessLevel, healthCondition, sex]
        )
        

        return result.rows[0];
    } catch (err) {
        console.error("Error in addUser helper function:", err.message);
        return null;
    }
}

const updateUser = async (id, username, weight, age, fitnessLevel, healthCondition, sex) => {
    try{
        const result = await pool.query('UPDATE public."UserInfo" SET "Name"=($1), "Weight"=($2), "Age"=($3), "FitnessLevel"=($4), "HealthCondition"=($5), "Sex"=($6) WHERE "ID" = ($7)', [username, weight, age, fitnessLevel, healthCondition, sex, id]);
        return result.rows[0];
    } catch (err) {
        console.error("Error in updateUser helper function:", err.message);
        return null;
    }
}

export const addUserInfo = async (req, res) => {
    try {
        const { email, username, weight, age, fitnessLevel, healthCondition, sex} = req.body;
        if(!username || !weight || !age || !fitnessLevel || !sex){
            return res.status(400).json({ error: "All fields must be defined"})            
        } else {
            const res = await pool.query('SELECT "ID" FROM public."Users" WHERE "Email" = ($1)', [email]);
            
            if (res.rows.length === 0) {
                return res.status(400).json({ error: "User not found"});
            }
            let exists = await pool.query('SELECT * FROM public."UserInfo" WHERE "ID" = ($1)', [id]);
            if(exists.rows.length === 0){
                await addUser(id, username, weight, age, fitnessLevel, healthCondition, sex);
            } else {
                await updateUser(id, username, weight, age, fitnessLevel, healthCondition, sex);
            }
            
            res.status(200).json({success: "Data added successfully"});
        }
    } catch {
        return res.status(500).json({ error: "Internal Server Error"})
    }
}
