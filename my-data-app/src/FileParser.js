import React, { useState } from "react";
import { useCSVReader, formatFileSize } from "react-papaparse";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Container, Row, Col, Card } from "react-bootstrap";

Chart.register(CategoryScale);

function generatePastelColors(count) {
  const colors = [];
  const baseHueStep = 360 / Math.max(count, 8); // ensure spread for small counts

  const hueOffsets = Array.from({ length: count }, (_, i) => i * baseHueStep);

  // Shuffle hues to prevent neighboring pastels (e.g., pink next to peach)
  for (let i = hueOffsets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hueOffsets[i], hueOffsets[j]] = [hueOffsets[j], hueOffsets[i]];
  }

  for (let i = 0; i < count; i++) {
    const hue = hueOffsets[i];
    const saturation = 60 + Math.random() * 10; // 60–70%
    const lightness = 80 + Math.random() * 5; // 80–85%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}

export default function Reader() {
  const { CSVReader } = useCSVReader();
  const [col, setCol] = useState([]); // headers
  const [val, setVal] = useState([]); // values
  const [start, setStart] = useState([]); // values
  const [end, setEnd] = useState([]); // values

  const [colors, setColors] = useState([]); // values

  return (
    <CSVReader
      onUploadAccepted={({ data }) => {
        // return if no data
        if (!data.length) return;

        // set custom categories
        data.forEach((row) => {
          if (row.Description?.toLowerCase().includes("kroger")) {
            row.Category = "Groceries";
          } else if (row.Description?.toLowerCase().includes("wal-mart")) {
            row.Category = "Groceries";
          } else if (
            row.Description?.toLowerCase().includes("international foods")
          ) {
            row.Category = "Groceries";
          } else if (row.Description?.toLowerCase().includes("ymca")) {
            row.Category = "Gym Membership";
          } else if (row.Category?.toLowerCase().includes("health care")) {
            row.Category = "Healthcare";
          } else if (row.Description?.toLowerCase().includes("subs")) {
            row.Category = "Dining";
          }
        });

        // define drop list
        let dropList = ["undefined", "payment/credit", "professional services"];
        data = data.filter(
          (row) => !dropList.includes(row.Category?.toLowerCase())
        );

        setColors(generatePastelColors(data.length));

        // get headers as an array of strings
        const headers = Object.keys(data[0]);

        // group & sum
        const grouped = data.reduce((acc, row) => {
          const desc = row.Category;
          const debit = parseFloat(row.Debit) || 0;
          acc[desc] = (acc[desc] || 0) + debit;
          return acc;
        }, {});

        // turn map into chart-friendly arrays
        setCol(Object.keys(grouped));
        setVal(Object.values(grouped));
        setEnd(data[0]["Transaction Date"]);
        setStart(data[data.length - 1]["Transaction Date"]);
        console.log("labels:", col);
        console.log("values:", val);
      }}
      config={{ worker: true, header: true }}
      noDrag
    >
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }) => (
        <>
          {" "}
          <Container>
            <Row>
              <Col md={6} className="mx-auto">
                {" "}
                {/* 4 out of 12 columns = 1/3 */}
                <Card className="FinanceCard">
                  <Card.Body>
                    <div {...getRootProps()}>
                      {acceptedFile ? (
                        <>
                          <div className="info-container">
                            <div>
                              <p>{acceptedFile.name}</p>
                              <span>{formatFileSize(acceptedFile.size)}</span>
                            </div>
                            <div className="info__progress">
                              <ProgressBar />
                            </div>
                            <div
                              {...getRemoveFileProps()}
                              className="info__remove"
                            >
                              <Remove color={"red"} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4>Enter a file:</h4>
                          <button>Upload file</button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mx-auto">
                {" "}
                {/* 4 out of 12 columns = 1/3 */}
                <div {...getRootProps()}>
                  {acceptedFile ? (
                    <>
                      <Card className="FinanceCard">
                        <Card.Body>
                          <p>
                            Total: ${val.reduce((a, b) => a + b, 0).toFixed(2)}
                          </p>
                          <p>
                            {start} to {end}
                          </p>
                          <div className="DoughnutChart">
                            {col.length > 0 && val.length > 0 && (
                              <Doughnut
                                data={{
                                  labels: col,
                                  datasets: [
                                    {
                                      label: "Total",
                                      data: val,
                                      backgroundColor: colors,
                                    },
                                  ],
                                }}
                              />
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </CSVReader>
  );
}
