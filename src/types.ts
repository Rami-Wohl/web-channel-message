export type ActionType = "broadcast" | "all";

export type ObserverMessage = {
	type: "observer";
	id: string;
	action: ActionType;
	payload: any;
};

type CallbackMessage = {
	type: "callback";
	callbackKey: string;
	action: ActionType;
	payload: any;
};

type CloseMessage = {
	type: "close";
};

export type ConnectionUpdate = {
	type: "internal";
	data: {
		connections: number;
	};
};

type InternalMessage = CloseMessage | ConnectionUpdate;

type UserMessage = CallbackMessage | ObserverMessage;

export type WorkerMessage = UserMessage | CloseMessage;

export type Message = UserMessage | InternalMessage;
