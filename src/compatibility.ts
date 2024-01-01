export function supportsWorkerType() {
	let supports = false;

	try {
		new Worker("blob://", {
			type: "module",
		});

		supports = true;
	} catch (error) {
		console.debug("Error creating worker:", error);
	}

	return supports;
}
