import { Message, MessageWithCallback } from "./index";

interface SharedWorkerGlobalScope {
	onconnect: (event: MessageEvent) => void;
}

const _self: SharedWorkerGlobalScope = self as any;

let connections: Set<MessagePort> = new Set();

_self.onconnect = function (e) {
	const port = e.ports[0];

	if (!port) {
		throw new Error("error connecting to message port");
	}

	console.log("connections: ", connections);

	connections.add(port);

	port.onmessage = function (e) {
		const message = e.data as Message | MessageWithCallback;

		if (message && message.type === "broadcast") {
			connections.forEach((conn) => {
				if (conn !== port) {
					conn.postMessage(message);
				}
			});
		}

		if (message && message.type === "all") {
			connections.forEach((conn) => {
				conn.postMessage(message);
			});
		}

		if (message && message.type === "close") {
			port.close();

			console.log("deleting port: ", port);

			connections.delete(port);
		}
	};

	port.start();
};
