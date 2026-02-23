import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    TextField,
    Button,
    Box,
    InputAdornment,
    Alert,
    Typography,
    IconButton
} from '@mui/material';
import { User, Mail, Lock, UserPlus, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
    fullName: z.string().min(2, 'Full name is too short'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const RegisterPage = () => {
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
            login({
                id: '2',
                name: data.fullName,
                email: data.email,
                role: 'customer'
            });
            navigate('/');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-10">
                <Typography variant="h4" className="font-black text-slate-800 tracking-tight mb-2">
                    Create Account
                </Typography>
                <Typography className="text-slate-500 font-medium">
                    Join thousands of users managing their inventory
                </Typography>
            </div>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {error && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        <Alert severity="error" className="mb-6 rounded-2xl border-none shadow-sm">{error}</Alert>
                    </motion.div>
                )}

                <div className="space-y-4">
                    <TextField
                        fullWidth
                        label="Full Name"
                        placeholder="John Doe"
                        {...register('fullName')}
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <User size={18} className="text-primary-500" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 4,
                                bgcolor: 'rgba(248, 250, 252, 0.8)',
                                '&:hover': { bgcolor: 'white' },
                                transition: 'all 0.3s'
                            }
                        }}
                    />

                    <TextField
                        fullWidth
                        label="Email Address"
                        placeholder="john@example.com"
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
                                bgcolor: 'rgba(248, 250, 252, 0.8)',
                                '&:hover': { bgcolor: 'white' },
                                transition: 'all 0.3s'
                            }
                        }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" className="text-slate-400">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 4,
                                    bgcolor: 'rgba(248, 250, 252, 0.8)',
                                    '&:hover': { bgcolor: 'white' },
                                    transition: 'all 0.3s'
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirm"
                            type={showPassword ? 'text' : 'password'}
                            {...register('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock size={18} className="text-primary-500" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 4,
                                    bgcolor: 'rgba(248, 250, 252, 0.8)',
                                    '&:hover': { bgcolor: 'white' },
                                    transition: 'all 0.3s'
                                }
                            }}
                        />
                    </div>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                        className="bg-primary-600 hover:bg-primary-700 py-4 rounded-[1.25rem] normal-case text-base font-black shadow-xl shadow-primary-200 mt-6 h-14"
                        endIcon={!isSubmitting && <ArrowRight size={20} />}
                    >
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>

                    <p className="text-center text-slate-500 mt-8 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="font-black text-primary-600 hover:text-primary-700 transition-colors underline-offset-4 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </Box>
        </motion.div>
    );
};

export default RegisterPage;
