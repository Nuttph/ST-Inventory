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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress
} from '@mui/material';
import {
    Plus,
    RefreshCcw,
    AlertTriangle,
    Search,
    ArrowUpRight,
    Package
} from 'lucide-react';

const mockInventory = [
    { id: 1, name: 'Premium Coffee Beans', stock: 15, minStock: 20, price: 250, category: 'Food' },
    { id: 2, name: 'Wireless Headphones', stock: 8, minStock: 5, price: 1500, category: 'Electronics' },
    { id: 3, name: 'Minimalist Watch', stock: 3, minStock: 10, price: 3200, category: 'Fashion' },
    { id: 4, name: 'Smart Plant Pot', stock: 45, minStock: 15, price: 850, category: 'Home' },
    { id: 5, name: 'Leather Journal', stock: 12, minStock: 10, price: 450, category: 'Stationery' },
];

const InventoryPage = () => {
    const [items, setItems] = useState(mockInventory);
    const [restockItem, setRestockItem] = useState(null);
    const [restockAmount, setRestockAmount] = useState(0);

    const handleRestock = () => {
        setItems(prev => prev.map(item =>
            item.id === restockItem.id
                ? { ...item, stock: item.stock + parseInt(restockAmount) }
                : item
        ));
        setRestockItem(null);
        setRestockAmount(0);
    };

    const getStockStatus = (stock, minStock) => {
        if (stock <= 0) return { label: 'Out of Stock', color: 'error', bg: 'bg-red-50 text-red-700' };
        if (stock < minStock) return { label: 'Low Stock', color: 'warning', bg: 'bg-orange-50 text-orange-700' };
        return { label: 'In Stock', color: 'success', bg: 'bg-green-50 text-green-700' };
    };

    return (
        <Box>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Inventory Control</h2>
                    <p className="text-slate-500">Manage stock levels and replenish products</p>
                </div>

                <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    className="bg-primary-600 rounded-xl px-6 py-2.5 font-bold shadow-lg shadow-primary-100"
                >
                    Add New Product
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Paper className="p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Total Products</p>
                            <p className="text-2xl font-black text-slate-800">124</p>
                        </div>
                    </div>
                    <LinearProgress variant="determinate" value={80} className="rounded-full h-1.5" />
                </Paper>

                <Paper className="p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Low Stock Alerts</p>
                            <p className="text-2xl font-black text-slate-800">12</p>
                        </div>
                    </div>
                    <LinearProgress variant="determinate" value={20} color="warning" className="rounded-full h-1.5" />
                </Paper>

                <Paper className="p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                            <RefreshCcw size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Restocks This Month</p>
                            <p className="text-2xl font-black text-slate-800">48</p>
                        </div>
                    </div>
                    <LinearProgress variant="determinate" value={65} color="success" className="rounded-full h-1.5" />
                </Paper>
            </div>

            <Paper className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                    <Typography variant="h6" className="font-bold text-slate-800">Stock Levels</Typography>
                    <TextField
                        placeholder="Search inventory..."
                        size="small"
                        InputProps={{
                            startAdornment: <Search size={16} className="text-slate-400 mr-2" />
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                </div>
                <TableContainer>
                    <Table>
                        <TableHead className="bg-slate-50">
                            <TableRow>
                                <TableCell className="font-bold text-slate-500">Product</TableCell>
                                <TableCell className="font-bold text-slate-500">Category</TableCell>
                                <TableCell className="font-bold text-slate-500">Stock</TableCell>
                                <TableCell className="font-bold text-slate-500">Status</TableCell>
                                <TableCell align="right" className="font-bold text-slate-500">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const status = getStockStatus(item.stock, item.minStock);
                                return (
                                    <TableRow key={item.id} hover>
                                        <TableCell>
                                            <p className="font-bold text-slate-700">{item.name}</p>
                                            <p className="text-xs text-slate-400">ID: PRD-{item.id.toString().padStart(3, '0')}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={item.category} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-lg">{item.stock}</span>
                                                <span className="text-slate-400 text-xs">/ {item.minStock} min</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`${status.bg} px-3 py-1 rounded-full text-xs font-bold`}>
                                                {status.label}
                                            </span>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="text"
                                                size="small"
                                                className="text-primary-600 font-bold hover:bg-primary-50 px-4 py-1.5 rounded-lg"
                                                onClick={() => setRestockItem(item)}
                                                startIcon={<RefreshCcw size={16} />}
                                            >
                                                Restock
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Restock Dialog */}
            <Dialog
                open={!!restockItem}
                onClose={() => setRestockItem(null)}
                PaperProps={{ className: 'rounded-3xl p-2' }}
            >
                <DialogTitle className="font-bold text-slate-800">
                    Restock: {restockItem?.name}
                </DialogTitle>
                <DialogContent>
                    <p className="text-slate-500 mb-6 font-medium">
                        Current stock: <span className="text-slate-900 font-bold">{restockItem?.stock}</span>.
                        Enter the amount to add to inventory.
                    </p>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Restock Quantity"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={restockAmount}
                        onChange={(e) => setRestockAmount(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </DialogContent>
                <DialogActions className="p-6">
                    <Button onClick={() => setRestockItem(null)} className="text-slate-400 font-bold">Cancel</Button>
                    <Button
                        onClick={handleRestock}
                        variant="contained"
                        className="bg-primary-600 rounded-xl px-8 font-bold shadow-lg shadow-primary-100"
                    >
                        Confirm Restock
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InventoryPage;
