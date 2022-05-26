import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
//import './App.css';
//import "@aws-amplify/ui-react/styles.css";
import "bootstrap/dist/css/bootstrap.css";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
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
  const initialFormState = {
    name: "",
    description: "",
    price: 0.0,
    quantity: 1,
    isOpen: true,
  };
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
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.quantity ||
      !formData.isOpen
    )
      return;
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
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Proof of concept</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Buying item</Nav.Link>
              <Nav.Link href="/findOrders">Submit offer</Nav.Link>
              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="container-xxl" fluid>
        <div className="d-flex flex-row">
          {/* <aside className="flex-sm-column p-3 bd-sidebar py-md-4 h-auto d-none d-sm-block">
            <Navbar.Brand>Buying item</Navbar.Brand>
            <hr />
            <Nav className="flex-sm-column nav-pills">
              <Nav.Link href="/">Add item request</Nav.Link>
            </Nav>
            <hr />
            <Navbar.Brand>Traveller</Navbar.Brand>
            <hr />
            <Nav className="flex-sm-column nav-pills">
              <Nav.Link href="findOrders">Submit offer</Nav.Link>
            </Nav>
            <hr />
          </aside> */}
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

                      <Form.Group>
                        <Form.Label>Link to item</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="https://wwww.amazon.com/iPhone12"
                          value={formData.name}
                        />
                        <Form.Text className="text-muted">
                          Enter link to item web shop page
                        </Form.Text>
                      </Form.Group>

                      <Form.Group>
                        <Row className="g-0">
                          <Form.Label>Photos</Form.Label>
                          <Card
                            className="col-md-auto"
                            style={{ width: "10rem" }}
                          >
                            <Card.Img
                              variant="top"
                              src="holder.js/100px180"
                              style={{ width: "10rem" }}
                            />
                            <Card.Body>
                              <Button variant="primary">Remove</Button>
                            </Card.Body>
                          </Card>
                          <Card
                            className="col-md-auto"
                            style={{ width: "10rem" }}
                          >
                            <Card.Img
                              variant="top"
                              src="holder.js/100px180"
                              style={{ width: "10rem" }}
                            />
                            <Card.Body>
                              <Button variant="primary">Remove</Button>
                            </Card.Body>
                          </Card>
                        </Row>
                      </Form.Group>

                      <Form.Group className="">
                        <Form.Label>Item description</Form.Label>
                        <Form.Control
                          type="text"
                          as="textarea"
                          rows={3}
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

                      <Form.Group>
                        <Row>
                          <Col>
                            <Form.Label>From</Form.Label>
                            <Form.Control
                              type="text"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              placeholder="From address"
                              value={formData.description}
                            />
                            <Form.Select aria-label="Default select example">
                              <option>Select country</option>
                              <option value="United States">
                                United States
                              </option>
                              <option value="Singapore">Singapore</option>
                              <option value="Vietnam">Vietnam</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                              From location
                            </Form.Text>
                          </Col>

                          <Col>
                            <Form.Label>To</Form.Label>
                            <Form.Control
                              type="text"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              placeholder="To address"
                              value={formData.description}
                            />
                            <Form.Select aria-label="Default select example">
                              <option>Select country</option>
                              <option value="United States">
                                United States
                              </option>
                              <option value="Singapore">Singapore</option>
                              <option value="Vietnam">Vietnam</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                              To location
                            </Form.Text>
                          </Col>
                        </Row>
                      </Form.Group>

                      <Form.Group>
                        <Row>
                          <Col>
                            <Form.Label>Item price</Form.Label>
                            <Row>
                              <Col>
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
                              </Col>
                              <Col>
                                <Form.Select aria-label="Default select example">
                                  <option>Select currency</option>
                                  <option value="USD">USD</option>
                                  <option value="VND">VND</option>
                                  <option value="SGD">SGD</option>
                                </Form.Select>
                              </Col>
                            </Row>
                            <Form.Text className="text-muted">
                              Enter item price
                            </Form.Text>
                          </Col>
                          <Col>
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                              type="number"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  quantity: Number(e.target.value),
                                })
                              }
                              placeholder="1"
                              value={formData.quantity}
                            />
                            <Form.Text className="text-muted">
                              How much/How many do you want to buy?
                            </Form.Text>
                          </Col>
                        </Row>
                      </Form.Group>

                      <Form.Group className=""></Form.Group>

                      <Form.Group className="">
                        {/* <Form.Check type="checkbox" label="Test" /> */}
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
                                <Card.Text>${Request.price}</Card.Text>
                                <Card.Text>
                                  Quantity: {Request.quantity}
                                </Card.Text>
                                <Card.Text>
                                  Status:{" "}
                                  {Request.isOpen ? "Waiting offer" : "Closed"}
                                </Card.Text>
                                <Row>
                                  <Button
                                    onClick={() => deleteRequest(Request)}
                                    variant="primary"
                                  >
                                    Delete request
                                  </Button>
                                </Row>
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
                                <Card.Text>${Request.price}</Card.Text>
                                <Card.Text>
                                  Quantity: {Request.quantity}
                                </Card.Text>
                                <Card.Text>
                                  Status:{" "}
                                  {Request.isOpen ? "Waiting offer" : "Closed"}
                                </Card.Text>
                                <Row>
                                  <Button onClick={() => {}} variant="primary">
                                    Offer
                                  </Button>
                                </Row>
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
