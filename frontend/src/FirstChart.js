import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

function FirstChart({ filteredData, ...props }) {
  // 연령 그룹과 성별 데이터 추출
  const ageGroups = filteredData.reduce((acc, cur) => {
    const ageRange = cur.groups.substring(5); // "남자인구수0 - 4세"에서 "0 - 4세" 추출
    if (!acc.includes(ageRange)) {
      acc.push(ageRange);
    }
    return acc;
  }, []).sort((a, b) => parseInt(a) - parseInt(b)); // 연령대 정렬

  const maleData = ageGroups.map(age => {
    const item = filteredData.find(d => d.groups.includes('남자') && d.groups.includes(age));
    return item ? -Math.abs(Number(item.dt)) : 0; // 남성 데이터를 음수로 변환
  });

  const femaleData = ageGroups.map(age => {
    const item = filteredData.find(d => d.groups.includes('여자') && d.groups.includes(age));
    return item ? Number(item.dt) : 0;
  });

  const data = {
    labels: ageGroups,
    datasets: [
      {
        label: '남성',
        data: maleData,
        backgroundColor: '#317ca4',
        borderColor: '#317ca4',
        borderWidth: 1,
      },
      {
        label: '여성',
        data: femaleData,
        backgroundColor: '#fc8282',
        borderColor: '#fc8282',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Y축을 기준으로 바 차트를 표시
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right', // 범례 위치
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const value = context.dataset.label === '남성' ? Math.abs(maleData[index]) : femaleData[index];
            return context.dataset.label + ' : ' + value.toLocaleString() + '명'; // 절댓값으로 변환하여 표시
          }
        }
      },
      datalabels: {
        color: 'black',
        anchor: function(context) {
          return context.dataset.label === '남성' ? 'start' : 'end'; // 텍스트를 막대 끝 부분에 표시
        },
        align: function(context) {
          return context.dataset.label === '남성' ? 'start' : 'end'; // 텍스트를 막대 끝 부분에 정렬
        },
        formatter: function(value, context) {
          const index = context.dataIndex;
          const total = Math.abs(maleData[index]) + Math.abs(femaleData[index]);
          const malePercentage = ((Math.abs(maleData[index]) / total) * 100).toFixed(1); 
          const femalePercentage = ((Math.abs(femaleData[index]) / total) * 100).toFixed(1); 
          return context.dataset.label === '남성' ? `${malePercentage}%` : `${femalePercentage}%`;
        },
        offset: 4 // 막대에서의 텍스트의 거리
      }
    },
    scales: {
      x: {
        stacked: true, // X축 데이터 스택으로 표시
        ticks: {
          callback: function(value) {
            return Math.abs(value).toLocaleString() + '명'; // 절댓값으로 변환하여 표시
          }
        }
      },
      y: {
        stacked: true, // Y축 데이터 스택으로 표시
      },
    },
  };

  // Bar 컴포넌트를 이용하여 차트 렌더링
  return <div style={{width: 1200, height: 700, margin: "50px auto 0 auto" }}><Bar data={data} options={options}/></div>;
};

export default FirstChart;