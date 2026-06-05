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
  const toggle = (id: string) =>
    setOpen((p) => {
      const n = new Set(p)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  return (
    <nav className="text-sm">
      {groups.map((g, i) => (
        <div key={g.nhom ?? `_${i}`} className="mb-3">
          {g.nhom && (
            <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {g.nhom}
            </div>
          )}
          <ul className="space-y-0.5">
            {g.leaves.map((l) => (
              <LeafItem key={l.id} leaf={l} depth={0} selected={selected} onSelect={onSelect} open={open} toggle={toggle} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
