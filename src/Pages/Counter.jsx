import React, { useEffect, useState } from "react";
import axios from "axios";

// Base API URL
const API_BASE = "https://artisticify-backend.vercel.app/api/counter";

const Counter = () => {
  const [counters, setCounters] = useState([]);
  const [formData, setFormData] = useState({
    boxNo: "",
    title: "",
    description: "",
    count: "",
  });
  const [editId, setEditId] = useState(null);

  // ✅ Fetch all counters
  const fetchCounters = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get`);
      console.log("Fetched Counter Data:", res.data);
      if (res.data && res.data.data) {
        setCounters(res.data.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update counter
        await axios.put(`${API_BASE}/update/${editId}`, formData);
      } else {
        // Add new counter
        await axios.post(`${API_BASE}/create`, formData);  // Make sure this URL is correct
      }
      setFormData({ boxNo: "", title: "", description: "", count: "" });
      setEditId(null);
      fetchCounters();
    } catch (error) {
      console.error("Submit error:", error);
    }
  }

  // Edit handler
  const handleEdit = (item) => {
    setFormData({
      boxNo: item.boxNo || "",
      title: item.title || "",
      description: item.description || "",
      count: item.count || "",
    });
    setEditId(item._id);
  };

  // ✅ Delete handler
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      fetchCounters();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Manage Counter Section</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="row g-3 mb-5">
        <div className="col-md-2">
          <input
            type="number"
            name="boxNo"
            className="form-control"
            placeholder="Box No"
            value={formData.boxNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="description"
            className="form-control"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            name="count"
            className="form-control"
            placeholder="Count (e.g., 1000+)"
            value={formData.count}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Box No</th>
              <th>Title</th>
              <th>Description</th>
              <th>Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {counters.length === 0 ? (
              <tr>
                <td colSpan="5">No counter data found.</td>
              </tr>
            ) : (
              counters.map((item) => (
                <tr key={item._id}>
                  <td>{item.boxNo}</td>
                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.count}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Counter;
