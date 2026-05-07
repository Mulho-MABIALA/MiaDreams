import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        try { return JSON.parse(localStorage.getItem('mia_cart') || '[]'); }
        catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('mia_cart', JSON.stringify(items));
    }, [items]);

    const cartKey = (product, size, color) =>
        `${product._id}-${size || ''}-${color || ''}`;

    const addItem = useCallback((product, quantity = 1, size = '', color = '') => {
        const key = cartKey(product, size, color);
        setItems(prev => {
            const existing = prev.find(i => i.key === key);
            if (existing) {
                return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, {
                key,
                product_id: product._id,
                name:       product.name,
                image:      product.image,
                price:      product.price,
                quantity,
                size,
                color,
                slug:       product.slug,
            }];
        });
    }, []);

    const removeItem = useCallback((key) => {
        setItems(prev => prev.filter(i => i.key !== key));
    }, []);

    const updateQty = useCallback((key, qty) => {
        if (qty < 1) return;
        setItems(prev => prev.map(i => i.key === key ? { ...i, quantity: qty } : i));
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const count    = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, count, subtotal }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
