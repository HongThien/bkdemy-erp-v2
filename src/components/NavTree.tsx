import { useState } from 'react'
import type { NavGroup, NavLeaf } from '../types'

function LeafItem({
  leaf,
  depth,
  selected,
  onSelect,
  open,
  toggle,
}: {
  leaf: NavLeaf
  depth: number
  selected: string
  onSelect: (id: string) => void
  open: Set<string>
  toggle: (id: string) => void
}) {
  const hasKids = !!leaf.children?.length
  const isOpen = open.has(leaf.id)
  return (
    <li>
      <button
        onClick={() => (hasKids ? toggle(leaf.id) : onSelect(leaf.id))}
        className={`flex w-full items-center gap-1 rounded py-1.5 pr-2 text-left ${
          selected === leaf.id ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'
        }`}
        style={{ paddingLeft: 8 + depth * 14 }}
      >
        <span className="w-3 text-[10px] text-slate-400">{hasKids ? (isOpen ? '▾' : '▸') : ''}</span>
        <span>{leaf.ten}</span>
      </button>
      {hasKids && isOpen && (
        <ul className="space-y-0.5">
          {leaf.children!.map((c) => (
            <LeafItem key={c.id} leaf={c} depth={depth + 1} selected={selected} onSelect={onSelect} open={open} toggle={toggle} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function NavTree({
  groups,
  selected,
  onSelect,
}: {
  groups: NavGroup[]
  selected: string
  onSelect: (id: string) => void
}) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  // Nhóm: mặc định MỞ hết; click tiêu đề để thu (kiểu Explorer). Lưu set các nhóm ĐÃ THU.
  const [closedGroups, setClosedGroups] = useState<Set<string>>(new Set())
  const toggle = (id: string) =>
    setOpen((p) => {
      const n = new Set(p)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const toggleGroup = (nhom: string) =>
    setClosedGroups((p) => {
      const n = new Set(p)
      n.has(nhom) ? n.delete(nhom) : n.add(nhom)
      return n
    })

  return (
    <nav className="text-sm">
      {groups.map((g, i) => {
        const key = g.nhom ?? `_${i}`
        const closed = closedGroups.has(key)
        // nhóm đang chứa leaf được chọn thì đánh dấu nhẹ để biết "mình đang ở đâu" khi thu
        const holdsSelected = g.leaves.some((l) => l.id === selected || l.children?.some((c) => c.id === selected))
        return (
          <div key={key} className="mb-1.5">
            {g.nhom ? (
              <button
                onClick={() => toggleGroup(key)}
                className="flex w-full items-center gap-1 rounded px-2 py-1 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <span className="w-3 text-[10px]">{closed ? '▸' : '▾'}</span>
                <span>{g.nhom}</span>
                {closed && holdsSelected && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />}
              </button>
            ) : null}
            {!closed && (
              <ul className="space-y-0.5">
                {g.leaves.map((l) => (
                  <LeafItem key={l.id} leaf={l} depth={g.nhom ? 1 : 0} selected={selected} onSelect={onSelect} open={open} toggle={toggle} />
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </nav>
  )
}
