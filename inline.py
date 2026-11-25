import re, pathlib
d = pathlib.Path('dist')
html = (d / 'index.html').read_text()
def js(m):
    code = (d / m.group(1).lstrip('./')).read_text()
    assert '</script' not in code.lower(), 'script tag inside bundle'
    return '<script type="module">' + code + '</script>'
def css(m):
    return '<style>' + (d / m.group(1).lstrip('./')).read_text() + '</style>'
html = re.sub(r'<script type="module" crossorigin src="([^"]+)"></script>', js, html)
html = re.sub(r'<link rel="stylesheet" crossorigin href="([^"]+)">', css, html)
assert 'src="./assets' not in html and 'href="./assets' not in html
(d / 'index.html').write_text(html)
print('inlined', len(html), 'bytes')
