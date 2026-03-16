import { useEffect, useMemo, useState } from 'react'

type VirtualConfig = {
  totalCount: number
  itemHeight: number
  overscan: number
  containerRef: React.RefObject<HTMLElement>
}

type VirtualState = {
  startIndex: number
  endIndex: number
  offsetTop: number
  totalHeight: number
}

export const useVirtual = ({
  totalCount,
  itemHeight,
  overscan,
  containerRef,
}: VirtualConfig) => {
  const [state, setState] = useState<VirtualState>({
    startIndex: 0,
    endIndex: Math.max(0, Math.min(totalCount - 1, 10)),
    offsetTop: 0,
    totalHeight: totalCount * itemHeight,
  })

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const calculate = () => {
      const scrollTop = node.scrollTop
      const viewHeight = node.clientHeight
      const rawStart = Math.floor(scrollTop / itemHeight) - overscan
      const rawEnd = Math.ceil((scrollTop + viewHeight) / itemHeight) + overscan

      const startIndex = Math.max(0, rawStart)
      const endIndex = Math.min(totalCount - 1, rawEnd)
      const offsetTop = startIndex * itemHeight

      setState({
        startIndex,
        endIndex,
        offsetTop,
        totalHeight: totalCount * itemHeight,
      })
    }

    calculate()
    node.addEventListener('scroll', calculate)
    window.addEventListener('resize', calculate)

    return () => {
      node.removeEventListener('scroll', calculate)
      window.removeEventListener('resize', calculate)
    }
  }, [containerRef, itemHeight, overscan, totalCount])

  const indices = useMemo(() => {
    if (totalCount === 0) return []
    const length = Math.max(0, state.endIndex - state.startIndex + 1)
    return Array.from({ length }, (_, idx) => state.startIndex + idx)
  }, [state.endIndex, state.startIndex, totalCount])

  return {
    ...state,
    indices,
  }
}
