import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Dropdown,
  DropdownButton,
  Form,
  Card,
} from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import { Header } from "../Components";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/Crm.css";

const Crm = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [leadTypeFilter, setLeadTypeFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);
  const [followUpComment, setFollowUpComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTab, setShowTab] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [meetingRoom, setMeetingRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("https://artisticify-backend.vercel.app/api/contact");
        if (!response.ok) throw new Error("Failed to fetch leads");
        const data = await response.json();
        setLeads(data);
        setFilteredLeads(data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const applyFilter = (filterType) => {
    let filtered = [...leads];
    const now = new Date();

    switch (filterType) {
      case "today":
        filtered = filtered.filter(
          (lead) => new Date(lead.createdAt).toDateString() === now.toDateString()
        );
        break;
      case "thisWeek":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        filtered = filtered.filter(
          (lead) => new Date(lead.createdAt) >= startOfWeek
        );
        break;
      case "thisMonth":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(
          (lead) => new Date(lead.createdAt) >= startOfMonth
        );
        break;
      case "customDate":
        if (startDate && endDate) {
          filtered = filtered.filter((lead) => {
            const leadDate = new Date(lead.createdAt);
            return (
              leadDate >= new Date(startDate) && leadDate <= new Date(endDate)
            );
          });
        }
        break;
      case "all":
        filtered = leads;
        break;
      default:
        break;
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }
    if (leadTypeFilter !== "All") {
      filtered = filtered.filter((lead) => lead.leadType === leadTypeFilter);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadField = async (id, field, value) => {
    try {
      const response = await fetch(`https://artisticify-backend.vercel.app/api/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${field}`);
      }

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === id ? { ...lead, [field]: value } : lead
        )
      );
      applyFilter("all");

      if (selectedLead && selectedLead._id === id) {
        setSelectedLead((prevLead) => ({ ...prevLead, [field]: value }));
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleTabToggle = (lead) => {
    setSelectedLead(lead);
    setFollowUpComment("");
    setShowTab(!showTab);
    setUpdateSuccess(false);
  };

  const handleFollowUpChange = async () => {
    if (!selectedLead) return alert("Please select a lead.");
    const newFollowUp = followUpComment;

    try {
      const response = await fetch(`https://artisticify-backend.vercel.app/contact/${selectedLead._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followUp: newFollowUp }),
      });

      if (!response.ok) {
        throw new Error("Failed to update follow-up");
      }

      const updatedLead = {
        ...selectedLead,
        followUp: [...(selectedLead.followUp || []), newFollowUp],
      };

      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === selectedLead._id ? updatedLead : lead
        )
      );

      setSelectedLead(updatedLead);
      setFollowUpComment("");
      setUpdateSuccess(true);
    } catch (error) {
      console.error("Error updating follow-up:", error);
    }
  };

  const handleStartMeeting = () => {
    if (meetingRoom && userName) {
      const url = `https://meet.jit.si/${meetingRoom}`;
      const meetingWindow = window.open(url, "_blank");

      meetingWindow?.addEventListener("load", () => {
        meetingWindow.document.documentElement.requestFullscreen();
      });

      setIsMeetingStarted(true);
    } else {
      alert("Please provide a meeting room name and your name.");
    }
  };

  return (
    <Container className="crm-container">
      <Row>
        <Col>
          <Header category="Page" title="CRM" />

          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <div className="d-flex gap-3">
                  <Button variant="primary" onClick={() => applyFilter("today")}>
                    Today
                  </Button>
                  <Button variant="primary" onClick={() => applyFilter("thisWeek")}>
                    This Week
                  </Button>
                  <Button variant="primary" onClick={() => applyFilter("thisMonth")}>
                    This Month
                  </Button>
                  <Button variant="primary" onClick={() => applyFilter("all")}>
                    All
                  </Button>
                </div>
              </div>

              <h5>Leads List</h5>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Table striped bordered hover responsive className="lead-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Service</th>
                      <th>Status</th>
                      <th>Lead Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr key={lead._id}>
                        <td>{lead.name}</td>
                        <td>{lead.email}</td>
                        <td>{lead.phone}</td>
                        <td>{lead.serviceSelected}</td>
                        <td>{lead.status}</td>
                        <td>{lead.leadType}</td>
                        <td>
                          <FaPen
                            size={24}
                            onClick={() => handleTabToggle(lead)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          {showTab && selectedLead && (
            <div className="lead-tab">
              <Card className="mb-4">
                <Card.Body>
                  <h4>Lead Details</h4>
                  <p><strong>Name:</strong> {selectedLead.name}</p>
                  <p><strong>Email:</strong> {selectedLead.email}</p>
                  <p><strong>Phone:</strong> {selectedLead.phone}</p>
                  <p><strong>Service:</strong> {selectedLead.serviceSelected}</p>
                  <p><strong>Status:</strong>
                    <DropdownButton
                      id="status-dropdown"
                      title={selectedLead.status || "Select"}
                      onSelect={(value) => {
                        updateLeadField(selectedLead._id, "status", value);
                      }}
                    >
                      <Dropdown.Item eventKey="New">New</Dropdown.Item>
                      <Dropdown.Item eventKey="In Progress">In Progress</Dropdown.Item>
                      <Dropdown.Item eventKey="Converted">Converted</Dropdown.Item>
                      <Dropdown.Item eventKey="Non Converted">Non Converted</Dropdown.Item>
                    </DropdownButton>
                  </p>
                  <p><strong>Lead Type:</strong>
                    <DropdownButton
                      id="leadType-dropdown"
                      title={selectedLead.leadType || "Select"}
                      onSelect={(value) => {
                        updateLeadField(selectedLead._id, "leadType", value);
                      }}
                    >
                      <Dropdown.Item eventKey="High Priority">High Priority</Dropdown.Item>
                      <Dropdown.Item eventKey="Medium Priority">Medium Priority</Dropdown.Item>
                      <Dropdown.Item eventKey="Low Priority">Low Priority</Dropdown.Item>
                    </DropdownButton>
                  </p>
                  <p><strong>Follow Up:</strong></p>
                  <div className="follow-up-section">
                    {selectedLead.followUp?.map((comment, index) => (
                      <div key={index} className="follow-up-comment">
                        {index + 1}. {comment}
                      </div>
                    ))}
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={followUpComment}
                    onChange={(e) => setFollowUpComment(e.target.value)}
                    placeholder="Add new follow-up comment..."
                    className="mt-2"
                  />
                  <Button
                    variant="primary"
                    onClick={handleFollowUpChange}
                    disabled={!followUpComment}
                    className="mt-2"
                  >
                    Add Follow Up
                  </Button>
                  {updateSuccess && (
                    <p className="text-success mt-2">
                      Follow-up comment added successfully!
                    </p>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => setShowTab(false)}
                    className="ms-2 mt-2"
                  >
                    Close Tab
                  </Button>

                  <div className="meeting-section mt-4">
                    <h5>Start Online Meeting</h5>
                    <Form.Group>
                      <Form.Label>Meeting Room Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter meeting room name"
                        value={meetingRoom}
                        onChange={(e) => setMeetingRoom(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="mt-2">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      variant="success"
                      onClick={handleStartMeeting}
                      className="mt-2"
                    >
                      Start Meeting
                    </Button>
                    {isMeetingStarted && (
                      <p className="text-success mt-2">
                        Meeting started successfully!
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Crm;
