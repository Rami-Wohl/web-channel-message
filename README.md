# Web Channel Message

### A light-weight library that lets multiple browser sessions interact with each other, through one or more Shared Workers.

<br>

---

#### <i>Note: Package name might change soon as -unlike initially intended- it does not directly use the Web Channel Message API. Instead, the package functions as a thin abstraction layer around the SharedWorker API</i>

---

<br>

## Example:

<br>

```TypeScript
const channel = new SharedWebChannel();

channel.registerCallback("logout", logoutUser);

function handleClick() {
    channel.sendMessage({
        type: "broadcast",
        callbackKey: "logout",
    })
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

## Usage:

<br>

To use this library, first instantiate a new `SharedWebChannel`, which is a wrapper around the SharedWorker API:

```TypeScript
const channel = new SharedWebChannel();
```

If you -for some reason- want to use more then one shared worker, you can instantiate `SharedWebChannel` with a name argument:

```TypeScript
const anotherChannel = new SharedWebChannel('second-channel');
```

### Sending messages

You can now send a message to all instances of your application:

```TypeScript
const anotherChannel = new SharedWebChannel('second-channel');
```
