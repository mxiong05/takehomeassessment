import type { DailySummary } from '../types';
const price = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
export function SummaryTable({ data }: { data: DailySummary[] }) { return <div className="table-wrap"><table><thead><tr><th>Date</th><th>Average low</th><th>Average high</th><th>Volume</th></tr></thead><tbody>{data.map(row => <tr key={row.day}><td>{row.day}</td><td>{price(row.lowAverage)}</td><td>{price(row.highAverage)}</td><td>{row.volume.toLocaleString('en-US')}</td></tr>)}</tbody></table></div>; }
