import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTwitter, FaInstagram, FaLinkedin, FaFacebook, FaEdit, FaSave } from 'react-icons/fa';

const SocialMediaLinks = () => {
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = 'https://artisticify-backend.vercel.app/api/social';

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get`);
        if (!response.ok) {
          throw new Error('Failed to fetch social links');
        }
        const data = await response.json();
        if (data.success && data.links) {
          setSocialLinks(data.links);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // First try to update existing links
      if (socialLinks._id) {
        const response = await fetch(`${API_BASE_URL}/update/${socialLinks._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(socialLinks),
        });

        if (!response.ok) {
          throw new Error('Failed to update links');
        }

        const data = await response.json();
        if (data.success) {
          setSuccessMessage('Links updated successfully!');
          setIsEditing(false);
        }
      } else {
        // If no existing links, add new ones
        const response = await fetch(`${API_BASE_URL}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(socialLinks),
        });

        if (!response.ok) {
          throw new Error('Failed to add links');
        }

        const data = await response.json();
        if (data.success) {
          setSocialLinks(data.links);
          setSuccessMessage('Links added successfully!');
          setIsEditing(false);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  if (loading && !isEditing) {
    return <div className="text-center py-4">Loading social links...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Social Media Links</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          {isEditing ? (
            <>
              <FaSave /> Cancel
            </>
          ) : (
            <>
              <FaEdit /> Edit
            </>
          )}
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                <FaWhatsapp className="inline mr-2 text-green-500" />
                WhatsApp URL
              </label>
              <input
                type="url"
                name="whatsapp"
                value={socialLinks.whatsapp || ''}
                onChange={handleInputChange}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.whatsapp.com/..."
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                <FaTwitter className="inline mr-2 text-blue-400" />
                Twitter URL
              </label>
              <input
                type="url"
                name="twitter"
                value={socialLinks.twitter || ''}
                onChange={handleInputChange}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/..."
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                <FaInstagram className="inline mr-2 text-pink-500" />
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram"
                value={socialLinks.instagram || ''}
                onChange={handleInputChange}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/..."
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                <FaLinkedin className="inline mr-2 text-blue-600" />
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin"
                value={socialLinks.linkedin || ''}
                onChange={handleInputChange}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/..."
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                <FaFacebook className="inline mr-2 text-blue-700" />
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook"
                value={socialLinks.facebook || ''}
                onChange={handleInputChange}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-wrap justify-center gap-6">
            {socialLinks.whatsapp && (
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition"
              >
                <FaWhatsapp className="text-3xl text-green-500" />
                <span className="font-medium">WhatsApp</span>
              </a>
            )}

            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                <FaTwitter className="text-3xl text-blue-400" />
                <span className="font-medium">Twitter</span>
              </a>
            )}

            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition"
              >
                <FaInstagram className="text-3xl text-pink-500" />
                <span className="font-medium">Instagram</span>
              </a>
            )}

            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                <FaLinkedin className="text-3xl text-blue-600" />
                <span className="font-medium">LinkedIn</span>
              </a>
            )}

            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                <FaFacebook className="text-3xl text-blue-700" />
                <span className="font-medium">Facebook</span>
              </a>
            )}

            {!socialLinks.whatsapp && 
             !socialLinks.twitter && 
             !socialLinks.instagram && 
             !socialLinks.linkedin && 
             !socialLinks.facebook && (
              <p className="text-gray-500">No social links available. Click edit to add some.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaLinks;