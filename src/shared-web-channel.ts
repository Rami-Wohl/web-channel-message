import SimpleSubject from "./simple-subject";
import {
	ObserverMessage,
	ConnectionUpdate,
	Message,
	UserMessage,
} from "./types";

const callbacks: Map<string, (...args: any[]) => any> = new Map();

/**
 * @name SharedWebChannel
 */
export class SharedWebChannel {
	public worker: SharedWorker | undefined;
	public subject: SimpleSubject;
	public connections: number | undefined;
	private connectionsUpdateCallback: ((...args: any[]) => any) | undefined;

	/**
	 * @constructor
	 * @param {string?} name - The SharedWorker name, defaults to "default-shared-worker".
	 */
	constructor(name: string = "default-shared-worker") {
		this.subject = new SimpleSubject();

		if (typeof window == "undefined") {
			return;
		}

		this.worker = new SharedWorker(
			new URL("./worker.js", import.meta.url),
			{
				type: "module",
				name,
			}
		);

		const forwardUpdate = (data: ObserverMessage) => {
			this.updateObservers(data);
		};

		const forwardConnectionUpdate = (data: ConnectionUpdate) => {
			this.connections = data.channelData.connections;
			if (this.connectionsUpdateCallback) {
				this.connectionsUpdateCallback(data.channelData.connections);
			}
		};

		this.worker.port.onmessage = function (event: MessageEvent) {
			const receivedMessage = event.data as Message;
			console.debug(
				"message received from shared worker: ",
				receivedMessage
			);

			if (receivedMessage.type === "callback") {
				const callback = callbacks.get(receivedMessage.callbackKey);
				if (callback) {
					callback(receivedMessage.payload);
				}
			}

			if (receivedMessage.type === "observer") {
				forwardUpdate(receivedMessage);
			}

			if (receivedMessage.type === "internal") {
				forwardConnectionUpdate(receivedMessage);
			}
		};

		window.addEventListener("beforeunload", () => {
			this.terminate();
		});

		this.worker.addEventListener("close", () => {
			this.terminate();
		});
	}

	private updateObservers(data: ObserverMessage) {
		this.subject.update(data);
	}

	/**
	 * @param {UserMessage} message
	 *
	 * Send a `Message` object to the SharedWorker
	 * so it can be forwarded to other active channels.
	 *
	 * @example
	 *
	 * channel.sendMessage({
	 *   type: "callback",
	 *   action: "broadcast",
	 *   payload: "bg-red-500",
	 *   callbackKey: "set-bg-color",
	 *});
	 *
	 */
	sendMessage(message: UserMessage) {
		this.worker?.port.postMessage(message);
	}

	/**
	 * TODO: jsdocs registerCallback
	 */
	registerCallback(key: string, callback: (...args: any[]) => any) {
		callbacks.set(key, callback);
	}

	onConnectionsUpdate(callback: (...args: any[]) => any) {
		this.connectionsUpdateCallback = callback;
	}

	private terminate() {
		console.debug("terminating port connection");
		this.worker?.port.postMessage({
			type: "close",
		});
		this.worker?.port.close();
		this.worker = undefined;

		window.removeEventListener("beforeunload", () => {
			this.terminate();
		});
	}
}
