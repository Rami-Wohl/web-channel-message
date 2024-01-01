# Web Channel Message

### A light-weight library that lets multiple browser sessions interact with each other, through one or more Shared Workers.

<br>

---

#### <i>Note: Package name might change soon as -unlike initially intended- it does not directly use the Web Channel Message API. Instead, the package functions as an abstraction layer around the SharedWorker API</i>

---

<br>

## Example:

<br>

```TypeScript
const channel = new SharedWebChannel();

channel.registerCallback("logout", logoutUser);

function handleClick() {
    channel.sendMessage({
      type: "callback",
      action: "all",
      callbackKey: "logout",
    });
}
```

<br>

For a working example check out [this demo](https://shared-worker-package-demo.vercel.app/) of a NextJS application that uses this library to synchronize state between instances of the same application in different tabs/windows.

<br>

## Install:

<br>
NPM:

```sh
npm i @r_wohl/web-channel-message
```

YARN:

```sh
yarn add @r_wohl/web-channel-message
```

<br>

# Usage:

<br>

To use this library, first instantiate a new `SharedWebChannel`, which is a wrapper around the SharedWorker API:

<br>

```TypeScript
import { SharedWebChannel } from "@r_wohl/web-channel-message";

...

const channel = new SharedWebChannel();
```

<br>

If you -for some reason- want to use more then one shared worker, you can instantiate `SharedWebChannel` with a name argument:

<br>

```TypeScript
const anotherChannel = new SharedWebChannel('second-channel');
```

<br>

## Tracking open connections:

---

<br>

As of version 3.0.0 you can keep track of the number of open connections when the `SharedWebChannel` is instantiated, as well as register a callback that is called when this number changes:

<br>

```TypeScript
const numberOfConnections = channel.connections;

...

channel.onConnectionsUpdate(myCustomHandler);

```

<br>

If a callback is registered to be executed when the number of open connections changes, it will receive the new number of connections as input.

<br>

## Sending messages:

---

<br>

You can now send a message to all instances of your application with the `sendMessage` method:

<br>

```TypeScript
  function handleClickColor(color: BackgroundColor) {
    channel.sendMessage({
      type: "callback",
      action: "all",
      payload: color,
      callbackKey: "set-bg-color",
    });
  }
```

<br>

For the `type` property, you can choose between [callback](#callback) mode and [observer](#observer) mode, which determines how the message is handled when it is received.

<br>

For the `action` property, you can choose between `"all"` and `"broadcast"`. Messages with `"all"` will be sent to all open connections, including the instance from which it was sent. Messages with `"broadcast"` will be sent to all <i>other</i> connections.

<br>

The `payload` property is optional. In `"callback"` mode this will be the input for your registered callback function. The same is true for `"observer"` mode, but in this case you have more control over what happens with the data in this property (see [observer](#observer) section)

<br>

Furthermore, in `"callback"` mode you'll need to specify a `callbackKey`. In `"observer"` mode you can specify a key as well, if you want the message to be received by specific `ChannelObservers` only:

<br>

```TypeScript
    channel.sendMessage({
      type: "observer",
      action: "broadcast",
      key: "my-custom-event"
    });
```

<br>

## Handling messages:

---

When messages are received in the `SharedWebChannel` you can either handle them with a registered callback, or with a `ChannelObserver`.

<br>

### Callback

---

<br>

The easiest way to handle message is to register a callback function, together with a specific key:

<br>

```TypeScript

channel.registerCallback("set-bg-color", setBgColor);

```

<br>

Whenever a message is received with that specific key in the `callbackKey` property, the registered callback function is executed with the value of the received `payload` property as input.

<br>

### Observer

---

<br>

Handling incoming messages with `ChannelObserver` instances gives you more control over data flow between different instances of your application.

Start with importing the `ChannelObserver`:

<br>

```TypeScript
import { ChannelObserver } from "@r_wohl/web-channel-message";
```

<br>

You can now make a `ChannelObserver` instance:

<br>

```TypeScript
    const observer = new ChannelObserver(channel, (data) => {
      const payload = data.payload as SomeCustomType;

      doSomethingWithPayload(payload)
    });
```

<br>

Optionally, you can specify a key when instantiating the `ChannelObserver`:

```TypeScript
    const observer = new ChannelObserver(channel, (data) => {
      const payload = data.payload as SomeCustomType;

      handlePayload(payload)
    }, "my-custom-key");
```

<br>

For any `ChannelObserver` with a key, it will only be updated when messages are received with either that specific key, or with the message key property set to `"all"`.

<br>

Please note that for this reason, you shouldn't set the message key to either `"all"` or `"default"` for messages in `"observer"` mode (the `"default"` key is set for `ChannelObserver` instances where no key is specified).

<br>

Finally, you can unsubscribe a `ChannelObserver` from the `SharedWebChannel` subject when appropriate, for instance in React.useEffect's return:

<br>

```TypeScript
  useEffect(() => {
    const observer = new ChannelObserver(channel, (data) => {
      const payload = data.payload as SomeCustomType;
      if (payload) {
        handlePayload(payload);
      }
    });

    return () => {
      channel.subject.unsubscribe(observer);
    };

  }, []);
```

<br>

# Contributors

This is my first NPM library, and I'd would be delighted if anyone would like to comment on the code or contribute in any way. Whether it be a long list of my failures or compliments on the idea/implementation, your input is more than welcome!
