import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALTROUNDS = Number(process.env.SALTROUNDS) || 10;

dotenv.config();
sgMail.setApiKey(process.env.GRIDKEY);

async function checkEmailExists(email) {
    try {
        const result = await pool.query('SELECT * FROM "Users" WHERE "Email" = $1', [email]);

        return result.rows.length > 0;
    } catch (error) {
        console.error('Error checking email:', error);
        throw error;
    }
}

async function createKey(email) {
    let exists; 
    try {
        exists = await pool.query('SELECT ("Email") FROM "VerificationKeys" WHERE "Email" = $1', [email]);
    } catch (error) {
        console.error("Error checking Verification Keys database");
        throw error;
    }

    if (exists && exists.rows.length > 0) { 
        try {
            await pool.query('DELETE FROM "VerificationKeys" WHERE "Email" = $1', [email]);
        } catch (error) {
            console.error("Error deleting the verification key while creating a new key");
        }
    }

    let [min, max] = [100000, 999999];
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sendVerificationEmail(key, email){
    const msg = {
        to: email,
        from: 'hmyoussef@gmail.com',
        subject: 'Your Barcoded Verification Code',
        text: `Your verification code is ${key}`
    }
    
    sgMail.send(msg).then(() => {
        console.log('Email sent');
    }).catch((error) => {
        console.error(error);
    })
}

async function storeVerificationKey(email, key){
    try {
        const hashedKey = await bcrypt.hash(String(key), SALTROUNDS);
        const result = await pool.query('INSERT into "VerificationKeys" ("Email", "Key") VALUES ($1, $2)', [email, String(hashedKey)]);

        return result.rows.length > 0;
    } catch (error) {
        console.error('Error storing verification key:', error);
        throw error;
    }
}

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        let exists = await checkEmailExists(email);
        if (exists) {
            return res.status(401).json({ response: "Exists" });
        }

        let key = await createKey(email);
        await storeVerificationKey(email, key);
        await sendVerificationEmail(key, email);

        res.status(200).json({ response: "Success" });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ response: "Internal Server Error" });
    }
};


async function checkKey(email, key){
    try {
        const result = await pool.query('SELECT ("Key") FROM "VerificationKeys" WHERE "Email"=$1', [email]);
        const isValid = await bcrypt.compare(String(key), result.rows[0]["Key"]);
        if(isValid){
            try {
                const result = await pool.query('DELETE FROM "VerificationKeys" WHERE "Key"=$1', [key]);
                return true;
            } catch (error) {
                console.error('Error deleting row from table:', error);
                throw error;
            }            
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error retrieving verification key:', error);
        throw error;
    }
}

async function storeUser(email, password, refreshToken) {
    try {
        const hashedPassword = await bcrypt.hash(password, parseInt(SALTROUNDS));

        const result = await pool.query('INSERT into public."Users" ("ID", "Email", "Password", "refreshToken") VALUES ($1, $2, $3, $4)', [uuidv4(), email, hashedPassword, refreshToken]);
        return refreshToken;
    } catch (error) {
        console.error('Error storing user information:', error);
        throw error;
    }
}

function createAccessToken(email){
    return jwt.sign({email}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })

}

function createRefreshToken(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET);
}

const verifyEmail = async (req, res) => {
    try {
        const { email, password, key } = req.body;

        let valid = await checkKey(email, key);
        if (!valid) {
            return res.status(401).json({ response: "Invalid verification code" });
        }

        let refreshToken = createRefreshToken(email);
        await storeUser(email, password, refreshToken);
        let accessToken = createAccessToken(email);

        res.status(200).json({
            response: "Success",
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ response: "Internal Server Error" });
    }
};


export { register, verifyEmail };