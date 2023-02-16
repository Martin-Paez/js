const PING_INTERVAL = 1000;

export class WSConsole {
    constructor() {
        this.connect();
    }

    connect() {
        this.write('Conectando...');
        this.socket !== undefined && this.socket.close();
        this.socket = new WebSocket('ws://192.168.0.14:8080'); 
        this.socket.onmessage = (e) => { this.write(e.data); }; 
        this.socket.onclose = (e) => { this.connect(); };
        setInterval(() => { this.ping() }, PING_INTERVAL);
    }

    send(msg) { 
        if (this.socket.readyState === 1)
            this.socket.send(msg);
        else if (this.socket.readyState !== 0)
            this.connect();
    }

    write(mensaje) { 
        let cmd = document.getElementById('console'); 
        cmd.textContent += mensaje.toString() + '\n';
        cmd.scrollTop = cmd.scrollHeight;
    }

    ping() {
        this.send("");
    }
}