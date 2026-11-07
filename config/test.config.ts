import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const testConfig = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  users: {
    standard: process.env.STANDARD_USER || 'standard_user',
    lockedOut: process.env.LOCKED_OUT_USER || 'locked_out_user',
    problem: process.env.PROBLEM_USER || 'problem_user',
    performanceGlitch: process.env.PERFORMANCE_GLITCH_USER || 'performance_glitch_user',
    error: process.env.ERROR_USER || 'error_user',
    visual: process.env.VISUAL_USER || 'visual_user',
    password: process.env.PASSWORD || 'secret_sauce',
    invalidUser: process.env.INVALID_USER || 'harikarang28@gmail.com',
    invalidPassword: process.env.INVALID_PASSWORD || 'Test@123',
  },
  timeouts: {
    actionTimeout: 10000,
    navigationTimeout: 30000,
    assertionTimeout: 10000,
  },
};
