import { SharedWebChannel } from "./shared-web-channel";
import { ObserverMessage } from "./types";

export class ChannelObserver {
	private onUpdate: (...args: any[]) => any;

	/**
	 * @constructor
	 * @param channel
	 * @param onUpdate
	 * @param key
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
