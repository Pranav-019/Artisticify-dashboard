import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Table, Modal } from 'react-bootstrap';

const CardCarousel = () => {
    const [cards, setCards] = useState([]);
    const [formData, setFormData] = useState({
        image: null,
    });

    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch cards from the backend
    const fetchCards = async () => {
        try {
            const res = await axios.get('https://artisticify-backend.vercel.app/api/cards/fetchCards');
            setCards(res.data.cards);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        }
    };

    const resetForm = () => {
        setFormData({
            image: null,
        });
        setEditMode(false);
        setEditingId(null);
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (editMode) {
                await axios.put(`https://artisticify-backend.vercel.app/api/cards/updateCard/${editingId}`, data);
            } else {
                await axios.post('https://artisticify-backend.vercel.app/api/cards/addCard', data);
            }
            fetchCards();
            resetForm();
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleEdit = (card) => {
        setFormData({
            image: null,
        });
        setEditMode(true);
        setEditingId(card._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://artisticify-backend.vercel.app/api/cards/deleteCard/${id}`);
            fetchCards();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 style={{ textAlign: 'center', color: '#333', fontSize: '26px', fontWeight: 'bold', marginTop: '20px' }}>
                Card Carousel Dashboard
            </h2>
            <Button className="my-3" onClick={() => { resetForm(); setShowModal(true); }}>
                Add Card
            </Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cards.map((card) => (
                        <tr key={card._id}>
                            <td><img src={card.image} alt="Card" width="100" /></td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleEdit(card)}>Edit</Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(card._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal Form */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Update Card' : 'Add New Card'}</Modal.Title>
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
                                {editMode ? 'Update Card' : 'Add Card'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CardCarousel;
