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
        const matchData = res.data.results || res.data; // handles paginated or flat response

        // Sorting matches by the latest message date or match date
        matchData.sort((a, b) => {
          const lastMessageA = a.messages?.length > 0 ? new Date(a.messages[a.messages.length - 1].created_at) : new Date(a.created_at);
          const lastMessageB = b.messages?.length > 0 ? new Date(b.messages[b.messages.length - 1].created_at) : new Date(b.created_at);

          return lastMessageB - lastMessageA; // Sort in descending order
        });

        setMatches(matchData);
      })
      .catch((err) => {
        console.error("MATCH FETCH ERROR:", err);
      });
  }, []);

  // Check if the conversation already exists with this other user (avoid multiple instances)
  const getMatchId = (user1, user2) => {
    return user1.id === currentUser.id ? user2.id : user1.id;
  };

  const conversationMap = {};

  return matches.map((match) => {
    const otherUser = match.user1.id === currentUser.id ? match.user2 : match.user1;
    const otherUserId = getMatchId(match.user1, match.user2);

    // Check if the conversation with this other user already exists
    if (conversationMap[otherUserId]) {
      return null; // Skip rendering this match if it's already rendered
    }

    // Store this conversation to avoid multiple renders for the same user
    conversationMap[otherUserId] = true;

    // Get the most recent message's created_at date
    const lastMessageDate = match.messages?.length > 0
      ? new Date(match.messages[match.messages.length - 1].created_at)
      : new Date(match.created_at); // Fallback to match date if no messages

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
              <div className={styles.mcDate}>
                {lastMessageDate.toLocaleString("en-US", {
                  weekday: "short", // e.g., "Mon"
                  month: "short",   // e.g., "Jan"
                  day: "numeric",   // e.g., "10"
                  hour: "numeric",  // e.g., "3"
                  minute: "2-digit", // e.g., "45"
                  hour12: true,      // e.g., "3:45 PM"
                })}
              </div>
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
