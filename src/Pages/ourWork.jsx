import React, { useState, useEffect } from "react";
import axios from "axios";

const OurWork = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [image, setImage] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ourwork");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addImage = async () => {
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("category", selectedCategory);
    if (selectedCategory === "Stationary") {
      formData.append("subCategory", subCategory);
    }
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/ourwork/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Image added successfully!");
      setSelectedCategory(""); // Reset the selected category
      setSubCategory(""); // Reset the selected subcategory
      setImage(null); // Reset the image
      fetchCategories(); // Refresh the categories
    } catch (error) {
      console.error("Error adding image:", error);
      alert("Failed to add image.");
    }
  };

  const deleteImage = async (category, subCategory, imageUrl) => {
    try {
      await axios.delete("http://localhost:5000/api/ourwork/delete", {
        data: { category, subCategory, imageUrl },
      });
      alert("Image deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image.");
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    fetchCategories();
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
                <option value="Logo">Logo</option>
                <option value="Brochure">Brochure</option>
                <option value="Poster">Poster</option>
                <option value="Flyer">Flyer</option>
                <option value="Packaging">Packaging</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Icon">Icon</option>
                <option value="Magazine">Magazine</option>
                <option value="Visual Aid">Visual Aid</option>
                <option value="Stationary">Stationary</option>
              </select>
            </div>

            {selectedCategory === "Stationary" && (
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
                  <option value="Envelope">Envelope</option>
                  <option value="Menu-Card">Menu-Card</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>
            )}

            <div>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          {categories.map((category) => (
            <div key={category.name} className="mb-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {category.name}
              </h3>
              {category.name === "Stationary" ? (
                category.subCategories.map((sub) => (
                  <div key={sub.name} className="mb-4">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                      {sub.name}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {sub.images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={sub.name}
                            className="rounded-lg shadow-md"
                          />
                          <button
                            onClick={() =>
                              deleteImage(category.name, sub.name, img)
                            }
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {category.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={category.name}
                        className="rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => deleteImage(category.name, null, img)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurWork;
