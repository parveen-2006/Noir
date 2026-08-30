const users = [
  { name: 'Ava Thompson', email: 'ava@noir.com', role: 'Admin', status: 'Active' },
  { name: 'Noah Patel', email: 'noah@noir.com', role: 'Manager', status: 'Active' },
  { name: 'Mia Rodriguez', email: 'mia@noir.com', role: 'Support', status: 'Pending' },
  { name: 'Liam Scott', email: 'liam@noir.com', role: 'Editor', status: 'Inactive' },
];

function UserPage() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">People</p>
          <h1>User</h1>
        </div>
        <button className="primary-button">Add user</button>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>Users</h2>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default UserPage;
