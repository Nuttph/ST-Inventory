import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    Button,
    IconButton,
    CircularProgress,
    Fade,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import {
    Package,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    ShoppingBag,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import orderApi from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';

const CustomerOrdersPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderApi.getOrders();
            // In a real app, the backend should filter by the current user.
            // For this demo, we'll filter client-side if the user is a member.
            const userOrders = response.data.filter(order => order.customer === user?.name);
            setOrders(userOrders.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={18} className="mr-2" />;
            case 'approved': return <CheckCircle2 size={18} className="mr-2" />;
            case 'paid': return <ShoppingBag size={18} className="mr-2" />;
            case 'packing': return <Package size={18} className="mr-2" />;
            case 'shipped': return <Truck size={18} className="mr-2" />;
            case 'cancelled': return <XCircle size={18} className="mr-2" />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'info';
            case 'paid': return 'success';
            case 'packing': return 'warning';
            case 'shipped': return 'primary';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                    <IconButton
                        onClick={() => navigate('/shop')}
                        className="bg-white shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </IconButton>
                    <Typography variant="h3" className="font-black text-slate-900 tracking-tighter italic">
                        My Orders
                    </Typography>
                </div>
                <Typography className="text-slate-500 font-bold ml-14">
                    Track and manage your order history
                </Typography>
            </motion.div>

            {loading ? (
                <Box className="flex flex-col items-center justify-center py-20">
                    <CircularProgress size={40} className="mb-4" />
                    <Typography className="text-slate-400 font-black italic">Loading your orders...</Typography>
                </Box>
            ) : orders.length === 0 ? (
                <Paper className="rounded-[3rem] p-20 text-center bg-white border-none shadow-xl shadow-slate-100">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={40} className="text-slate-300" />
                    </div>
                    <Typography variant="h5" className="font-black text-slate-800 mb-2">No orders yet</Typography>
                    <Typography className="text-slate-400 font-bold mb-8">Ready to start shopping? Our premium collection awaits!</Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/shop')}
                        className="bg-primary-600 rounded-2xl px-10 py-3 font-black shadow-lg shadow-primary-100"
                    >
                        Explore Marketplace
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={4}>
                    {orders.map((order, index) => (
                        <Grid item xs={12} key={order._id}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="group rounded-[2.5rem] border-none shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="p-8 flex-1">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <Typography className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Order ID</Typography>
                                                        <Typography className="font-black text-slate-800 text-lg">{order.orderId || order._id.substring(0, 10).toUpperCase()}</Typography>
                                                    </div>
                                                    <Chip
                                                        label={<span className="flex items-center capitalize font-black">{getStatusIcon(order.status)}{order.status}</span>}
                                                        color={getStatusColor(order.status)}
                                                        className="rounded-xl px-4 py-6 shadow-sm"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                    <div>
                                                        <Typography className="text-[10px] font-black text-slate-300 uppercase block mb-1">Date</Typography>
                                                        <Typography className="font-bold text-slate-700">{new Date(order.date).toLocaleDateString()}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography className="text-[10px] font-black text-slate-300 uppercase block mb-1">Amount</Typography>
                                                        <Typography className="font-black text-primary-600">฿{order.amount.toLocaleString()}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography className="text-[10px] font-black text-slate-300 uppercase block mb-1">Items</Typography>
                                                        <Typography className="font-bold text-slate-700">Detailed view coming soon</Typography>
                                                    </div>
                                                    <div className="flex items-end justify-end md:justify-start">
                                                        <Button
                                                            variant="text"
                                                            endIcon={<ChevronRight size={16} />}
                                                            className="text-primary-600 font-black p-0 hover:bg-transparent"
                                                        >
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 md:w-64 p-8 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-100">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                        <Truck className="text-primary-500" />
                                                    </div>
                                                    <Typography className="text-[10px] font-black text-slate-300 uppercase mb-1">Estimated Delivery</Typography>
                                                    <Typography className="font-black text-slate-800">Next 1-2 Days</Typography>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default CustomerOrdersPage;
