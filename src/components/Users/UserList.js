import { useState, useEffect } from 'react';
import { userService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await userService.getUsers(page);
      setUsers(response.data);
      setTotalPages(response.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to fetch users');
      if (err.response && err.response.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (user) => {
    navigate(`/edit-user/${user.id}`, { state: { user } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        // Remove the user from the current state
        setUsers(users.filter(user => user.id !== id));
        showNotification('User deleted successfully', 'success');
      } catch (err) {
        showNotification('Failed to delete user', 'error');
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    
    // Auto-hide after duration
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };
  
  const hideNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };
  

  return (
    <div className="gradient-background min-h-screen pb-12">
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
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
            <button 
              onClick={hideNotification}
              className="ml-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-8">
        {/* Search Box */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="input-field pl-10"
              style={{ textIndent: "10px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filteredUsers.map((user, index) => (
                <div 
                  key={user.id} 
                  className="card hover:translate-y-[-5px] transition-all duration-300"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={user.avatar}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-pink-500"
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          {user.first_name} {user.last_name}
                        </h2>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn-secondary py-1.5 px-4 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-1.5 px-4 rounded-full text-sm transition-all duration-300 shadow-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="inline-flex rounded-md shadow-sm bg-white bg-opacity-20 p-1 backdrop-filter backdrop-blur-lg">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 mx-1 rounded-md ${
                      currentPage === page
                        ? 'bg-white text-pink-600 font-bold shadow-sm'
                        : 'text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;