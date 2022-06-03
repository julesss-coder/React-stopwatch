/*

QUESTIONS:
My logic:
Start seconds at 0
Upon start: seconds++, every second.
Upon stop: stop updating seconds
Upon reset: seconds = 0
Why not?
ANSWER: Using browser's Date object makes the timer a lot more accurate than just using window.setInterval alone.

STRATEGY

* marks a state change

UI:
time display:
  Starts with '0 s'
buttons:
  - start:
    Upon click:*
      If this is the first time you start the timer:
        Initial seconds = 0 s
      Else
        Initial seconds = seconds from previous update

      Each second: 
        initial seconds++*
        display seconds
  - stop:
    Upon click:*
      Stop updating seconds*
      Display current seconds
  - reset:
    Upon click:*
      Reset seconds to 0*
      Reset time display to seconds

  How to measure seconds:
  Current seconds = 0
  Upon start:
    Get current time
    Update seconds every second
  Upon stop:
    Get current time
*/

class StopWatch extends React.Component {
  constructor(props) {
    super(props);
    // What is `this` inside the constructor?
    // ANSWER: MDN: "Within a class constructor, this is a regular object. All non-static methods within the class are added to the prototype of this.""
    // URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
    // this.__proto__.__proto__.__proto__ === Object.prototype // true
    // this.__proto__'s prototype is Component, but I was not able to access it in the console to check whether this.__proto__ === Component.prototype
    console.log('this in constructor: ', this);
    this.state = {
      timePassedInMilliSeconds: 0
    }

    // Why do I have to initialize the timer here?
    // What happens if I don't?
    // A similar example from the official React documentation does NOT initilize the timer in the constructor: https://codepen.io/gaearon/pen/amqdNr?editors=0010
    this.timer = null;

    // What would `this` be if we didn't bind it to `this` in the constructor?
    // ANSWER: undefined, see below.
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
  }

  // Why not put the timer in a stateDidMount() method?
  start() {
    // if timer has not been assigned a value
    // ie. if user has not clicked 'start' yet
    // prevents user from starting a second interval after having started the timer once already
    // Every 250 ms (arbitrary choice): get time elapsed since last function call, add it up
    // Running setInterval only every 1000 ms seems to be as accurate as running it every 250 s
    console.log('this without binding start(): ', this); // undefined
    // REASON: "When a static or prototype method [defined in a class] is called without a value for this, such as by assigning the method to a variable and then calling it, the this value will be undefined inside the method."
    // URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
    if (!this.timer) {
      //Get start time 0s
      console.log('this.state.timePassedInMilliSeconds: ', this.state.timePassedInMilliSeconds);
      let startTime = Date.now();
      console.log('startTime: ', startTime);
      this.timer = setInterval(() => {
        const stopTime = Date.now();
        console.log('stopTime: ', stopTime);
        // time passed so far, plus most recent time passed
        const timePassedInMilliSeconds = this.state.timePassedInMilliSeconds + (stopTime - startTime);
        console.log('timePassedInMilliSeconds: ', timePassedInMilliSeconds);

        this.setState({
          timePassedInMilliSeconds,
        });
        
        startTime = stopTime;
      }, 250); // Executed every 250 millisecond
    }
  }

  stop() {
    console.log('this in stop(): ', this);
    window.clearInterval(this.timer);
    this.timer = null;
  }

  reset() {
    this.stop();
    this.setState({
      timePassedInMilliSeconds: 0
    })
  }

  render() {
    // Get state.time from constructor
    // Even though the time elapsed is measured ever 250ms, 
    // we set the DOM to update only each second
    // We could also update the DOM more often, show milliseconds instead of seconds, etc.
    return (
      <div>
        <h2 className="border px-3 py-4 rounded my-3 mx-auto text-center" style={{maxWidth: "300px"}}>
          {Math.floor(this.state.timePassedInMilliSeconds/1000)} s
        </h2>
        <div className="d-flex justify-content-center">
          <button className="btn btn-outline-primary mr-2" onClick={this.start}>
            start
          </button>
          <button className="btn btn-outline-danger mr-2" onClick={this.stop}>
            stop
          </button>
          <button className="btn btn-outline-warning" onClick={this.reset}>
            reset
          </button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <StopWatch />,
  document.getElementById('root')
);