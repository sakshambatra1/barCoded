import {addUser} from '../helpers/userInfoHelpers.js';
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
