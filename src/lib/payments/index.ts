import { PayHereProvider } from "./payhere";

export function getPaymentProvider(name = "PAYHERE") {
  switch (name) {
    case "PAYHERE":
    default:
      return new PayHereProvider();
  }
}
