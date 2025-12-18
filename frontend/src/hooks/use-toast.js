export function useToast() {
  function toast({ title, description, variant }) {
    // Minimal toast: log and optionally show alert for destructive
    console.log('TOAST', title, description, variant)
    if (variant === 'destructive') {
      // show a non-blocking alert fallback
      try {
        // keep it non-blocking in UI; developers can implement a nicer toast later
        setTimeout(() => alert(`${title}: ${description}`), 10)
      } catch (e) {
        // ignore
      }
    }
  }

  return { toast }
}

export default useToast
