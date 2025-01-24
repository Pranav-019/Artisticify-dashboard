import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Container, Image, Table } from "react-bootstrap";

function Design() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [ourWorks, setOurWorks] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const fetchOurWorks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/design/fetch"
      );

      console.log("Response for fetch : ", response);
      if (response.data.success) {
        setOurWorks(response.data.ourDesign);
      } else {
        console.error("Failed to fetch Our Work items:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Our Work items:", error);
    }
  };

  useEffect(() => {
    fetchOurWorks();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const addImage = async () => {
    if (!selectedCategory || !selectedFile) {
      alert("Please select a category and an image.");
      return;
    }

    const formData = new FormData();
    formData.append("category", selectedCategory);
    formData.append("imageUrls", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/design/insert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        alert("Image added successfully!");
      } else {
        alert("Failed to add image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error occurred while adding the image.");
    }
  };

  const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/design/delete/${id}`
      );
      console.log("Response for Delete : ", response);
      if (response.data.success) {
        alert("Category and Image deleted successfully!");
        fetchOurWorks();
      } else {
        alert("Failed to delete category.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error occurred while deleting the category.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h1
          className="text-4xl font-bold text-center text-blue-600 mb-8"
          style={{ color: "#03c9d7" }}
        >
          Design
        </h1>

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
                <option value="logo-design">logo-design</option>
                <option value="brochure-design">brochure-design</option>
                <option value="flyer-design">flyer-design</option>
                <option value="packaging-design">packaging-design</option>
                <option value="icon-design">icon-design</option>
                <option value="uiux-design">uiux-design</option>
                <option value="stationary-design">stationary-design</option>
                <option value="magazine-design">magazine-design</option>
                <option value="visualAid-design">visualAid-design</option>
                <option value="poster-design">poster-design</option>

                <option value="calendar-design">calendar-design</option>
                <option value="letterHead-design">letterHead-design</option>
                <option value="envelope-design">envelope-design</option>
                <option value="visitingCard-design">visitingCard-design</option>
                <option value="certificate-design">certificate-design</option>
                <option value="menuCard-design">menuCard-design</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium">
                Select Image(s):
              </label>
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

        <Container>
          <div className="container py-4">
            {ourWorks.map((work) => (
              <div
                className="row align-items-center border-bottom py-3"
                key={work.id}
              >
                <div className="col-lg-3 col-md-4 col-sm-12 mb-2 mb-md-0">
                  <h6 className="fw-bold">{work.category}</h6>
                </div>

                <div className="col-lg-4 col-md-5 col-sm-12 mb-2 mb-md-0">
                  <div className="d-flex flex-wrap gap-2">
                    {work.images.map((image, index) => (
                      <img
                        key={index}
                        src={`data:${image.contentType};base64,${image.data}`}
                        alt={`${work.category} ${index}`}
                        className="rounded object-cover"
                        style={{
                          width: "70px",
                          height: "70px",
                          border: "1px solid #ccc",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Delete Button */}
                <div className="col-lg-5 col-md-3 col-sm-12 d-flex justify-content-start justify-content-md-end gap-2">
                  <Button
                    variant="danger"
                    onClick={() => deleteCategory(work.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Design;
