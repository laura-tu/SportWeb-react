import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
  headers: string[]
  selected: string | null
  setSelected: (header: string) => void
}

const SelectableHeaderList: React.FC<Props> = ({ headers, selected, setSelected }) => {
  return (
    <ScrollArea className="h-[21rem] w-full p-2">
      <div className="flex flex-col gap-2">
        {headers.map((header, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(header)}
            className={`text-sm text-left px-3 py-1 rounded-md transition ${
              selected === header
                ? 'bg-blue-900 text-white font-semibold shadow'
                : 'bg-white hover:bg-gray-200'
            }`}
          >
            {header}
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}

export default SelectableHeaderList
