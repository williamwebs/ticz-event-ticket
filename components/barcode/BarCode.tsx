"use client";

import JsBarcode from "jsbarcode";
import React, { useEffect, useRef } from "react";

interface BarCodeProps {
  value: string;
}

const BarCode = ({ value }: BarCodeProps) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: "upc",
        displayValue: true,
        fontOptions: "bold",
        lineColor: "#ffffff",
        width: 2,
        height: 30,
        margin: 0,
        background: "#041E23",
      });
    }
  }, [value]);

  return <svg ref={barcodeRef} className="w-full h-full"></svg>;
};

export default BarCode;
