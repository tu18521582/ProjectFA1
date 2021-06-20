import React, { useEffect, useState } from "react";
import './App.css';
import Input from "./Input";


function App() {
    const [name, setName] = useState("");// ma chung khoan cua cong ty
    const [index, setIndex] = useState({});//index cua quy cua nam can tim 
    const [nameCompany, setnameCompany] = useState(""); //ten cua cong ty
    const [dataCanslim, setDataCanslim] = useState([]); //result cua api  
    const [company, setCompany] = useState({}); //hinh anh cua cong ty
    const array2019 = []; //index cua cac quy trong nam 2019
    const array2020 = []; //index cua cac quy trong nam 2020
    const array2021 = []; //index cua cac quy trong nam 2021

    useEffect(() => {
        async function fetchDataCompany() {
            try {
                //getImageCompany
                const requestUrl = `https://sb-api.stockbook.vn/api/stocks/${name}/stats?api_version=2.4`;
                const response = await fetch(requestUrl);
                const responseJSON = await response.json();
                setCompany(responseJSON);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchDataCompany();
    }, [name])

    useEffect(() => {
        async function fetchNameCompany() {
            try {
                //getNameCompany
                const requestUrl = `https://finfo-api.vndirect.com.vn/v4/stocks?fields=companyName&q=code:${name}`;
                const response = await fetch(requestUrl);
                const responseJSON = await response.json();
                setnameCompany(responseJSON.data[0].companyName);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchNameCompany();
    }, [name])

    useEffect(() => {
        async function fetchDataCanslim() {
            try {
                //getNetSaleAndEps
                const requestUrl = `https://api4.fialda.com/api/services/app/TechnicalAnalysis/GetFinancialHighlights?symbol=${name}`;
                const response = await fetch(requestUrl);
                const responseJSON = await response.json();
                const arr = responseJSON.result;
                if (arr.length == 32) {
                    setDataCanslim(arr);
                    //do nothing
                }
                else {
                    var m = 32 - arr.length;
                    var num = 32;
                    for (var i = 0; i < m; i++) {
                        arr[num - 1] = {
                            "year": 2022,
                            "quarter": 10,
                            "netSale": 0,
                            "eps": 0
                        };
                        num--;
                    }
                    setDataCanslim(arr);
                }
                if (arr) {
                    for (var j = 0; j < arr.length; j++) {
                        if (arr[j].year === 2019 && arr[j].quarter < 5) {
                            array2019[0] = j;
                            array2019[1] = j + 1;
                            array2019[2] = j + 2;
                            array2019[3] = j + 3;
                            j += 3;
                        }
                        else if (arr[j].year == 2020 && arr[j].quarter < 5) {
                            array2020[0] = j;
                            array2020[1] = j + 1;
                            array2020[2] = j + 2;
                            array2020[3] = j + 3;
                            j += 3;
                        }
                        else if (arr[j].year == 2021 && arr[j].quarter > 0) {
                            array2021[0] = j;
                        }
                    }
                    const objData = {
                        year2019: array2019,
                        year2020: array2020,
                        year2021: array2021
                    }
                    setIndex(objData);
                    console.log(objData);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchDataCanslim();
    }, [name])

    const setNameFunction = (inputData) => {
        setName(inputData);
    }
    console.log(dataCanslim);
    return (
        <div className="App">
            <div>
                <div>
                    <Input parentCallback={setNameFunction} />
                </div>
                <div style={{ display: "flex" }}>
                    <div>
                        <h1 style={{ color: "whitex" }}>
                            {company ? company.stockCompany : ""}
                        </h1>
                        <img style={{ width: "200px", marginTop: "10px" }} src={company ? company.avaUrl : ""} />
                    </div>
                    <h1 style={{ color: "yellow", marginTop: "50px", marginLeft: "30px", fontSize: "50px" }}>
                        {nameCompany ? nameCompany : ""}
                    </h1>
                </div>

            </div>
            {typeof (dataCanslim) !== 'undefined' && dataCanslim != null && dataCanslim.length > 0
                && index.year2020 != null && index.year2021 != null && index.year2019 != null ?
                <h1 style={{ color: "red" }}>
                    {`Tổng điểm: ${((((dataCanslim[(index.year2021)[0]].netSale / dataCanslim[(index.year2020)[0]].netSale) - 1) * 100) > 25 ? 15 :
                        (((dataCanslim[(index.year2021)[0]].netSale / dataCanslim[(index.year2020)[0]].netSale) - 1) * 100) / 25 * 15)
                        +

                        ((((dataCanslim[(index.year2020)[3]].netSale / dataCanslim[(index.year2019)[3]].netSale) - 1) * 100) > 25 ? 10 :
                            (((dataCanslim[(index.year2020)[3]].netSale / dataCanslim[(index.year2019)[3]].netSale) - 1) * 100) / 25 * 10)
                        +
                        (((((dataCanslim[(index.year2021)[0]].netSale + dataCanslim[(index.year2020)[1]].netSale + dataCanslim[(index.year2020)[2]].netSale +
                            dataCanslim[(index.year2020)[3]].netSale) / (dataCanslim[(index.year2020)[0]].netSale + dataCanslim[(index.year2019)[1]].netSale + dataCanslim[(index.year2019)[2]].netSale + dataCanslim[(index.year2019)[3]].netSale)) - 1) * 100) > 20 ?
                            10 :
                            ((((dataCanslim[(index.year2021)[0]].netSale + dataCanslim[(index.year2020)[1]].netSale + dataCanslim[(index.year2020)[2]].netSale +
                                dataCanslim[(index.year2020)[3]].netSale) / (dataCanslim[(index.year2020)[0]].netSale + dataCanslim[(index.year2019)[1]].netSale + dataCanslim[(index.year2019)[2]].netSale + dataCanslim[(index.year2019)[3]].netSale)) - 1) * 100) / 20 * 10)
                        +
                        (((((dataCanslim[(index.year2020)[0]].netSale + dataCanslim[(index.year2020)[1]].netSale + dataCanslim[(index.year2020)[2]].netSale +
                            dataCanslim[(index.year2020)[3]].netSale) / (dataCanslim[(index.year2019)[0]].netSale + dataCanslim[(index.year2019)[1]].netSale + dataCanslim[(index.year2019)[2]].netSale + dataCanslim[(index.year2019)[3]].netSale)) - 1) * 100) > 20 ?
                            5 :
                            ((((dataCanslim[(index.year2020)[0]].netSale + dataCanslim[(index.year2020)[1]].netSale + dataCanslim[(index.year2020)[2]].netSale +
                                dataCanslim[(index.year2020)[3]].netSale) / (dataCanslim[(index.year2019)[0]].netSale + dataCanslim[(index.year2019)[1]].netSale + dataCanslim[(index.year2019)[2]].netSale + dataCanslim[(index.year2019)[3]].netSale)) - 1) * 100) / 20 * 5)
                        +
                        ((((dataCanslim[(index.year2021)[0]].eps / dataCanslim[(index.year2020)[0]].eps) - 1) * 100) > 25 ? 20 :
                            (((dataCanslim[(index.year2021)[0]].eps / dataCanslim[(index.year2020)[0]].eps) - 1) * 100) / 25 * 20)
                        +
                        ((((dataCanslim[(index.year2020)[3]].eps / dataCanslim[(index.year2019)[3]].eps) - 1) * 100) > 25 ? 15 :
                            (((dataCanslim[(index.year2020)[3]].eps / dataCanslim[(index.year2019)[3]].eps) - 1) * 100) / 25 * 15)
                        +
                        (((((dataCanslim[(index.year2021)[0]].eps + dataCanslim[(index.year2020)[1]].eps + dataCanslim[(index.year2020)[2]].eps +
                            dataCanslim[(index.year2020)[3]].eps) / (dataCanslim[(index.year2020)[0]].eps + dataCanslim[(index.year2019)[1]].eps + dataCanslim[(index.year2019)[2]].eps + dataCanslim[(index.year2019)[3]].eps)) - 1) * 100) > 15 ?
                            15 :
                            ((((dataCanslim[(index.year2021)[0]].eps + dataCanslim[(index.year2020)[1]].eps + dataCanslim[(index.year2020)[2]].eps +
                                dataCanslim[(index.year2020)[3]].eps) / (dataCanslim[(index.year2020)[0]].eps + dataCanslim[(index.year2019)[1]].eps + dataCanslim[(index.year2019)[2]].eps + dataCanslim[(index.year2019)[3]].eps)) - 1) * 100) / 20 * 15)
                        +
                        (((((dataCanslim[(index.year2020)[0]].eps + dataCanslim[(index.year2020)[1]].eps + dataCanslim[(index.year2020)[2]].eps +
                            dataCanslim[(index.year2020)[3]].eps) / (dataCanslim[(index.year2019)[0]].eps + dataCanslim[(index.year2019)[1]].eps + dataCanslim[(index.year2019)[2]].eps + dataCanslim[(index.year2019)[3]].eps)) - 1) * 100) > 20 ?
                            10 :
                            ((((dataCanslim[(index.year2020)[0]].eps + dataCanslim[(index.year2020)[1]].eps + dataCanslim[(index.year2020)[2]].eps +
                                dataCanslim[(index.year2020)[3]].eps) / (dataCanslim[(index.year2019)[0]].eps + dataCanslim[(index.year2019)[1]].eps + dataCanslim[(index.year2019)[2]].eps + dataCanslim[(index.year2019)[3]].eps)) - 1) * 100) / 20 * 10)}`}
                </h1>
                :
                ""}
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>Tham chiếu</th>
                        <th>Tỷ trọng từng thành phần</th>
                        <th>C </th>
                        <th>A </th>
                    </tr>
                </thead>
                <tbody>
                    {/* EPS */}
                    {typeof (dataCanslim) !== 'undefined' && dataCanslim != null && dataCanslim.length > 0
                        && index.year2020 != null
                        ?
                        <>
                            <tr>
                                <td>Tiêu chí sale</td>
                                <td>{'1 quý gần nhất'}</td>
                                <td>{`Quý 1 2020: `}</td>
                                <td>{`Quý 1 2021: `}</td>
                                <td>{`Phần trăm tăng trưởng: `}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>{dataCanslim[(index.year2020)[0]].netSale}</td>
                                <td>{dataCanslim[(index.year2021)[0]].netSale}</td>
                                <td>{`${((dataCanslim[(index.year2021)[0]].netSale / dataCanslim[(index.year2020)[0]].netSale) - 1) * 100}`}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td style={{ color: "red" }}>25%</td>
                                <td style={{ color: "red" }}>15%</td>
                                <td id='sale1'>
                                    {(((dataCanslim[(index.year2021)[0]].netSale / dataCanslim[(index.year2020)[0]].netSale) - 1) * 100) > 25 ? 15 :
                                        (((dataCanslim[(index.year2021)[0]].netSale / dataCanslim[(index.year2020)[0]].netSale) - 1) * 100) / 25 * 15
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{'1 Quý trước đó gần nhất (C)'}</td>
                                <td>{`Quý 4 2019: `}</td>
                                <td>{`Quý 4 2020: `}</td>
                                <td>{`Phần trăm tăng trưởng: `}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>{`${dataCanslim[(index.year2019)[3]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[3]].netSale}`}</td>
                                <td>{`${((dataCanslim[(index.year2020)[3]].netSale / dataCanslim[(index.year2019)[3]].netSale) - 1) * 100}`}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td style={{ color: "red" }}>25%</td>
                                <td style={{ color: "red" }}>10%</td>
                                <td id='sale2'>
                                    {(((dataCanslim[(index.year2020)[3]].netSale / dataCanslim[(index.year2019)[3]].netSale) - 1) * 100) > 25 ? 10 :
                                        (((dataCanslim[(index.year2020)[3]].netSale / dataCanslim[(index.year2019)[3]].netSale) - 1) * 100) / 25 * 10
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{'Trailing 12 tháng gần nhất (A)'}</td>
                                <td>{`Quý 2 2019: `}</td>
                                <td>{`Quý 3 2019: `}</td>
                                <td>{`Quý 4 2019: `}</td>
                                <td>{`Quý 1 2020: `}</td>
                                <td>{`Quý 2 2020: `}</td>
                                <td>{`Quý 3 2020: `}</td>
                                <td>{`Quý 4 2020: `}</td>
                                <td>{`Quý 1 2021: `}</td>
                                <td>{`Phần trăm tăng trưởng: `}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>{`${dataCanslim[(index.year2019)[1]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2019)[2]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2019)[3]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[0]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[1]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[2]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[3]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2021)[0]].netSale}`}</td>
                                <td>{(((dataCanslim[(index.year2021)[0]].netSale + dataCanslim[(index.year2020)[1]].netSale + dataCanslim[(index.year2020)[2]].netSale +
                                    dataCanslim[(index.year2020)[3]].netSale) / (dataCanslim[(index.year2020)[0]].netSale + dataCanslim[(index.year2019)[1]].netSale + dataCanslim[(index.year2019)[2]].netSale + dataCanslim[(index.year2019)[3]].netSale)) - 1) * 100}</td>
                                <td style={{ color: "red" }}>20%</td>
                                <td style={{ color: "red" }}>10%</td>
                                <td></td>
                                <td id='sale3'>{((((dataCanslim[(index.year2021)[0]].netSale + dataCanslim[(index.year2020)[1]].netSale + dataCanslim[(index.year2020)[2]].netSale +
                                    dataCanslim[(index.year2020)[3]].netSale) / (dataCanslim[(index.year2020)[0]].netSale + dataCanslim[(index.year2019)[1]].netSale + dataCanslim[(index.year2019)[2]].netSale + dataCanslim[(index.year2019)[3]].netSale)) - 1) * 100) > 20 ?
                                    10 :
                                    ((((dataCanslim[(index.year2021)[0]].netSale + dataCanslim[(index.year2020)[1]].netSale + dataCanslim[(index.year2020)[2]].netSale +
                                        dataCanslim[(index.year2020)[3]].netSale) / (dataCanslim[(index.year2020)[0]].netSale + dataCanslim[(index.year2019)[1]].netSale + dataCanslim[(index.year2019)[2]].netSale + dataCanslim[(index.year2019)[3]].netSale)) - 1) * 100) / 20 * 10}
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{'Trailing 12 tháng gần nhất trước đó (A)'}</td>
                                <td>{`Quý 1 2019: `}</td>
                                <td>{`Quý 2 2019: `}</td>
                                <td>{`Quý 3 2019: `}</td>
                                <td>{`Quý 4 2019: `}</td>
                                <td>{`Quý 1 2020: `}</td>
                                <td>{`Quý 2 2020: `}</td>
                                <td>{`Quý 3 2020: `}</td>
                                <td>{`Quý 4 2020: `}</td>
                                <td>{`Phần trăm tăng trưởng: `}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>{`${dataCanslim[(index.year2019)[0]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2019)[1]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2019)[2]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2019)[3]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[0]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[1]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[2]].netSale}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[3]].netSale}`}</td>
                                <td>{(((dataCanslim[(index.year2020)[0]].netSale + dataCanslim[(index.year2020)[1]].netSale + dataCanslim[(index.year2020)[2]].netSale +
                                    dataCanslim[(index.year2020)[3]].netSale) / (dataCanslim[(index.year2019)[0]].netSale + dataCanslim[(index.year2019)[1]].netSale + dataCanslim[(index.year2019)[2]].netSale + dataCanslim[(index.year2019)[3]].netSale)) - 1) * 100}</td>
                                <td style={{ color: "red" }}>20%</td>
                                <td style={{ color: "red" }}>5%</td>
                                <td></td>
                                <td id='sale4'>{((((dataCanslim[(index.year2020)[0]].netSale + dataCanslim[(index.year2020)[1]].netSale + dataCanslim[(index.year2020)[2]].netSale +
                                    dataCanslim[(index.year2020)[3]].netSale) / (dataCanslim[(index.year2019)[0]].netSale + dataCanslim[(index.year2019)[1]].netSale + dataCanslim[(index.year2019)[2]].netSale + dataCanslim[(index.year2019)[3]].netSale)) - 1) * 100) > 20 ?
                                    5 :
                                    ((((dataCanslim[(index.year2020)[0]].netSale + dataCanslim[(index.year2020)[1]].netSale + dataCanslim[(index.year2020)[2]].netSale +
                                        dataCanslim[(index.year2020)[3]].netSale) / (dataCanslim[(index.year2019)[0]].netSale + dataCanslim[(index.year2019)[1]].netSale + dataCanslim[(index.year2019)[2]].netSale + dataCanslim[(index.year2019)[3]].netSale)) - 1) * 100) / 20 * 5}
                                </td>
                            </tr>














                            {/* Tieu chi EPS */}
                            <tr>
                                <td>Tiêu chí sale</td>
                                <td>{'1 quý gần nhất'}</td>
                                <td>{`Quý 1 2020: `}</td>
                                <td>{`Quý 1 2021: `}</td>
                                <td>{`Phần trăm tăng trưởng: `}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>{dataCanslim[(index.year2020)[0]].eps}</td>
                                <td>{dataCanslim[(index.year2021)[0]].eps}</td>
                                <td>{`${((dataCanslim[(index.year2021)[0]].eps / dataCanslim[(index.year2020)[0]].eps) - 1) * 100}`}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td style={{ color: "red" }}>25%</td>
                                <td style={{ color: "red" }}>15%</td>
                                <td id='eps1'>
                                    {(((dataCanslim[(index.year2021)[0]].eps / dataCanslim[(index.year2020)[0]].eps) - 1) * 100) > 25 ? 15 :
                                        (((dataCanslim[(index.year2021)[0]].eps / dataCanslim[(index.year2020)[0]].eps) - 1) * 100) / 25 * 15
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{'1 Quý trước đó gần nhất (C)'}</td>
                                <td>{`Quý 4 2019: `}</td>
                                <td>{`Quý 4 2020: `}</td>
                                <td>{`Phần trăm tăng trưởng: `}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>{`${dataCanslim[(index.year2019)[3]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[3]].eps}`}</td>
                                <td>{`${((dataCanslim[(index.year2020)[3]].eps / dataCanslim[(index.year2019)[3]].eps) - 1) * 100}`}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td style={{ color: "red" }}>25%</td>
                                <td style={{ color: "red" }}>10%</td>
                                <td id='eps2'>
                                    {(((dataCanslim[(index.year2020)[3]].eps / dataCanslim[(index.year2019)[3]].eps) - 1) * 100) > 25 ? 10 :
                                        (((dataCanslim[(index.year2020)[3]].eps / dataCanslim[(index.year2019)[3]].eps) - 1) * 100) / 25 * 10
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{'Trailing 12 tháng gần nhất (A)'}</td>
                                <td>{`Quý 2 2019: `}</td>
                                <td>{`Quý 3 2019: `}</td>
                                <td>{`Quý 4 2019: `}</td>
                                <td>{`Quý 1 2020: `}</td>
                                <td>{`Quý 2 2020: `}</td>
                                <td>{`Quý 3 2020: `}</td>
                                <td>{`Quý 4 2020: `}</td>
                                <td>{`Quý 1 2021: `}</td>
                                <td>{`Phần trăm tăng trưởng: `}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>{`${dataCanslim[(index.year2019)[1]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2019)[2]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2019)[3]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[0]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[1]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[2]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[3]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2021)[0]].eps}`}</td>
                                <td>{(((dataCanslim[(index.year2021)[0]].eps + dataCanslim[(index.year2020)[1]].eps + dataCanslim[(index.year2020)[2]].eps +
                                    dataCanslim[(index.year2020)[3]].eps) / (dataCanslim[(index.year2020)[0]].eps + dataCanslim[(index.year2019)[1]].eps + dataCanslim[(index.year2019)[2]].eps + dataCanslim[(index.year2019)[3]].eps)) - 1) * 100}</td>
                                <td style={{ color: "red" }}>20%</td>
                                <td style={{ color: "red" }}>10%</td>
                                <td></td>
                                <td id='eps3'>{((((dataCanslim[(index.year2021)[0]].eps + dataCanslim[(index.year2020)[1]].eps + dataCanslim[(index.year2020)[2]].eps +
                                    dataCanslim[(index.year2020)[3]].eps) / (dataCanslim[(index.year2020)[0]].eps + dataCanslim[(index.year2019)[1]].eps + dataCanslim[(index.year2019)[2]].eps + dataCanslim[(index.year2019)[3]].eps)) - 1) * 100) > 20 ?
                                    10 :
                                    ((((dataCanslim[(index.year2021)[0]].eps + dataCanslim[(index.year2020)[1]].eps + dataCanslim[(index.year2020)[2]].eps +
                                        dataCanslim[(index.year2020)[3]].eps) / (dataCanslim[(index.year2020)[0]].eps + dataCanslim[(index.year2019)[1]].eps + dataCanslim[(index.year2019)[2]].eps + dataCanslim[(index.year2019)[3]].eps)) - 1) * 100) / 20 * 10}
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{'Trailing 12 tháng gần nhất trước đó (A)'}</td>
                                <td>{`Quý 1 2019: `}</td>
                                <td>{`Quý 2 2019: `}</td>
                                <td>{`Quý 3 2019: `}</td>
                                <td>{`Quý 4 2019: `}</td>
                                <td>{`Quý 1 2020: `}</td>
                                <td>{`Quý 2 2020: `}</td>
                                <td>{`Quý 3 2020: `}</td>
                                <td>{`Quý 4 2020: `}</td>
                                <td>{`Phần trăm tăng trưởng: `}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>{`${dataCanslim[(index.year2019)[0]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2019)[1]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2019)[2]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2019)[3]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[0]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[1]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[2]].eps}`}</td>
                                <td>{`${dataCanslim[(index.year2020)[3]].eps}`}</td>
                                <td>{(((dataCanslim[(index.year2020)[0]].eps + dataCanslim[(index.year2020)[1]].eps + dataCanslim[(index.year2020)[2]].eps +
                                    dataCanslim[(index.year2020)[3]].eps) / (dataCanslim[(index.year2019)[0]].eps + dataCanslim[(index.year2019)[1]].eps + dataCanslim[(index.year2019)[2]].eps + dataCanslim[(index.year2019)[3]].eps)) - 1) * 100}</td>
                                <td style={{ color: "red" }}>20%</td>
                                <td style={{ color: "red" }}>5%</td>
                                <td></td>
                                <td id='eps4'>{((((dataCanslim[(index.year2020)[0]].eps + dataCanslim[(index.year2020)[1]].eps + dataCanslim[(index.year2020)[2]].eps +
                                    dataCanslim[(index.year2020)[3]].eps) / (dataCanslim[(index.year2019)[0]].eps + dataCanslim[(index.year2019)[1]].eps + dataCanslim[(index.year2019)[2]].eps + dataCanslim[(index.year2019)[3]].eps)) - 1) * 100) > 20 ?
                                    5 :
                                    ((((dataCanslim[(index.year2020)[0]].eps + dataCanslim[(index.year2020)[1]].eps + dataCanslim[(index.year2020)[2]].eps +
                                        dataCanslim[(index.year2020)[3]].eps) / (dataCanslim[(index.year2019)[0]].eps + dataCanslim[(index.year2019)[1]].eps + dataCanslim[(index.year2019)[2]].eps + dataCanslim[(index.year2019)[3]].eps)) - 1) * 100) / 20 * 5}
                                </td>
                            </tr>
                        </>
                        : ""}
                </tbody>
            </table>
        </div>
    );
}

export default App;
