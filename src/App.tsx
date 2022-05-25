import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
//import './App.css';
//import "@aws-amplify/ui-react/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./scss/custom.scss";
import { Authenticator } from "@aws-amplify/ui-react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { listRequests } from "./graphql/queries";
import {
  createRequest as createRequestMutation,
  deleteRequest as deleteRequestMutation,
} from "./graphql/mutations";

import awsExports from "./aws-exports";
import { couldStartTrivia } from "typescript";
Amplify.configure(awsExports);

function App() {
  const initialFormState = { name: "", description: "", price: 0.01 };
  const [Requests, setRequests] = useState<any[]>([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const apiData: any = await API.graphql({ query: listRequests });
    console.log(apiData.data.listRequests.items);
    setRequests(apiData.data.listRequests.items);
  }

  async function createRequest() {
    if (!formData.name || !formData.description || !formData.price) return;
    await API.graphql({
      query: createRequestMutation,
      variables: { input: formData },
    });
    setRequests([...Requests, formData]);
    setFormData(initialFormState);
  }

  async function deleteRequest({ id }: any) {
    const newRequestsArray = Requests.filter(
      (Request: { id: any }) => Request.id !== id
    );
    setRequests(newRequestsArray);
    await API.graphql({
      query: deleteRequestMutation,
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
            <ul className="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0 mr-auto">
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
          <aside className="flex-sm-column p-3 bd-sidebar py-md-4 h-auto d-none d-sm-block">
            <Navbar.Brand>Buying item</Navbar.Brand>
            <hr />
            <Nav className="flex-sm-column nav-pills">
              <Nav.Link href="/">Add item request</Nav.Link>
              {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
            </Nav>
            <hr />
            <Navbar.Brand>Traveller</Navbar.Brand>
            <hr />
            <Nav className="flex-sm-column nav-pills">
              <Nav.Link href="findOrders">Submit offer</Nav.Link>
              {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
            </Nav>
            <hr />
          </aside>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="flex-sm-column ps-lg-5 my-4 ms-3">
                    <h1>Add new item request</h1>
                    <Form className="row g-3 col-md-12">
                      <Form.Group>
                        <Form.Label>Item name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Item name"
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          value={formData.name}
                        />
                        <Form.Text className="text-muted">
                          Enter item name
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="">
                        <Form.Label>Item description</Form.Label>
                        <Form.Control
                          type="text"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Item description"
                          value={formData.description}
                        />
                        <Form.Text className="text-muted">
                          Enter item description
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="">
                        <Form.Group className="">
                          <Form.Label>Item price</Form.Label>
                          <Form.Control
                            type="number"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                price: Number(e.target.value),
                              })
                            }
                            placeholder="Item price"
                            value={formData.price}
                          />
                          <Form.Text className="text-muted">
                            Enter item price
                          </Form.Text>
                        </Form.Group>
                        <Form.Check type="checkbox" label="Test" />
                        <Button
                          className="col-12"
                          variant="primary"
                          onClick={createRequest}
                        >
                          Submit
                        </Button>{" "}
                      </Form.Group>
                    </Form>
                    <div style={{ marginTop: 30, marginBottom: 30 }}>
                      <Row className="g-2">
                        {Requests.map((Request) => (
                          <Col>
                            <Card
                              key={Request.id || Request.name}
                              style={{ width: "18rem" }}
                            >
                              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                              <Card.Header>{Request.name}</Card.Header>
                              <Card.Body>
                                {/* <Card.Title>{Request.name}</Card.Title> */}
                                <Card.Text>{Request.description}</Card.Text>
                                <Card.Text>{Request.price}</Card.Text>
                                <Button
                                  onClick={() => deleteRequest(Request)}
                                  variant="primary"
                                >
                                  Delete request
                                </Button>
                              </Card.Body>
                              <Card.Footer className="text-muted">
                                2 days ago
                              </Card.Footer>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                    <hr />

                    {/* <Authenticator loginMechanisms={["email"]}>
              {({ signOut, user }) => (
                <main>
                  <h1>Hello {user.username}</h1>
                  <button onClick={signOuあんt}>Sign out</button>
                </main>
              )}
            </Authenticator> */}
                  </div>
                }
              ></Route>
              <Route
                path="/findOrders"
                element={
                  <div className="flex-sm-column ps-lg-5 my-md-4">
                    <h1>Submit offer</h1>
                    <div style={{ marginTop: 30, marginBottom: 30 }}>
                      <Row className="g-2">
                        {Requests.map((Request) => (
                          <Col>
                            <Card
                              key={Request.id || Request.name}
                              style={{ width: "18rem" }}
                            >
                              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                              <Card.Header>{Request.name}</Card.Header>
                              <Card.Body>
                                {/* <Card.Title>{Request.name}</Card.Title> */}
                                <Card.Text>{Request.description}</Card.Text>
                                <Card.Text>{Request.price}</Card.Text>
                                <Button onClick={() => {}} variant="primary">
                                  Offer
                                </Button>
                              </Card.Body>
                              <Card.Footer className="text-muted">
                                2 days ago
                              </Card.Footer>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                    <hr />

                    {/* <Authenticator loginMechanisms={["email"]}>
              {({ signOut, user }) => (
                <main>
                  <h1>Hello {user.username}</h1>
                  <button onClick={signOuあんt}>Sign out</button>
                </main>
              )}
            </Authenticator> */}
                  </div>
                }
              ></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </Container>
    </div>
  );
}

export default App;
