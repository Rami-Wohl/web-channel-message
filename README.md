# Web Channel Message

### A light-weight library that lets multiple browser sessions interact with each other, through one or more Shared Workers.

<br>

---

#### <i>Note: Package name might change soon as -unlike initially intended- it does not directly use the Web Channel Message API. Instead, the package functions as a thin abstraction layer around the SharedWorker API</i>

---

<br>

### Example:

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
