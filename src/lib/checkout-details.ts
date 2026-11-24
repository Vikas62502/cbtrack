export type SavedCheckout = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
};

const KEY = "cb-checkout-details";

export function loadCheckoutDetails(): SavedCheckout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedCheckout) : null;
  } catch {
    return null;
  }
}

export function saveCheckoutDetails(details: SavedCheckout) {
  try {
    localStorage.setItem(KEY, JSON.stringify(details));
  } catch {
    /* ignore */
  }
}

export function saveLastOrder(orderId: string, phone: string) {
  try {
    sessionStorage.setItem("cb-last-order", orderId);
    sessionStorage.setItem("cb-last-phone", phone);
  } catch {
    /* ignore */
  }
}
