import Swal from "sweetalert2";
import "./../App.css";

const brand = {
  green: "#2D6A4F",
  mid: "#40916C",
  danger: "#C0392B",
};

const brandClasses = {
  container: "swal-container-class",
  popup: "aludoh-swal-popup",
  title: "aludoh-swal-title",
  htmlContainer: "aludoh-swal-text",
  actions: "aludoh-swal-actions",
  confirmButton: "aludoh-swal-confirm",
  denyButton: "aludoh-swal-deny",
  cancelButton: "aludoh-swal-cancel",
  timerProgressBar: "aludoh-swal-progress",
};

const BrandSwal = Swal.mixin({
  customClass: brandClasses,
  buttonsStyling: false,
  showClass: { popup: "aludoh-swal-show" },
  hideClass: { popup: "aludoh-swal-hide" },
});

export const showLoading = (message = "Please wait...") => {
  BrandSwal.fire({
    titleText: message,
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoading = () => {
  Swal.close();
};

export const showSuccess = (message) => {
  BrandSwal.fire({
    icon: "success",
    iconColor: brand.mid,
    titleText: message,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });
};

const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );

/** Rich success dialog: title, supporting text and an optional footnote. */
export const showThankYou = ({ title, text, note, confirmText = "Done" }) =>
  BrandSwal.fire({
    icon: "success",
    iconColor: brand.mid,
    titleText: title,
    html: `<p>${escapeHtml(text)}</p>${
      note ? `<span class="aludoh-swal-note">${escapeHtml(note)}</span>` : ""
    }`,
    confirmButtonText: confirmText,
    timer: 7000,
    timerProgressBar: true,
    didOpen: (popup) => {
      popup.addEventListener("mouseenter", Swal.stopTimer);
      popup.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

export const showError = (message) => {
  BrandSwal.fire({
    icon: "error",
    iconColor: brand.danger,
    title: "Something went wrong",
    text: message,
    confirmButtonText: "OK",
  });
};

/** Error dialog offering an alternative channel. Resolves true if the alternative was chosen. */
export const showErrorWithAlternative = async ({ title, message, alternativeText }) => {
  const result = await BrandSwal.fire({
    icon: "warning",
    iconColor: "#D4A017",
    titleText: title,
    text: message,
    showDenyButton: true,
    confirmButtonText: alternativeText,
    denyButtonText: "Try again later",
    reverseButtons: false,
  });
  return result.isConfirmed;
};

export const showWarning = (message) => {
  BrandSwal.fire({
    icon: "warning",
    iconColor: "#D4A017",
    title: "Please check",
    text: message,
    confirmButtonText: "OK",
  });
};

export const showConfirm = async (message) => {
  const result = await BrandSwal.fire({
    icon: "question",
    iconColor: brand.green,
    title: "Confirm",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });
  return result.isConfirmed;
};
