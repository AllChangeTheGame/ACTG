import React, { useState, useEffect } from 'react';
import { useAuth } from '../authentication/AuthContext';
import Select from 'react-select';
import './MoneyTracker.css';

const LocationSharingForm = ({ onTracked }) => {
  const { getToken } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all teams for dropdown
  useEffect(() => {
    const fetchTeams = async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const res = await fetch('/api/teams/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTeams(data);
      } catch (err) {
        console.error('Failed to fetch teams:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, [getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTeam?.value) {
      alert('Please select a team.');
      return;
    }

    const token = await getToken();
    if (!token) return;

    // API not yet set up
    try {
      const res = await fetch('/api/user-locations/request/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team_id: selectedTeam.value.id }),
      });

      if (!res.ok) {
        throw new Error('Failed to track location');
      }

      alert(`Location tracking started for ${selectedTeam.value.name}`);
      if (onTracked) onTracked();
    } catch (err) {
      console.error('Error requesting location:', err);
      alert('Failed to track location. Try again.');
    }
  };

  if (loading) return <p>Loading teams...</p>;

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Track a Team</h3>

      <label className="formLabel">
        Which team are you tracking?
        <Select
          options={teams.map(team => ({ value: team, label: team.name }))}
          value={selectedTeam}
          onChange={setSelectedTeam}
          placeholder="Select Team"
          className="select"
          isSearchable
        />
      </label>

      <button type="submit" className="submit">Start Tracking</button>
    </form>
  );
};

export default LocationSharingForm;
