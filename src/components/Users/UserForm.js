import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { userService } from '../../services/api';

const UserForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Initialize with user data if available from location state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  

  useEffect(() => {
    // If we have user data from the navigation state, use it
    if (location.state && location.state.user) {
      const { user } = location.state;
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar
      });
    } else {
      // Otherwise we need to fetch the user data
      fetchUserData();
    }
  }, [id, location.state]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Note: The reqres API doesn't actually provide an endpoint to get a single user
      // by ID, but in a real application you would fetch the user here
      // const user = await userService.getUser(id);
      // setFormData(user);
    } catch (err) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
      isValid = false;
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      await userService.updateUser(id, formData);
      showNotification('User updated successfully!', 'success');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      setError('Failed to update user');
      showNotification('Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/users');
  };


const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    // Auto-hide after duration
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  return (
    <div className="gradient-background min-h-screen flex justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {notification.show && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              <p>{notification.message}</p>
            </div>
          </div>
        )}

        <div className="auth-card animate-fadeIn">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit User
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          {loading && !formData.first_name ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {formData.avatar && (
                <div className="flex justify-center mb-6">
                  <img 
                    src={formData.avatar} 
                    alt={`${formData.first_name} ${formData.last_name}`} 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="first_name">
                  First Name
                </label>
                <input
                  className="input-field"
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
                {formErrors.first_name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="last_name">
                  Last Name
                </label>
                <input
                  className="input-field"
                  id="last_name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
                {formErrors.last_name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email
                </label>
                <input
                  className="input-field"
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <button
                  className="btn-primary py-2.5 px-6"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update User'
                  )}
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserForm;