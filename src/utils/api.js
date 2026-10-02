import { fetchWithTimeout } from "./fetchWithTimeout";

const OFFLINE_MESSAGE =
  "We couldn't reach our server right now. Please try again shortly, or contact us directly on WhatsApp or phone.";

const offlineError = () => {
  const error = new Error(OFFLINE_MESSAGE);
  error.offline = true;
  return error;
};

const request = async (path, options, fallbackMessage) => {
  let response;
  try {
    response = await fetchWithTimeout(path, options, 15000);
  } catch {
    throw offlineError();
  }

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  // The dev proxy answers with an empty/non-JSON 5xx when the API is down.
  if (!data) {
    if (response.status >= 500 || response.status === 0) throw offlineError();
    throw new Error(fallbackMessage);
  }
  if (!response.ok || data.success === false) {
    throw new Error(data.message || fallbackMessage);
  }
  return data;
};

export const apiGet = (path) =>
  request(path, { headers: { Accept: "application/json" } }, "Failed to load data");

export const apiPost = (path, body) =>
  request(
    path,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    },
    "Request failed"
  );

export const mediaUrl = (value) => {
  if (!value) return "";
  if (value.startsWith("http") || value.startsWith("/")) return value;
  return `/uploads/${value}`;
};
