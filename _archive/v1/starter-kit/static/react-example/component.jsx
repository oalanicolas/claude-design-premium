function CanvasSafeCounter() {
  var state = React.useState(0);
  var count = state[0];
  var setCount = state[1];

  return (
    <div className="card" id="start">
      <p className="label">Stateful prototype</p>
      <h2>Count: {count}</h2>
      <p>This component is loaded through browser Babel and exposes itself on window.</p>
      <button className="button" type="button" onClick={() => setCount(count + 1)}>
        Add one
      </button>
    </div>
  );
}

Object.assign(window, { CanvasSafeCounter });

var target = document.getElementById("react-root");
if (target) {
  ReactDOM.createRoot(target).render(React.createElement(CanvasSafeCounter));
}
