import React from "react";

interface ColorInfo {
  range: string;
  color: string;
  description: string;
}

const colorMap: ColorInfo[] = [
  { range: "< 45%", color: "#f1959b", description: "Trump (low support)" },
  { range: "< 45%", color: "#a8d5ba", description: "Non-Trump (low support)" },
  { range: "45% - 49%", color: "#f1959b", description: "Trump (competitive)" },
  { range: "45% - 49%", color: "#8ecba0", description: "Non-Trump (competitive)" },
  { range: "50% - 54%", color: "#ec6d76", description: "Trump (moderate lead)" },
  { range: "50% - 54%", color: "#76bf86", description: "Non-Trump (moderate lead)" },
  { range: "55% - 59%", color: "#e74c3c", description: "Trump (strong lead)" },
  { range: "55% - 59%", color: "#63a96f", description: "Non-Trump (strong lead)" },
  { range: "60%+", color: "#c0392b", description: "Trump (dominant lead)" },
  { range: "60%+", color: "#4e8a58", description: "Non-Trump (dominant lead)" },
];

const ColorCodes: React.FC = () => {
  return (
    <div className="p-4 border rounded-lg">
           <h1 className="py-4 text-xl font-extrabold ">AMERICAN ELECTIONS 2K24</h1>
      <h2>Election Result Color Legend</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {colorMap.map((info, index) => (
          <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <span
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: info.color,
                display: "inline-block",
                marginRight: "10px",
                border: "1px solid #ccc",
              }}
            ></span>
            <span>
              {info.range}: {info.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColorCodes;
