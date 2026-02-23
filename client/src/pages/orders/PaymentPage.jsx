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
    Snackbar,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import {
    ChevronLeft,
    CheckCircle2,
    Clock,
    ShieldCheck,
    QrCode as QrIcon,
    Receipt,
    Wallet,
    CreditCard,
    Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderApi from '../../api/orderApi';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes timer
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('qr');

    useEffect(() => {
        if (cartItems.length === 0 && !showSuccess) {
            navigate('/shop');
        }
    }, [cartItems, navigate, showSuccess]);

    useEffect(() => {
        if (timeLeft > 0 && paymentMethod === 'qr') {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, paymentMethod]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleConfirmPayment = async () => {
        setLoading(true);
        try {
            // Create detailed order in database
            const orderData = {
                orderId: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                user: user?._id || user?.id, // Support both just in case
                customer: user?.name || 'Anonymous Customer',
                amount: cartTotal * 1.07,
                status: paymentMethod === 'cod' ? 'pending' : 'paid',
                paymentMethod: paymentMethod,
                items: cartItems.map(item => ({
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            };

            await orderApi.createOrder(orderData);

            setLoading(false);
            setShowSuccess(true);
            clearCart();
            setTimeout(() => {
                navigate('/orders');
            }, 3000);
        } catch (error) {
            console.error('Payment/Order creation failed:', error);
            alert('Payment failed. Please try again.');
            setLoading(false);
        }
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
                    onClick={() => navigate('/orders')}
                >
                    View My Orders
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
                            Checkout
                        </Typography>
                        <Typography className="text-slate-500 font-bold">
                            Complete your transaction
                        </Typography>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Payment Method Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white h-full">
                            <CardContent className="p-8">
                                <Typography variant="h6" className="font-black text-slate-800 mb-6"> Select Payment Method</Typography>

                                <ToggleButtonGroup
                                    value={paymentMethod}
                                    exclusive
                                    onChange={(e, val) => val && setPaymentMethod(val)}
                                    fullWidth
                                    className="mb-8 flex-wrap gap-2"
                                    sx={{ '& .MuiToggleButton-root': { border: 'none', borderRadius: '1rem !important', flex: 1, py: 2 } }}
                                >
                                    <ToggleButton value="qr" className={`flex flex-col gap-2 ${paymentMethod === 'qr' ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <QrIcon size={24} />
                                        <span className="text-[10px] font-black uppercase">QR Code</span>
                                    </ToggleButton>
                                    <ToggleButton value="card" className={`flex flex-col gap-2 ${paymentMethod === 'card' ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <CreditCard size={24} />
                                        <span className="text-[10px] font-black uppercase">Card</span>
                                    </ToggleButton>
                                    <ToggleButton value="cod" className={`flex flex-col gap-2 ${paymentMethod === 'cod' ? 'bg-primary-50 text-primary-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <Truck size={24} />
                                        <span className="text-[10px] font-black uppercase">COD</span>
                                    </ToggleButton>
                                </ToggleButtonGroup>

                                <AnimatePresence mode="wait">
                                    {paymentMethod === 'qr' && (
                                        <motion.div
                                            key="qr"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex flex-col items-center"
                                        >
                                            <Box className="bg-primary-50 px-4 py-2 rounded-full flex items-center gap-2 mb-6">
                                                <Clock size={16} className="text-primary-600" />
                                                <Typography className="text-primary-600 font-black text-sm">
                                                    Expires in {formatTime(timeLeft)}
                                                </Typography>
                                            </Box>
                                            <Box className="relative p-6 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 mb-6">
                                                <img src="/qr-code.png" alt="Payment QR" className="w-48 h-48 object-contain rounded-2xl" />
                                            </Box>
                                            <Typography className="text-slate-400 font-bold text-sm text-center">Scan with any Mobile Banking app</Typography>
                                        </motion.div>
                                    )}

                                    {paymentMethod === 'card' && (
                                        <motion.div
                                            key="card"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden">
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-8">
                                                        <CreditCard size={32} />
                                                        <span className="font-black italic text-xl">VISA</span>
                                                    </div>
                                                    <p className="text-2xl font-black mb-4 tracking-[0.2em]">**** **** **** 4242</p>
                                                    <div className="flex gap-8">
                                                        <div>
                                                            <p className="text-[8px] uppercase font-black text-white/40">Card Holder</p>
                                                            <p className="font-bold">{user?.name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] uppercase font-black text-white/40">Expires</p>
                                                            <p className="font-bold">12/28</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 rounded-full -mr-10 -mt-10 blur-2xl" />
                                            </div>
                                            <Typography className="text-slate-400 font-bold text-sm text-center">Your saved card will be charged</Typography>
                                        </motion.div>
                                    )}

                                    {paymentMethod === 'cod' && (
                                        <motion.div
                                            key="cod"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="py-10 text-center"
                                        >
                                            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Truck size={40} className="text-primary-600" />
                                            </div>
                                            <Typography variant="h6" className="font-black text-slate-800 mb-2">Cash on Delivery</Typography>
                                            <Typography className="text-slate-500 font-bold max-w-[200px] mx-auto text-sm">Pay with cash when your order arrives at your door.</Typography>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-4 w-full mt-8">
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
                                        <div key={item._id} className="flex justify-between items-center">
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
                                        paymentMethod === 'cod' ? 'Place Order (COD)' : 'Confirm Payment'
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
