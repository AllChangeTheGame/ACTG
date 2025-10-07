// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import Select from "react-select";
// import { useAuth } from '../authentication/AuthContext';

// const LocationSharing = ({}) => {
//   const [teams, setTeams] = useState([]);
//   const { getToken } = useAuth();
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [loggedInUserId, setLoggedInUserId] = useState(null);
//   const jwtToken = localStorage.getItem("jwtToken");


  
//     useEffect(() => {
//       const fetchTeamsInfo = async () => {
//         const token = await getToken();
//         try {
//           const res = await fetch('/api/teams/', {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           const data = await res.json();
//           setTeams(data);
//         } catch (err) {
//           console.error('Failed to fetch teamsinfo:', err);
//         }
//       };
//       fetchTeamsInfo();
//     }, [getToken]);

//   const handleTeamSelect = (selectedOption) => {
//     setSelectedTeam(selectedOption.value);
//   };

//   async function fetchLoggedInUser() {
//     try {
//       const response = await fetch(`${base_url}/users/me/`, {
//         headers: {
//           Authorization: `Bearer ${jwtToken}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch logged in user data");
//       }

//       const data = await response.json();
//       setLoggedInUserId(data.id);
//     } catch (error) {
//       console.error("Error fetching logged in user data:", error);
//     }
//   }

//   useEffect(() => {
//     fetchLoggedInUser();
//   }, [jwtToken]);

//   const requestLocation = async () => {
//     try {
//       if (selectedTeam) {
//         const requestData = {
//           request_team_id: selectedTeam.id,
//         };

//         const response = await fetch(`${base_url}/user-locations/request/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${jwtToken}`,
//           },
//           body: JSON.stringify(requestData),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to request location");
//         }

//         console.log("Location requested successfully");
//         alert("Location tracked successfully");
//       }
//     } catch (error) {
//       console.error("Error requesting location", error);
//     }
//   };

//   return (
//     <>
//       <HeaderComponentAll />
//       <div className="formBackground">
//         <div className="formContainer">
//           <div className="claimRouteTitleContainer">
//             <label className="formTitle">Which team are you tracking?</label>
//           </div>

//           <Select
//             className="dropdown-basic"
//             options={teams.map((team) => ({
//               value: team,
//               label: team.name,
//             }))}
//             value={
//               selectedTeam
//                 ? { value: selectedTeam, label: selectedTeam.name }
//                 : null
//             }
//             onChange={(selectedOption) => handleTeamSelect(selectedOption)}
//             placeholder="Select Team"
//             isSearchable={true}
//           />

//           <div className="mainButtonContainer">
//             <Link className="link-button" to="/home">
//               <button className="mainButton" onClick={requestLocation}>
//                 TRACK
//               </button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default LocationSharing;