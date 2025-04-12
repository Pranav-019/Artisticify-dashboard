import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Grid, Typography, CircularProgress } from '@mui/material';

const OurWork = () => {
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing works from backend
  const fetchWorks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://artisticify-backend.vercel.app/api/ourwork/get');
      setWorks(response.data.works);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('imageUrls', imageUrls.split(',').map(url => url.trim()));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post('https://artisticify-backend.vercel.app/api/ourwork/insert', formData);
  
      alert(response.data.message);  // Show the response message
  
      // Optionally, update state with the new work
      fetchWorks(); // Refresh works list if necessary
    } catch (error) {
      console.error('Error:', error);  // Log the error for debugging
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrls(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Our Work Gallery
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Add New Work</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label="category"
            >
              <MenuItem value="logo">logo</MenuItem>
              <MenuItem value="brochure">brochure</MenuItem>
              <MenuItem value="poster">poster</MenuItem>
              <MenuItem value="flyer">flyer</MenuItem>
              <MenuItem value="packaging">packaging</MenuItem>
              <MenuItem value="ui/ux">ui/ux</MenuItem>
              <MenuItem value="icon">icon</MenuItem>
              <MenuItem value="magazine">magazine</MenuItem>
              <MenuItem value="visual aid">visual Aid</MenuItem>
              <MenuItem value="stationary">stationary</MenuItem>
            </Select>
          </FormControl>

          {category === 'stationary' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>SubCategory</InputLabel>
              <Select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                label="subCategory"
              >
                <MenuItem value="envelope">envelope</MenuItem>
                <MenuItem value="menu-card">menu Card</MenuItem>
                <MenuItem value="certificate">certificate</MenuItem>
              </Select>
            </FormControl>
          )}

          <TextField
            label="Image URLs (comma separated)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
          />

          <div style={{ marginTop: '10px' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageFile && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={imageUrls}
                  alt="preview"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6">Existing Works</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {works.map((work) => (
                <Grid item xs={12} md={6} key={work._id}>
                  <div style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <Typography variant="h6">{work.category}</Typography>
                    <Typography variant="body2">{work.subCategory || 'N/A'}</Typography>
                    <div>
                      {work.imageUrls.map((url, index) => (
                        <img key={index} src={url} alt="work" style={{ width: '100%', marginTop: '10px' }} />
                      ))}
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default OurWork;
