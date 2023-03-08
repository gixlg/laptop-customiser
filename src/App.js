import React, { useState, useEffect } from "react";
import { getDefaultPrice } from "./service";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [processorList, setProcessorList] = useState([]);
  const [error, setError] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [priceError, setPriceError] = useState(null);

  useEffect(() => {
    const getMacComponents = () => {
      return fetch(`http://localhost:3004/components`)
        .then((response) => response.json())
        .then((data) => {
          const newData = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].type === "proe") {
              if (data[i].default === true) {
                data[i].selected = true;
              } else {
                data[i].selected = false;
              }
              newData.push(data[i]);
            }
          }
          setProcessorList(newData);
          setLoading(false);
        })
        .catch(() => {
          setError(new Error("could not fetch the customisable components"));
          setLoading(false);
        });
    };
    setLoading(true);
    getMacComponents();
    setPriceLoading(true);
    getDefaultPrice()
      .then((data) => {
        setPrice(data.value);
      })
      .catch((error) => {
        setPriceError(error);
      })
      .finally(() => {
        setPriceLoading(false);
      });
  }, []);

  const setSelectedVariant = (variantSerialNo) => {
    const newArr = [];
    for (let i = 0; i < processorList.length; i++) {
      const variant = processorList[i];
      newArr.push({
        ...variant,
        selected: variant.serialNo === variantSerialNo,
      });
    }
    setProcessorList(newArr);
  };

  const getAddOnPrice = () => {
    let selectedProcessor = null;
    for (let i = 0; i < processorList.length; i++) {
      const variant = processorList[i];
      if (variant.selected) {
        selectedProcessor = variant;
        break;
      }
    }
    return selectedProcessor?.addOnPrice ?? 0;
  };

  return (
    <>
      <header>
        <div className="header__content">
          <a
            className="header__link"
            href="https://www.apple.com/in/macbook-pro"
          >
            <strong>MacBook Pro</strong>
          </a>
        </div>
      </header>
      <main>
        <div className="main__container">
          <div className="main__content">
            <section>
              <img
                className="macbook-img"
                alt="macbook pro"
                src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16touch-space-select-201911?wid=1808&hei=1686&fmt=jpeg&qlt=80&.v=1572825197207"
              />
            </section>
            <section className="configuration">
              {loading ? (
                <h1>loading...</h1>
              ) : error ? (
                <h1>Something went wrong. Please try again later</h1>
              ) : (
                <>
                  <h1 className="mt-0">
                    Customise your 16‑inch MacBook Pro - Space Grey
                  </h1>
                  <ul className="summary-list" aria-label="summary-list">
                    <li>{processorList.find((c) => c.selected)?.variant}</li>
                    <li>16-inch Retina display with True Tone</li>
                    <li>Four Thunderbolt 3 ports</li>
                    <li>Touch Bar and Touch ID</li>
                    <li>Backlit Magic Keyboard - US English</li>
                  </ul>
                  {!!processorList.length && (
                    <div className="component">
                      <h3 className="component__name">Processor</h3>
                      <ul aria-label="processor-list">
                        {processorList.map((v) => (
                          <li
                            key={`Processor_${v.serialNo}`}
                            className={`variant ${
                              v.selected ? "variant--selected" : ""
                            }`}
                            data-testid={`Processor_${v.serialNo}`}
                            onClick={() => setSelectedVariant(v.serialNo)}
                          >
                            <p className="variant__name">
                              <strong>{v.variant}</strong>
                            </p>
                            {v.addOnPrice > 0 && <p>+ ₹{v.addOnPrice}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
        <div className="price container">
          <div className="price__content">
            <h1 className="price__value">
              Total:
              {priceLoading ? (
                <>{` loading...`}</>
              ) : priceError ? (
                "Something went wrong. Please try again later"
              ) : (
                <span data-testid="total-price">{` ₹${
                  price + getAddOnPrice()
                }`}</span>
              )}
            </h1>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
