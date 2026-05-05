
// ── Preloader ──
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 2000);
});

// ── Countdown (fixed launch: August 19, 2026) ──
const pad = n => String(n).padStart(2, '0');
const target = new Date('2026-08-19T00:00:00');

function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
        document.getElementById('cd-d').textContent = '00';
        document.getElementById('cd-h').textContent = '00';
        document.getElementById('cd-m').textContent = '00';
        document.getElementById('cd-s').textContent = '00';
        return;
    }
    document.getElementById('cd-d').textContent = pad(Math.floor(diff / 864e5));
    document.getElementById('cd-h').textContent = pad(Math.floor(diff % 864e5 / 36e5));
    document.getElementById('cd-m').textContent = pad(Math.floor(diff % 36e5 / 6e4));
    document.getElementById('cd-s').textContent = pad(Math.floor(diff % 6e4 / 1e3));
}
tick(); setInterval(tick, 1000);

// ── Email form ──
// ⚠️ Replace this URL after deploying the worker with: wrangler deploy
// const WORKER_URL = 'https://virtus-subscribe.<YOUR_SUBDOMAIN>.workers.dev';
const WORKER_URL = 'https://virtus-subscribe.virtus-engineeringco.workers.dev';

async function submit() {
    const inp = document.getElementById('email');
    const btn = document.getElementById('notify');
    const emailVal = inp.value.trim();

    // Client-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        inp.focus();
        inp.style.background = 'rgba(239,68,68,0.05)';
        setTimeout(() => inp.style.background = '', 700);
        return;
    }

    // Loading state
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    inp.disabled = true;

    try {
        const res = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailVal }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.detail || data.error || 'Subscription failed');
        }

        // Success
        btn.textContent = '✓ Done';
        document.getElementById('success').classList.add('show');
        inp.value = '';
    } catch (err) {
        console.error('Subscribe error:', err);
        btn.textContent = originalText;
        btn.disabled = false;
        inp.disabled = false;
        inp.style.background = 'rgba(239,68,68,0.05)';
        setTimeout(() => inp.style.background = '', 1500);
    }
}
document.getElementById('notify').addEventListener('click', submit);
document.getElementById('email').addEventListener('keydown', e => e.key === 'Enter' && submit());
