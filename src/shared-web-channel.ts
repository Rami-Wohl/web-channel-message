import SimpleSubject from "./simple-subject";
import {
	ObserverMessage,
	ConnectionUpdate,
	Message,
	UserMessage,
} from "./types";

const callbacks: Map<string, (...args: any[]) => any> = new Map();

let isSupported: boolean = true;

export class SharedWebChannel {
	public worker: SharedWorker | undefined;
	public subject: SimpleSubject;
	public connections: number = 1;
	private connectionsUpdateCallback: ((...args: any[]) => any) | undefined;

	/**
	 * Constructs a new SharedWebChannel instance. If you'll need more then one
	 * instance throughout your application, it is recommended to provide a name.
	 *
	 * When omitted, the name will default to "default-shared-worker".
	 *
	 */
	constructor(name: string = "default-shared-worker") {
		this.subject = new SimpleSubject();

		if (typeof window == "undefined") {
			return;
		}

		try {
			this.worker = new SharedWorker(
				new URL("./worker.js", import.meta.url),
				{
					type: "module",
					name,
				}
			);
		} catch (e) {
			isSupported = false;

			console.warn(
				"The shared worker module feature doesn't appear to be supported in this environment"
			);

			return;
		}

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

		// for desktop browers
		window.addEventListener("beforeunload", () => {
			this.terminate();
		});

		// for iOS Safari
		window.addEventListener("unload", () => {
			this.terminate();
		});

		// for iOS/Android in general
		window.addEventListener("pagehide", () => {
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
	 * Sends a `UserMessage` object to the SharedWorker
	 * so it can be forwarded to other active channels.
	 *
	 * @example
	 *
	 * channel.sendMessage({
	 *   //type: "callback" to trigger a callback function with corresponding callbackKey or "observer" to update one or more ChannelObservers.
	 *   type: "callback",
	 *  // action: "broadcast" to send to all OTHER app instances or "all" to send to all.
	 *   action: "broadcast",
	 *  // payload: optional; in "callback" mode this will be your callback's input
	 *   payload: "bg-red-500",
	 *   callbackKey: "set-bg-color",
	 *});
	 *
	 */
	sendMessage(message: UserMessage) {
		// if sharedworkers are not supported, but the application instance from
		// which the message is sent is supposed to execute a callback or update an observer,
		// then execute the corresponding callback/update the corresponding observers
		if (!isSupported) {
			console.warn(
				"The shared worker module feature doesn't appear to be supported in this environment"
			);

			if (message.type === "callback" && message.action === "all") {
				const callback = callbacks.get(message.callbackKey);
				if (callback) {
					callback(message.payload);
				}
			}

			if (message.type === "observer" && message.action === "all") {
				this.updateObservers(message);
			}

			return;
		}

		this.worker?.port.postMessage(message);
	}

	/**
	 * Registers a callback with a key in a Map object. When a message sent with type `callback`
	 * is received the `SharedWebChannel` will look for a callback with the corresponding
	 * `callbackKey`, and -if found- execute it with the value in `payload` as input.
	 *
	 * @example
	 *
	 * channel.registerCallback("set-bg-color", setBgColor);
	 *
	 */
	registerCallback(key: string, callback: (...args: any[]) => any) {
		callbacks.set(key, callback);
	}

	/**
	 * Registers a callback to be executed when the number of open connections
	 * (the number of open browser session in different tabs/windows) changes.
	 *
	 * @example
	 *
	 * channel.onConnectionsUpdate(setInstances);
	 *
	 */
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

		window.removeEventListener("unload", () => {
			this.terminate();
		});

		window.removeEventListener("pagehide", () => {
			this.terminate();
		});
	}
}
