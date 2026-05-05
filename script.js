
// ── Preloader ──
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 2000);
});

// ── Countdown (persisted 90 days from first visit) ──
const STORAGE_KEY = 'virtus_launch_ts';
const pad = n => String(n).padStart(2, '0');
const now = Date.now();
let targetTs = localStorage.getItem(STORAGE_KEY);
if (targetTs) {
    targetTs = Number(targetTs);
    if (isNaN(targetTs) || targetTs <= now) {
        targetTs = now + 90 * 864e5;
        localStorage.setItem(STORAGE_KEY, String(targetTs));
    }
} else {
    targetTs = now + 90 * 864e5;
    localStorage.setItem(STORAGE_KEY, String(targetTs));
}
const target = new Date(targetTs);

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
