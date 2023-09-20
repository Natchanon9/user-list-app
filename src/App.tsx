import React, { useEffect, useState, useCallback } from 'react';

const App: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch user data
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `https://random-data-api.com/api/users/random_user?size=5&page=${page}`
        );
        const data = await response.json();
        setUsers((prevUsers) => [...prevUsers, ...data]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsers();
  }, [page]);

  const handleFetchMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  // Filter the user list based on the search term
  const filteredUsers = users.filter((user) => {
    const searchLowerCase = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLowerCase) ||
      user.first_name?.toLowerCase().includes(searchLowerCase) ||
      user.last_name?.toLowerCase().includes(searchLowerCase)
    );
  });

  const handleUserClick = (userName: string) => {
    setSelectedUser(userName);
  };

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0', margin: 0, padding: 0 }}>
      <h1 style={{ color: '#333' }}>User List</h1>
      <input
        type="text"
        placeholder="Search by username, first name, or last name"
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <div className="user-list">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`user ${user.username === selectedUser ? 'selected' : ''}`}
            onClick={() => handleUserClick(user.username)}
            style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', padding: '10px' }}
          >
            <strong>Username:</strong> {user.username}<br />
            <strong>First Name:</strong> {user.first_name}<br />
            <strong>Last Name:</strong> {user.last_name}<br />
            <strong>Address:</strong> {user.address?.street_address}, {user.address?.city}, {user.address?.state}, {user.address?.zip}<br /><br />
          </div>
        ))}
      </div>
      <button
        onClick={handleFetchMore}
        style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
      >
        Fetch More
      </button>
    </div>
  );
}

export default App;
