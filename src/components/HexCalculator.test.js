import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import HexCalculator from "./HexCalculator";

describe("Display",()=>{
test("renders display with initial value 0",()=>{
    render(<HexCalculator></HexCalculator>)
    expect(screen.getByTestId("display")).toHaveTextContent("0");
});
});

describe("Hex Number Buttons", () => {
  test("clicking a number button shows it on display", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-A"));
    expect(screen.getByTestId("display")).toHaveTextContent("A");
  });

  test("clicking two digits shows both on display", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-F"));
    fireEvent.click(screen.getByTestId("btn-F"));
    expect(screen.getByTestId("display")).toHaveTextContent("FF");
  });

  test("does not allow more than 2 digits", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-1"));
    fireEvent.click(screen.getByTestId("btn-2"));
    fireEvent.click(screen.getByTestId("btn-3"));
    expect(screen.getByTestId("error-message")).toHaveTextContent("ERROR: Maximum 2 hex digits allowed");
  });
});

describe("Clear and Backspace", () => {
  test("AC button resets display to 0", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-A"));
    fireEvent.click(screen.getByTestId("btn-AC"));
    expect(screen.getByTestId("display")).toHaveTextContent("0");
  });

  test("backspace removes last character", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-A"));
    fireEvent.click(screen.getByTestId("btn-F"));
    fireEvent.click(screen.getByTestId("btn-backspace"));
    expect(screen.getByTestId("display")).toHaveTextContent("A");
  });

  test("backspace on single digit resets to 0", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-A"));
    fireEvent.click(screen.getByTestId("btn-backspace"));
    expect(screen.getByTestId("display")).toHaveTextContent("0");
  });
});

describe("Arithmetic Operations", () => {
  test("adds two hex numbers correctly", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-1"));
    fireEvent.click(screen.getByTestId("btn-add"));
    fireEvent.click(screen.getByTestId("btn-1"));
    fireEvent.click(screen.getByTestId("btn-equal"));
    expect(screen.getByTestId("display")).toHaveTextContent("2");
  });

  test("subtracts two hex numbers correctly", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-F"));
    fireEvent.click(screen.getByTestId("btn-subtract"));
    fireEvent.click(screen.getByTestId("btn-1"));
    fireEvent.click(screen.getByTestId("btn-equal"));
    expect(screen.getByTestId("display")).toHaveTextContent("E");
  });

  test("multiplies two hex numbers correctly", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-2"));
    fireEvent.click(screen.getByTestId("btn-multiply"));
    fireEvent.click(screen.getByTestId("btn-3"));
    fireEvent.click(screen.getByTestId("btn-equal"));
    expect(screen.getByTestId("display")).toHaveTextContent("6");
  });

  test("divides two hex numbers correctly", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-F"));
    fireEvent.click(screen.getByTestId("btn-divide"));
    fireEvent.click(screen.getByTestId("btn-3"));
    fireEvent.click(screen.getByTestId("btn-equal"));
    expect(screen.getByTestId("display")).toHaveTextContent("5");
  });
});

describe("Error Handling", () => {
  test("shows error for division by zero", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-A"));
    fireEvent.click(screen.getByTestId("btn-divide"));
    fireEvent.click(screen.getByTestId("btn-0"));
    fireEvent.click(screen.getByTestId("btn-equal"));
    expect(screen.getByTestId("error-message")).toHaveTextContent("ERROR: Division by zero");
  });

  test("shows error for negative result", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-1"));
    fireEvent.click(screen.getByTestId("btn-subtract"));
    fireEvent.click(screen.getByTestId("btn-F"));
    fireEvent.click(screen.getByTestId("btn-equal"));
    expect(screen.getByTestId("error-message")).toHaveTextContent("ERROR: Negative result");
  });

  test("shows error for fractional result", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-A"));
    fireEvent.click(screen.getByTestId("btn-divide"));
    fireEvent.click(screen.getByTestId("btn-3"));
    fireEvent.click(screen.getByTestId("btn-equal"));
    expect(screen.getByTestId("error-message")).toHaveTextContent("ERROR: Fractional result");
  });
});

describe("History", () => {
  test("shows calculation history after a successful operation", () => {
    render(<HexCalculator />);
    fireEvent.click(screen.getByTestId("btn-F"));
    fireEvent.click(screen.getByTestId("btn-add"));
    fireEvent.click(screen.getByTestId("btn-1"));
    fireEvent.click(screen.getByTestId("btn-equal"));
    expect(screen.getByTestId("history")).toBeInTheDocument();
  });
});