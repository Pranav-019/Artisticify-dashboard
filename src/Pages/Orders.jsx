import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Card,
  Form,
} from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/orders.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { FaEye } from "react-icons/fa";
 // Import if you're using autoTable for tables


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTab, setShowTab] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // New order form state
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerEmail: "",
    city: "",
    phone: "",
    serviceSelected: "",
    packageSelected: "",
    amountPaid: "",
    message: "",
  });

  const generateInvoice = (order) => {
    const doc = new jsPDF();
  
    // Header Section
    doc.setFontSize(22);
    doc.text("Artisticify", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("3rd Floor, 307 Amanora Chamber, Amanora Mall Hadapsar, Pune", 105, 30, { align: "center" });
    doc.text("City - Pune, State Maharashtra, ZIP - 411028", 105, 35, { align: "center" });
    doc.text("Phone:  +91-9112452929 | Email: info@artisticify.com", 105, 40, { align: "center" });
    doc.text("----------------------------------------------------", 14, 45);
  
    // Invoice Header
    doc.setFontSize(18);
    doc.text("Invoice", 14, 55);
    doc.setFontSize(12);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 65);
    doc.text(`Order ID: ${order.orderId}`, 14, 70);
    doc.text(`Customer Name: ${order.customerName}`, 14, 75);
    doc.text(`Email: ${order.customerEmail}`, 14, 80);
    doc.text(`City: ${order.city}`, 14, 85);
    doc.text("----------------------------------------------------", 14, 90);
  
    // Order Details Table
    const tableStartY = 100;
    doc.text("Order Details", 14, tableStartY - 5);
    const columns = ["Service", "Package", "Total Amount", "Amount Paid"];
    const rows = [
      [order.serviceSelected, order.packageSelected, `${order.totalAmount}`, `${order.amountPaid}`],
    ];
  
    doc.autoTable({
      startY: tableStartY,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: { fontSize: 10 },
    });
  
    // Calculate remaining amount
    const remainingAmount = order.totalAmount - order.amountPaid;
    const paymentStatus = remainingAmount === 0 ? "Payment Completed" : `Remaining Amount: ${remainingAmount}`;
  
    // Remaining Amount and Notes Section
    const tableEndY = doc.lastAutoTable.finalY + 10;
    doc.text(paymentStatus, 14, tableEndY); // Display remaining amount or "Payment Completed"
    doc.setFontSize(12);
    doc.text(order.custom , 14, tableEndY + 10);
    doc.text(order.message || "Thank you for your business!", 14, tableEndY + 20);
  
    // Footer
    doc.setFontSize(10);
    doc.text("This is a system-generated invoice.", 14, 280);
    doc.text("For any queries, contact us at info@artisticify.com.", 14, 285);
  
    // Save the PDF
    doc.save(`Invoice-${order.orderId}.pdf`);
  };
  

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://artisticify-backend.vercel.app/api/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters
  const applyFilter = (filterType) => {
    let filtered = [...orders];
    const now = new Date();

    switch (filterType) {
      case "today":
        filtered = filtered.filter(
          (order) => new Date(order.createdAt).toDateString() === now.toDateString()
        );
        break;
      case "thisWeek":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) >= startOfWeek
        );
        break;
      case "thisMonth":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) >= startOfMonth
        );
        break;
      case "customDate":
        if (startDate && endDate) {
          filtered = filtered.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return (
              orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
            );
          });
        }
        break;
      case "all":
        filtered = orders;
        break;
      default:
        break;
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  // Update order status or add updates
  const updateOrderField = async (orderId, field, value) => {
    try {
      const response = await fetch(`https://artisticify-backend.vercel.app/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${field}`);
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );
      applyFilter("all");  // Refetch the orders after the update
      setUpdateSuccess(true);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  // Handle tab toggle for details or edit
  const handleTabToggle = (order, mode) => {
    setSelectedOrder(order);
    setShowTab({ [mode]: true });
    setUpdateSuccess(false);
  };

  // Handle new order creation
  const handleCreateOrder = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://artisticify-backend.vercel.app/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const createdOrder = await response.json();
      setOrders((prevOrders) => [...prevOrders, createdOrder]);
      setNewOrder({
        customerName: "",
        customerEmail: "",
        city: "",
        phone: "",
        serviceSelected: "",
        packageSelected: "",
        amountPaid: "",
        totalAmount: "",
        custom: "",
        message: "",
      });
      setUpdateSuccess(true);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  // Handle editing an order
  const handleEditOrder = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://artisticify-backend.vercel.app/api/orders/${selectedOrder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedOrder),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id ? updatedOrder : order
        )
      );
      setUpdateSuccess(true);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Handle viewing order details
  const handleViewDetails = (order) => {
    handleTabToggle(order, "details");
  };

  return (
    <Container className="orders-container">
      <Row>
        <Col>
          <h1>Orders</h1>

          {/* Create Order Form */}
          <Card className="mb-4">
            <Card.Body>
              <h5>Create New Order</h5>
              <Form onSubmit={handleCreateOrder}>
                <Form.Group controlId="customerName">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="customerEmail">
                  <Form.Label>Customer Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newOrder.customerEmail}
                    onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.city}
                    onChange={(e) => setNewOrder({ ...newOrder, city: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.phone}
                    onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="serviceSelected">
                  <Form.Label>Service Selected</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.serviceSelected}
                    onChange={(e) => setNewOrder({ ...newOrder, serviceSelected: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="packageSelected">
                  <Form.Label>Package Selected</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.packageSelected}
                    onChange={(e) => setNewOrder({ ...newOrder, packageSelected: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="amountPaid">
                  <Form.Label>Amount Paid</Form.Label>
                  <Form.Control
                    type="number"
                    value={newOrder.amountPaid}
                    onChange={(e) => setNewOrder({ ...newOrder, amountPaid: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="totalAmount">
                  <Form.Label>Total Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={newOrder.totalAmount}
                    onChange={(e) => setNewOrder({ ...newOrder, totalAmount: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newOrder.message}
                    onChange={(e) => setNewOrder({ ...newOrder, message: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="orderStatus">
                  <Form.Label>Order Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={newOrder.orderStatus}
                    onChange={(e) => setNewOrder({ ...newOrder, orderStatus: e.target.value })}
                  >
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>In Progress</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="custom">
                  <Form.Label>Custom Field</Form.Label>
                  <Form.Control
                    type="text"
                    value={newOrder.custom}
                    onChange={(e) => setNewOrder({ ...newOrder, custom: e.target.value })}
                  />
                </Form.Group>
                <Button type="submit">Create Order</Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Filter Buttons */}
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex gap-3 mb-3">
                <Button onClick={() => applyFilter("today")}>Today</Button>
                <Button onClick={() => applyFilter("thisWeek")}>This Week</Button>
                <Button onClick={() => applyFilter("thisMonth")}>This Month</Button>
                <Button onClick={() => applyFilter("all")}>All</Button>
              </div>

              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Details</th>
                      <th>Action</th>
                      <th>Invoice</th>

                    </tr>
                  </thead>
                  <tbody>
  {filteredOrders.map((order) => (
    <tr key={order.orderId}>
      <td>{order.orderId}</td>
      <td>{order.customerName}</td>
      <td>{order.serviceSelected}</td>
      <td>{order.orderStatus}</td>
      <td>
        <FaEye
          onClick={() => handleViewDetails(order)}
          style={{ cursor: "pointer", color: "blue" }}
        />
      </td>
      <td>
        <FaPen onClick={() => handleTabToggle(order, "edit")} />
      </td>
      <td>
        <Button
          variant="success"
          onClick={() => generateInvoice(order)}
        >
          Generate Invoice
        </Button>
      </td>
    </tr>
  ))}
</tbody>


                </Table>
              )}
            </Card.Body>
          </Card>

          {showTab.details && selectedOrder && (
            <Card className="mb-4">
              <Card.Body>
                <h4>Order Details</h4>
                <pre>{JSON.stringify(selectedOrder, null, 2)}</pre>
                <Button variant="primary" onClick={() => setShowTab({ details: false })}>Close</Button>
              </Card.Body>
            </Card>
          )}

          {showTab.edit && selectedOrder && (
            <Card className="mb-4">
              <Card.Body>
                <h4>Edit Order</h4>
                <Form onSubmit={handleEditOrder}>
                <Form.Group controlId="orderStatus">
                     <Form.Label>Status</Form.Label>
                     <Form.Control
                       as="select"
                      value={selectedOrder?.orderStatus || ""}
                       onChange={(e) =>
                       setSelectedOrder({
                        ...selectedOrder,
                        orderStatus: e.target.value,
                     })
    }
  >
                     <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                     <option value="Completed">Completed</option>
                     </Form.Control>
                     </Form.Group>

                  <Form.Group controlId="paymentDone">
                    <Form.Label>Payment Done</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedOrder.paymentDone}
                      onChange={(e) =>
                        setSelectedOrder({ ...selectedOrder, paymentDone: e.target.value })
                      }
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </Form.Control>
                  </Form.Group>
                  <Button type="submit" variant="primary">Update</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowTab({ edit: false })}
                    className="ml-3"
                  >
                    Close
                  </Button>
                </Form>
                {updateSuccess && <p>Update successful!</p>}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Orders;
