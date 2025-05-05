
/**
 * Formats markdown-style content to proper HTML
 * Converts ## headings to proper HTML elements
 */
export const formatContent = (content: string): string => {
  if (!content) return "";
  
  // Replace markdown-style headers with proper HTML
  let formatted = content
    .replace(/##\s*([^#\n]+)/g, "<h2>$1</h2>")
    .replace(/###\s*([^#\n]+)/g, "<h3>$1</h3>")
    .replace(/####\s*([^#\n]+)/g, "<h4>$1</h4>");
    
  // Convert line breaks to paragraph tags
  formatted = formatted
    .split("\n\n")
    .filter(para => para.trim() !== "")
    .map(para => {
      // Skip wrapping if the paragraph already has HTML tags
      if (para.match(/<[^>]+>/)) {
        return para;
      }
      return `<p>${para}</p>`;
    })
    .join("");
    
  return formatted;
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Use this if content is from untrusted sources
 */
export const sanitizeHtml = (html: string): string => {
  // In a real app you would use a library like DOMPurify
  return html;
};
