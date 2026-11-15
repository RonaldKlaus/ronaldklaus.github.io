"""Set ?v=<hash> on card.css/card.js in both pages. Run after changing CSS or JS: python3 scripts/bump-assets.py"""
import hashlib, re, sys
root = sys.argv[1] if len(sys.argv) > 1 else "."
h = {f: hashlib.sha256(open(f'{root}/{f}', 'rb').read()).hexdigest()[:8] for f in ('css/card.css', 'js/card.js')}
for p in ('index.html', 'de/index.html'):
    s = open(f'{root}/{p}', encoding='utf-8').read()
    for f, v in h.items():
        s, n = re.subn(r'/' + re.escape(f) + r'(\?v=[0-9a-f]+)?"', f'/{f}?v={v}"', s)
        assert n == 1, (p, f, n)
    open(f'{root}/{p}', 'w', encoding='utf-8').write(s)
print(h)
