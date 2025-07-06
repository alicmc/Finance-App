import React, { useState } from 'react'
import { useCSVReader, formatFileSize } from "react-papaparse";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Pie } from 'react-chartjs-2';
import { Container, Row, Col, Card } from 'react-bootstrap';

Chart.register(CategoryScale);

export default function Reader() {
    const { CSVReader } = useCSVReader();
    const [col, setCol] = useState([]); // headers
    const [val, setVal] = useState([]); // values

    return (
        <CSVReader
            onUploadAccepted={({ data }) => {
                // data is Array<Object>
                if (!data.length) return;

                // 1) Get headers as an array of strings
                const headers = Object.keys(data[0]);

                // 2) Group & sum
                const grouped = data.reduce((acc, row) => {
                    const desc = row.Category;
                    const debit = parseFloat(row.Debit) || 0;
                    acc[desc] = (acc[desc] || 0) + debit;
                    return acc;
                }, {});

                // 3) Turn map into chart-friendly arrays
                setCol(Object.keys(grouped));
                setVal(Object.values(grouped));
                console.log('labels:', col);
                console.log('values:', val);
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
                <> <Container>
                    <Row>
                        <Col md={6} className="mx-auto">  {/* 4 out of 12 columns = 1/3 */}
                            <Card className='TheCard'>
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
                                                    <div {...getRemoveFileProps()} className="info__remove">
                                                        <Remove color={"red"} />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <button>Upload file</button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mx-auto">  {/* 4 out of 12 columns = 1/3 */}
                            <div {...getRootProps()}>
                                {acceptedFile ? (
                                    <>
                                        <Card className='TheCard'>
                                            <Card.Body>
                                                <p>Total: {val.reduce((a, b) => a + b, 0)}</p>
                                                <div className="App">
                                                    {col.length > 0 && val.length > 0 && (
                                                        <Pie
                                                            data={{
                                                                labels: col,
                                                                datasets: [
                                                                    {
                                                                        label: 'My Data',
                                                                        data: val,
                                                                        backgroundColor: [
                                                                            '#FF6384',
                                                                            '#36A2EB',
                                                                            '#FFCE56',
                                                                            '#4BC0C0',
                                                                            '#9966FF',
                                                                            '#FF9F40'
                                                                        ],
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
            )
            }
        </CSVReader >
    );
}