import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  fetchActiveOrdersCount,
  fetchCancelledOrdersCount,
  fetchCategoriesCount,
  fetchDeliveredOrdersCount,
  fetchOrdersCountByDate,
  fetchPendingOrdersCount,
  fetchRestaurantsCount,
  fetchRevenueByDate,
  fetchFoodItemsCount,
  fetchAllOrderStatusCounts,
  fetchDpCount,
  allCustomerCount,
  getAverageOrderValue,
  fetchRepeatCustomersByDate,
} from "../../utils/dashboard";
import BackBtn from "../../components/common/Back";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const today = new Date();

// 7 days before
const defaultStart = new Date(today);
defaultStart.setDate(defaultStart.getDate() - 7);

// 7 days after
const defaultEnd = new Date(today);
defaultEnd.setDate(defaultEnd.getDate() + 7);

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState({
    start: defaultStart.toISOString().split("T")[0],
    end: defaultEnd.toISOString().split("T")[0],
  });

  // State for summary cards
  const [summary, setSummary] = useState({
    pending: 0,
    active: 0,
    delivered: 0,
    cancelled: 0,
    restaurants: 0,
    categories: 0,
    foodItems: 0,
    dp: 0,
    customer: 0,
    avgOrderValue: 0,
  });

  // State for charts
  const [revenueChart, setRevenueChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Revenue",
        data: [],
        backgroundColor: "#38bdf8",
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  });
  const [ordersChart, setOrdersChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Orders",
        data: [],
        backgroundColor: "#f59e42",
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  });


  const [repeatChart, setRepeatChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Percet user repeat",
        data: [],
        backgroundColor: "#f59e42",
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [
        restaurants,
        categories,
        foodItems,
        counts,
        dpCount,
        customer,
        avgOrderValue,
      ] = await Promise.all([
        fetchRestaurantsCount(),
        fetchCategoriesCount(),
        fetchFoodItemsCount(),
        fetchAllOrderStatusCounts(),
        fetchDpCount(),
        allCustomerCount(),
        getAverageOrderValue(),
      ]);
      setSummary({
        pending: counts?.pending,
        active: counts?.active,
        delivered: counts?.delivered,
        cancelled: counts?.cancelled,
        dp: dpCount,
        restaurants,
        categories,
        foodItems,
        customer: customer,
        avgOrderValue: avgOrderValue,
      });

      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchGraphData = async () => {
      // Fetch chart data
      const revenueMap = await fetchRevenueByDate(
        new Date(dateRange.start).toISOString(),
        new Date(dateRange.end).toISOString()
      );
      const ordersMap = await fetchOrdersCountByDate(
        new Date(dateRange.start).toISOString(),
        new Date(dateRange.end).toISOString()
      );

      const repeatMap = await fetchRepeatCustomersByDate(
        new Date(dateRange.start).toISOString(),
        new Date(dateRange.end).toISOString()
      );

      // Prepare labels (dates) in range
      const labels = [];
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        labels.push(d.toISOString().slice(0, 10));
      }

      setRevenueChart({
        labels: labels.map((date) =>
          new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          })
        ),
        datasets: [
          {
            label: "Revenue",
            data: labels.map((date) => revenueMap[date] || 0),
            backgroundColor: "#38bdf8",
            borderRadius: 8,
            barPercentage: 0.6,
          },
        ],
      });

      setOrdersChart({
        labels: labels.map((date) =>
          new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          })
        ),
        datasets: [
          {
            label: "Orders",
            data: labels.map((date) => ordersMap[date] || 0),
            backgroundColor: "#f59e42",
            borderRadius: 8,
            barPercentage: 0.6,
          },
        ],
      });

      setRepeatChart({
      labels: labels.map((date) =>
        new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        })
      ),
      datasets: [
        {
          label: "Repeat Customers",
          data: labels.map((date) => repeatMap[date] || 0),
          backgroundColor: "#34d399",
          borderRadius: 8,
          barPercentage: 0.6,
        },
      ],
    });
    };

    fetchGraphData();
  }, [dateRange]);

  const summaryData = [
    {
      label: "Pending Orders",
      value: summary.pending,
      color: "border-blue-400",
    },
    {
      label: "Active Orders",
      value: summary.active,
      color: "border-green-400",
    },
    {
      label: "Delivered Orders",
      value: summary.delivered,
      color: "border-green-400",
    },
    {
      label: "Customer Cancelled Orders",
      value: summary.cancelled,
      color: "border-orange-400",
    },
    {
      label: "Restaurants",
      value: summary.restaurants,
      color: "border-blue-400",
    },
    {
      label: "Categories",
      value: summary.categories,
      color: "border-green-400",
    },
    {
      label: "Food Items",
      value: summary.foodItems,
      color: "border-green-400",
    },
    {
      label: "Delivery Partner",
      value: summary.dp,
      color: "border-blue-400",
    },
    {
      label: "Total Users",
      value: summary.customer,
      color: "border-green-400",
    },
    {
      label: "Average Order Value",
      value: summary.avgOrderValue.toFixed(2),
      color: "border-green-400",
    },
  ];

  // useEffect( () => {
  //   const getAvg = async () => {
  //     const data  = await getAverageOrderValue();
  //     console.log(data);
  //   }

  //   getAvg();
  // },[])
  const totalRevenue = revenueChart.datasets[0].data.reduce((a, b) => a + b, 0);
  const totalOrders = ordersChart.datasets[0].data.reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-6">
      {/* <BackBtn /> */}
      <div className="max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          {summaryData.map((item) => (
            <div
              key={item.label}
              className={`bg-white rounded-xl shadow border-t-4 ${item.color} p-5 flex flex-col items-start`}
            >
              <span className="text-xs text-gray-400 mb-1">{item.label}</span>
              <span className="text-2xl font-bold text-gray-700">
                {loading ? "..." : item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((r) => ({ ...r, start: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((r) => ({ ...r, end: e.target.value }))
            }
            className="border rounded px-3 py-2"
          />
          <button
            className="bg-primary text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => {}} // Filtering is handled by useEffect
          >
            Filter By Date
          </button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-700">Revenue</h3>
              <span className="text-sm text-gray-400">
                Total:{" "}
                <span className="font-semibold text-primary">
                  ₹
                  {totalRevenue.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </span>
            </div>
            <Bar
              data={revenueChart}
              options={{
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-700">Orders</h3>
              <span className="text-sm text-gray-400">
                Total Orders (Placed):{" "}
                <span className="font-semibold text-primary">
                  {totalOrders}
                </span>
              </span>
            </div>
            <Bar
              data={ordersChart}
              options={{
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-700">Repeat Customers</h3>
              {/* <span className="text-sm text-gray-400">
                Total Orders (Placed):{" "}
                <span className="font-semibold text-primary">
                  {totalOrders}
                </span>
              </span> */}
            </div>
            <Bar
              data={repeatChart}
              options={{
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false } },
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
