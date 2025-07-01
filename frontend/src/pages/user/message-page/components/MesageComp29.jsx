import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./message-comp.module.css";
import axios from "axios";

const API_MATCHES = import.meta.env.VITE_MATCHES_API;

export default function MessageComp() {
  const [matches, setMatches] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    axios
      .get(API_MATCHES, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setMatches(res.data.results || res.data); // handles paginated or flat response
      })
      .catch((err) => {
        console.error("MATCH FETCH ERROR:", err);
      });
  }, []);

  return matches.map((match) => {
    const otherUser =
      match.user1.id === currentUser.id ? match.user2 : match.user1;

    return (
      <Link
        to={`/message-detail/${match.id}`}
        className={styles.messageLink}
        key={match.id}
      >
        <div className={styles.messageCompCont}>
          <div className={styles.mcImageCont}>
            <img
              src={otherUser.profile_picture || "/placeholder.jpg"}
              alt={otherUser.name}
            />
          </div>
          <div className={styles.mcDetailCont}>
            <div className={styles.mcTop}>
              <div className={styles.mcName}>{otherUser.name}</div>
              {/* Optional: Last message date or match date */}
            </div>
            <div className={styles.mcBot}>
              <div className={styles.mcMessageContent}>
                Tap to open chat 💬
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  });
}
