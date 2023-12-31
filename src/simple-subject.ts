import { ChannelObserver } from "./channel-observer";
import { ObserverMessage } from "./types";

class SimpleSubject {
	private observers: ChannelObserver[] = [];

	subscribe(observer: ChannelObserver) {
		this.observers.push(observer);
	}

	unsubscribe(observer: ChannelObserver) {
		const observerIndex = this.observers.indexOf(observer);

		if (observerIndex === -1) {
			return;
		}

		this.observers.splice(observerIndex, 1);
	}

	update(data: ObserverMessage) {
		//TODO: turn observers into Map with event key as key
		// if there's an event key then only update those observers
		// else update all

		for (const observer of this.observers) {
			observer.update(data);
		}
	}
}

export default SimpleSubject;
