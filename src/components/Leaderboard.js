import React, { useState, useEffect } from "react";
import styles from "../css/Leaderboard.module.css";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/Firebase";
import { collection, getDocs } from "firebase/firestore";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Sort users by score in descending order
        data.sort((a, b) => b.score - a.score);
        const top10 = data.slice(0, 10);

        if (user && user.id) {
          // Determine user rank and include them if not in top 10
          const userIndex = data.findIndex((u) => u.id === user.id);
          const includeUser = userIndex >= 10;

          // Prepare final leaderboard data
          const finalLeaderboardData = includeUser
            ? [...top10, data[userIndex]]
            : top10;

          setLeaderboardData(finalLeaderboardData);
        }
        setLeaderboardData(top10);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.leaderboardContainer}>
      <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
      <table className={styles.leaderboardTable}>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Name</th>
            <th className={styles.pointsColumn}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr
              key={entry.id}
              className={
                user && user.id === entry.id ? styles.highlightRow : ""
              }
            >
              <td>{index + 1}.</td>
              <td className={styles.nameColumn}>{entry.name}</td>
              <td className={styles.pointsColumn}>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
