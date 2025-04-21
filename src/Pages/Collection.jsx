import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal, Form } from 'react-bootstrap';

const CollectionDashboard = () => {
  const [collections, setCollections] = useState([]);
  const [formData, setFormData] = useState({
    image: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch collections from the backend
  const fetchCollections = async () => {
    try {
      const res = await axios.get('https://artisticify-backend.vercel.app/api/collection/fetchCollection');
      setCollections(res.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    }
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      image: null,
    });
    setEditMode(false);
    setEditingId(null);
    setShowModal(false);
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editMode) {
        // Update collection (you can add the editing logic here if needed)
        await axios.put(`https://artisticify-backend.vercel.app/api/collection/${editingId}`, data);
      } else {
        // Add new collection
        await axios.post('https://artisticify-backend.vercel.app/api/collection/addCollection', data);
      }
      fetchCollections();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle delete collection
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://artisticify-backend.vercel.app/api/collection/deleteCollection/${id}`);
      fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 style={{ textAlign: 'center', color: '#333', fontSize: '26px', fontWeight: 'bold' }}>Collection Dashboard</h2>

      <Button className="my-3" onClick={() => { resetForm(); setShowModal(true); }}>
        Add Collection
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((collection) => (
            <tr key={collection._id}>
              <td><img src={collection.image} alt="Collection" width="100" /></td>
              <td>
                <Button variant="warning" size="sm" onClick={() => { setEditMode(true); setEditingId(collection._id); setShowModal(true); }}>
                  Edit
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(collection._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Form */}
      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Update Collection' : 'Add New Collection'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={resetForm}>Cancel</Button>
              <Button variant="primary" type="submit">
                {editMode ? 'Update Collection' : 'Add Collection'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CollectionDashboard;
