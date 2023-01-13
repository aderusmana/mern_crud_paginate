import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setlimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getUsers();
  }, [page, keyword]);

  const getUsers = async () => {
    const response = await axios.get(
      `http://localhost:5000/users?search_query=${keyword}&page=${page}&limit=${limit}`
    );
    setUsers(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPages);
    setRows(response.data.totalRows);
  };

  const changePage = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg(
        "Jika anda tidak menemukan data yang anda cari, maka cari dengan menggunakan fitur search dengan kata lebih spesifik !"
      );
    } else {
      setMsg("");
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      getUsers();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="columns">
        <div className="column is-centered">
          <form onSubmit={searchData}>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find Something here..."
                ></input>
              </div>
              <div className="control">
                <button type="submit" className="button is-info">
                  Search
                </button>
              </div>
            </div>
            <Link className="button is-success" to="/add">
              Add User
            </Link>
          </form>
          <table className="table is-striped is-bordered is-fullwidth mt-2 ">
            <thead className="has-text-centered">
              <tr>
                <th className="has-text-centered">Name</th>
                <th className="has-text-centered">Email</th>
                <th className="has-text-centered">Gender</th>
                <th className="has-text-centered">Image</th>
                <th className="has-text-centered">Action</th>
              </tr>
            </thead>
            <tbody className="has-text-centered">
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.gender}</td>
                  <td>
                    <img width="50px" src={user.url} alt="Image" />
                  </td>
                  <td>
                    <button className="button is-small is-responsive is-warning mr-3">
                      <Link to={`edit/${user.id}`}> EDIT</Link>
                    </button>

                    <button
                      onClick={() => deleteUser(user.id)}
                      className="button is-small is-responsive is-danger"
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Total Rows : {rows} Page: {rows ? page + 1 : 0} of {pages}
          </p>
          <h3 className="has-text-centered has-text-danger">{msg}</h3>
          <nav
            key={rows}
            className="pagination is-centered"
            role="navigation"
            aria-label="pagination"
          >
            <ReactPaginate
              previousLabel={"<< Prev"}
              nextLabel={"Next >>"}
              pageCount={Math.min(10, pages)}
              onPageChange={changePage}
              containerClassName={"pagination-list"}
              pageLinkClassName={"pagination-link"}
              previousLinkClassName={"pagination-previous"}
              nextLinkClassName={"pagination-next"}
              activeLinkClassName={"pagination-link is-current"}
              disabledLinkClassName={"pagination-link is-disable"}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default UserList;
