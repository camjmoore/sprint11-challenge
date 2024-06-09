import React from "react";
import Spinner from "./Spinner";
import { render, screen } from "@testing-library/react";

test("renders message when on prop is true", () => {
  render(<Spinner on={true} />);
  const value = screen.queryByText(/Please wait.../i);
  expect(value).not.toBeNull;
});

test("renders spinner when on prop is true", () => {
  const spinner = screen.queryByTestId("spinner");

  render(<Spinner on={true} />);
  expect(spinner).not.toBeNull;
});

test("renders null when on prop is false", () => {
  const spinner = screen.queryByTestId("spinner");

  const { rerender } = render(<Spinner on={true} />);
  expect(spinner).not.toBeNull;

  rerender(<Spinner on={false} />);
  expect(spinner).toBeNull;
});
