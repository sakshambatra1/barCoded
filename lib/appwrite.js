// appwrite.js
import { Account, Client, ID, Avatars, Databases } from "react-native-appwrite"; 

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1', 
    platform: 'com.bar.coded',
    projectId: '66e0e63400049c1e24c2',
    databaseId: '66e0e8620018fa37a4b3',
    userCollectionId: '66e0e895002d89e88f16'
};

const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client); 

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw new Error('Account creation failed');
        
        const avatarUrl = avatars.getInitials(username);

        // Assuming signIn is a function that signs in the user
        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            { email, username, avatarUrl }
        );

        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};