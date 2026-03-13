export function isMockCheckoutEnabled() {
  return process.env.ALLOW_MOCK_CHECKOUT?.trim() === "true";
}
