const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');
const Payment = require('../models/Payment');

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('payment');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOrder = async (req, res) => {
    try {
        const { orderId, user, customer, amount, status, paymentMethod, items } = req.body;

        // 1. Create Order
        const order = new Order({
            orderId,
            user,
            customer,
            amount,
            status,
            paymentMethod
        });
        const savedOrder = await order.save();

        // 2. Create OrderDetails
        if (items && items.length > 0) {
            const detailPromises = items.map(item => {
                return new OrderDetail({
                    order: savedOrder._id,
                    product: item._id, // item id from mongo
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity
                }).save();
            });
            await Promise.all(detailPromises);
        }

        // 3. Create Payment
        const payment = new Payment({
            order: savedOrder._id,
            amount: amount,
            method: paymentMethod,
            status: paymentMethod === 'cod' ? 'pending' : 'completed', // QR/Card is immediate for this mock
            transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
        const savedPayment = await payment.save();

        // 4. Update Order with Payment Reference
        savedOrder.payment = savedPayment._id;
        await savedOrder.save();

        const fullOrder = await Order.findById(savedOrder._id).populate('payment');
        res.status(201).json(fullOrder);
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(400).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('payment');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        const details = await OrderDetail.find({ order: order._id }).populate('product');

        res.json({
            ...order._doc,
            items: details
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            Object.assign(order, req.body);
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            // Should also delete details and payment ideally
            await OrderDetail.deleteMany({ order: order._id });
            await Payment.deleteMany({ order: order._id });
            await order.deleteOne();
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOrders,
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder
};
