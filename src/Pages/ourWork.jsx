import React, { useState, useEffect } from "react";
import axios from "axios";

const OurWork = () => {
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [images, setImages] = useState([]);  // Handle multiple image files
  const [imageUrls, setImageUrls] = useState("");  // For multiple image URLs

  const fetchCategory = async () => {
    try {
      const response = await axios.get("https://artisticify-backend.vercel.app/api/ourwork/get");
      setCategory(response.data.works || []);  // Ensure category is always an array
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const addImage = async () => {
    if (images.length === 0 && !imageUrls) {  // Ensure at least one image or URL is provided
      alert("Please select an image or enter image URL(s).");
      return;
    }
  
    const formData = new FormData();
    formData.append("category", selectedCategory);
  
    // Handle subcategory if present
    if (selectedCategory === "stationary") {
      formData.append("subCategory", subCategory);
    }
  
    // Handle image files if selected
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);  // Append each image in the images array
      });
    }
  
    // Handle image URLs if provided
    if (imageUrls) {
      formData.append("imageUrls", imageUrls);  // Use "imageUrls" for multiple URLs
    }
  
    try {
      // Find the category by selectedCategory using its _id
      const categoryToUpdate = category.find((cat) => cat.category === selectedCategory);
  
      if (categoryToUpdate) {
        console.log("Updating category:", categoryToUpdate);  // Debug log to inspect the category object
        // Update existing category
        const response = await axios.put(
          `https://artisticify-backend.vercel.app/api/ourwork/update/${categoryToUpdate._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Response from API:", response);  // Log API response for debugging
        alert("Image(s) added successfully to the existing category!");
      } else {
        // Create a new category
        const response = await axios.post(
          "https://artisticify-backend.vercel.app/api/ourwork/insert",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Response from API (new category):", response);  // Log API response for debugging
        alert("New category created and image(s) added successfully!");
      }
  
      setSelectedCategory(""); // Reset the selected category
      setSubCategory(""); // Reset the selected subcategory
      setImages([]); // Reset the images array
      setImageUrls(""); // Reset the imageUrls
      fetchCategory(); // Refresh the categories
    } catch (error) {
      console.error("Error adding image(s):", error);
      alert("Failed to add image(s).");
    }
  };
  

  const deleteImage = async (id) => {
    try {
      await axios.delete(`https://artisticify-backend.vercel.app/api/ourwork/delete/${id}`);
      alert("Image deleted successfully!");
      fetchCategory();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`https://artisticify-backend.vercel.app/api/ourwork/delete/${id}`);
      alert("Category deleted successfully!");
      fetchCategory();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category.");
    }
  };

  const handleFileChange = (e) => {
    setImages([...e.target.files]);  // Store multiple selected files
  };

  const handleUrlChange = (e) => {
    setImageUrls(e.target.value);  // Set the imageUrls for multiple URLs
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          Our Work
        </h1>

        {/* Add Image Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Add Image
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium">
                Select Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Select --</option>
                <option value="logo">logo</option>
                <option value="brochure">brochure</option>
                <option value="poster">poster</option>
                <option value="flyer">flyer</option>
                <option value="packaging">packaging</option>
                <option value="ui/ux">ui/ux</option>
                <option value="icon">icon</option>
                <option value="magazine">magazine</option>
                <option value="visual Aid">visual Aid</option>
                <option value="stationary">stationary</option>
              </select>
            </div>

            {selectedCategory === "stationary" && (
              <div>
                <label className="block text-gray-600 font-medium">
                  Select Subcategory:
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Select --</option>
                  <option value="envelope">envelope</option>
                  <option value="menu-card">menu-card</option>
                  <option value="certificate">certificate</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-gray-600 font-medium">
                Select Image(s):
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                multiple // Allow multiple file selection
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium">
                Or enter Image URL(s) (comma-separated):
              </label>
              <input
                type="text"
                value={imageUrls}
                onChange={handleUrlChange}
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter Image URLs, separated by commas"
              />
            </div>

            <button
              onClick={addImage}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
            >
              Add Image
            </button>
          </div>
        </div>

        {/* Display Categories and Images */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            All Categories
          </h2>
          {category && category.length > 0 ? (
            category.map((cat) => (
              <div key={cat._id} className="mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    {cat.category}
                  </h3>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete Category
                  </button>
                </div>

                {/* Ensure subCategory is an array */}
                {Array.isArray(cat.subCategory) && cat.subCategory.length > 0 ? (
                  cat.subCategory.map((sub) => (
                    <div key={sub._id} className="mb-4">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">
                        {sub.subCategory}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {sub.images && sub.images.length > 0 ? (
                          sub.images.map((img) => (
                            <div key={img._id} className="relative group">
                              <img
                                src={img.imageUrl}
                                alt={sub.subCategory}
                                className="rounded-lg shadow-md"
                              />
                              <button
                                onClick={() => deleteImage(img._id)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                              >
                                ✕
                              </button>
                            </div>
                          ))
                        ) : (
                          <p>No images available.</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cat.images && cat.images.length > 0 ? (
                      cat.images.map((img) => (
                        <div key={img._id} className="relative group">
                          <img
                            src={img.imageUrl}
                            alt={cat.category}
                            className="rounded-lg shadow-md"
                          />
                          <button
                            onClick={() => deleteImage(img._id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No images available.</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No categories available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurWork;
