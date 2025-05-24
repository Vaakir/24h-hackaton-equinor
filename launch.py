import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

def launch_game_server():
    PORT = 8001
    DIRECTORY = 'game'

    game_dir = Path(__file__).parent / DIRECTORY
    os.chdir(game_dir)

    Handler = http.server.SimpleHTTPRequestHandler

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving game at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server")

        webbrowser.open(f'http://localhost:{PORT}')

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.shutdown()

if __name__ == "__main__":
    launch_game_server()