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
  const initialFormState = { name: "", description: "" };
  const [notes, setNotes] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData: any = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
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
      <Container className="xxl vh-100 d-inline-flex" fluid>
        <Row className="vh-100">
          <Col>
            <div className="vh-100 bd-sidebar">
              <Container className="vh-100 flex-sm-column">
                <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                <Nav className="flex-sm-column flex-fill nav-pills">
                  <Nav.Link href="#home">Home</Nav.Link>
                  <Nav.Link href="#features">Features</Nav.Link>
                  <Nav.Link href="#pricing">Pricing</Nav.Link>
                </Nav>
              </Container>
            </div>
          </Col>
          {/* Notes app */}
          <Col>
            <h1>My Notes App</h1>
            <input
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Note name"
              value={formData.name}
            />
            <input
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Note description"
              value={formData.description}
            />
            <button onClick={createNote}>Create Note</button>
            <div style={{ marginBottom: 30 }}>
              {notes.map((note) => (
                <div key={note.id || note.name}>
                  <h2>{note.name}</h2>
                  <p>{note.description}</p>
                  <button onClick={() => deleteNote(note)}>Delete note</button>
                </div>
              ))}
            </div>
            <Authenticator loginMechanisms={["email"]}>
              {({ signOut, user }) => (
                <main>
                  <h1>Hello {user.username}</h1>
                  <button onClick={signOut}>Sign out</button>
                </main>
              )}
            </Authenticator>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
