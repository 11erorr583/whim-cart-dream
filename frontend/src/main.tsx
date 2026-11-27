import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  const [status, setStatus] = useState('Checking service…');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/v1/health', {signal: controller.signal})
      .then(r => { if (!r.ok) throw new Error('Unavailable'); return r.json(); })
      .then(data => setStatus(data.status === 'ok' ? 'Service connected' : 'Service unavailable'))
      .catch(() => { if (!controller.signal.aborted) setStatus('Service unavailable'); });
    return () => controller.abort();
  }, []);
  return <><header><a href="/">WHIM CART DREAM</a><span>Virtual retail</span></header><main><p className="eyebrow">A new shopping experience</p><h1>Explore freely.<br/>Spend virtually.</h1><p>A virtual shopping destination is under construction. No real money is charged and no physical goods are delivered.</p><section aria-label="Development status"><h2>Our doors are not open yet.</h2><p role="status">{status}</p></section></main><footer>Whim Cart Dream · Simulated shopping only</footer></>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
