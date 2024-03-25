import './App.scss';
import FirstChart from './FirstChart.js';
import React, { useState, useEffect } from "react";
import { Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ComposedChart, Label, Bar } from 'recharts';
import ChartJS from 'chart.js/auto';
import { CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import ChartDataLabels from "chartjs-plugin-datalabels";

function App() {

  // 그래프 선택
  const [chart, setChart] = useState("연령대별 남녀 인구수");

  const [populationData, setPopulationData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('01');

  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [filteredData3, setFilteredData3] = useState([]);
  const [filteredData4, setFilteredData4] = useState([]);
  const [filteredData5, setFilteredData5] = useState([]);

  // api 호출하여 데이터 받아오는 코드
  useEffect(() => {
    fetch('/api/population', {
      method: "GET"
    })
    .then(response => response.json())
    .then(data => {
      const parsedData = data.map(item => {
        const prdDeStr = item.prdDe.toString(); // prdDe 값을 문자열로 변환
        const year = prdDeStr.substring(0, 4); // 처음 4자리를 년도로 추출
        const month = prdDeStr.substring(4, 6); // 다음 2자리를 월로 추출
  
        return { ...item, year, month };
      });

      setPopulationData(parsedData);
    })
  }, []);

  // 1. [연령대별 남녀인구수] - 선택한 년도와 월에 맞는 데이터만 필터링
  useEffect(() => {
    const newFilteredData = populationData.filter(item => 
      item.year === selectedYear && item.month === selectedMonth &&
      (item.groups.startsWith('남자인구수') || item.groups.startsWith('여자인구수')) &&
      item.groups.endsWith('세')
    );
    setFilteredData1(newFilteredData);
  }, [selectedYear, selectedMonth, populationData]);

  // 2. [인구수 추이] - 선택한 년도에 맞는 데이터만 필터링
  useEffect(() => {
    const newFilteredData = populationData.reduce((a, i) => {
      // 해당 년도와 월에 대한 객체가 이미 a에 있는지 확인
      const existingData = a.find(data => data.year === i.year && data.month === i.month && data.prdDe === i.prdDe);
      
      // 해당 년도와 월에 대한 객체가 없을 경우 새로운 객체 생성
      if (!existingData) {
        a.push({
          prdDe: i.prdDe,
          year: i.year,
          month: i.month,
          dtMale: i.groups === '남자인구수' ? i.dt : null,
          dtFemale: i.groups === '여자인구수' ? i.dt : null,
          dtTotal: i.groups === '총인구수' ? i.dt : null
        });
      } else {
        // 이미 있는 객체의 해당하는 groups에 dt 할당
        if (i.groups === '남자인구수') {
          existingData.dtMale = i.dt;
        } else if (i.groups === '여자인구수') {
          existingData.dtFemale = i.dt;
        } else if (i.groups === '총인구수') {
          existingData.dtTotal = i.dt;
        }
      }
  
      return a;
    }, []);
  
    setFilteredData2(newFilteredData);
  }, [selectedYear, populationData]);

  // 3. [경제활동 추이] - 선택한 년도에 맞는 데이터만 필터링
  useEffect(() => {
    const newFilteredData = populationData.reduce((a, i) => {
      // 해당 년도와 월에 대한 객체가 이미 a에 있는지 확인
      const existingData = a.find(data => data.year === i.year && data.month === i.month && data.prdDe === i.prdDe);
      
      // 해당 년도와 월에 대한 객체가 없을 경우 새로운 객체 생성
      if (!existingData) {
        a.push({
          prdDe: i.prdDe,
          year: i.year,
          month: i.month,
          dtEconomy: i.groups === '경제활동인구' ? i.dt * 1000 : null,
          dtUneconomy: i.groups === '비경제활동인구' ? i.dt * 1000 : null,
        });
      } else {
        // 이미 있는 객체의 해당하는 groups에 dt 할당
        if (i.groups === '경제활동인구') {
          existingData.dtEconomy = i.dt * 1000;
        } else if (i.groups === '비경제활동인구') {
          existingData.dtUneconomy = i.dt * 1000;
        }
      }
  
      return a;
    }, []);
  
    setFilteredData3(newFilteredData);
  }, [selectedYear, populationData]);

  // 4. [고용률] - 선택한 년도에 맞는 데이터만 필터링
  useEffect(() => {
    const newFilteredData = populationData.reduce((a, i) => {
      // 해당 년도와 월에 대한 객체가 이미 a에 있는지 확인
      const existingData = a.find(data => data.year === i.year && data.month === i.month && data.prdDe === i.prdDe);
      
      // 해당 년도와 월에 대한 객체가 없을 경우 새로운 객체 생성
      if (!existingData) {
        a.push({
          prdDe: i.prdDe,
          year: i.year,
          month: i.month,
          dtUpto15: i.groups === '15세이상인구' ? i.dt * 1000 : null,
          dtEmployed: i.groups === '취업자' ? i.dt * 1000 : null,
          dtEmployedRate: i.groups === '고용률' ? i.dt : null,
        });
      } else {
        // 이미 있는 객체의 해당하는 groups에 dt 할당
        if (i.groups === '15세이상인구') {
          existingData.dtUpto15 = i.dt * 1000;
        } else if (i.groups === '취업자') {
          existingData.dtEmployed = i.dt * 1000;
        } else if (i.groups === '고용률') {
          existingData.dtEmployedRate = i.dt;
        }
      }
  
      return a;
    }, []);
  
    setFilteredData4(newFilteredData);
  }, [selectedYear, populationData]);

  // 5. [실업률] - 선택한 년도에 맞는 데이터만 필터링
  useEffect(() => {
    const newFilteredData = populationData.reduce((a, i) => {
      // 해당 년도와 월에 대한 객체가 이미 a에 있는지 확인
      const existingData = a.find(data => data.year === i.year && data.month === i.month && data.prdDe === i.prdDe);
      
      // 해당 년도와 월에 대한 객체가 없을 경우 새로운 객체 생성
      if (!existingData) {
        a.push({
          prdDe: i.prdDe,
          year: i.year,
          month: i.month,
          dtEconomy: i.groups === '경제활동인구' ? i.dt * 1000 : null,
          dtUnemployed: i.groups === '실업자' ? i.dt * 1000 : null,
          dtUnemployedRate: i.groups === '실업률' ? i.dt : null,
        });
      } else {
        // 이미 있는 객체의 해당하는 groups에 dt 할당
        if (i.groups === '경제활동인구') {
          existingData.dtEconomy = i.dt * 1000;
        } else if (i.groups === '실업자') {
          existingData.dtUnemployed = i.dt * 1000;
        } else if (i.groups === '실업률') {
          existingData.dtUnemployedRate = i.dt;
        }
      }

      return a;
    }, []);

    setFilteredData5(newFilteredData);
  }, [selectedYear, populationData]);

  // 아직 데이터가 없는 월의 경우, 빈 칸으로 냅둠
  let filteredDataWithEmptyMonths = [];
  if (chart === '인구수 추이') {
    for (let i = 1; i <= 12; i++) {
      const monthData = filteredData2.find(item => item.year === selectedYear && parseInt(item.month) === i);
      if (monthData) {
        filteredDataWithEmptyMonths.push(monthData);
      } else {
        filteredDataWithEmptyMonths.push({
          month: String(i).padStart(2, '0'), // 월을 2자리 숫자로 표시
          dtMale: null, // 남자 인구수
          dtFemale: null, // 여자 인구수
          dtTotal: null // 총 인구수
        });
      }
    }
  } else if (chart === '경제활동 추이') {
    for (let i = 1; i <= 12; i++) {
      const monthData = filteredData3.find(item => item.year === selectedYear && parseInt(item.month) === i);
      if (monthData) {
        filteredDataWithEmptyMonths.push(monthData);
      } else {
        filteredDataWithEmptyMonths.push({
          month: String(i).padStart(2, '0'), // 월을 2자리 숫자로 표시
          dtEconomy: null, // 경제활동 인구
          dtUneconomy: null // 비경제활동 인구
        });
      }
    }
  } else if (chart === '고용률') {
    for (let i = 1; i <= 12; i++) {
      const monthData = filteredData4.find(item => item.year === selectedYear && parseInt(item.month) === i);
      if (monthData) {
        filteredDataWithEmptyMonths.push(monthData);
      } else {
        filteredDataWithEmptyMonths.push({
          month: String(i).padStart(2, '0'), // 월을 2자리 숫자로 표시
          dtUpto15: null, // 15세이상 인구
          dtEmployed: null, // 취업자
          dtEmployedRate: null // 고용률
        });
      }
    }
  } else if (chart === '실업률') {
    for (let i = 1; i <= 12; i++) {
      const monthData = filteredData5.find(item => item.year === selectedYear && parseInt(item.month) === i);
      if (monthData) {
        filteredDataWithEmptyMonths.push(monthData);
      } else {
        filteredDataWithEmptyMonths.push({
          month: String(i).padStart(2, '0'), // 월을 2자리 숫자로 표시
          dtEconomy: null, // 경제활동 인구
          dtUnemployed: null, // 실업자
          dtUnemployedRate: null // 실업률
        });
      }
    }
  }

  // 년도 선택하는 select 태그의 onChange 이벤트 핸들러
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // 월 선택하는 select 태그의 onChange 이벤트 핸들러
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // 년도와 월의 unique 값들을 추출 -> select 옵션으로 사용
  const yearOptions = Array.from(new Set(populationData.map(item => item.year)));
  const monthOptions = Array.from(new Set(populationData.map(item => item.month)));

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ChartDataLabels,
    Title
  );

  return (
    <div className="App">
      <div className="tab_wrap">
        <ul className="select_tab">
        <li
              className={`${chart === "연령대별 남녀 인구수" ? "on" : ""}`}
              onClick={() => {
                  setChart("연령대별 남녀 인구수");
                  setSelectedYear('2024');
                  setSelectedMonth('01');
              }}
              style={{ fontSize: "17px" }}
          >
              연령대별 남녀 인구수
          </li>
          <li
              className={`${chart === "인구수 추이" ? "on" : ""}`}
              onClick={() => {
                  setChart("인구수 추이");
                  setSelectedYear('2024');
              }}
              style={{ fontSize: "17px" }}
          >
              인구수 추이
          </li>
          <li
              className={`${chart === "경제활동 추이" ? "on" : ""}`}
              onClick={() => {
                  setChart("경제활동 추이");
                  setSelectedYear('2024');
              }}
              style={{ fontSize: "17px" }}
          >
              경제활동 추이
          </li>
          <li
              className={`${chart === "고용률" ? "on" : ""}`}
              onClick={() => {
                  setChart("고용률");
                  setSelectedYear('2024');
              }}
              style={{ fontSize: "17px" }}
          >
              고용률
          </li>
          <li
              className={`${chart === "실업률" ? "on" : ""}`}
              onClick={() => {
                  setChart("실업률");
                  setSelectedYear('2024');
              }}
              style={{ fontSize: "17px" }}
          >
              실업률
          </li>
        </ul>
      </div>

      <div className='chart'>
        {chart === "연령대별 남녀 인구수" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ marginRight: "10px", marginBottom: "0", fontWeight: "bold" }}>년도</p>
              <select value={selectedYear} onChange={handleYearChange} style={{ marginTop: "20px", marginRight: "20px", width: "90px", height: "30px", color: "#8884d8", fontWeight: "bold" }}>
                {yearOptions.slice().reverse().map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <p style={{ marginRight: "10px", marginBottom: "0", fontWeight: "bold" }}>월</p>
              <select value={selectedMonth} onChange={handleMonthChange} style={{ marginTop: "20px", width: "80px", height: "30px", color: "#8884d8", fontWeight: "bold" }}>
                {monthOptions.map(month => <option key={month} value={month}>{month}</option>)}
              </select>
            </div>
            <FirstChart width={1300} height={700} filteredData={filteredData1} />
          </div>
        )}

        {chart === "인구수 추이" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ marginRight: "10px", marginBottom: "0", fontWeight: "bold" }}>년도</p>
              <select value={selectedYear} onChange={handleYearChange} style={{ marginTop: "20px", width: "90px", height: "30px", color: "#8884d8", fontWeight: "bold" }}>
                {yearOptions.slice().reverse().map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <ComposedChart width={1300} height={700} data={filteredDataWithEmptyMonths} margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
              <CartesianGrid />
              <XAxis dataKey="month"  tickFormatter={(label) => parseInt(label) < 10 ? label.replace(/^0/, '') + '월' : label + '월'} />
              <YAxis 
                yAxisId="left"
                orientation="left"
                domain={[0, 1200000]}
                tickFormatter={(value) => { return value.toLocaleString(); }}
              >
                <Label value="(명)" style={{ textAnchor: "middle" }} position={"top"} offset={20} />
              </YAxis>
              <Tooltip 
                formatter={(value, name) => [name + ` : ${new Intl.NumberFormat('ko-KR').format(value)}명`]} 
                labelFormatter={(label) => parseInt(label) < 10 ? label.replace(/^0/, '') + '월' : label + '월'} 
              />
              <Legend />
              <Bar name={"남자 인구수"} dataKey="dtMale" fill="#E5D85C" stackId="a" yAxisId="left" />
              <Bar name={"여자 인구수"} dataKey="dtFemale" fill="#82ca9d" radius={[5, 5, 0, 0]} stackId="a" yAxisId="left" />
              <Line name={"총 인구수"} type="monotone" dataKey="dtTotal" stroke="#8884d8" strokeWidth={4} yAxisId="left" />
            </ComposedChart>      
          </div>        
        )}

        {chart === "경제활동 추이" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ marginRight: "10px", marginBottom: "0", fontWeight: "bold" }}>년도</p>
              <select value={selectedYear} onChange={handleYearChange} style={{ marginTop: "20px", width: "90px", height: "30px", color: "#8884d8", fontWeight: "bold" }}>
                {yearOptions.slice().reverse().map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <ComposedChart width={1300} height={700} data={filteredDataWithEmptyMonths} margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
              <CartesianGrid />
              <XAxis dataKey="month"  tickFormatter={(label) => parseInt(label) < 10 ? label.replace(/^0/, '') + '월' : label + '월'}  />
              <YAxis 
                yAxisId="left"
                orientation="left"
                domain={[0, 620000]}
                tickFormatter={(value) => { return value.toLocaleString(); }}
              >
                <Label value="(명)" style={{ textAnchor: "middle" }} position={"top"} offset={20} />
              </YAxis>
              <Tooltip 
                formatter={(value, name) => [name + ` : ${new Intl.NumberFormat('ko-KR').format(value)}명`]} 
                labelFormatter={(label) => parseInt(label) < 10 ? label.replace(/^0/, '') + '월' : label + '월'} 
              />
              <Legend />
              <Bar name={"경제활동 인구"} dataKey="dtEconomy" fill="#E5D85C" radius={[5, 5, 0, 0]} yAxisId="left" />
              <Bar name={"비경제활동 인구"} dataKey="dtUneconomy" fill="#82ca9d" radius={[5, 5, 0, 0]} yAxisId="left" />
            </ComposedChart>
          </div>
        )}

        {chart === "고용률" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ marginRight: "10px", marginBottom: "0", fontWeight: "bold" }}>년도</p>
              <select value={selectedYear} onChange={handleYearChange} style={{ marginTop: "20px", width: "90px", height: "30px", color: "#8884d8", fontWeight: "bold" }}>
                {yearOptions.slice().reverse().map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <ComposedChart width={1300} height={700} data={filteredDataWithEmptyMonths} margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
              <CartesianGrid />
              <XAxis dataKey="month"  tickFormatter={(label) => parseInt(label) < 10 ? label.replace(/^0/, '') + '월' : label + '월'}  />
              <YAxis 
                yAxisId="left"
                orientation="left"
                domain={[0, 1000000]}
                tickFormatter={(value) => { return value.toLocaleString(); }}
              >
                <Label value="(명)" style={{ textAnchor: "middle" }} position={"top"} offset={15} />
              </YAxis>
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(value) => { return value.toLocaleString(); }}
              >
                <Label value="(%)" style={{ textAnchor: "middle" }} position={"top"} offset={15} />
              </YAxis>
              <Tooltip 
                formatter={(value, name) => name === "고용률" ? [name + ` : ${new Intl.NumberFormat('ko-KR').format(value)}%`] : [name + ` : ${new Intl.NumberFormat('ko-KR').format(value)}명`] }
                labelFormatter={(label) => parseInt(label) < 10 ? label.replace(/^0/, '') + '월' : label + '월'} 
              />
              <Legend />
              <Bar name={"15세 이상 인구"} dataKey="dtUpto15" fill="#E5D85C" radius={[5, 5, 0, 0]} yAxisId="left"/>
              <Bar name={"취업자"} dataKey="dtEmployed" fill="#82ca9d" radius={[5, 5, 0, 0]} yAxisId="left"/>
              <Line name={"고용률"} type="monotone" dataKey="dtEmployedRate" stroke="#8884d8" strokeWidth={4} yAxisId="right"/>
            </ComposedChart>
          </div>
        )}

        {chart === "실업률" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ marginRight: "10px", marginBottom: "0", fontWeight: "bold" }}>년도</p>
              <select value={selectedYear} onChange={handleYearChange} style={{ marginTop: "20px", width: "90px", height: "30px", color: "#8884d8", fontWeight: "bold" }}>
                {yearOptions.slice().reverse().map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <ComposedChart width={1300} height={700} data={filteredDataWithEmptyMonths} margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
              <CartesianGrid />
              <XAxis dataKey="month"  tickFormatter={(label) => parseInt(label) < 10 ? label.replace(/^0/, '') + '월' : label + '월'}  />
              <YAxis 
                yAxisId="left"
                orientation="left"
                domain={[0, 620000]}
                tickFormatter={(value) => { return value.toLocaleString(); }}
              >
                <Label value="(명)" style={{ textAnchor: "middle" }} position={"top"} offset={15} />
              </YAxis>
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(value) => { return value.toLocaleString(); }}
              >
                <Label value="(%)" style={{ textAnchor: "middle" }} position={"top"} offset={15} />
              </YAxis>
              <Tooltip 
                formatter={(value, name) => name === "실업률" ? [name + ` : ${new Intl.NumberFormat('ko-KR').format(value)}%`] : [name + ` : ${new Intl.NumberFormat('ko-KR').format(value)}명`] }
                labelFormatter={(label) => parseInt(label) < 10 ? label.replace(/^0/, '') + '월' : label + '월'} 
              />
              <Legend />
              <Bar name={"경제활동 인구"} dataKey="dtEconomy" fill="#E5D85C" radius={[5, 5, 0, 0]} yAxisId="left"/>
              <Bar name={"실업자"} dataKey="dtUnemployed" fill="#82ca9d" radius={[5, 5, 0, 0]} yAxisId="left"/>
              <Line name={"실업률"} type="monotone" dataKey="dtUnemployedRate" stroke="#8884d8" strokeWidth={4} yAxisId="right" />
            </ComposedChart>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;