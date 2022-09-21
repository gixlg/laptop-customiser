import { fireEvent, render, waitFor } from "@testing-library/react";
import App from "./App";
import data from "../server/db.json";

describe("Laptop customiser", () => {
  beforeEach(() => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({
        json: () => Promise.resolve(data.components),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(data.price),
      });
  });

  it("should show the correct price when processor a is selected", async () => {
    const { getByTestId } = render(<App />);
    await waitFor(() => {
      fireEvent.click(getByTestId(`Processor_a`));
    })
    expect(getByTestId("total-price")).toHaveTextContent(`₹239900`);
  });

  it("should show the correct price when processor b is selected", async () => {
    const { getByTestId } = render(<App />);
    await waitFor(() => {
      fireEvent.click(getByTestId(`Processor_b`));
    });
    expect(getByTestId("total-price")).toHaveTextContent(`₹259900`);
  });
});