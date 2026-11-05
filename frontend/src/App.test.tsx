// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function setup() { render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><App/></QueryClientProvider>); }
it('shows a friendly error after submitting a symbol', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: { code: 'SYMBOL_NOT_FOUND', message: 'Symbol not found.' } }) }));
  setup(); fireEvent.change(screen.getByLabelText('Stock symbol'), { target: { value: 'bad' } }); fireEvent.click(screen.getByText(/View summary/));
  expect(await screen.findByRole('alert')).toHaveTextContent('Symbol not found.');
});
it('shows the no-data state for an empty response', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ symbol: 'AAPL', data: [] }) }));
  setup(); fireEvent.change(screen.getByLabelText('Stock symbol'), { target: { value: 'aapl' } }); fireEvent.click(screen.getByText(/View summary/));
  expect(await screen.findByText('No data available')).toBeTruthy();
});
