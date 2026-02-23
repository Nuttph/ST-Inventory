import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    IconButton,
    Avatar,
    Tooltip,
    Tab,
    Tabs,
    Menu,
    MenuItem,
    Divider
} from '@mui/material';
import {
    MoreVertical,
    CheckCircle,
    XCircle,
    Package,
    Truck,
    Clock,
    Eye
} from 'lucide-react';

const mockOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: 3450, status: 'pending', date: '2026-02-23' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 1200, status: 'approved', date: '2026-02-22' },
    { id: 'ORD-003', customer: 'Robert Brown', amount: 8900, status: 'paid', date: '2026-02-21' },
    { id: 'ORD-004', customer: 'Sarah Wilson', status: 'packing', amount: 450, date: '2026-02-20' },
    { id: 'ORD-005', customer: 'Michael Lee', status: 'shipped', amount: 1500, date: '2026-02-19' },
];

const OrderManagementPage = () => {
    const [tab, setTab] = useState(0);
    const [orders, setOrders] = useState(mockOrders);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleAction = (orderId, newStatus) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setAnchorEl(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'info';
            case 'paid': return 'success';
            case 'packing': return 'secondary';
            case 'shipped': return 'primary';
            default: return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={14} className="mr-1" />;
            case 'approved': return <CheckCircle size={14} className="mr-1" />;
            case 'paid': return <CheckCircle size={14} className="mr-1" />;
            case 'packing': return <Package size={14} className="mr-1" />;
            case 'shipped': return <Truck size={14} className="mr-1" />;
            default: return null;
        }
    };

    return (
        <Box>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Order Management</h2>
                <p className="text-slate-500">Monitor and process customer orders</p>
            </div>

            <Paper className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <Box className="px-6 pt-4 border-b">
                    <Tabs
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        sx={{
                            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
                        }}
                    >
                        <Tab label="All Orders" className="font-bold capitalize min-w-0 px-6" />
                        <Tab label="Pending" className="font-bold capitalize min-w-0 px-6" />
                        <Tab label="In Progress" className="font-bold capitalize min-w-0 px-6" />
                        <Tab label="Completed" className="font-bold capitalize min-w-0 px-6" />
                    </Tabs>
                </Box>

                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead className="bg-slate-50">
                            <TableRow>
                                <TableCell className="font-bold text-slate-500 py-4">Order ID</TableCell>
                                <TableCell className="font-bold text-slate-500 py-4">Customer</TableCell>
                                <TableCell className="font-bold text-slate-500 py-4">Amount</TableCell>
                                <TableCell className="font-bold text-slate-500 py-4">Date</TableCell>
                                <TableCell className="font-bold text-slate-500 py-4">Status</TableCell>
                                <TableCell align="right" className="font-bold text-slate-500 py-4">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} hover className="transition-colors">
                                    <TableCell className="font-bold text-slate-700">{order.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar sx={{ width: 30, height: 30, fontSize: 12 }}>{order.customer[0]}</Avatar>
                                            <span className="font-medium">{order.customer}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold">฿{order.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-slate-500">{order.date}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={<span className="flex items-center capitalize">{getStatusIcon(order.status)}{order.status}</span>}
                                            color={getStatusColor(order.status)}
                                            size="small"
                                            className="font-bold rounded-lg"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <div className="flex justify-end gap-1">
                                            {order.status === 'pending' && (
                                                <Tooltip title="Approve">
                                                    <IconButton onClick={() => handleAction(order.id, 'approved')} className="text-green-600 bg-green-50">
                                                        <CheckCircle size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {order.status === 'paid' && (
                                                <Tooltip title="Start Packing">
                                                    <IconButton onClick={() => handleAction(order.id, 'packing')} className="text-orange-600 bg-orange-50">
                                                        <Package size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {order.status === 'packing' && (
                                                <Tooltip title="Ship Order">
                                                    <IconButton onClick={() => handleAction(order.id, 'shipped')} className="text-blue-600 bg-blue-50">
                                                        <Truck size={18} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            <IconButton
                                                onClick={(e) => {
                                                    setAnchorEl(e.currentTarget);
                                                    setSelectedOrder(order);
                                                }}
                                            >
                                                <MoreVertical size={18} />
                                            </IconButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ elevation: 2, className: 'rounded-xl min-w-[150px]' }}
            >
                <MenuItem onClick={() => setAnchorEl(null)}><Eye size={16} className="mr-2" /> View Details</MenuItem>
                <Divider />
                <MenuItem onClick={() => setAnchorEl(null)} className="text-red-500"><XCircle size={16} className="mr-2" /> Cancel Order</MenuItem>
            </Menu>
        </Box>
    );
};

export default OrderManagementPage;
