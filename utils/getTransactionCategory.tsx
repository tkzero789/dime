export default function getTransactionCategory(category: string) {
  if (
    ["car payment", "credit card payment", "insurance", "loan"].includes(
      category,
    )
  ) {
    return "bg-amber-300 text-amber-700";
  } else if (
    [
      "Budget Expense",
      "monthly subscription",
      "single payment",
      "budget expense",
    ].includes(category)
  ) {
    return "bg-sky-300 text-sky-700";
  } else if (["mortgage", "rent", "bill and utilities"].includes(category)) {
    return "bg-pink-300 text-pink-700";
  } else {
    return "bg-green-300 text-green-700";
  }
}
