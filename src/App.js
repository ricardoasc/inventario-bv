import React, { useState, useEffect } from "react";
import db from "./firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import Papa from "papaparse";
import BarcodeScanner from "./BarcodeScanner";

const App = () => {
  const [inventories, setInventoryItems] = useState([]);

  const fetchData = () => {
    const fetch = async () => {
      const inventoriesCollection = await db.collection("inventories").get();
      const inventoryData = inventoriesCollection.docs.map((doc) => {
        const inventory = doc.data();
        return {
          id: doc.id,
          title: inventory.title,
          date: inventory.date,
          count: inventory.items.reduce(
            (total, item) => total + item.quantity,
            0
          ),
          items: inventory.items,
        };
      });
      setInventoryItems(inventoryData);
    };

    fetch();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCSV = (item) => {
    const csvData = item.items.map((it) => ({
      code: it.code,
      date: new Date(it.date.seconds * 1000).toLocaleString(), // Suponhamos que 'date' seja um atributo em seus objetos
      quantity: it.quantity,
    }));

    const csv = Papa.unparse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${item.title}.csv`);
    link.click();

    window.location.reload();
  };

  const handleDeleteInventory = async (id) => {
    await db.collection("inventories").doc(id).delete();
    window.location.reload();
  };

  return (
    <div>
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold text-blue-900">Inventario BV-HOME</h1>
      </div>

      <div className="flex">
        <div className="flex-col w-1/2 p-4 ml-12">
          <BarcodeScanner></BarcodeScanner>
        </div>
        <div className="flex-col p-4 mr-24 mt-12 w-full">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventories.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>
                      <small>
                        {new Date(item.date.seconds * 1000).toLocaleString()}
                      </small>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleExportCSV(item)}
                      >
                        Exportar CSV
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteInventory(item.id)}
                      >
                        Borrar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default App;
