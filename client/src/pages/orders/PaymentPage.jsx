import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Button,
    Divider,
    IconButton,
    CircularProgress,
    Card,
    CardContent,
    Fade,
    Alert,
    Snackbar
} from '@mui/material';
import {
    ChevronLeft,
    CheckCircle2,
    Clock,
    ShieldCheck,
    QrCode,
    Receipt,
    Wallet
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { motion } from 'framer-motion';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes timer
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (cartItems.length === 0 && !showSuccess) {
            navigate('/shop');
        }
    }, [cartItems, navigate, showSuccess]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleConfirmPayment = () => {
        setLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            setShowSuccess(true);
            clearCart();
            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/shop');
            }, 3000);
        }, 2000);
    };

    if (showSuccess) {
        return (
            <Box className="flex flex-col items-center justify-center min-h-[70vh]">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    <CheckCircle2 size={100} className="text-green-500 mb-6" />
                </motion.div>
                <Typography variant="h4" className="font-black text-slate-800 mb-2 text-center">
                    Payment Successful!
                </Typography>
                <Typography className="text-slate-500 font-bold mb-8 text-center px-4">
                    Your order has been placed and is being processed.
                </Typography>
                <Button
                    variant="contained"
                    className="bg-primary-600 rounded-2xl px-10 py-3 font-black shadow-lg shadow-primary-100"
                    onClick={() => navigate('/shop')}
                >
                    Back to Shop
                </Button>
            </Box>
        );
    }

    return (
        <Fade in={true} timeout={800}>
            <Box className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <IconButton
                        onClick={() => navigate(-1)}
                        className="bg-white shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </IconButton>
                    <div>
                        <Typography variant="h4" className="font-black text-slate-800 tracking-tight">
                            Payment
                        </Typography>
                        <Typography className="text-slate-500 font-bold">
                            Complete your transaction
                        </Typography>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* QR Code Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white">
                            <CardContent className="p-8 flex flex-col items-center">
                                <Box className="bg-primary-50 px-4 py-2 rounded-full flex items-center gap-2 mb-6">
                                    <Clock size={16} className="text-primary-600" />
                                    <Typography className="text-primary-600 font-black text-sm">
                                        Expires in {formatTime(timeLeft)}
                                    </Typography>
                                </Box>

                                <Typography variant="h6" className="font-black text-slate-800 mb-6 text-center">
                                    Scan QR to Pay
                                </Typography>

                                <Box className="relative p-6 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 mb-6">
                                    <img
                                        src="/qr-code.png"
                                        alt="Payment QR"
                                        className="w-64 h-64 object-contain rounded-2xl grayscale-0"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-[2px] rounded-[3rem]">
                                        <QrCode size={40} className="text-primary-600" />
                                    </div>
                                </Box>

                                <div className="space-y-4 w-full">
                                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <Wallet size={20} className="text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Name</p>
                                            <p className="font-black text-slate-800">ST INVENTORY CO., LTD.</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <ShieldCheck size={20} className="text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secure Payment</p>
                                            <p className="font-black text-slate-800">Verified Merchant</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Order Summary Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden sticky top-28">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <Receipt className="text-primary-400" size={24} />
                                    <Typography variant="h5" className="font-black tracking-tight">
                                        Order Summary
                                    </Typography>
                                </div>

                                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden">
                                                    <img src={item.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-white/50 font-bold">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-black">฿{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                <Divider className="my-8 bg-white/10" />

                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between text-white/60 font-bold">
                                        <span>Subtotal</span>
                                        <span>฿{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-white/60 font-bold">
                                        <span>Tax (7%)</span>
                                        <span>฿{(cartTotal * 0.07).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-xl font-black">Total</span>
                                        <span className="text-3xl font-black text-primary-400">
                                            ฿{(cartTotal * 1.07).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    className="bg-primary-500 hover:bg-primary-400 text-white rounded-[1.5rem] py-5 font-black text-lg transition-all transform active:scale-95 disabled:bg-white/10 disabled:text-white/30 shadow-2xl shadow-primary-500/20"
                                    onClick={handleConfirmPayment}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'Confirm Payment'
                                    )}
                                </Button>

                                <p className="text-center text-white/30 text-xs font-bold mt-6 flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} />
                                    Secure SSL Encrypted Transaction
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </Box>
        </Fade>
    );
};

export default PaymentPage;
