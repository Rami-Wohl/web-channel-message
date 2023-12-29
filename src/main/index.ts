type Message =
	| {
			name?: string;
			type: "broadcast" | "all";
			payload: any;
	  }
	| {
			type: "close";
	  };

type MessageWithCallback = Exclude<Message, { type: "close" }> & {
	callbackKey?: string;
};

const callbacks: Map<string, (...args: any[]) => any> = new Map();

class SharedWebChannel {
	public worker: SharedWorker | undefined;

	constructor() {
		if (typeof window == "undefined") {
			return;
		}

		this.worker = new SharedWorker(
			new URL("../worker/worker.js", import.meta.url),
			{
				name: "web-channel-messenger-worker",
				type: "module",
			}
		);

		this.worker.port.onmessage = function (event: MessageEvent) {
			const receivedMessage = event.data as MessageWithCallback;
			console.debug(
				"message received from shared worker: ",
				receivedMessage
			);

			if (receivedMessage.callbackKey) {
				const callback = callbacks.get(receivedMessage.callbackKey);
				if (callback) {
					callback(receivedMessage.payload);
				}
			}
		};

		window.addEventListener("beforeunload", () => {
			this.terminate();
		});

		this.worker.addEventListener("close", () => {
			this.terminate();
		});
	}

	sendMessage(message: MessageWithCallback) {
		this.worker?.port.postMessage(message);
	}

	registerCallback(key: string, callback: (...args: any[]) => any) {
		callbacks.set(key, callback);
	}

	terminate() {
		console.debug("terminating port connection");
		this.worker?.port.postMessage({
			type: "close",
		});
		this.worker?.port.close();
		this.worker = undefined;
	}
}

export default SharedWebChannel;
