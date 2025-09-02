import { StripeProvider } from '@stripe/stripe-react-native';
import React from 'react';

// Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'test';

/**
 * StripeService component that wraps the application with Stripe provider
 * @param {Object} props - Component props
 * @returns {React.Component} - Stripe provider component
 */
export const StripeService = ({ children }) => {
  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.waqafannur" // Only needed for Apple Pay
      urlScheme="waqafannur" // Only needed for 3D Secure and bank redirects
    >
      {children}
    </StripeProvider>
  );
};

/**
 * Helper function to format amount for Stripe (converts to smallest currency unit)
 * @param {number} amount - Amount in decimal (e.g., 10.99)
 * @returns {number} - Amount in smallest currency unit (e.g., 1099 cents)
 */
export const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100);
};

/**
 * Helper function to create payment request body
 * @param {number} amount - Amount to charge
 * @param {string} currency - Currency code (default: 'myr')
 * @returns {Object} - Payment request body
 */
export const createPaymentRequest = (amount, currency = 'myr') => {
  return {
    amount: formatAmountForStripe(amount),
    currency: currency,
  };
};