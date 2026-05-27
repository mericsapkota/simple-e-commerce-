import React, { useState } from "react";
import { Client } from "@gradio/client";
import { any } from "zod";
export default function AppleChecker() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(any);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // paste your live Gradio link here from Colab (make sure to include /api/predict)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); // Reset results on new upload
    }
  };

  const analyzeApple = async () => {
    if (!image) return alert("Please upload an apple photo first!");
    setLoading(true);

    try {
      // Connect directly to the base share link provided by your Colab session
      const app = await Client.connect("https://6b66eade8d03f6a412.gradio.live/");

      // Pass the raw image file object directly to the prediction endpoint
      // The library handles all base64 parsing and routing strings automatically
      const result = await app.predict("/predict", {
        input_image: image,
      });

      if (result.data && result.data[0]) {
        setResult(result.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Gradio Client Error:", error);
      alert("Failed to extract data from the running AI endpoint.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "sans-serif",
        border: "1px solid #ddd",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      <h2>🍎 Apple Condition Checker</h2>
      <p style={{ color: "#666", fontSize: "14px" }}>AI checks your fruit via Cloud Pipeline</p>

      {/* Upload Button Block */}
      <div style={{ margin: "20px 0" }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          id="apple-upload"
          style={{ display: "none" }}
        />
        <label
          htmlFor="apple-upload"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "inline-block",
          }}
        >
          Select Apple Image
        </label>
      </div>

      {/* Live Image Preview */}
      {preview && (
        <div style={{ margin: "20px 0" }}>
          <img
            src={preview}
            alt="Apple preview"
            style={{
              maxWidth: "100%",
              maxHeight: "250px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      )}

      {/* Action Button */}
      {image && (
        <button
          onClick={analyzeApple}
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "AI is analyzing image..." : "Scan Apple Quality"}
        </button>
      )}

      {/* Results Display Panel */}
      {result && (
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            textAlign: "left",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", borderBottom: "1px solid #ddd", paddingBottom: "5px" }}>
            AI Analysis Verdict:
          </h3>
          <p style={{ margin: "5px 0" }}>
            🟢 <strong>Healthy Match:</strong> {(result.healthy * 100).toFixed(1)}%
          </p>
          <p style={{ margin: "5px 0" }}>
            🟤 <strong>Rotten/Bruised Match:</strong> {(result.rotten * 100).toFixed(1)}%
          </p>

          <div
            style={{
              marginTop: "12px",
              fontWeight: "bold",
              color: result.healthy > result.rotten ? "#28a745" : "#dc3545",
              textAlign: "center",
              fontSize: "18px",
            }}
          >
            Result: {result.healthy > result.rotten ? "GOOD CONDITION ✅" : "BAD CONDITION ❌"}
          </div>
        </div>
      )}
    </div>
  );
}
