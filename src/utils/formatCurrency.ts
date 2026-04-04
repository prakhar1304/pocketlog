/** Amounts in the store are whole rupees (integer). */
export function formatCurrency(amountRupees: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amountRupees));
}

export function formatSignedCurrency(
  amountRupees: number,
  type: "income" | "expense"
): string {
  const n = Math.abs(Math.round(amountRupees));
  const num = new Intl.NumberFormat("en-IN").format(n);
  if (type === "income") return `+₹${num}`;
  return `−₹${num}`;
}
