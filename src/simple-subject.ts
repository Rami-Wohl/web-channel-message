import { ChannelObserver } from "./channel-observer";
import { ObserverMessage } from "./types";

class SimpleSubject {
	private observers: Map<string, ChannelObserver[]> = new Map();

	subscribe(observer: ChannelObserver, key: string = "default") {
		if (this.observers.has(key)) {
			this.observers.get(key)?.push(observer);
		} else {
			this.observers.set(key, [observer]);
		}
	}

	unsubscribe(observer: ChannelObserver, key: string = "default") {
		const observersForKey = this.observers.get(key);

		if (!observersForKey) return;

		const observerIndex = observersForKey.indexOf(observer);

		if (observerIndex === -1) return;

		observersForKey.splice(observerIndex, 1);
	}

	update(data: ObserverMessage) {
		for (const [key, observerGroup] of this.observers.entries()) {
			if (
				data.key === "all" ||
				data.key === key ||
				(data.key === undefined && key === "default")
			) {
				for (const observer of observerGroup) {
					observer.update(data);
				}
			}
		}
	}
}

export default SimpleSubject;
