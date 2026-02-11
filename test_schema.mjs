
import { z } from 'zod';

const WEAK_PASSWORDS = new Set(['password', '12345678']);

function isWeakPassword(password: string): boolean {
  return WEAK_PASSWORDS.has(password.toLowerCase());
}

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  .refine((val) => !isWeakPassword(val), {
    message: 'This password is too common. Please choose a stronger password.',
  });

const registrationSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const test = (data: any) => {
    const result = registrationSchema.safeParse(data);
    if (result.success) {
        console.log('Valid:', data);
    } else {
        console.log('Invalid:', data);
        console.log('Errors:', result.error.format());
    }
};

console.log('--- Test Matching ---');
test({ password: 'Password!123', confirmPassword: 'Password!123' });

console.log('\n--- Test Mismatch ---');
test({ password: 'Password!123', confirmPassword: 'wrong' });

console.log('\n--- Test Complex Fail ---');
test({ password: 'password', confirmPassword: 'password' });
