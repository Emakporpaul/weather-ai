/**
 * Sidebar — left nav rail on desktop, slide-in drawer on mobile.
 * Accepts isOpen + onClose for mobile drawer behavior.
 */
const NAV_ITEMS = [
  { id: 'current', label: 'Current', icon: '☀️' },
  { id: 'hourly', label: 'Hourly', icon: '🕐' },
  { id: 'details', label: 'Details', icon: '📊' },
  { id: 'monthly', label: 'Monthly', icon: '📅' },
  { id: 'trends', label: 'Trends', icon: '📈' },
]

export default function Sidebar({ active, onSelect, isOpen, onClose }) {
  function handleSelect(id) {
    onSelect(id)
    onClose?.()  // close drawer on mobile after selecting
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — always visible on md+, drawer on mobile */}
      <aside className={`
        fixed md:static top-0 left-0 h-full z-30
        flex flex-col w-52 shrink-0 bg-dash-panel border-r border-dash-border py-6 px-3 gap-1
        transition-transform duration-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Mobile drawer header */}
        <div className="flex items-center justify-between mb-4 md:hidden px-2">
          <span className="font-display text-sm font-medium text-dash-text">Menu</span>
          <button onClick={onClose} aria-label="Close menu" className="text-dash-muted p-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
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
    </>
  )
}
