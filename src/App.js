import React from "react";
import "./App.css";
import { fromEvent, interval, Subject } from "rxjs";
import { takeUntil, debounceTime, map, filter, buffer } from "rxjs/operators";

function App() {
  const [currentTimer, setCurrentTimer] = React.useState(0);
  const [isPaused, setPaused] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    let stream$ = new Subject();
    let timerObservable = interval(1000);
    timerObservable.pipe(takeUntil(stream$)).subscribe(() => {
      if (isActive) {
        setCurrentTimer((prev) => prev + 1000);
      }
    });

    return () => {
      stream$.next();
    };
  });

  const startStop = () => {
    if (isPaused) {
      setIsActive(!isActive);
      setPaused(!isPaused);
    } else {
      setIsActive(!isActive);
      setCurrentTimer(0);
    }
  };
  const pause = () => {
    setIsActive(false);
    setPaused(true);
  };
  const clear = () => {
    setIsActive(true);
    setCurrentTimer(0);
  };
  const waitwtf = () => {
    const event$ = fromEvent(document.querySelector("#pause"), "click");
    const buff$ = event$.pipe(debounceTime(300));
    const click$ = event$.pipe(
      buffer(buff$),
      map((click) => {
        return click.length;
      }),
      filter((x) => x === 2)
    );
    click$.subscribe(() => {
      pause();
    });
  };

  return (
    <div className="App">
      <div className="counter">
        {new Date(currentTimer).toISOString().slice(11, 19)}
      </div>
      <div className="buttons">
        <button onClick={startStop}>Start/Stop</button>
        <button id="pause" onClick={waitwtf} type="button">
          Wait
        </button>
        <button onClick={clear}>Clear</button>
      </div>
    </div>
  );
}

export default App;
