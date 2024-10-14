import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  // Styles go here


// Import user images
import yogeshImage from './images/yogesh.png';
import anoopImage from './images/anoop-sharma.jpg';
import shankarImage from './images/shankar-kumar.jpg';
import rameshImage from './images/ramesh.png';
import sureshImage from './images/suresh.png';

// Define a mapping of user names to their imported image URLs
const userImages = {
  "Yogesh": yogeshImage,
  "Anoop sharma": anoopImage,
  "Shankar Kumar": shankarImage,
  "Ramesh": rameshImage,
  "Suresh": sureshImage
};

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState('status'); // Default grouping
  const [sortedBy, setSortedBy] = useState('');

  useEffect(() => {
    // Fetch data from API
    axios.get('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => {
        setTickets(response.data.tickets);
        setUsers(response.data.users);
      })
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  const groupTickets = (tickets, grouping) => {
    switch (grouping) {
      case 'status':
        return groupByStatus(tickets);
      case 'user':
        return groupByUser(tickets);
      case 'priority':
        return groupByPriority(tickets);
      default:
        return tickets;
    }
  };

  const groupByStatus = (tickets) => {
    const statuses = ['Todo', 'In progress', 'Backlog'];
    return statuses.map(status => ({
      title: status,
      tickets: tickets.filter(ticket => ticket.status === status)
    }));
  };

  const groupByUser = (tickets) => {
    return users.map(user => ({
      title: user.name,
      tickets: tickets.filter(ticket => ticket.userId === user.id)
    }));
  };

  const groupByPriority = (tickets) => {
    const priorities = ['Urgent', 'High', 'Medium', 'Low', 'No Priority'];
    return priorities.map((priority, idx) => ({
      title: priority,
      tickets: tickets.filter(ticket => ticket.priority === (4 - idx)) // Priority is descending
    }));
  };

  const sortTickets = (tickets, sortBy) => {
    if (sortBy === 'priority') {
      return [...tickets].sort((a, b) => b.priority - a.priority); // Descending priority
    } else if (sortBy === 'title') {
      return [...tickets].sort((a, b) => a.title.localeCompare(b.title)); // Ascending title
    }
    return tickets;
  };

  const groupedTickets = groupTickets(tickets, grouping);

  return (
    <div className="kanban-container">
      <h1>Kanban Board</h1>
      <div className="controls">
        <button onClick={() => setGrouping('status')}>Group by Status</button>
        <button onClick={() => setGrouping('user')}>Group by User</button>
        <button onClick={() => setGrouping('priority')}>Group by Priority</button>
        <button onClick={() => setSortedBy('priority')}>Sort by Priority</button>
        <button onClick={() => setSortedBy('title')}>Sort by Title</button>
      </div>

      <div className="kanban-board">
        {groupedTickets.map((group, idx) => (
          <div key={idx} className="kanban-column">
            <h2>{group.title}</h2>
            {sortTickets(group.tickets, sortedBy).map(ticket => (
              <KanbanCard key={ticket.id} ticket={ticket} users={users} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// KanbanCard component inside the same file
const KanbanCard = ({ ticket, users }) => {
  const user = users.find(user => user.id === ticket.userId);

  return (
    <div className="kanban-card">
      <div className="card-header">
        <span className="ticket-id">{ticket.id}</span>
        {user && (
          <div className="user-avatar">
            <img src={userImages[user.name]} alt={user.name} />
          </div>
        )}
      </div>
      <h3 className="ticket-title">{ticket.title}</h3>
      <p className="ticket-priority">
        Priority: {['No Priority', 'Low', 'Medium', 'High', 'Urgent'][ticket.priority]}
      </p>
      <p className="ticket-tag">{ticket.tag.join(', ')}</p>
    </div>
  );
};

export default App;
