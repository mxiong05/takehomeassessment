import { useState, type FormEvent } from 'react';
export function SymbolForm({ onSubmit }: { onSubmit: (symbol: string) => void }) {
  const [value, setValue] = useState('');
  function submit(event: FormEvent) { event.preventDefault(); onSubmit(value.trim().toUpperCase()); }
  return <form onSubmit={submit}><label htmlFor="symbol">Stock symbol</label><div className="search"><input id="symbol" value={value} onChange={e => setValue(e.target.value.toUpperCase())} placeholder="e.g. AAPL" autoComplete="off" required /><button type="submit">View summary <span aria-hidden="true">→</span></button></div><p className="hint">Enter a ticker symbol to explore the past month.</p></form>;
}
