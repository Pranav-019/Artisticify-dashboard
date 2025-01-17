// All imports should be at the very top
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsCurrencyRupee } from 'react-icons/bs'; // Import rupee icon
import { GoDot } from 'react-icons/go';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; 
import { Button, LineChart, SparkLine } from '../Components';
import { useStateContext } from '../Contexts/ContextProvider';// Import chart.js components

// Register required components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Importing components from other files


// Component logic below
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

  // Fetch orders data from API
  useEffect(() => {
    axios
      .get('https://artisticify-backend.vercel.app/api/orders') // Replace with your Orders API endpoint
      .then((response) => {
        setOrderData(response.data); // Assuming the API returns a list of orders
        processSalesData(response.data); // Process sales data for charts
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching order data:', error);
        setLoading(false);
      });
  }, []);

  const processSalesData = (orders) => {
    const sales = orders.map((order) => ({
      amountPaid: order.amountPaid,
      totalAmount: order.totalAmount,
      remainingAmount: order.totalAmount - order.amountPaid, // Calculate remaining amount
    }));
    setSalesData(sales);
  };

  const calculateTotalRevenue = () =>
    salesData.reduce((total, sale) => total + sale.amountPaid, 0).toFixed(2);

  const calculateTotalRemainingAmount = () =>
    salesData.reduce((total, sale) => total + sale.remainingAmount, 0).toFixed(2);

  // Pie Chart data
  const pieChartData = {
    labels: ['Amount Paid', 'Remaining Amount'],
    datasets: [
      {
        label: 'Customer Payment Breakdown',
        data: [
          salesData.reduce((total, sale) => total + sale.amountPaid, 0),
          salesData.reduce((total, sale) => total + sale.remainingAmount, 0),
        ],
        backgroundColor: ['#28a745', '#ff4b5c'], // Green for paid, Red for remaining
        hoverOffset: 4,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ₹${value.toFixed(2)}`;
          },
        },
      },
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="mt-24">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Earnings Section */}
          <div className="flex flex-wrap lg:flex-nowrap justify-center">
            <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-400">Earnings</p>
                  <p className="text-2xl">
                    <BsCurrencyRupee /> {calculateTotalRevenue()}
                  </p>
                </div>
                <button
                  type="button"
                  style={{ backgroundColor: currentColor }}
                  className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full p-4"
                >
                  <BsCurrencyRupee />
                </button>
              </div>
            </div>
          </div>

          {/* Revenue Updates Section */}
          <div className="flex gap-10 flex-wrap justify-center">
            <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780">
              <div className="flex justify-between">
                <p className="font-semibold text-xl">Revenue Updates</p>
                <div className="flex items-center gap-4">
                  <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                    <span>
                      <GoDot />
                    </span>
                    <span>Expense</span>
                  </p>
                  <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                    <span>
                      <GoDot />
                    </span>
                    <span>Budget</span>
                  </p>
                </div>
              </div>
              <div className="mt-10 flex gap-10 flex-wrap justify-center">
                <div className="border-r-1 border-color m-4 pr-10">
                  <div>
                    <p>
                      <span className="text-3xl font-semibold">
                        <BsCurrencyRupee /> {calculateTotalRevenue()}
                      </span>
                    </p>
                    <p className="text-gray-500 mt-1">Revenue</p>
                  </div>

                  <div className="mt-5">
                    <SparkLine
                      currentColor={currentColor}
                      id="line-sparkLine"
                      type="Line"
                      height="80px"
                      width="250px"
                      data={salesData.map((sale) => sale.amountPaid)}
                      color={currentColor}
                    />
                  </div>
                </div>

                {/* Pie Chart for Revenue */}
                <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-4 p-6 rounded-2xl w-full md:w-400">
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="flex gap-10 m-4 flex-wrap justify-center">
            <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
              <div className="flex justify-between items-center gap-2">
                <p className="text-xl font-semibold">Recent Transactions</p>
                <DropDown currentMode={currentMode} />
              </div>
              <div className="mt-10 w-72 md:w-400">
                {orderData.map((order) => (
                  <div key={order.orderId} className="flex justify-between mt-4">
                    <div className="flex gap-4">
                      <div>
                        <p className="text-md font-semibold">
                          {order.serviceSelected}
                        </p>
                        <p className="text-sm text-gray-400">{order.message}</p>
                      </div>
                    </div>
                    <p
                      className={`text-${
                        order.orderStatus === 'Completed' ? 'green' : 'red'
                      }-400`}
                    >
                      <BsCurrencyRupee /> {order.amountPaid.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Ecommerce;
