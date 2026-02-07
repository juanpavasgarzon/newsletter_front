import { useEffect } from 'react'

export const SEARCH_DEBOUNCE_MS = 280

export function useDebouncedSearchSync(
  inputValue: string,
  urlSearchValue: string,
  onSync: (value: string) => void,
  delay: number = SEARCH_DEBOUNCE_MS,
): void {
  useEffect(() => {
    if (inputValue === urlSearchValue) {
      return
    }
    const id = window.setTimeout(() => {
      onSync(inputValue)
    }, delay)
    return () => clearTimeout(id)
  }, [inputValue, urlSearchValue, onSync, delay])
}
