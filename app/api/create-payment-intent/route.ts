// app/api/create-payment-intent/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      amount,
      currency = 'usd',

      user_id,
      tutor_id,
      service_id,
      staff_id,

      appointment_start,
      duration,
    } = body;

    // 🔒 Basic validation
    if (!amount || !user_id || !service_id || !staff_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ⚠️ Optional: enforce integer amount
    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // 🧠 TODO (recommended): recalculate amount server-side
    // const expectedAmount = calculatePrice(service_id, duration);
    // if (amount !== expectedAmount) throw new Error('Amount mismatch');

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,

      automatic_payment_methods: {
        enabled: true,
      },

      metadata: {
        user_id: String(user_id),
        tutor_id: String(tutor_id ?? ''),
        service_id: String(service_id),
        staff_id: String(staff_id),
        appointment_start: String(appointment_start ?? ''),
        duration: String(duration ?? ''),
      },

      description: `Booking: service ${service_id}, staff ${staff_id}`,

      capture_method: 'automatic',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err: any) {
    console.error('Stripe Error:', err);

    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}