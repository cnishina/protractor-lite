import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as url from 'url';

import * as env from './env';

export class HttpServer {
  server: http.Server;
  /**
   * 
   * @param port 
   */
  createServer(port?: number) {
    process.setMaxListeners(20);
    port = port || env.httpPort as number;
    
    this.server = http.createServer(
            (request: http.IncomingMessage, response: http.ServerResponse) => {
              const uri = url.parse(request.url).pathname;
              let fileName = path.join(process.cwd(), uri);
    
              try {
                if (fs.statSync(fileName).isFile() ||
                    fs.statSync(fileName).isDirectory) {
                } else {
                  response.writeHead(404, {'Content-Type': 'text/plain'});
                  response.write('404 Not Found\n');
                  response.end();
                  return;
                }
              } catch (err) {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.write('404 Not Found\n');
                response.end();
                return;
              }
    
              if (fs.statSync(fileName).isDirectory()) {
                fileName += '/index.html';
              }
    
              fs.readFile(
                  fileName, 'binary', ((err, file) => {
                    if (err) {
                      response.writeHead(500, {'Content-Type': 'text/plain'});
                      response.write(err + '\n');
                      response.end();
                      return;
                    }
    
                    response.writeHead(
                        200, {'Content-Length': fs.statSync(fileName).size});
                    response.write(file, 'binary');
                    response.end();
                  }));
            })
        .listen(port);
  }

  closeServer() {
    this.server.close();
  }
}
