import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Papa from "papaparse";

const CSVManager = () => {
  const [csvData, setCsvData] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
        toast.success("File uploaded successfully.");
      },
      error: (error) => {
        toast.error("Error parsing CSV file.");
        console.error(error);
      },
    });
  };

  const handleDownload = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditRow = (index, field, value) => {
    const updatedData = [...csvData];
    updatedData[index][field] = value;
    setCsvData(updatedData);
  };

  const handleDeleteRow = (index) => {
    const updatedData = csvData.filter((_, i) => i !== index);
    setCsvData(updatedData);
  };

  const handleAddRow = () => {
    setCsvData([...csvData, {}]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">CSV Manager</h1>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileChange} />
        <Button onClick={handleUpload} className="ml-2">Upload</Button>
      </div>
      <div className="overflow-auto mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              {csvData.length > 0 && Object.keys(csvData[0]).map((key) => (
                <TableHead key={key}>{key}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.keys(row).map((key) => (
                  <TableCell key={key}>
                    <Input
                      value={row[key]}
                      onChange={(e) => handleEditRow(rowIndex, key, e.target.value)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="outline" onClick={() => handleDeleteRow(rowIndex)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button onClick={handleAddRow} className="mb-4">Add Row</Button>
      <Button onClick={handleDownload}>Download CSV</Button>
    </div>
  );
};

export default CSVManager;