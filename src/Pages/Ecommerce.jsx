import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsCurrencyRupee } from 'react-icons/bs';
import { GoDot } from 'react-icons/go';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Button, LineChart, SparkLine } from '../Components';
import { useStateContext } from '../Contexts/ContextProvider';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const dropdownData = [
  { Time: 'Last Week', Id: '1' },
  { Time: 'Last Month', Id: '2' },
  { Time: 'Last Year', Id: '3' },
];

const DropDown = ({ currentMode }) => (
  <div className="w-28 border-1 border-color px-2 py-1 rounded-md">
    <DropDownListComponent
      id="time"
      fields={{ text: 'Time', value: 'Id' }}
      style={{ border: 'none', color: currentMode === 'Dark' && 'white' }}
      value="1"
      dataSource={dropdownData}
      popupHeight="220px"
      popupWidth="120px"
    />
  </div>
);

const Ecommerce = () => {
  const { currentColor, currentMode } = useStateContext();
  const [orderData, setOrderData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://artisticify-backend.vercel.app/api/orders')
      .then((response) => {
        setOrderData(response.data);
        processSalesData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
        setLoading(false);
      });
  }, []);

  const processSalesData = (orders) => {
    const sales = orders.map((order) => ({
      service: order.serviceSelected,
      amountPaid: order.amountPaid,
      totalAmount: order.totalAmount,
      remainingAmount: order.totalAmount - order.amountPaid,
    }));
    setSalesData(sales);
  };

  const calculateTotalRevenue = () =>
    salesData.reduce((total, sale) => total + sale.amountPaid, 0).toFixed(2);

  const calculateTotalRemainingAmount = () =>
    salesData.reduce((total, sale) => total + sale.remainingAmount, 0).toFixed(2);

  // Aggregate data for grouped charts
  const aggregatedData = salesData.reduce((acc, sale) => {
    const service = acc[sale.service] || { total: 0, paid: 0 };
    service.total += sale.totalAmount;
    service.paid += sale.amountPaid;
    acc[sale.service] = service;
    return acc;
  }, {});

  const groupedBarData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: 'Total Amount',
        data: Object.values(aggregatedData).map((data) => data.total),
        backgroundColor: '#007bff',
      },
      {
        label: 'Amount Paid',
        data: Object.values(aggregatedData).map((data) => data.paid),
        backgroundColor: '#28a745',
      },
    ],
  };

  const groupedBarOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  const multiLineData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: 'Amount Paid',
        data: Object.values(aggregatedData).map((data) => data.paid),
        borderColor: '#ff6384',
        tension: 0.4,
      },
      {
        label: 'Remaining Amount',
        data: Object.values(aggregatedData).map(
          (data) => data.total - data.paid
        ),
        borderColor: '#36a2eb',
        tension: 0.4,
      },
    ],
  };

  const multiLineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  const pieChartData = {
    labels: ['Amount Paid', 'Remaining Amount'],
    datasets: [
      {
        data: [
          salesData.reduce((total, sale) => total + sale.amountPaid, 0),
          salesData.reduce((total, sale) => total + sale.remainingAmount, 0),
        ],
        backgroundColor: ['#28a745', '#ff4b5c'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="mt-24">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="flex flex-wrap lg:flex-nowrap justify-center">
            <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-400">Earnings</p>
                  <p className="text-2xl">
                    <BsCurrencyRupee /> {calculateTotalRevenue()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-10 flex-wrap justify-center">
            <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-6 rounded-2xl w-full md:w-780">
              {/* Reduced the size of the pie chart by adjusting its container width */}
              <div style={{ width: '300px', height: '300px' }}>
                <Pie data={pieChartData} />
              </div>
            </div>
            <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-6 rounded-2xl w-full md:w-780">
              <Bar data={groupedBarData} options={groupedBarOptions} />
            </div>
            <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-6 rounded-2xl w-full md:w-780">
              <Line data={multiLineData} options={multiLineOptions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Ecommerce;
