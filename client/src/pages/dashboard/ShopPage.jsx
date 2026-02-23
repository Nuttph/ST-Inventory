import React, { useState } from 'react';
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
    Dialog,
    Rating,
    Tooltip,
    Snackbar,
    Alert
} from '@mui/material';
import { Search, ShoppingCart, Filter, Eye, Heart, Star, Check, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import mockProducts from '../../data/products.json';

const ShopPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [likedProducts, setLikedProducts] = useState(new Set());
    const [quantities, setQuantities] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [addedItemName, setAddedItemName] = useState('');
    // track which product(s) are currently being added so we can disable
    // the button and avoid race conditions when the user clicks repeatedly
    const [addingIds, setAddingIds] = useState(new Set());

    const { addToCart } = useCart();

    const categories = ['All', ...new Set(mockProducts.map(p => p.category))];

    const filteredProducts = mockProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleQuantityChange = (productId, delta, max = Infinity) => {
        setQuantities(prev => {
            const current = prev[productId] || 1;
            let next = current + delta;
            next = Math.max(1, next);
            if (next > max) next = max;
            return { ...prev, [productId]: next };
        });
    };

    // helper that doesn't depend on a click event so it can be
    // called from multiple places (card button or dialog).  Wrap in a
    // try/catch so a runtime error won't blow up the whole app and
    // produce the white‑screen crash the user described.
    const handleAdd = (product) => {
        if (!product) return;
        // avoid double-work if already in progress
        if (addingIds.has(product.id)) return;
        setAddingIds(prev => new Set(prev).add(product.id));

        // don't allow user to add more than stock
        const qty = Math.min(quantities[product.id] || 1, product.stock || 1);

        try {
            if (!addToCart) {
                throw new Error('Cart context unavailable');
            }
            addToCart(product, qty);
            setAddedItemName(`${product.name} (${qty} item${qty > 1 ? 's' : ''})`);
            setSnackbarOpen(true);
            setQuantities(prev => ({ ...prev, [product.id]: 1 }));
        } catch (err) {
            console.error('failed to add to cart', err);
            alert('ไม่สามารถเพิ่มสินค้าในตะกร้าได้ กรุณาลองอีกครั้ง');
        } finally {
            setAddingIds(prev => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
        }
    };

    const toggleLike = (e, id) => {
        e.stopPropagation();
        const newLiked = new Set(likedProducts);
        if (newLiked.has(id)) newLiked.delete(id);
        else newLiked.add(id);
        setLikedProducts(newLiked);
    };

    return (
        <Box>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <Typography variant="h3" className="font-black text-slate-900 tracking-tighter mb-2 italic">
                    Marketplace
                </Typography>
                <div className="flex flex-col md:flex-row gap-6 mt-6">
                    <TextField
                        placeholder="Search our premium collection..."
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search size={22} className="text-primary-500" /></InputAdornment>,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 5,
                                bgcolor: 'white',
                                border: 'none',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                                '& fieldset': { border: 'none' }
                            }
                        }}
                    />
                </div>
            </motion.div>

            {/* Categories Toolbar */}
            <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-none">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        variant={selectedCategory === cat ? 'contained' : 'outlined'}
                        className={`rounded-2xl px-8 py-3 font-black text-sm whitespace-nowrap transition-all
              ${selectedCategory === cat
                                ? 'bg-primary-600 text-white shadow-xl shadow-primary-200 border-none scale-105'
                                : 'bg-white text-slate-500 border-slate-100 hover:border-primary-200 shadow-sm'}`}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Card className="group h-full flex flex-col rounded-[3rem] border-none shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_-20px_rgba(37,99,235,0.2)] overflow-hidden transition-all duration-700 bg-white">
                                <div className="relative aspect-[1/1] overflow-hidden">
                                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute top-6 left-6">
                                        <Chip label={product.category} size="small" className="bg-white/90 backdrop-blur font-black text-[10px] uppercase text-primary-700 px-3 py-4" />
                                    </div>
                                    <IconButton onClick={(e) => toggleLike(e, product.id)} className="absolute top-6 right-6 bg-white/90 backdrop-blur hover:bg-white shadow-lg transition-all">
                                        <Heart size={20} className={likedProducts.has(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
                                    </IconButton>

                                    {/* Quick View Button */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5">
                                        <Button
                                            variant="contained"
                                            onClick={() => setSelectedProduct(product)}
                                            className="bg-white/90 backdrop-blur text-slate-900 font-black rounded-2xl px-6 py-2.5 shadow-xl"
                                            startIcon={<Eye size={20} />}
                                        >
                                            Quick View
                                        </Button>
                                    </div>
                                </div>

                                <CardContent className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-1 mb-3">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-black text-slate-700">{product.rating}</span>
                                        <span className="text-xs text-slate-300 ml-1">({product.reviews})</span>
                                    </div>

                                    <Typography variant="h6" className="font-black text-slate-800 leading-tight mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[3rem]">
                                        {product.name}
                                    </Typography>

                                    <div className="mt-auto">
                                        <div className="flex items-end justify-between mb-6">
                                            <div>
                                                <span className="text-[10px] font-black text-slate-300 uppercase block tracking-[0.2em] mb-1">Total Price</span>
                                                <span className="text-2xl font-black text-slate-900 tracking-tighter">฿{product.price.toLocaleString()}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black text-slate-300 uppercase block mb-1">Stock</span>
                                                <span className={`text-sm font-black ${product.stock < 10 ? 'text-orange-500' : 'text-green-500'}`}>{product.stock} pcs</span>
                                            </div>
                                        </div>

                                        {/* Quantity Selector & Add Button */}
                                        <div className="flex gap-3 items-center">
                                            <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-100 flex-1">
                                                <IconButton
                                                    size="small"
                                                    disabled={product.stock <= 0 || addingIds.has(product.id)}
                                                    onClick={(e) => { e.stopPropagation(); handleQuantityChange(product.id, -1, product.stock); }}
                                                    className="text-slate-400 hover:text-primary-600"
                                                >
                                                    <Minus size={16} />
                                                </IconButton>
                                                <span className="flex-1 text-center font-black text-slate-700 text-sm">
                                                    {quantities[product.id] || 1}
                                                </span>
                                                <IconButton
                                                    size="small"
                                                    disabled={product.stock <= 0 || addingIds.has(product.id)}
                                                    onClick={(e) => { e.stopPropagation(); handleQuantityChange(product.id, 1, product.stock); }}
                                                    className="text-slate-400 hover:text-primary-600"
                                                >
                                                    <Plus size={16} />
                                                </IconButton>
                                            </div>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAdd(product);
                                                }}
                                                disabled={addingIds.has(product.id) || product.stock <= 0}
                                                className={`bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-2xl shadow-lg shadow-primary-200 transition-all hover:-translate-y-1 active:scale-95 ${
                                                    addingIds.has(product.id) || product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            >
                                                {product.stock <= 0 ? 'หมด' : <ShoppingCart size={22} />}
                                            </IconButton>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Snackbar Feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="success" variant="filled" className="rounded-2xl font-bold shadow-xl">
                    Added to Cart: {addedItemName}
                </Alert>
            </Snackbar>

            {/* Product Detail Modal */}
            <Dialog
                open={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{ className: 'rounded-[3rem] overflow-hidden' }}
            >
                {selectedProduct && (
                    <div className="flex flex-col md:flex-row min-h-[500px]">
                        <div className="w-full md:w-1/2">
                            <img src={selectedProduct.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-full md:w-1/2 p-12 flex flex-col justify-between">
                            <div>
                                <Chip label={selectedProduct.category} className="bg-primary-50 text-primary-600 font-black mb-6" />
                                <Typography variant="h4" className="font-black text-slate-900 mb-2 tracking-tighter">{selectedProduct.name}</Typography>
                                <div className="flex items-center gap-2 mb-8">
                                    <Rating value={selectedProduct.rating} precision={0.1} readOnly size="small" />
                                    <span className="text-sm font-bold text-slate-400">({selectedProduct.reviews} reviews)</span>
                                </div>
                                <Typography variant="h3" className="font-black text-primary-600 mb-8 tracking-tighter">฿{selectedProduct.price.toLocaleString()}</Typography>
                                <Typography className="text-slate-500 leading-relaxed font-medium">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </Typography>
                            </div>
                            <div className="flex items-center gap-4 mt-10">
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => {
                                        handleAdd(selectedProduct);
                                        setSelectedProduct(null);
                                    }}
                                    disabled={selectedProduct && (addingIds.has(selectedProduct.id) || selectedProduct.stock === 0)}
                                    className={`bg-primary-600 hover:bg-primary-700 py-4 rounded-3xl font-black text-lg shadow-xl shadow-primary-100 ${
                                        selectedProduct && (addingIds.has(selectedProduct.id) || selectedProduct.stock === 0) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    startIcon={<ShoppingCart size={22} />}
                                >
                                    {selectedProduct && (addingIds.has(selectedProduct.id) ? 'Adding...' : 'Add To Cart')}
                                </Button>
                                <IconButton className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                    <Heart size={24} className="text-slate-400" />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </Box>
    );
};

export default ShopPage;
