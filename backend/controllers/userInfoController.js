import pool from '../db.js';

const addUser = async(id, username, weight, age, sport, healthCondition, sex, dateOfBirth) => {
    try {
        const result = await pool.query(
            'INSERT INTO public."UserInfo" ("ID", "Name", "Weight", "Age", "Sport", "HealthCondition", "Sex", "DoB") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, username, weight, age, sport, healthCondition, sex, dateOfBirth]
        )
        

        return result.rows[0];
    } catch (err) {
        console.error("Error in addUser helper function:", err.message);
        return null;
    }
}

const updateUser = async (id, username, weight, age, sport, healthCondition, sex, dateOfBirth) => {
    try{
        const result = await pool.query('UPDATE public."UserInfo" SET "Name"=($1), "Weight"=($2), "Age"=($3), "Sport"=($4), "HealthCondition"=($5), "Sex"=($6), "DoB"=($7) WHERE "ID" = ($8)', [username, weight, age, sport, healthCondition, sex, dateOfBirth, id]);
        return result.rows[0];
    } catch (err) {
        console.error("Error in updateUser helper function:", err.message);
        return null;
    }
}

export const addUserInfo = async (req, res) => {
    const { email, username, weight, age, sport, healthCondition, sex, dateOfBirth} = req.body;
    if (!email){
        console.log("Email");
        return res.status(500).json({ error : "Server Error: Email not Found"});
    }
    else if(!username || !weight || !age || !sport || !sex){
        console.log("Username: " + username);
        console.log("Weight: " + weight);
        console.log("Age: " + age);
        console.log("Sport: " + sport);
        console.log("Health Condition: " + healthCondition);
        console.log("Sex: " + sex);
        return res.status(400).json({ error: "All fields must be defined"})
    }
    try {
        const users = await pool.query('SELECT "ID" FROM public."Users" WHERE "Email" = ($1)', [email]);
        
        if (users.rows.length === 0) {
            return res.status(400).json({ error: "User not found"});
        }
        let id = users.rows[0].ID;
        let exists = await pool.query('SELECT * FROM public."UserInfo" WHERE "ID" = ($1)', [id]);
        if(exists.rows.length === 0){
            await addUser(id, username, weight, age, sport, healthCondition, sex, dateOfBirth);
        } else {
            await updateUser(id, username, weight, age, sport, healthCondition, sex, dateOfBirth);
        }
        
        res.status(200).json({success: "Data added successfully"});
    } catch {
        console.log("Email: " + email);
        console.log("Username: " + username);
        console.log("Weight: " + weight);
        console.log("Age: " + age);
        console.log("Sport: " + sport);
        console.log("Health Condition: " + healthCondition);
        console.log("Sex: " + sex);
        return res.status(500).json({ error: "Internal Server Error"})
    }
}

export const getUserInfo = async (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    try {
        const userResult = await pool.query('SELECT "ID" FROM public."Users" WHERE "Email" = ($1)', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const id = userResult.rows[0].ID;
        
        const userInfoResult = await pool.query('SELECT * FROM public."UserInfo" WHERE "ID" = ($1)', [id]);
        if (userInfoResult.rows.length === 0) {
            return res.status(404).json({ error: "User information not found" });
        }
        
        const userInfo = userInfoResult.rows[0];
        return res.status(200).json({
            name: userInfo.Name,
            weight: userInfo.Weight,
            age: userInfo.Age,
            dateOfBirth: userInfo.DoB,
            sport: userInfo.Sport,
            healthCondition: userInfo.HealthCondition,
            sex: userInfo.Sex
        });
    } catch (error) {
        console.error("Error in getUserInfo:", error);
        return res.status(500).json({ error: "Internal Server Error Retrieving User Information" });
    }
}



