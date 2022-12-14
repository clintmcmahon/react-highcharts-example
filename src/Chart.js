import React, { useEffect, useState } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsMore from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting'

HighchartsMore(Highcharts);
HC_exporting(Highcharts);

function Chart() {
    const [options, setOptions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const url = "https://data.rcc-acis.org/StnData";

    useEffect(() => {
        setIsLoading(true);
        const fetchRecords = async () => {
            const query = {
                elems: [
                    {
                        interval: "mly",
                        duration: 1,
                        name: "avgt",
                        reduce: { "reduce": "mean" },
                        prec: 3
                    }],
                sid: "MSPthr 9",
                sDate: "2021-01-01",
                eDate: "2021-12-31",
                meta: ["name", "state", "sids"]
            }

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: JSON.stringify(query)
            });

            const responseData = await response.json();

            const categories = [];
            const seriesData = [];
            responseData.data.map((item) => {
                categories.push(item[0]);
                seriesData.push(parseInt(item[1]));
            });

            setOptions({
                title: {
                    text: `2021 Average temperatures in Minneapolis`
                },
                xAxis: {
                    categories: categories
                },
                yAxis: {
                    title: {
                        text: "Temperature (°F)"
                    }
                },
                tooltip: {
                    crosshairs: true,
                    shared: true,
                    valueSuffix: '°F'
                },
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                    }
                },
                series: [
                    {
                        name: 'Average Temperature',
                        color: "#7393B3",
                        data: seriesData,
                        zIndex: 1,

                    }
                ]
            });

            setIsLoading(false);
        }

        fetchRecords();

    }, []);

    return (
        <Row>
            <Col xs={12}>
                <div>
                    <h1>React Highcharts example</h1>
                    <Row>
                        <Col s={12}>
                            {isLoading &&
                                <div>Loading data...</div>
                            }
                            {!isLoading && options &&
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options}
                                />
                            }
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    );
}

export default Chart;