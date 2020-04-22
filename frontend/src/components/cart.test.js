import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import Cart from "./Cart";
import { convertToMoney } from '../App';
jest.mock('../App');

jest.mock('rc-util/lib/Portal');

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('The cart component.', () => {
  it("renders without any products if the list or id are empty.", () => {
    act(() => {
      render(<Cart convertToMoney={convertToMoney} />, container);
    });
    expect(container.textContent).toBe("Cart Summary0 products in your cartAdd items to your cart!Taxes$NaNCart Total$NaNCheckout");
  });

  it('renders the cart component correctly.', () => {
    const tree = renderer
      .create(<Cart convertToMoney={convertToMoney} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});