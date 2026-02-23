import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const AuthLayout = () => {
    return (
        <Box
            className="min-h-screen relative flex items-center justify-center bg-[#0f172a] overflow-hidden p-4"
        >
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />

            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            <Container maxWidth="sm" className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Paper
                        elevation={0}
                        className="rounded-[3rem] p-10 md:p-14 shadow-2xl border border-white/10 bg-white/95 backdrop-blur-xl"
                        sx={{
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <div className="flex flex-col items-center mb-10">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="w-20 h-20 bg-primary-600 rounded-[2rem] mb-6 flex items-center justify-center shadow-2xl shadow-primary-500/40"
                            >
                                <span className="text-white text-3xl font-black italic tracking-tighter">ST</span>
                            </motion.div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">ST Inventory</h1>
                            <div className="h-1 w-12 bg-primary-500 rounded-full" />
                        </div>

                        <Outlet />
                    </Paper>

                    <div className="mt-8 text-center text-slate-500 text-sm font-medium">
                        &copy; 2026 ST Inventory System. All rights reserved.
                    </div>
                </motion.div>
            </Container>
        </Box>
    );
};

export default AuthLayout;
