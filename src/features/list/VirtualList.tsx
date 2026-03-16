import React, { useRef } from 'react'
import { useVirtual } from './useVirtual'

type VirtualListProps<T> = {
  items: T[]
  itemHeight: number
  height: number
  overscan?: number
  renderRow: (item: T, index: number) => React.ReactNode
}

export const VirtualList = <T,>({
  items,
  itemHeight,
  height,
  overscan = 6,
  renderRow,
}: VirtualListProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { indices, offsetTop, totalHeight } = useVirtual({
    totalCount: items.length,
    itemHeight,
    overscan,
    containerRef,
  })

  return (
    <div className="virtual-container" ref={containerRef} style={{ height }}>
      <div className="virtual-spacer" style={{ height: totalHeight }}>
        <div className="virtual-window" style={{ transform: `translateY(${offsetTop}px)` }}>
          {indices.map((index) => (
            <div key={index} className="virtual-row" style={{ height: itemHeight }}>
              {renderRow(items[index], index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
