import React, { useState, useEffect } from 'react';
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

} from '@mui/material';
import { Search, ShoppingCart, Filter, Eye, Heart, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import mockProducts from '../../data/products.json';

const ShopPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [likedProducts, setLikedProducts] = useState(new Set());
    const [addedItems, setAddedItems] = useState(new Set());
    const { addToCart } = useCart();

    const categories = ['All', ...new Set(mockProducts.map(p => p.category))];

    const filteredProducts = mockProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleLike = (e, id) => {
        e.stopPropagation();
        const newLiked = new Set(likedProducts);
        if (newLiked.has(id)) newLiked.delete(id);
        else newLiked.add(id);
        setLikedProducts(newLiked);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart(product);

        // Feedback animation
        setAddedItems(prev => new Set(prev).add(product.id));
        setTimeout(() => {
            setAddedItems(prev => {
                const next = new Set(prev);
                next.delete(product.id);
                return next;
            });
        }, 1500);
    };

    return (
        <Box>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
                <Typography variant="h3" className="font-black text-slate-900 tracking-tighter mb-2 italic">
                    Marketplace
                </Typography>
                <div className="flex flex-col md:flex-row gap-6 mt-6">
                    <TextField
                        placeholder="Find your favorite products..."
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search size={22} className="text-primary-500" /></InputAdornment>,
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'white', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } }}
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
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 border-none'
                                : 'bg-white text-slate-500 border-slate-100 hover:border-primary-200'}`}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="group rounded-[2.5rem] border-none shadow-[0_15px_45px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_25px_60px_-15px_rgba(37,99,235,0.15)] overflow-hidden transition-all duration-500 bg-white">
                                <div className="relative aspect-[1/1] overflow-hidden">
                                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-5 left-5">
                                        <Chip label={product.category} size="small" className="bg-white/90 backdrop-blur font-black text-[10px] uppercase text-primary-700 px-2" />
                                    </div>
                                    <IconButton onClick={(e) => toggleLike(e, product.id)} className="absolute top-5 right-5 bg-white/90 backdrop-blur">
                                        <Heart size={18} className={likedProducts.has(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
                                    </IconButton>
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex items-center gap-1 mb-2">
                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-black text-slate-700">{product.rating}</span>
                                    </div>
                                    <Typography variant="h6" className="font-black text-slate-800 leading-tight mb-4 group-hover:text-primary-600 transition-colors">
                                        {product.name}
                                    </Typography>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">Price</span>
                                            <span className="text-xl font-black text-slate-900 tracking-tighter">฿{product.price.toLocaleString()}</span>
                                        </div>
                                        <IconButton
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className={`p-3 rounded-2xl transition-all duration-300 ${addedItems.has(product.id) ? 'bg-green-500 text-white' : 'bg-primary-600 text-white shadow-lg shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1'}`}
                                        >
                                            {addedItems.has(product.id) ? <Check size={20} /> : <PlusIcon size={20} />}
                                        </IconButton>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Product View Modal can remain similar but simpler */}
        </Box>
    );
};

// Helper since I reused Plus from ShoppingCart context potentially
const PlusIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default ShopPage;
