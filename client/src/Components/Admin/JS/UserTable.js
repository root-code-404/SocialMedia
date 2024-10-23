import React, { useState, useEffect } from 'react';
import { Table, Button, } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/getUsers')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error:', error));
  }, [users]);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        console.log(`User with ID ${userId} has been deleted.`);
      } else {
        console.error(`Error deleting user with ID ${userId}.`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='container mt-4  '>
      <h2>User Table</h2>
      <Table striped bordered hover className='mt-4'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>

            <th>Number</th>
            <th>Bio</th>
            <th>Action</th>
            <th>Action</th>

          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.number}</td>
              <td>{user.bio}</td>
              <td>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete User
                </Button>
              </td>
              <td>
                <Link to={`/userprofiles/${user._id}`} className="text-decoration-none ">
                  <Button
                    variant="success"
                    className="ms-2"
                  >
                    View Profile
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    </div>
  );
};

export default UserTable;
