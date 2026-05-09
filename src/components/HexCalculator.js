import React, { useState, useEffect } from 'react';
import {
  hexAdd,
  hexSubtract,
  hexMultiply,
  hexDivide
} from '../calculator/hexCalculator';
import '../styles/HexCalculator.css';

const hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
const operations = [
  { symbol: '/', op: 'divide', label: 'DIV' },
  { symbol: '×', op: 'multiply', label: 'MUL' },
  { symbol: '−', op: 'subtract', label: 'SUB' },
  { symbol: '+', op: 'add', label: 'ADD' }
];

function HexCalculator() {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState('');
  const [previousValue, setPreviousValue] = useState('');
  const [operation, setOperation] = useState(null);
  const [history, setHistory] = useState([]);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNumberClick = (num) => {
    // FR3: Reject invalid hexadecimal input
    if (!hexDigits.includes(num.toUpperCase())) {
      setErrorMessage('ERROR: Invalid hexadecimal input');
      return;
    }

    setErrorMessage('');

    if (waitingForNewValue) {
      setCurrentValue(num);
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      const newValue = currentValue === '' ? num : currentValue + num;
      // FR2: Maximum 2 hexadecimal digits per operand
      if (newValue.length <= 2) {
        setCurrentValue(newValue);
        setDisplay(newValue || '0');
      } else {
        // FR22: Display error for input exceeding 2 digits
        setErrorMessage('ERROR: Maximum 2 hex digits allowed');
      }
    }
  };

  const handleOperationClick = (op) => {
    setErrorMessage('');

    if (operation && !waitingForNewValue && currentValue) {
      // If there's already an operation, calculate first
      calculate(op);
    } else {
      if (currentValue !== '') {
        setPreviousValue(currentValue);
        setOperation(op);
        setWaitingForNewValue(true);
        setDisplay(currentValue);
      }
    }
  };

  const calculate = (nextOp = null) => {
    if (!previousValue || !currentValue || !operation) {
      if (nextOp) {
        setPreviousValue(currentValue);
        setOperation(nextOp);
        setWaitingForNewValue(true);
      }
      return;
    }

    let result;
    const prev = previousValue.toUpperCase();
    const curr = currentValue.toUpperCase();

    // FR10-FR13: Convert, calculate, and convert back
    switch (operation) {
      case 'add':
        result = hexAdd(prev, curr);
        break;
      case 'subtract':
        result = hexSubtract(prev, curr);
        break;
      case 'multiply':
        result = hexMultiply(prev, curr);
        break;
      case 'divide':
        result = hexDivide(prev, curr);
        break;
      default:
        result = curr;
    }

    const isError = result.includes('ERROR');

    // FR17-FR24: Handle various error cases
    if (isError) {
      setErrorMessage(result);
    } else {
      setErrorMessage('');
      // FR15: Verify output doesn't exceed 4 digits
      if (result.length > 4) {
        setErrorMessage('ERROR: Result exceeds 4-digit hex limit');
        setDisplay('0');
        setCurrentValue('');
        setPreviousValue('');
        setOperation(null);
        setWaitingForNewValue(false);
        return;
      }

      // Add to history only if no error
      const opSymbol = operations.find(o => o.op === operation)?.symbol || '?';
      const entry = `${prev} ${opSymbol} ${curr} = ${result}`;
      setHistory((prev) => [entry, ...prev.slice(0, 9)]);
    }

    setDisplay(result);
    setCurrentValue(result);
    setPreviousValue('');
    setOperation(null);
    setWaitingForNewValue(true);

    if (nextOp) {
      setPreviousValue(result.includes('ERROR') ? '0' : result);
      setOperation(nextOp);
      setWaitingForNewValue(true);
    }
  };

  const handleEqual = () => {
    // FR13: Execute calculation on equals command
    if (operation && currentValue && previousValue) {
      calculate();
    }
  };

  const handleClear = () => {
    // FR4: Clear function
    setDisplay('0');
    setCurrentValue('');
    setPreviousValue('');
    setOperation(null);
    setWaitingForNewValue(false);
    setErrorMessage('');
  };

  const handleBackspace = () => {
    // FR5: Backspace/Edit function
    if (currentValue.length > 1) {
      const newValue = currentValue.slice(0, -1);
      setCurrentValue(newValue);
      setDisplay(newValue);
    } else {
      setCurrentValue('');
      setDisplay('0');
    }
    setErrorMessage('');
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();

      // Number/hex digit input (0-9, A-F)
      if (hexDigits.includes(key)) {
        e.preventDefault();
        handleNumberClick(key);
      }
      // Operations
      else if (key === '+') {
        e.preventDefault();
        handleOperationClick('add');
      } else if (key === '-') {
        e.preventDefault();
        handleOperationClick('subtract');
      } else if (key === '*') {
        e.preventDefault();
        handleOperationClick('multiply');
      } else if (key === '/') {
        e.preventDefault();
        handleOperationClick('divide');
      }
      // Equal
      else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEqual();
      }
      // Clear
      else if (key === 'C') {
        e.preventDefault();
        handleClear();
      }
      // Backspace
      else if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue, previousValue, operation, waitingForNewValue]);

  return (
    <div className="hex-calculator-wrapper dark">
      <div className="calculator-container">
        <div className="calculator-title">Hex Calculator</div>
        <div className="calculator">
          {/* Display */}
          <div className="display-area">
            <div className="calculation-display">
              {previousValue && operation && currentValue ? (
                <span>
                  {previousValue}
                  {operations.find(o => o.op === operation)?.symbol}
                  {currentValue}
                </span>
              ) : previousValue && operation ? (
                <span>
                  {previousValue}
                  {operations.find(o => o.op === operation)?.symbol}
                </span>
              ) : (
                ''
              )}
            </div>
            <div className={`result-display ${errorMessage ? 'error' : ''}`}>
              {display}
            </div>
          </div>

          {/* Error message display */}
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          {/* Keypad */}
          <div className="keypad">
            {/* Row 1: AC and operations */}
            <div className="button-row">
              <button
                onClick={handleClear}
                className="btn btn-special btn-clear"
                title="All Clear (C)"
              >
                AC
              </button>
              <button
                onClick={() => handleOperationClick('divide')}
                className={`btn btn-operation ${operation === 'divide' ? 'active' : ''}`}
                title="Divide (/)"
              >
                /
              </button>
              <button
                onClick={() => handleOperationClick('multiply')}
                className={`btn btn-operation ${operation === 'multiply' ? 'active' : ''}`}
                title="Multiply (×)"
              >
                ×
              </button>
              <button
                onClick={handleBackspace}
                className="btn btn-special btn-backspace"
                title="Backspace"
              >
                ←
              </button>
            </div>

            {/* Row 2: 7, 8, 9, - */}
            <div className="button-row">
              <button
                onClick={() => handleNumberClick('7')}
                className="btn btn-number"
              >
                7
              </button>
              <button
                onClick={() => handleNumberClick('8')}
                className="btn btn-number"
              >
                8
              </button>
              <button
                onClick={() => handleNumberClick('9')}
                className="btn btn-number"
              >
                9
              </button>
              <button
                onClick={() => handleOperationClick('subtract')}
                className={`btn btn-operation ${operation === 'subtract' ? 'active' : ''}`}
                title="Subtract (−)"
              >
                −
              </button>
            </div>

            {/* Row 3: 4, 5, 6, + */}
            <div className="button-row">
              <button
                onClick={() => handleNumberClick('4')}
                className="btn btn-number"
              >
                4
              </button>
              <button
                onClick={() => handleNumberClick('5')}
                className="btn btn-number"
              >
                5
              </button>
              <button
                onClick={() => handleNumberClick('6')}
                className="btn btn-number"
              >
                6
              </button>
              <button
                onClick={() => handleOperationClick('add')}
                className={`btn btn-operation ${operation === 'add' ? 'active' : ''}`}
                title="Add (+)"
              >
                +
              </button>
            </div>

            {/* Row 4: 1, 2, 3 */}
            <div className="button-row">
              <button
                onClick={() => handleNumberClick('1')}
                className="btn btn-number"
              >
                1
              </button>
              <button
                onClick={() => handleNumberClick('2')}
                className="btn btn-number"
              >
                2
              </button>
              <button
                onClick={() => handleNumberClick('3')}
                className="btn btn-number"
              >
                3
              </button>
              <button
                onClick={handleEqual}
                className="btn btn-equal"
                title="Calculate"
              >
                =
              </button>
            </div>

            {/* Row 5: 0 and hex digits A-F */}
            <div className="button-row">
              <button
                onClick={() => handleNumberClick('0')}
                className="btn btn-number"
                style={{ gridColumn: '1 / 3' }}
              >
                0
              </button>
              <button
                onClick={() => handleNumberClick('A')}
                className="btn btn-number"
              >
                A
              </button>
              <button
                onClick={() => handleNumberClick('B')}
                className="btn btn-number"
              >
                B
              </button>
            </div>

            {/* Row 6: C, D, E, F */}
            <div className="button-row">
              <button
                onClick={() => handleNumberClick('C')}
                className="btn btn-number"
              >
                C
              </button>
              <button
                onClick={() => handleNumberClick('D')}
                className="btn btn-number"
              >
                D
              </button>
              <button
                onClick={() => handleNumberClick('E')}
                className="btn btn-number"
              >
                E
              </button>
              <button
                onClick={() => handleNumberClick('F')}
                className="btn btn-number"
              >
                F
              </button>
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="history">
            <h3>History</h3>
            <ul className="history-list">
              {history.map((entry, index) => (
                <li key={index} className="history-item">
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default HexCalculator;
