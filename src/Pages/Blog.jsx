import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Table, Modal, Row, Col } from 'react-bootstrap';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [formData, setFormData] = useState({
        mainTitle: '',
        shortDescription: '',
        description: '',
        image: null,
        sections: [{ title: '', content: '' }]
    });

    const [editMode, setEditMode] = useState(false);
    const [editingBlogId, setEditingBlogId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch blogs
    const fetchBlogs = async () => {
        try {
            const res = await axios.get('https://artisticify-backend.vercel.app/api/blogs/allBlogs');
            setBlogs(res.data.blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleChange = (e, index = null, field = null) => {
        const { name, value, files } = e.target;

        if (name === 'image') {
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else if (field !== null && index !== null) {
            const updatedSections = [...formData.sections];
            updatedSections[index][field] = value;
            setFormData(prev => ({ ...prev, sections: updatedSections }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const addSection = () => {
        setFormData(prev => ({
            ...prev,
            sections: [...prev.sections, { title: '', content: '' }]
        }));
    };

    const removeSection = (index) => {
        const updated = [...formData.sections];
        updated.splice(index, 1);
        setFormData(prev => ({ ...prev, sections: updated }));
    };

    const resetForm = () => {
        setFormData({
            mainTitle: '',
            shortDescription: '',
            description: '',
            image: null,
            sections: [{ title: '', content: '' }]
        });
        setEditMode(false);
        setEditingBlogId(null);
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('mainTitle', formData.mainTitle);
        data.append('shortDescription', formData.shortDescription);
        data.append('description', formData.description);
        data.append('sections', JSON.stringify(formData.sections));
        if (formData.image) data.append('image', formData.image);

        try {
            if (editMode) {
                await axios.put(`https://artisticify-backend.vercel.app/api/blogs/updateBlog/${editingBlogId}`, data);
            } else {
                await axios.post('https://artisticify-backend.vercel.app/api/blogs/addBlog', data);
            }
            fetchBlogs();
            resetForm();
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    const handleEdit = (blog) => {
        setFormData({
            mainTitle: blog.mainTitle,
            shortDescription: blog.shortDescription,
            description: blog.description,
            image: null,
            sections: blog.sections || [{ title: '', content: '' }]
        });
        setEditMode(true);
        setEditingBlogId(blog._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://artisticify-backend.vercel.app/api/blogs/deleteBlog/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 style={{ textAlign: 'center', color: '#333', fontSize: '26px', fontWeight: 'bold', marginTop: '20px' }}>
                Blog Dashboard
            </h2>
            <Button className="my-3 w-full" onClick={() => { resetForm(); setShowModal(true); }}>
                Add Blog
            </Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Main Title</th>
                        <th>Short Description</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th>Sections Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog._id}>
                            <td>{blog.mainTitle}</td>
                            <td>{blog.shortDescription?.slice(0, 20)}...</td>
                            <td>{blog.description?.slice(0, 60)}...</td>
                            <td>
                                {blog.image ? (
                                    <img src={blog.image} alt={blog.mainTitle} width="100" />
                                ) : 'No Image'}
                            </td>
                            <td>{blog.sections?.length || 0}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleEdit(blog)}>Edit</Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(blog._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? 'Update Blog' : 'Add New Blog'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Main Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="mainTitle"
                                value={formData.mainTitle}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Short Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={1}
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={handleChange}
                                accept="image/*"
                            />
                        </Form.Group>

                        <h5>Sections</h5>
                        {formData.sections.map((section, index) => (
                            <div key={index} className="mb-3 border p-3 rounded bg-light">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Section Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => handleChange(e, index, 'title')}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Section Content</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={section.content}
                                                onChange={(e) => handleChange(e, index, 'content')}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {formData.sections.length > 1 && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeSection(index)}
                                        className="mt-2"
                                    >
                                        Remove Section
                                    </Button>
                                )}
                            </div>
                        ))}
                        <div className='flex justify-between'>
                            <Button variant="secondary" onClick={addSection}>+ Add Section</Button>
                            <Button variant="primary" type="submit">{editMode ? 'Update Blog' : 'Add Blog'}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Blog;
