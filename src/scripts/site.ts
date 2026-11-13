// Small behaviour for the starter site: the phone menu and the contact form's checks.

const button = document.querySelector<HTMLButtonElement>('.menu-button');
const nav = document.getElementById('site-nav');
function setMenu(open: boolean) {
	if (!button || !nav) return;
	button.setAttribute('aria-expanded', String(open));
	button.textContent = open ? 'Close' : 'Menu';
	nav.dataset.open = String(open);
}
button?.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
nav?.addEventListener('click', (e) => {
	if ((e.target as Element).closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') setMenu(false);
});

const form = document.querySelector<HTMLFormElement>('#contact-form');
const checks: Record<string, (v: string) => boolean> = {
	name: (v) => v.trim().length > 0,
	email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
	message: (v) => v.trim().length > 0,
};
function check(field: HTMLInputElement | HTMLTextAreaElement): boolean {
	const ok = checks[field.name](field.value);
	field.setAttribute('aria-invalid', String(!ok));
	document.getElementById(`${field.name}-error`)!.hidden = ok;
	return ok;
}
if (form) {
	const fields = Object.keys(checks).map((n) => form.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement);
	// Clear a field's message as soon as it is fixed (while typing), so nothing jumps when Send is pressed.
	fields.forEach((f) => f.addEventListener('input', () => f.getAttribute('aria-invalid') === 'true' && check(f)));
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const bad = fields.filter((f) => !check(f));
		if (bad.length) return bad[0].focus();
		// To really send it, post new FormData(form) to your form service or an Astro API route here.
		form.reset();
		document.getElementById('form-sent')!.hidden = false;
	});
}
