import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    TextField,
    Button,
    Box,
    Typography,
    InputAdornment,
    IconButton,
    Alert,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import authApi from '../../api/authApi';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setError('');
        try {
            const response = await authApi.login({
                email: data.email,
                password: data.password
            });

            if (response.data && response.data.token) {
                // The API returns user info and token in the same object
                const { token, ...user } = response.data;
                login(user, token);
                navigate('/');
            } else {
                setError('Invalid server response.');
            }
        } catch (err) {
            console.error('Login error:', err);
            const message = err.response?.data?.message || 'Invalid credentials or server error.';
            setError(message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-10">
                <Typography variant="h4" className="font-black text-slate-800 tracking-tighter mb-2">
                    Hello Again!
                </Typography>
                <Typography className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                    E-Commerce Management System
                </Typography>
            </div>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {error && (
                    <Alert severity="error" className="mb-6 rounded-2xl border-none shadow-sm font-bold">{error}</Alert>
                )}

                <div className="space-y-5">
                    <TextField
                        fullWidth
                        label="Email Address"
                        placeholder="manager@example.com"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Mail size={18} className="text-primary-500" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 4,
                                bgcolor: 'rgba(240, 244, 248, 0.5)',
                                '&:hover': { bgcolor: 'white' }
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock size={18} className="text-primary-500" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 4,
                                bgcolor: 'rgba(240, 244, 248, 0.5)',
                                '&:hover': { bgcolor: 'white' }
                            }
                        }}
                    />

                    <div className="flex items-center justify-between">
                        <FormControlLabel
                            control={<Checkbox size="small" defaultChecked />}
                            label={<span className="text-sm font-bold text-slate-500">Keep me logged in</span>}
                        />
                        <Link to="#" className="text-sm font-black text-primary-600">
                            Forgot?
                        </Link>
                    </div>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        className="bg-primary-600 hover:bg-primary-700 py-4 rounded-[1.25rem] normal-case text-base font-black shadow-xl shadow-primary-200 mt-4 h-14"
                        endIcon={<ArrowRight size={20} />}
                    >
                        {isSubmitting ? 'Verifying...' : 'Sign In To Panel'}
                    </Button>

                    <p className="text-center text-slate-500 mt-10 font-bold">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-black text-primary-600 hover:underline underline-offset-4">
                            Register
                        </Link>
                    </p>

                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Test Roles:</p>
                        <div className="text-[11px] font-bold text-slate-600">
                            <p>Manager: manager@example.com (Full access)</p>
                            <p>Staff: staff@example.com (Inventory & Orders)</p>
                            <p>Member: member@example.com (Shop & Cart)</p>
                        </div>
                    </div>
                </div>
            </Box>
        </motion.div>
    );
};

export default LoginPage;
