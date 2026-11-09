# React foundations — with Vue comparisons

You already know frontend development, so use Vue as a bridge. The goal is to learn React's model rather than translate every Vue feature one-for-one.

## 1. React components are functions

A React function component receives props and returns JSX:

~~~jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}
~~~

Vue comparison:

~~~vue
<script setup>
defineProps({ name: String });
</script>

<template>
  <h1>Hello, {{ name }}</h1>
</template>
~~~

Both describe reusable UI. React uses JavaScript expressions directly in JSX; Vue templates have their own directives and interpolation syntax.

## 2. JSX is JavaScript syntax for describing UI

In JSX, use className rather than class, htmlFor rather than for, and camelCase event names such as onClick.

~~~jsx
const title = "Study Tracker";
return <h1 className="page-title">{title}</h1>;
~~~

The braces mean: evaluate this JavaScript expression and place its result in the UI. JSX is transformed into JavaScript calls by the build tool; the browser does not understand JSX directly.

Vue equivalent: template interpolation uses double braces, and bindings commonly use directives such as :class and @click.

## 3. State: useState versus ref

React:

~~~jsx
const [count, setCount] = useState(0);

function increment() {
  setCount((currentCount) => currentCount + 1);
}
~~~

Vue:

~~~js
const count = ref(0);
function increment() {
  count.value += 1;
}
~~~

Key difference: React state is updated through its setter. Calling the setter asks React to render again with the new state. Do not mutate a state object or array directly.

For object state, copy the old object:

~~~js
setForm((currentForm) => ({
  ...currentForm,
  title: "New title",
}));
~~~

The spread syntax copies enumerable properties into a new object. This is a shallow copy, so nested objects need their own copying when changed.

React state is a snapshot for a particular render. When the next value depends on the previous value, prefer the functional setter form shown above.

## 4. Props and component communication

A parent sends data or callbacks to a child as props:

~~~jsx
<TaskList tasks={tasks} onDelete={handleDelete} />
~~~

The child receives them:

~~~jsx
function TaskList({ tasks, onDelete }) {
  return tasks.map((task) => (
    <button key={task.id} onClick={() => onDelete(task.id)}>
      Delete {task.title}
    </button>
  ));
}
~~~

Vue comparison: props flow down from parent to child; events or callback props communicate changes upward. React commonly passes a function prop down and calls it from the child.

## 5. Rendering lists and conditional UI

React list rendering usually uses map:

~~~jsx
{tasks.map((task) => (
  <p key={task.id}>{task.title}</p>
))}
~~~

Vue equivalent: v-for. React needs a stable key so it can match each rendered item when the list changes. Use a database ID rather than the array index for data that can be inserted, removed or reordered.

Conditional rendering uses JavaScript:

~~~jsx
{loading ? <p>Loading…</p> : <TaskList tasks={tasks} />}
{error && <p role="alert">{error}</p>}
~~~

Vue equivalent: v-if / v-else. The difference is that React uses normal JavaScript expressions rather than template directives.

## 6. Controlled inputs

React:

~~~jsx
const [title, setTitle] = useState("");

<input
  value={title}
  onChange={(event) => setTitle(event.target.value)}
/>
~~~

Vue:

~~~vue
<input v-model="title">
~~~

Both keep the UI and application state in sync. In React, value and onChange are explicit. This makes the update path easy to follow but requires more code.

## 7. useEffect is not just a replacement for watch

useEffect synchronises a component with something outside React: a subscription, browser API, network request, or third-party system.

~~~jsx
useEffect(() => {
  const unsubscribe = subscribeToSomething();
  return () => unsubscribe();
}, []);
~~~

Vue comparison:
- onMounted is often used for setup after mounting.
- onUnmounted is often used for cleanup.
- watch / watchEffect react to changing dependencies.

React useEffect runs after a render when its dependencies change. Its cleanup runs before the effect re-runs and when the component unmounts. It is not a general-purpose replacement for computed values; derive values during render when possible.

## 8. Context compared with provide / inject

React Context allows data to be read by a subtree without passing props through every intermediate component. Vue has provide / inject for a similar purpose.

This project uses AuthContext for the Firebase user and authentication functions. It avoids passing user, login and logout props through every page.

Do not put every application value into Context by default. Keep local state local; use shared state when multiple distant components genuinely need it.

## 9. Hooks rules

Hooks such as useState, useEffect and useContext must be called at the top level of a function component or a custom hook. Do not call them inside loops, conditions or nested functions.

A custom hook is a function whose name begins with use and that composes React hooks. This project defines useAuth() so components can access the authentication context consistently.

## Suggested source-reading order

1. main.jsx — root, StrictMode, BrowserRouter and AuthProvider.
2. App.jsx — route composition.
3. TaskForm.jsx — local state and controlled inputs.
4. TaskList.jsx — props, map, keys and events.
5. DashboardPage.jsx — effects, async calls and derived values.
6. AuthContext.jsx — Context and a custom hook.

Try explaining each component aloud: what data comes in, what state it owns, what it renders, and what callbacks it sends out.
