require('dotenv').config();

/**
 * Simple wrapper for eSewa configuration values.
 *
 * Environment variables expected:
 *   ESEWA_MERCHANT_CODE  - merchant identifier (scd)
 *   ESEWA_SECRET_KEY      - (optional) if you ever use the private key
 *   ESEWA_SUCCESS_URL     - URL where esewa will redirect on successful payment
 *   ESEWA_FAILURE_URL     - URL where esewa will redirect on failed/cancelled payment
 *
 * The `SUCCESS_URL` / `FAILURE_URL` values should point back to your backend
 * so that you can perform a verification call before considering the purchase
 * complete.  They are prefixed with `/apis/v1` to match how the router is
 * mounted in `index.js`.
 */

module.exports = {
  MERCHANT_CODE: process.env.ESEWA_MERCHANT_CODE || '',
  SECRET_KEY: process.env.ESEWA_SECRET_KEY || '',
  SUCCESS_URL:
    process.env.ESEWA_SUCCESS_URL ||
    'http://72.60.223.137:8000/apis/v1/payments/esewa/success',
  FAILURE_URL:
    process.env.ESEWA_FAILURE_URL ||
    'http://72.60.223.137:8000/apis/v1/payments/esewa/failure',
};
