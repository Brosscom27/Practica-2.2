import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export const registerUser = async ({ name, email, password, role }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new HttpError(409, 'El correo ya está registrado');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });
  return { id: user._id, name: user.name, email: user.email, role: user.role };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new HttpError(401, 'Credenciales inválidas');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new HttpError(401, 'Credenciales inválidas');

  const token = jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '8h'
  });

  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
};
