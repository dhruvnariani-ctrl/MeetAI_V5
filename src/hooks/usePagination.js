import { useEffect, useState } from 'react'

/* Client-side pagination shared by lists and tables. Resets when items or resetKey changes. */
export default function usePagination(items, pageSize, resetKey = '') {
  const [state, setState] = useState({ page: 1, items, resetKey })
  const isCurrent = state.items === items && state.resetKey === resetKey
  const page = isCurrent ? state.page : 1

  useEffect(() => {
    setState((current) =>
      current.items === items && current.resetKey === resetKey
        ? current
        : { page: 1, items, resetKey },
    )
  }, [items, resetKey])

  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(page, 1), pageCount)
  const start = (current - 1) * pageSize

  return {
    page: current,
    pageCount,
    total,
    from: total ? start + 1 : 0,
    to: Math.min(start + pageSize, total),
    pageItems: items.slice(start, start + pageSize),
    setPage: (nextPage) => {
      const requested =
        typeof nextPage === 'function' ? nextPage(current) : nextPage

      setState({
        page: Math.min(Math.max(requested, 1), pageCount),
        items,
        resetKey,
      })
    },
  }
}