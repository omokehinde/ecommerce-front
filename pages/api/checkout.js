import Stripe from "stripe";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req,res) {
    if(req.method !== "POST") {
        res.json("Only POST request are allowed.");
        return
    }
    const {name,email,city,postalCode,streetAddress,country,cartProducts} = req.body;
    const productIds = cartProducts;
    const uniqueIds = [...new Set(productIds)];
    await mongooseConnect();
    const productInfos = await Product.find({_id: uniqueIds});

    let line_items = [];

    for (const productId of uniqueIds) {
        const productInfo = productInfos.find(p=> p._id.toString() === productId);
        const quantity = productIds.filter(id=> id === productId)?.length || 0;
        if (quantity > 0 && productInfo) {
            line_items.push({
                quantity,
                price_data: {
                    currency: "USD",
                    product_data: {name: productInfo.title},
                    unit_amount: productInfo.price * 100
                },
            });
        }
    }
    const orderDoc = await Order.create({
        line_items,name,email,city,streetAddress,postalCode,country,paid: false
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        customer_email: email,
        success_url: process.env.PUBLIC_URL+"/cart?success=1",
        cancel_url: process.env.PUBLIC_URL+"/cart?canceled=1",
        metadata: {orderId: orderDoc._id.toString(), test: "ok"}
    });

    res.json({
        url: session.url
    });
}