import type { PaymentStatus } from "../types/Ordertypes";

export const ESEWA_TEST_FORM_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
export const ESEWA_TEST_STATUS_URL = "https://rc.esewa.com.np/api/epay/transaction/status/";

export type EsewaPaymentRequest = {
  amount: number;
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
};

export type EsewaResponsePayload = {
  transaction_code?: string;
  status: string;
  total_amount: number | string;
  transaction_uuid: string;
  product_code: string;
  signed_field_names: string;
  signature: string;
};

export type EsewaStatusResponse = {
  product_code: string;
  transaction_uuid: string;
  total_amount: number;
  status: string;
  ref_id: string | null;
};

export type PendingEsewaOrderItem = {
  id: string;
  quantity: number;
};

export type PendingEsewaOrder = {
  items: PendingEsewaOrderItem[];
  shipping_address: string;
  transaction_uuid: string;
  total_amount: number;
  tax_amount: number;
  amount: number;
  product_delivery_charge: number;
  product_code: string;
};

export type EsewaPaymentInitInput = {
  amount: number;
  tax_amount: number;
  product_delivery_charge: number;
  product_service_charge?: number;
  product_code: string;
  success_url: string;
  failure_url: string;
  secret_key: string;
  transaction_uuid?: string;
};

export type EsewaVerificationResult = {
  responsePayload: EsewaResponsePayload;
  statusResponse: EsewaStatusResponse;
  paymentStatus: PaymentStatus;
};

const PENDING_ORDER_KEY = "esewa_pending_order";

const encodeBase64 = (buffer: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const createTransactionUuid = () => {
  // frontend
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${datePart}-${timePart}-${randomPart}`;
};

export const buildSignatureMessage = (
  signedFieldNames: string,
  payload: Record<string, unknown>, // backend
) =>
  signedFieldNames
    .split(",")
    .map((field) => `${field}=${payload[field] ?? ""}`)
    .join(",");

export const generateEsewaSignature = async (message: string, secretKey: string) => {
  //frontend
  const keyData = new TextEncoder().encode(secretKey);
  const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return encodeBase64(signatureBuffer);
};

export const submitEsewaPayment = (payload: EsewaPaymentRequest) => {
  // frontend
  const form = document.createElement("form");
  form.method = "POST";
  form.action = ESEWA_TEST_FORM_URL;

  Object.entries(payload).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

export const savePendingEsewaOrder = (pending: PendingEsewaOrder) => {
  window.localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pending));
};

export const loadPendingEsewaOrder = () => {
  const raw = window.localStorage.getItem(PENDING_ORDER_KEY);
  return raw ? (JSON.parse(raw) as PendingEsewaOrder) : null;
};

export const clearPendingEsewaOrder = () => {
  window.localStorage.removeItem(PENDING_ORDER_KEY);
};

export const decodeEsewaResponse = (encodedData: string): EsewaResponsePayload => {
  const normalized = encodedData.replace(/ /g, "+");
  const decoded = decodeURIComponent(normalized);
  const jsonString = atob(decoded);
  return JSON.parse(jsonString) as EsewaResponsePayload;
};

export const extractEsewaEncodedData = (search: string) => {
  const params = new URLSearchParams(search);
  const direct = params.get("data");
  if (direct) return direct;

  const match = search.match(/data=([^&]+)/);
  if (match?.[1]) return match[1];

  const esewaParam = params.get("esewa");
  if (esewaParam?.includes("data=")) {
    return esewaParam.split("data=")[1];
  }

  return null;
};

export const mapEsewaStatusToPaymentStatus = (status: string): PaymentStatus => {
  if (status === "COMPLETE") return "PAID";
  if (status === "PENDING") return "PENDING";
  return "FAILED";
};

export const verifyEsewaResponseSignature = async (response: EsewaResponsePayload, secretKey: string) => {
  const message = buildSignatureMessage(response.signed_field_names, response);
  const generatedSignature = await generateEsewaSignature(message, secretKey);
  return generatedSignature === response.signature;
};

export const createEsewaPaymentRequest = async (input: EsewaPaymentInitInput) => {
  const serviceCharge = input.product_service_charge ?? 0;
  const transactionUuid = input.transaction_uuid ?? createTransactionUuid();
  const amount = Number(input.amount.toFixed(2));
  const taxAmount = Number(input.tax_amount.toFixed(2));
  const deliveryCharge = Number(input.product_delivery_charge.toFixed(2));
  const totalAmount = Number((amount + taxAmount + deliveryCharge + serviceCharge).toFixed(2));
  const signedFieldNames = "total_amount,transaction_uuid,product_code";

  const signatureMessage = buildSignatureMessage(signedFieldNames, {
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: input.product_code,
  });

  const signature = await generateEsewaSignature(signatureMessage, input.secret_key);

  return {
    transaction_uuid: transactionUuid,
    total_amount: totalAmount,
    request: {
      amount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: input.product_code,
      product_service_charge: serviceCharge,
      product_delivery_charge: deliveryCharge,
      success_url: input.success_url,
      failure_url: input.failure_url,
      signed_field_names: signedFieldNames,
      signature,
    } satisfies EsewaPaymentRequest,
  };
};

export const fetchEsewaTransactionStatus = async (params: {
  product_code: string;
  total_amount: number | string;
  transaction_uuid: string;
}): Promise<EsewaStatusResponse> => {
  const baseUrl = import.meta.env.DEV ? "/esewa-status" : ESEWA_TEST_STATUS_URL;
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set("product_code", params.product_code);
  url.searchParams.set("total_amount", String(params.total_amount));
  url.searchParams.set("transaction_uuid", params.transaction_uuid);

  const response = await fetch(url.toString(), { method: "GET" });
  if (!response.ok) {
    throw new Error("Failed to verify transaction status");
  }
  return (await response.json()) as EsewaStatusResponse;
};

export const verifyEsewaPayment = async (encodedData: string, secretKey: string): Promise<EsewaVerificationResult> => {
  const responsePayload = decodeEsewaResponse(encodedData);
  const signatureValid = await verifyEsewaResponseSignature(responsePayload, secretKey);
  if (!signatureValid) {
    throw new Error("eSewa response signature verification failed.");
  }

  const statusResponse = await fetchEsewaTransactionStatus({
    product_code: responsePayload.product_code,
    total_amount: responsePayload.total_amount,
    transaction_uuid: responsePayload.transaction_uuid,
  });

  return {
    responsePayload,
    statusResponse,
    paymentStatus: mapEsewaStatusToPaymentStatus(statusResponse.status),
  };
};
