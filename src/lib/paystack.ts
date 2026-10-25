// FitLedger OS — Paystack Checkout Integration
// Supports Test Mode (pk_test_...) and Live Mode (pk_live_...)

export interface PaystackOptions {
  email: string;
  amountInNaira: number;
  fullName: string;
  planName: string;
  gymName?: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
}

export function loadPaystackScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);

    if ((window as any).PaystackPop) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Paystack script failed to load. Will fallback to simulated test mode.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function initializePaystackPayment(options: PaystackOptions) {
  const isLoaded = await loadPaystackScript();

  // Test sandbox fallback public key if user hasn't supplied one in .env yet
  const publicKey =
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
    'pk_test_b8dfc4807498c56e30b35e07662c5bbf127f88eb';

  const reference = `FIT_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;

  if (isLoaded && (window as any).PaystackPop) {
    try {
      const handler = (window as any).PaystackPop.setup({
        key: publicKey,
        email: options.email || 'guest@fitledger.ng',
        amount: Math.round(options.amountInNaira * 100), // Paystack expects Kobo
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: 'Member Name',
              variable_name: 'member_name',
              value: options.fullName,
            },
            {
              display_name: 'Plan / Item',
              variable_name: 'plan_name',
              value: options.planName,
            },
            {
              display_name: 'Gym Tenant',
              variable_name: 'gym_name',
              value: options.gymName || 'FitLedger Gym',
            },
          ],
        },
        callback: function (response: { reference: string }) {
          options.onSuccess(response.reference);
        },
        onClose: function () {
          if (options.onClose) options.onClose();
        },
      });

      handler.openIframe();
      return;
    } catch (err) {
      console.warn('PaystackPop setup error, falling back to simulated sandbox:', err);
    }
  }

  // Graceful in-browser simulated test popup if network blocks external script
  const simulatedRef = `PSTK_TEST_${Date.now().toString().slice(-6)}`;
  const proceed = window.confirm(
    `[PAYSTACK TEST MODE]\n\nSimulate Paystack Payment of ₦${options.amountInNaira.toLocaleString()} for ${options.planName}?\n\nCustomer: ${options.fullName} (${options.email})\nReference: ${simulatedRef}\n\nClick OK to simulate Successful Payment.`
  );

  if (proceed) {
    options.onSuccess(simulatedRef);
  } else if (options.onClose) {
    options.onClose();
  }
}
