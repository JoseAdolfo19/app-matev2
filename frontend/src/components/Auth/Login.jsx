import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { FaGoogle } from 'react-icons/fa';

const schema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email es requerido'),
  password: yup.string().required('Contraseña es requerida'),
});

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);
    
    if (result.success) {
      toast.success('¡Bienvenido de vuelta!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse.credential);
    if (result.success) {
      toast.success('¡Bienvenido!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--primary)]">MathFlow</h1>
          <p className="text-[var(--on-surface-variant)]">Impulsa tu aprendizaje matemático</p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--surface)] rounded-2xl p-8 shadow-lg border border-[var(--outline-variant)]">
          <h2 className="text-2xl font-bold text-[var(--on-surface)] mb-6">
            Bienvenido de nuevo
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--on-surface-variant)] mb-1">
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--surface-container-high)] focus:border-[var(--primary)] focus:outline-none bg-[var(--surface-container-lowest)] text-[var(--on-surface)]"
                placeholder="estudiante@mathflow.edu"
              />
              {errors.email && (
                <p className="text-sm text-[var(--error)] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-[var(--on-surface-variant)]">
                  CONTRASEÑA
                </label>
                <Link to="/forgot-password" className="text-sm text-[var(--primary)] hover:underline">
                  Olvidé mi contraseña
                </Link>
              </div>
              <input
                type="password"
                {...register('password')}
                className="w-full px-4 py-3 rounded-lg border-2 border-[var(--surface-container-high)] focus:border-[var(--primary)] focus:outline-none bg-[var(--surface-container-lowest)] text-[var(--on-surface)]"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-[var(--error)] mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-[var(--outline-variant)]"></div>
            <span className="flex-shrink mx-4 text-sm text-[var(--outline)]">O CONTINÚA CON</span>
            <div className="flex-grow border-t border-[var(--outline-variant)]"></div>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Error al iniciar sesión con Google')}
            useOneTap
            theme="filled_blue"
            shape="pill"
            text="continue_with"
          />

          <p className="text-center mt-6 text-[var(--on-surface-variant)]">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-[var(--primary)] font-bold hover:underline">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;