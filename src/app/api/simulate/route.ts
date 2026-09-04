import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { processFailedPayment } from '@/lib/agent/recovery-agent';
import { RazorpayPaymentEntity, SimulationScenario } from '@/lib/types';

// Pre-defined failure scenarios for demonstration
const SCENARIOS: Record<string, SimulationScenario> = {
  network_error: {
    name: 'Network Timeout',
    description: 'Payment gateway timeout - a transient error that can be recovered by retrying',
    failureType: 'network_error',
    amount: 249900, // ₹2,499
    method: 'card',
    errorCode: 'GATEWAY_ERROR',
    errorDescription: 'Payment processing failed due to gateway timeout. Please retry.',
  },
  insufficient_funds: {
    name: 'Insufficient Funds',
    description: 'Customer\'s account has insufficient balance. Best recovered by waiting and retrying later.',
    failureType: 'insufficient_funds',
    amount: 599900, // ₹5,999
    method: 'upi',
    errorCode: 'PAYMENT_ERROR',
    errorDescription: 'Payment failed due to insufficient balance in the customer\'s account.',
  },
  card_declined: {
    name: 'Card Declined',
    description: 'Bank has declined the card. Requires customer to use an alternative payment method.',
    failureType: 'card_declined',
    amount: 149900, // ₹1,499
    method: 'card',
    errorCode: 'PAYMENT_ERROR',
    errorDescription: 'The card was declined by the issuing bank. Customer should try another card.',
  },
  expired_card: {
    name: 'Expired Card',
    description: 'The card used has expired. Customer needs to provide updated card details.',
    failureType: 'expired_card',
    amount: 349900, // ₹3,499
    method: 'card',
    errorCode: 'BAD_REQUEST_ERROR',
    errorDescription: 'The card has expired. Please use a valid card.',
  },
  high_value: {
    name: 'High-Value Transaction (Human Gate)',
    description: 'A high-value payment that triggers the human approval gate. Demonstrates safety controls.',
    failureType: 'network_error',
    amount: 7500000, // ₹75,000
    method: 'netbanking',
    errorCode: 'GATEWAY_ERROR',
    errorDescription: 'Payment processing failed due to a temporary bank system error.',
  },
  budget_cap: {
    name: 'Budget Cap Test',
    description: 'Simulate hitting the daily budget cap. Demonstrates spending controls.',
    failureType: 'network_error',
    amount: 15000000, // ₹1,50,000
    method: 'card',
    errorCode: 'GATEWAY_ERROR',
    errorDescription: 'Gateway timeout while processing high-value transaction.',
  },
  auth_failed: {
    name: 'Authentication Failed',
    description: 'Customer abandoned 3D Secure / OTP verification. Needs nudge to retry.',
    failureType: 'authentication_failed',
    amount: 99900, // ₹999
    method: 'card',
    errorCode: 'PAYMENT_ERROR',
    errorDescription: 'Payment was not authenticated. Customer did not complete OTP/3DS verification.',
  },
  bank_error: {
    name: 'Bank Server Down',
    description: 'The customer\'s bank server is temporarily down. Delayed retry recommended.',
    failureType: 'bank_error',
    amount: 199900, // ₹1,999
    method: 'netbanking',
    errorCode: 'GATEWAY_ERROR',
    errorDescription: 'Bank server is temporarily unavailable. Please try again later.',
  },
};

const CUSTOMER_NAMES = [
  'Priya Sharma', 'Rahul Mehta', 'Anita Verma', 'Vikram Singh',
  'Sneha Patel', 'Arjun Kumar', 'Neha Gupta', 'Rohan Joshi',
];

const CUSTOMER_EMAILS = [
  'priya.s@example.com', 'rahul.m@example.com', 'anita.v@example.com', 'vikram.s@example.com',
  'sneha.p@example.com', 'arjun.k@example.com', 'neha.g@example.com', 'rohan.j@example.com',
];

function generateMockPayment(scenario: SimulationScenario): RazorpayPaymentEntity {
  const customerIdx = Math.floor(Math.random() * CUSTOMER_NAMES.length);

  return {
    id: `pay_sim_${uuidv4().slice(0, 12)}`,
    entity: 'payment',
    amount: scenario.amount,
    currency: 'INR',
    status: 'failed',
    order_id: `order_sim_${uuidv4().slice(0, 12)}`,
    method: scenario.method,
    description: `Simulated ${scenario.name} scenario`,
    email: CUSTOMER_EMAILS[customerIdx],
    contact: `+919${Math.floor(100000000 + Math.random() * 900000000)}`,
    error_code: scenario.errorCode,
    error_description: scenario.errorDescription,
    error_reason: scenario.failureType,
    notes: {
      customer_name: CUSTOMER_NAMES[customerIdx],
      simulated: 'true',
    },
    created_at: Math.floor(Date.now() / 1000),
  };
}

export async function GET() {
  return NextResponse.json({
    scenarios: Object.entries(SCENARIOS).map(([key, scenario]) => ({
      id: key,
      ...scenario,
      amountFormatted: `₹${(scenario.amount / 100).toFixed(2)}`,
    })),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario: scenarioId } = body;

    if (!scenarioId || !SCENARIOS[scenarioId]) {
      return NextResponse.json(
        {
          error: 'Invalid scenario',
          availableScenarios: Object.keys(SCENARIOS),
        },
        { status: 400 }
      );
    }

    const scenario = SCENARIOS[scenarioId];
    const mockPayment = generateMockPayment(scenario);

    // Process through the full recovery agent pipeline
    const startTime = Date.now();
    const result = await processFailedPayment(mockPayment);
    const processingTimeMs = Date.now() - startTime;

    return NextResponse.json({
      scenario: {
        id: scenarioId,
        ...scenario,
      },
      mockPayment: {
        ...mockPayment,
        amountFormatted: `₹${(mockPayment.amount / 100).toFixed(2)}`,
      },
      result,
      processingTimeMs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
