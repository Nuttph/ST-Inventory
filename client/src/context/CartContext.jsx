import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Initialize state directly from localStorage to prevent flash of empty cart or null errors
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const parsed = JSON.parse(savedCart);
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (e) {
            console.error("Failed to parse cart from localStorage", e);
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        if (!product || !product.id) return;

        const qty = Number(quantity) || 1;

        setCartItems(prev => {
            // Ensure prev is always an array
            const currentItems = Array.isArray(prev) ? prev : [];
            const existingItem = currentItems.find(item => item.id === product.id);

            if (existingItem) {
                return currentItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: (item.quantity || 0) + qty }
                        : item
                );
            }
            return [...currentItems, { ...product, quantity: qty }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => (Array.isArray(prev) ? prev : []).filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        const qty = Number(quantity) || 0;
        if (qty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems(prev => (Array.isArray(prev) ? prev : []).map(item =>
            item.id === productId ? { ...item, quantity: qty } : item
        ));
    };

    const clearCart = () => setCartItems([]);

    // Safeguard for reduce
    const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
    const cartTotal = safeCartItems.reduce((total, item) => total + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
    const cartCount = safeCartItems.reduce((count, item) => count + (Number(item.quantity) || 0), 0);

    return (
        <CartContext.Provider value={{
            cartItems: safeCartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
