import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';

/**
 * A simple HTTP server for testing browser functionality
 */
export class MockServer {
  private server: http.Server;
  private port: number;

  constructor(port = 0) {
    this.port = port;
    this.server = http.createServer(this.requestHandler.bind(this));
  }

  /**
   * Start the server
   * @returns Promise that resolves with the port number
   */
  async start(): Promise<number> {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        const address = this.server.address() as { port: number };
        this.port = address.port;
        console.log(`Mock server running at http://localhost:${this.port}/`);
        resolve(this.port);
      });
    });
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Get the URL of the server
   */
  getUrl(): string {
    return `http://localhost:${this.port}`;
  }

  /**
   * Handle HTTP requests
   */
  private requestHandler(req: http.IncomingMessage, res: http.ServerResponse): void {
    const url = req.url || '/';
    
    // Basic routing
    if (url === '/' || url === '/index.html') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Browser Test Page</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .container { max-width: 800px; margin: 0 auto; }
              button { padding: 10px 15px; margin: 10px 0; cursor: pointer; }
              input { padding: 8px; width: 300px; margin: 10px 0; }
              .result { margin-top: 20px; padding: 10px; border: 1px solid #ddd; min-height: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Browser Test Page</h1>
              <p>This page is used for testing browser functionality.</p>
              
              <h2>Click Test</h2>
              <button id="clickButton">Click Me</button>
              <div id="clickResult" class="result"></div>
              
              <h2>Type Test</h2>
              <input id="typeInput" type="text" placeholder="Type something here...">
              <div id="typeResult" class="result"></div>
              
              <script>
                // Click test
                document.getElementById('clickButton').addEventListener('click', function() {
                  document.getElementById('clickResult').textContent = 'Button was clicked at ' + new Date().toISOString();
                });
                
                // Type test
                document.getElementById('typeInput').addEventListener('input', function(e) {
                  document.getElementById('typeResult').textContent = 'Current text: ' + e.target.value;
                });
                
                // Log for testing
                console.log('Test page loaded successfully');
              </script>
            </div>
          </body>
        </html>
      `);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  }
}