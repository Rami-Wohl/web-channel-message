import { SharedWebChannel } from "./shared-web-channel";
import { ObserverMessage } from "./types";

export class ChannelObserver {
	private onUpdate: (...args: any[]) => any;

	/**
	 * Constructs a new `ChannelObserver` instance, that immediately subscribes to the provided channel's subject.
	 * When the `SharedWebChannel` receives a message with action set to `observer`, it will update it's subject's subscribed observers.
	 * If a `key` is provided then only messages with that key or `key: "all"` will trigger it's `onUpdate` function.
	 *
	 * @example
	 *
	 * const observer = new ChannelObserver(channel, (message) => {
	 *     const payload = message.payload as MyCustomType;
	 *
	 *     if (payload) {
	 *         handlePayload(payload);
	 *     }
	 * });
	 *
	 * //and to cleanup the observer:
	 *
	 * channel.subject.unsubscribe(observer);
	 */
	constructor(
		channel: SharedWebChannel,
		onUpdate: (data: ObserverMessage) => any,
		key?: string
	) {
		this.onUpdate = onUpdate;

		channel.subject.subscribe(this, key);
	}

	public update: <R>(data: ObserverMessage) => R | void = (data) => {
		this.onUpdate(data);
	};
}
