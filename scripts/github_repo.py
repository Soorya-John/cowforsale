"""Create the requested public repository using existing Git credentials only.

Credentials stay in process memory and are never printed or written to disk.
This helper does not publish GitHub Pages or push source.
"""
import json
import os
import subprocess
import urllib.request
import urllib.error

name = 'pashu-birthday'
env = dict(os.environ, GIT_TERMINAL_PROMPT='0', GCM_INTERACTIVE='never')
credential = subprocess.run(['git', 'credential', 'fill'], input='protocol=https\nhost=github.com\n\n', text=True, capture_output=True, env=env, check=True)
fields = dict(line.split('=', 1) for line in credential.stdout.splitlines() if '=' in line)
token = fields.get('password')
if not token:
    raise SystemExit('No existing GitHub credential available.')

def request(method, endpoint, data=None):
    req = urllib.request.Request('https://api.github.com' + endpoint, data=json.dumps(data).encode() if data is not None else None, method=method, headers={'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json', 'User-Agent': 'pashu-birthday-setup', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)

user = request('GET', '/user')['login']
try:
    repo = request('GET', f'/repos/{user}/{name}')
    if repo['private']:
        raise SystemExit('A private repository already exists under this name; no changes made.')
except urllib.error.HTTPError as error:
    if error.code != 404:
        raise
    repo = request('POST', '/user/repos', {'name': name, 'description': 'A deeply unserious, cow-themed birthday scrapbook for Nandini. Made with love and questionable judgement.', 'private': False, 'auto_init': False})
print(json.dumps({'html_url': repo['html_url'], 'clone_url': repo['clone_url'], 'private': repo['private']}))
