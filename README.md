# thingsapp

Node module for creating todos in Things.app by Cultured Code.

## Installation

Install using `npm install --save git+ssh://git@github.com/simonbs/thingsapp.git`.

## Usage

When creating an instance of Things, you should pass your account ID and start index. Find these by inspecting HTTP traffic to `https://cloud.culturedcode.com` using [Charles](https://www.charlesproxy.com) or similar.

The UUID in the requests is your account ID. Consider the following call to the Things Cloud API.

```
https://cloud.culturedcode.com/version/1/history/THIS-IS-YOUR-ACCOUNT-ID/items?start-index=5612
```

In above request, `THIS-IS-YOUR-ACCOUNT-ID` is your account ID and your start index is 5612. 

When you have acquired both your account ID and your start index you can use the thingsapp module as shown below.

```javascript
var todo = {
  title: 'Pack for vacation',
  note: 'GoPro, selfiestick, MacBook charger and tickets'
}
var things = new Things('THIS-IS-YOUR-ACCOUNT-ID', 5612)
things.createTodo(todo, function(err) {
  // Handle errors.
})
```

In your todo you can set the `where` key to either `inbox` or `today` to specify the location of the todo. Default is the inbox.
