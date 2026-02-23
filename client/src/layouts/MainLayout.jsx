import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Badge,
    Tooltip,
    Paper,
    Chip,
    Button
} from '@mui/material';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    LogOut,
    Menu as MenuIcon,
    Bell,
    ChevronLeft,
    Store,
    Wallet,
    Settings,
    Trash2,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidth = 280;

const MainLayout = () => {
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [cartAnchorEl, setCartAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity } = useCart();

    const menuItems = [
        { text: 'Shop', icon: <Store size={22} />, path: '/shop', roles: ['member', 'manager', 'staff'] },
        { text: 'My Orders', icon: <ShoppingCart size={22} />, path: '/orders', roles: ['member', 'manager'] },
        { text: 'Inventory', icon: <Package size={22} />, path: '/inventory', roles: ['manager', 'staff'] },
        { text: 'Order Management', icon: <Wallet size={22} />, path: '/admin/orders', roles: ['manager', 'staff'] },
        { text: 'User Permissions', icon: <Users size={22} />, path: '/admin/users', roles: ['manager'] },
    ].filter(item => item.roles.includes(user?.role));

    const handleDrawerToggle = () => setOpen(!open);
    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCartMenu = (event) => setCartAnchorEl(event.currentTarget);
    const handleClose = () => { setAnchorEl(null); setCartAnchorEl(null); };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'slate.50' }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: 'white',
                    color: 'slate.900',
                    borderBottom: '1px solid rgba(0,0,0,0.08)',
                    width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 72px)`,
                    transition: (theme) => theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar className="px-4">
                    <IconButton onClick={handleDrawerToggle} edge="start" className="mr-2">
                        {open ? <ChevronLeft /> : <MenuIcon />}
                    </IconButton>

                    <Typography variant="h6" noWrap className="font-black text-slate-800 flex-grow uppercase tracking-tighter">
                        {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
                    </Typography>

                    <Box className="flex items-center gap-2">
                        {/* Cart Button */}
                        <IconButton className="bg-slate-50 hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-colors" onClick={handleCartMenu}>
                            <Badge badgeContent={cartCount} color="primary" sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}>
                                <ShoppingCart size={20} />
                            </Badge>
                        </IconButton>

                        <IconButton className="bg-slate-50">
                            <Badge badgeContent={0} color="error">
                                <Bell size={20} />
                            </Badge>
                        </IconButton>

                        <div className="flex items-center gap-3 ml-2 hover:bg-slate-50 p-1 rounded-full transition-colors cursor-pointer" onClick={handleMenu}>
                            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontWeight: 'bold' }}>{user?.name?.[0]}</Avatar>
                            <div className="hidden md:block">
                                <p className="text-sm font-black text-slate-800 leading-none">{user?.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{user?.role}</p>
                            </div>
                        </div>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{ elevation: 4, className: 'rounded-2xl min-w-[200px] border border-slate-100 mt-2' }}
                        >
                            <MenuItem onClick={handleClose} className="py-3 font-bold text-slate-600">Profile Settings</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogout} className="py-3 font-bold text-red-500">
                                <ListItemIcon><LogOut size={18} className="text-red-500" /></ListItemIcon>
                                Sign Out
                            </MenuItem>
                        </Menu>

                        {/* Cart Dropdown */}
                        <Menu
                            anchorEl={cartAnchorEl}
                            open={Boolean(cartAnchorEl)}
                            onClose={handleClose}
                            PaperProps={{
                                elevation: 4,
                                className: 'rounded-3xl min-w-[350px] border border-slate-100 mt-2 p-4'
                            }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Typography variant="h6" className="font-black text-slate-800">Your Cart</Typography>
                                <Chip label={`${cartCount} items`} size="small" className="font-black bg-primary-50 text-primary-600" />
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="py-10 text-center">
                                    <ShoppingCart size={40} className="text-slate-200 mx-auto mb-2" />
                                    <p className="text-slate-400 font-bold">Cart is empty</p>
                                </div>
                            ) : (
                                <div className="max-h-[400px] overflow-y-auto space-y-4 mb-4 scrollbar-thin">
                                    {cartItems.map(item => (
                                        <div key={item._id} className="flex gap-4 p-2 hover:bg-slate-50 rounded-2xl transition-colors group">
                                            <img src={item.image} className="w-16 h-16 rounded-xl object-cover" />
                                            <div className="flex-grow">
                                                <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</p>
                                                <p className="text-primary-600 font-black text-sm">฿{(Number(item.price) || 0).toLocaleString()}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <button onClick={() => updateQuantity(item._id, (item.quantity || 0) - 1)} className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold">-</button>
                                                    <span className="text-xs font-black">{item.quantity || 0}</span>
                                                    <button onClick={() => updateQuantity(item._id, (item.quantity || 0) + 1)} className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-bold">+</button>
                                                </div>
                                            </div>
                                            <IconButton onClick={() => removeFromCart(item._id)} size="small" className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={16} />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {cartItems.length > 0 && (
                                <>
                                    <Divider className="mb-4" />
                                    <div className="mb-4 flex justify-between">
                                        <span className="font-bold text-slate-500">Total</span>
                                        <span className="font-black text-xl text-slate-800">฿{(cartTotal || 0).toLocaleString()}</span>
                                    </div>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        className="bg-primary-600 rounded-2xl py-3 font-black shadow-lg shadow-primary-100"
                                        onClick={() => {
                                            handleClose();
                                            navigate('/payment');
                                        }}
                                    >
                                        Checkout Now
                                    </Button>
                                </>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: drawerWidth,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: '1px solid rgba(0,0,0,0.08)',
                        ...(!open && { width: 72, overflowX: 'hidden' }),
                    },
                }}
            >
                <div className="flex items-center h-16 px-6">
                    <div className="w-10 h-10 bg-primary-600 rounded-[1rem] flex items-center justify-center mr-3 shadow-lg shadow-primary-200">
                        <span className="text-white text-base font-black italic tracking-tighter">ST</span>
                    </div>
                    {open && <span className="font-black text-xl tracking-tighter text-slate-800 uppercase italic">ST Inventory</span>}
                </div>

                <Divider className="opacity-50" />

                <List className="px-3 mt-6 gap-2">
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={location.pathname === item.path}
                                sx={{
                                    borderRadius: 4,
                                    px: 2.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.50',
                                        color: 'primary.600',
                                        '& .MuiListItemIcon-root': { color: 'primary.600' }
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                                {open && <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 800, tracking: '-0.02em' }} />}
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 4, pt: 12, bgcolor: '#f8fafc' }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
