import React, { useState } from "react";
import db from "./firebase";

const BarcodeScanner = () => {
  const [inventoryTitle, setInventoryTitle] = useState("");
  const [barcode, setBarcode] = useState("");
  const [inventoryItems, setInventoryItems] = useState([]);

  const handleTitleChange = (event) => {
    setInventoryTitle(event.target.value);
  };

  const handleBarcodeChange = (event) => {
    if (event.key === "Enter" && barcode.trim() !== "") {
      const value = barcode.trim();
      const existingItemIndex = inventoryItems.findIndex(
        (item) => item.code === value
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...inventoryItems];
        updatedItems[existingItemIndex].quantity += 1;
        setInventoryItems(updatedItems);
      } else {
        const newItem = { code: value, quantity: 1, date: new Date() };
        setInventoryItems([...inventoryItems, newItem]);
      }

      setBarcode(""); // Limpa o campo após adicionar o item
    }
  };

  const handleSaveInventory = async () => {
    if (inventoryTitle.trim() === "") {
      alert("Introduzca un título para el inventario");
      return;
    }

    const shouldSave = window.confirm(
      "¿Estás seguro que deseas guardar el inventario?"
    );
    if (!shouldSave) return;

    setInventoryItems([]);
    setInventoryTitle("");
    setBarcode("");

    await db.collection("inventories").add({
      title: inventoryTitle,
      items: inventoryItems,
      date: new Date(),
    });
    window.location.reload();
  };

  const handleItemDelete = (index) => {
    const updatedItems = [...inventoryItems];
    updatedItems.splice(index, 1);
    setInventoryItems(updatedItems);
  };

  const handleDecreaseQuantity = (index) => {
    const updatedItems = [...inventoryItems];
    if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
    }
    setInventoryItems(updatedItems);
  };

  const getTotalItems = () => {
    return inventoryItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">
        Crear nuevo inventario
      </h1>
      <div className="mb-4">
        <input
          type="text"
          className="w-full border p-2 mb-2"
          placeholder="Título"
          value={inventoryTitle}
          onChange={handleTitleChange}
        />
        <input
          type="text"
          className="w-full border p-2 mb-2"
          placeholder="Codigo de barras"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyPress={handleBarcodeChange}
        />
        <button
          className="bg-green-500 hover:bg-green-700 text-white p-2 rounded mt-4 mb-4"
          onClick={handleSaveInventory}
        >
          Guardar
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Codigo</th>
              <th className="border p-2">Cantidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, index) => (
              <tr key={index}>
                <td className="border p-2 text-sm">{item.code}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2 ">
                  <button
                    onClick={() => handleDecreaseQuantity(index)}
                    className="mr-2 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="w-4 h-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleItemDelete(index)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">Total: {getTotalItems()}</div>
    </div>
  );
};

export default BarcodeScanner;
