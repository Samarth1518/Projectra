/**
 * Pre-process AI responses for consistent rendering
 */
export function formatResponse(text) {
  if (!text) return ''

  // Normalize line endings
  let formatted = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Ensure code blocks have proper spacing
  formatted = formatted.replace(/```(\w*)\n/g, '```$1\n')

  // Remove excessive blank lines (more than 2 consecutive)
  formatted = formatted.replace(/\n{3,}/g, '\n\n')

  return formatted.trim()
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
