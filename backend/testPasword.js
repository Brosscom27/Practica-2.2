import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './src/models/User.js';

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        const email = 'mcordovacsx@gmail.com'; // cámbialo por tu email
        const plainPassword = 'Rummy4ever$';   // cámbialo por tu contraseña

        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ Usuario no encontrado');
            process.exit();
        }

        console.log('Usuario encontrado:', user.email);
        console.log('Hash almacenado:', user.password);

        const isMatch = await bcrypt.compare(plainPassword, user.password);
        console.log('¿Coincide la contraseña?', isMatch);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

testLogin();