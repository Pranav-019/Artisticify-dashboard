import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Table, Modal } from 'react-bootstrap';

const Testimonial = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        text: '',
        image: null,
        rating: 1
    });

    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchTestimonials = async () => {
        try {
            const res = await axios.get('https://artisticify-backend.vercel.app/api/testimonials');
            setTestimonials(res.data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            position: '',
            text: '',
            image: null,
            rating: 1
        });
        setEditMode(false);
        setEditingId(null);
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('position', formData.position);
        data.append('text', formData.text);
        data.append('rating', formData.rating);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (editMode) {
                await axios.put(`https://artisticify-backend.vercel.app/api/testimonials/${editingId}`, data);
            } else {
                await axios.post('https://artisticify-backend.vercel.app/api/testimonials', data);
            }
            fetchTestimonials();
            resetForm();
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleEdit = (testimonial) => {
        setFormData({
            name: testimonial.name,
            position: testimonial.position,
            text: testimonial.text,
            image: null,
            rating: testimonial.rating
        });
        setEditMode(true);
        setEditingId(testimonial._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://artisticify-backend.vercel.app/api/testimonials/${id}`);
            fetchTestimonials();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 style={{ textAlign: 'center', color: '#333', fontSize: '26px', fontWeight: 'bold', marginTop: '20px' }}>Testimonial Dashboard</h2>
            <Button className="my-3" onClick={() => { resetForm(); setShowModal(true); }}>
                Add Testimonial
            </Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Text</th>
                        <th>Image</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {testimonials.map((t) => (
                        <tr key={t._id}>
                            <td>{t.name}</td>
                            <td>{t.position}</td>
                            <td>{t.text.slice(0, 40)}...</td>
                            <td><img src={t.image} alt={t.name} width="100" /></td>
                            <td>{t.rating} ⭐</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleEdit(t)}>Edit</Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(t._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Update Testimonial' : 'Add New Testimonial'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Position</Form.Label>
                            <Form.Control
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Text</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="text"
                                value={formData.text}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Select
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                            >
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <option key={num} value={num}>{num} ⭐</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={resetForm}>Cancel</Button>
                            <Button variant="primary" type="submit">
                                {editMode ? 'Update Testimonial' : 'Add Testimonial'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Testimonial;
