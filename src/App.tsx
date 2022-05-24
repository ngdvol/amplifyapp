import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
//import './App.css';
//import "@aws-amplify/ui-react/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./scss/custom.scss";
import { Authenticator } from "@aws-amplify/ui-react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";

import awsExports from "./aws-exports";
import { couldStartTrivia } from "typescript";
Amplify.configure(awsExports);

function App() {
  const initialFormState = { name: "", description: "", price: 0.01 };
  const [notes, setNotes] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData: any = await API.graphql({ query: listNotes });
    console.log(apiData.data.listNotes.items);
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description || !formData.price) return;
    await API.graphql({
      query: createNoteMutation,
      variables: { input: formData },
    });
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }: any) {
    const newNotesArray = notes.filter((note: { id: any }) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div className="App">
      <Nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <Container className="container-xxl" fluid>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul className="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0">
              <li className="nav-item col-6 col-md-auto">
                <a className="nav-link p-2" href="/">
                  Home
                </a>
              </li>
            </ul>
          </div>
        </Container>
      </Nav>

      <Container className="container-xxl" fluid>
        <div className="d-flex flex-row">
          <aside className="flex-sm-column p-3 bd-sidebar py-md-4 h-auto">
            <Navbar.Brand href="#home">My requests</Navbar.Brand>
            <hr />
            <Nav className="flex-sm-column nav-pills">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            <hr />
          </aside>
          {/* Notes app */}
          <div className="flex-sm-column ps-lg-5 my-md-4">
            <h1>My request list</h1>
            <input
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Item name"
              value={formData.name}
            />
            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Item description"
              value={formData.description}
            />
            <input
              type="number"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: isNaN(e.target.valueAsNumber)
                    ? 0
                    : e.target.valueAsNumber,
                })
              }
              placeholder="Item price"
              value={formData.price}
            />
            <button onClick={createNote}>Create request</button>
            <div style={{ marginBottom: 30 }}>
              {notes.map((note) => (
                <div key={note.id || note.name}>
                  <h2>Item name: {note.name}</h2>
                  <p>Description: {note.description}</p>
                  <p>Price: {note.price}</p>
                  <p>ID: {note.id}</p>
                  <button onClick={() => deleteNote(note)}>
                    Delete request
                  </button>
                </div>
              ))}
            </div>
            <hr />

            {/* <Authenticator loginMechanisms={["email"]}>
              {({ signOut, user }) => (
                <main>
                  <h1>Hello {user.username}</h1>
                  <button onClick={signOut}>Sign out</button>
                </main>
              )}
            </Authenticator> */}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
