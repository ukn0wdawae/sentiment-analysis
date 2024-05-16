import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AnalyzeForm = () => {
  const [review, setReview] = useState("");
  const [result, setResult] = useState("");
  const [fileData, setFileData] = useState(null);
  const [chartData, setChartData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://backend-sentiment-analyzer.fly.dev/",
        { review }
      );
      setResult(response.data.sentiment);
    } catch (error) {
      console.error(
        "Error analyzing sentiment:",
        error.response ? error.response.data : error.message
      );
      setResult("Error analyzing sentiment");
    }
  };

  const handleFileChange = (e) => {
    setFileData(e.target.files[0]);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!fileData) {
      alert("Please upload a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", fileData);
    try {
      const response = await axios.post(
        "https://backend-sentiment-analyzer.fly.dev/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const positiveCount = response.data.filter(
        (res) => res.sentiment === "positive"
      ).length;
      const negativeCount = response.data.filter(
        (res) => res.sentiment === "negative"
      ).length;
      setChartData([
        { name: "Positive", count: positiveCount },
        { name: "Negative", count: negativeCount },
      ]);
    } catch (error) {
      console.error(
        "Error analyzing file:",
        error.response ? error.response.data : error.message
      );
      setResult("Error analyzing file");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Sentiment Analysis</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center mb-4">
        <textarea
          className="border p-2 mb-4"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="4"
          cols="50"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Analyze
        </button>
      </form>
      {result && <p className="mb-4">Sentiment: {result}</p>}
      <hr className="w-full mb-4" />
      <h2 className="text-2xl font-semibold mb-4">Upload JSON File</h2>
      <form
        onSubmit={handleFileSubmit}
        className="flex flex-col items-center mb-4"
      >
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Analyze File
        </button>
      </form>
      {chartData.length > 0 && (
        <div className="flex justify-center">
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default AnalyzeForm;
