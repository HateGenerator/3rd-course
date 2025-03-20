export function sanitizeHTML(str) {
    return str.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  }