import sys
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from graph import stream_portfolio_chat


def run_chat_query(query: str, session_id: str = "default_session"):
    for chunk in stream_portfolio_chat(query, session_id):
        print(f"data: {json.dumps(chunk)}", flush=True)
    print("data: [DONE]", flush=True)


class AIStreamHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Keep stdout/stderr clean

    def do_GET(self):
        if self.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status":"ok"}')
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        if self.path != "/stream":
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
        try:
            payload = json.loads(body)
        except Exception:
            payload = {}

        query = str(payload.get("message", "")).strip()
        session_id = str(payload.get("sessionId", "default_session"))

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Connection", "close")
        self.end_headers()

        try:
            for chunk in stream_portfolio_chat(query, session_id):
                line = f"data: {json.dumps(chunk)}\n\n".encode("utf-8")
                self.wfile.write(line)
                self.wfile.flush()
            self.wfile.write(b"data: [DONE]\n\n")
            self.wfile.flush()
        except BrokenPipeError:
            pass
        except Exception as e:
            print(f"[AIStreamHandler] Error: {e}", file=sys.stderr)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--serve":
        port = int(sys.argv[2]) if len(sys.argv) > 2 else 5001
        server = ThreadingHTTPServer(("127.0.0.1", port), AIStreamHandler)
        print(f"Python LangGraph AI Server listening on http://127.0.0.1:{port}", file=sys.stderr, flush=True)
        server.serve_forever()
    elif len(sys.argv) > 1:
        query_text = sys.argv[1]
        session_id = sys.argv[2] if len(sys.argv) > 2 else "cli_session"
        run_chat_query(query_text, session_id)
    else:
        raw_input = sys.stdin.read().strip()
        if raw_input:
            try:
                data = json.loads(raw_input)
                run_chat_query(data.get("message", ""), data.get("sessionId", "session_stdin"))
            except Exception:
                run_chat_query(raw_input)
