import {fireEvent, render, waitFor, screen, within} from "@testing-library/react";
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

    it.each([{
        processorId: `Processor_a`,
        price: "₹239900"
    }, {
        processorId: `Processor_b`,
        price: "₹259900"
    }])("should show the correct price when processor %s is selected", async ({processorId, price}) => {
        const {getByTestId} = render(<App/>);
        await waitFor(() => {
            fireEvent.click(getByTestId(processorId));
        })
        expect(getByTestId("total-price")).toHaveTextContent(price);
    });


    it.each([`Processor_a`, `Processor_b`])("should show the correct selection when processor %s is selected", async (processorId) => {
        const {getByTestId} = render(<App/>);
        await waitFor(() => {
            fireEvent.click(getByTestId(processorId));
        })
        expect(getByTestId(processorId)).toHaveClass("variant--selected");
    });

    it.each([{
        processorId: `Processor_a`,
        expectedVariant: "2.3GHz 8-core 9th-generation Intel Core processor, Turbo Boost up to 4.8GHz"
    }, {
        processorId: `Processor_b`,
        expectedVariant: "2.4GHz 8-core 9th-generation Intel Core processor, Turbo Boost up to 5.0GHz"
    }])("should show the correct summary when %s is selected", async ({processorId, expectedVariant}) => {
        const {getByTestId} = render(<App/>);
        await waitFor(() => {
            fireEvent.click(getByTestId(processorId));
        })

        let summaryList = screen.getByRole("list", {
            name: "summary-list"
        });

        expect(within(summaryList).getByText(expectedVariant)).toBeVisible()

    });

    it("should how the correct list of processors", async () => {
        render(<App/>);

        waitFor(() => {
            let processorList = screen.getByRole("list", {
                name: "processor-list"
            });
            expect(within(processorList).getAllByRole("listitem")).toHaveLength(2)
        })
    })

    it("should the macbook logo be clickable", () => {
        render(<App/>);

        expect(screen.getByRole("link", {name: "MacBook Pro"})).toHaveAttribute("href", "https://www.apple.com/in/macbook-pro")
    })

});
