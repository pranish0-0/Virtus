
// ── Preloader ──
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 2000);
});

// ── Countdown (90 days from page load) ──
const target = new Date(Date.now() + 90 * 864e5);
const pad = n => String(n).padStart(2, '0');
function tick() {
    const diff = target - Date.now();
    if (diff <= 0) return;
    document.getElementById('cd-d').textContent = pad(Math.floor(diff / 864e5));
    document.getElementById('cd-h').textContent = pad(Math.floor(diff % 864e5 / 36e5));
    document.getElementById('cd-m').textContent = pad(Math.floor(diff % 36e5 / 6e4));
    document.getElementById('cd-s').textContent = pad(Math.floor(diff % 6e4 / 1e3));
}
tick(); setInterval(tick, 1000);

// ── Email form ──
function submit() {
    const inp = document.getElementById('email');
    const btn = document.getElementById('notify');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) {
        inp.focus();
        inp.style.background = 'rgba(239,68,68,0.05)';
        setTimeout(() => inp.style.background = '', 700);
        return;
    }
    btn.textContent = '✓ Done'; btn.disabled = true; inp.disabled = true;
    document.getElementById('success').classList.add('show');
    inp.value = '';
}
document.getElementById('notify').addEventListener('click', submit);
document.getElementById('email').addEventListener('keydown', e => e.key === 'Enter' && submit());
