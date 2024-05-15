import React, { useState } from "react";
import axios from "axios";

const AnalyzeForm = () => {
  const [review, setReview] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/analyze", { review });
      setResult(response.data.sentiment);
    } catch (error) {
      console.error(
        "Error analyzing sentiment:",
        error.response ? error.response.data : error.message
      );
      setResult("Error analyzing sentiment");
    }
  };

  return (
    <div>
      <h1>Sentiment Analysis</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="4"
          cols="50"
        />
        <button type="submit">Analyze</button>
      </form>
      {result && <p>Sentiment: {result}</p>}
    </div>
  );
};

export default AnalyzeForm;
