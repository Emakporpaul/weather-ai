/**
 * Sidebar — left navigation rail, MSN-style.
 * Purely presentational tab state for now (Current is the only built view);
 * the others are visually present so the dashboard reads as complete,
 * and can be wired to real views later.
 */
const NAV_ITEMS = [
  { id: 'current', label: 'Current', icon: '☀️' },
  { id: 'hourly', label: 'Hourly', icon: '🕐' },
  { id: 'details', label: 'Details', icon: '📊' },
  { id: 'monthly', label: 'Monthly', icon: '📅' },
  { id: 'trends', label: 'Trends', icon: '📈' },
]

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="hidden md:flex flex-col w-44 shrink-0 bg-dash-panel border-r border-dash-border py-6 px-3 gap-1">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-left transition-colors
            ${active === item.id
              ? 'bg-dash-accent/15 text-dash-accent font-medium'
              : 'text-dash-muted hover:bg-white/5 hover:text-dash-text'}`}
        >
          <span className="text-base leading-none">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </aside>
  )
}
