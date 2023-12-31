import { SharedWebChannel } from "./shared-web-channel";
import { ObserverMessage } from "./types";

export class ChannelObserver {
	public onUpdate: (...args: any[]) => any;

	constructor(
		channel: SharedWebChannel,
		onUpdate: (data: ObserverMessage) => any
	) {
		this.onUpdate = onUpdate;

		channel.subject.subscribe(this);
	}

	public update: <R>(data: ObserverMessage) => R | void = (data) => {
		this.onUpdate(data);
	};
}
