import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const schema = yup.object().shape({
  full_name: yup.string().required('Nombre completo es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  password: yup.string().min(8, 'Mínimo 8 caracteres').required('Contraseña es requerida'),
  password_confirmation: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmar contraseña es requerida'),
  role: yup.string().default('student'),
  academic_level: yup.string().when('role', {
    is: 'student',
    then: () => yup.string().required('Nivel académico es requerido')
  }),
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'student' }
  });

  const role = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser(data);
    setLoading(false);
    
    if (result.success) {
      toast.success('¡Registro exitoso! Bienvenido a MathFlow');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[var(--surface)] rounded-2xl p-8 shadow-lg border border-[var(--outline-variant)]"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--primary)]">MathFlow</h1>
          <p className="text-[var(--on-surface-variant)]">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--on-surface-variant)] mb-1">
              NOMBRE COMPLETO
            </label>
            <input
              type="text"
              {...register('full_name')}
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--surface-container-high)] focus:border-[var(--primary)] focus:outline-none bg-[var(--surface-container-lowest)]"
              placeholder="Ej. Juan Pérez"
            />
            {errors.full_name && (
              <p className="text-sm text-[var(--error)] mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--on-surface-variant)] mb-1">
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--surface-container-high)] focus:border-[var(--primary)] focus:outline-none bg-[var(--surface-container-lowest)]"
              placeholder="nombre@ejemplo.com"
            />
            {errors.email && (
              <p className="text-sm text-[var(--error)] mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--on-surface-variant)] mb-1">
              CONTRASEÑA
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--surface-container-high)] focus:border-[var(--primary)] focus:outline-none bg-[var(--surface-container-lowest)]"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--outline)]"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-[var(--error)] mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--on-surface-variant)] mb-1">
              CONFIRMAR CONTRASEÑA
            </label>
            <input
              type="password"
              {...register('password_confirmation')}
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--surface-container-high)] focus:border-[var(--primary)] focus:outline-none bg-[var(--surface-container-lowest)]"
              placeholder="Repite la contraseña"
            />
            {errors.password_confirmation && (
              <p className="text-sm text-[var(--error)] mt-1">{errors.password_confirmation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--on-surface-variant)] mb-1">
              ROL
            </label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 rounded-lg border-2 border-[var(--surface-container-high)] focus:border-[var(--primary)] focus:outline-none bg-[var(--surface-container-lowest)]"
            >
              <option value="student">Estudiante</option>
              <option value="teacher">Docente</option>
            </select>
          </div>

          {role === 'student' && (
            <div>
              <label className="block text-sm font-medium text-[var(--on-surface-variant)] mb-1">
                NIVEL ACADÉMICO
              </label>
              <select
                {...register('academic_level')}
                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--surface-container-high)] focus:border-[var(--primary)] focus:outline-none bg-[var(--surface-container-lowest)]"
              >
                <option value="basic">Básico</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
              {errors.academic_level && (
                <p className="text-sm text-[var(--error)] mt-1">{errors.academic_level.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[var(--on-surface-variant)]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[var(--primary)] font-bold hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;