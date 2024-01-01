/// <reference lib="webworker" />

import { ConnectionUpdate, WorkerMessage } from "./types";

const _self: SharedWorkerGlobalScope = self as any;

let connections: Set<MessagePort> = new Set();

_self.onconnect = function (e) {
	const port = e.ports[0];

	if (!port) {
		throw new Error("error connecting to message port");
	}

	console.log("connections: ", connections);

	connections.add(port);

	connections.forEach((conn) => {
		const message: ConnectionUpdate = {
			type: "internal",
			channelData: {
				connections: connections.size,
			},
		};

		conn.postMessage(message);
	});

	port.onmessage = function (e) {
		const message = e.data as WorkerMessage;

		if (message && message.type === "close") {
			port.close();

			console.log("deleting port: ", port);

			connections.delete(port);

			connections.forEach((conn) => {
				const message: ConnectionUpdate = {
					type: "internal",
					channelData: {
						connections: connections.size,
					},
				};

				conn.postMessage(message);
			});

			return;
		}

		if (message && message.action === "broadcast") {
			connections.forEach((conn) => {
				if (conn !== port) {
					conn.postMessage(message);
				}
			});
		}

		if (message && message.action === "all") {
			connections.forEach((conn) => {
				conn.postMessage(message);
			});
		}
	};

	port.start();
};
