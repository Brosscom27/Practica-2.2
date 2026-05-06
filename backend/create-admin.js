// createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './src/models/User.js'; // Ajusta la ruta si es necesario

dotenv.config(); // Carga las variables de entorno (MONGODB_URI)

const createAdmin = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Datos del administrador
        const adminData = {
            name: 'Administrador',
            email: 'prueba@gmail.com', // Cambia por el email que quieras
            password: 'prueba123#',       // Cambia por una contraseña segura
            role: 'admin'
        };

        // Verificar si ya existe un usuario con ese email
        const existingUser = await User.findOne({ email: adminData.email });
        if (existingUser) {
            console.log('El usuario ya existe. No se creó ninguno nuevo.');
            process.exit(0);
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Crear el usuario con la contraseña hasheada
        const newUser = new User({
            ...adminData,
            password: hashedPassword
        });

        await newUser.save();
        console.log('✅ Super usuario administrador creado exitosamente:');
        console.log(`   Email: ${adminData.email}`);
        console.log(`   Contraseña: ${adminData.password}`);
        console.log(`   Rol: ${adminData.role}`);
    } catch (error) {
        console.error('❌ Error al crear el administrador:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

createAdmin();