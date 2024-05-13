import React, { useState } from 'react';

const Button = ({ text, onclick }) => {
  return (
    <button onClick={onclick}>{text}</button>
  );
}

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
    
  );
}

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = all === 0 ? 0 : (good - bad) / all;
  const positive = all === 0 ? 0 : (good / all) * 100;

  if (all === 0) {
    return (
      <div>
        <div>No feedback</div>
      </div>
    );
  }

  return (
    <div>
      <table>
        <StatisticsLine text="good" value={good} />
        <StatisticsLine text="neutral" value={neutral} />
        <StatisticsLine text="bad" value={bad} />
        <StatisticsLine text="all" value={all} />
        <StatisticsLine text="average" value={average} />
        <StatisticsLine text="positive" value={`${positive} %`} />
      </table>
    </div>
  );
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increment = (state, setState) => () => setState(state + 1);

  return (
    <div>
      <h2>give feedback</h2>
      <Button text="good" onclick={increment(good, setGood)} />
      <Button text="neutral" onclick={increment(neutral, setNeutral)} />
      <Button text="bad" onclick={increment(bad, setBad)} />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

export default App;
