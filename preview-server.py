#!/usr/bin/env python3
"""
PAIRDEN — local preview server.

Python's built-in http.server only serves files that literally exist, so every
clean URL on this site (/frontdesk, /es/faq, ...) 404s locally even though it
works fine on Netlify. This server emulates the rules in netlify.toml so that
what you test locally is what ships.

What it emulates:
  · clean-URL rewrites   /frontdesk      -> frontdesk.html      (200, same as Netlify)
  · booking redirects    /book           -> GHL calendar        (302)
                         /es/reservar    -> GHL calendar        (302)
  · plan short links     /growth         -> /?plan=growth       (302)
                         /foundation, /frontoffice
  · demo short link      /demo           -> /frontdesk          (302)
  · 404 fallback         unknown path    -> 404.html

It does NOT emulate: the axismarketingai.net 301 block (host-level, needs real
DNS) or the security headers. Those are Netlify-only and untestable here.

Usage:
    cd ~/Desktop/pairden-site-v2-setup/marketing-site
    python3 preview-server.py
    # then open http://localhost:8099   (Ctrl+C to stop)

This file is a dev tool. Netlify ignores it — it is never served or executed
in production.
"""

import http.server
import os
import socketserver
import sys
from urllib.parse import urlparse

PORT = 8099

# Single source of truth, mirrored from netlify.toml.
BOOKING_URL = "https://api.leadconnectorhq.com/widget/booking/GICmHjNXus2auxqe65re"

REDIRECTS = {
    "/book":        BOOKING_URL,
    "/es/reservar": BOOKING_URL,
    "/growth":      "/?plan=growth",
    "/foundation":  "/?plan=foundation",
    "/frontoffice": "/?plan=frontoffice",
    "/demo":        "/frontdesk",
}


class PairdenPreviewHandler(http.server.SimpleHTTPRequestHandler):
    """Serves the site the way Netlify will."""

    def do_GET(self):
        if self._handle_redirect():
            return
        self._rewrite_clean_url()
        super().do_GET()

    def do_HEAD(self):
        if self._handle_redirect():
            return
        self._rewrite_clean_url()
        super().do_HEAD()

    # ── Netlify emulation ──────────────────────────────────────────

    def _handle_redirect(self):
        """302 for booking + short links. Returns True if handled."""
        path = urlparse(self.path).path
        key = path.rstrip("/") or "/"

        target = REDIRECTS.get(key)
        if target is None:
            return False

        self.send_response(302)
        self.send_header("Location", target)
        self.send_header("Content-Length", "0")
        self.end_headers()
        sys.stderr.write(f"  ↪ 302  {path}  ->  {target}\n")
        return True

    def _rewrite_clean_url(self):
        """/frontdesk -> /frontdesk.html when that file exists (Netlify 200 rewrite)."""
        parsed = urlparse(self.path)
        path = parsed.path

        # Leave alone: root, directories, and anything already carrying an extension.
        if path.endswith("/") or os.path.splitext(path)[1]:
            return

        candidate = self.translate_path(path) + ".html"
        if os.path.isfile(candidate):
            rebuilt = path + ".html"
            if parsed.query:
                rebuilt += "?" + parsed.query
            self.path = rebuilt

    def send_error(self, code, message=None, explain=None):
        """Serve the real 404.html instead of Python's plain-text error page."""
        if code == 404:
            page = os.path.join(os.getcwd(), "404.html")
            if os.path.isfile(page):
                try:
                    with open(page, "rb") as fh:
                        body = fh.read()
                except OSError:
                    pass
                else:
                    self.send_response(404)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.send_header("Content-Length", str(len(body)))
                    self.end_headers()
                    if self.command != "HEAD":
                        self.wfile.write(body)
                    return
        super().send_error(code, message, explain)


def main():
    root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root)

    if not os.path.isfile("index.html"):
        sys.exit(f"ERROR: no index.html in {root}\nRun this from the repo root.")

    socketserver.TCPServer.allow_reuse_address = True
    try:
        server = socketserver.TCPServer(("", PORT), PairdenPreviewHandler)
    except OSError as err:
        sys.exit(
            f"ERROR: could not bind port {PORT} ({err}).\n"
            f"Another server is probably still running — close that Terminal tab,\n"
            f"or run:  lsof -ti:{PORT} | xargs kill"
        )

    print(f"""
╔══════════════════════════════════════════════════════════════╗
║  PAIRDEN preview  ·  http://localhost:{PORT}                   ║
╚══════════════════════════════════════════════════════════════╝

  Serving: {root}

  English   /            /frontdesk   /faq
            /tools       /privacy     /terms
  Spanish   /es/         /es/frontdesk  /es/faq
            /es/privacidad            /es/terminos
  Booking   /book        /es/reservar     -> GHL calendar (302)
  Plans     /growth      /foundation      /frontoffice
  Demo      /demo        -> /frontdesk

  Ctrl+C to stop.
""")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        server.server_close()


if __name__ == "__main__":
    main()
