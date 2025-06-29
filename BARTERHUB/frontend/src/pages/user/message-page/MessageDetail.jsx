import styles from "./message-detail.module.css";
import UserLayout from "../../../layouts/user-layout/UserLayour";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// component
import Rating from "../../../components/component/Rating";

const API_MESSAGES = import.meta.env.VITE_MESSAGES_API;
const API_RATINGS = import.meta.env.VITE_MATCHES_RATINGS_API;

export default function MessageDetail() {
  const navigate = useNavigate();
  const { matchId } = useParams();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // === Fetch messages ===
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    axios
      .get(API_MESSAGES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const filtered = res.data
          .filter((msg) => msg.match === matchId)
          .map((msg) => ({
            ...msg,
            is_mine: msg.sender.id === currentUser.id,
          }));
        setMessages(filtered);
      })
      .catch((err) => console.error("FETCH MESSAGE ERROR:", err));
  }, [matchId]);

  // === Send message ===
  const sendMessage = () => {
    if (!content.trim()) return;

    const token = localStorage.getItem("access_token");

    axios
      .post(
        API_MESSAGES,
        {
          match: matchId,
          content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setMessages((prev) => [
          ...prev,
          {
            ...res.data,
            is_mine: res.data.sender.id === currentUser.id,
          },
        ]);
        setContent("");
      })
      .catch((err) => console.error("SEND MESSAGE ERROR:", err));
  };

  // === Fetch match data ===
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(
          `${import.meta.env.VITE_MATCHES_API}${matchId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const match = res.data;
        setMatchData(match);
        setHasConfirmed(
          Array.isArray(match.confirmed_by) &&
          match.confirmed_by.includes(currentUser.id)
        );

        // Set rating submitted state from localStorage
        const ratedKey = `rated_${matchId}`;
        setRatingSubmitted(localStorage.getItem(ratedKey) === "true");
      } catch (err) {
        console.error("Fetch match error:", err);
      }
    };

    fetchMatch();
  }, [matchId]);

  // === Handle confirm trade ===
  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.patch(
        `${import.meta.env.VITE_MATCHES_API}${matchId}/confirm-trade/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedMatch = res.data;
      setMatchData(updatedMatch);
      setHasConfirmed(true);
    } catch (err) {
      console.error("Confirm trade error:", err);
      alert("Failed to confirm trade.");
    }
  };

  return (
    <UserLayout>
      <div className={styles.messagePage}>
        <div className={styles.mpHeader}>
          <h3>Messages</h3>
          <div className={styles.mpIcon}>
            <i className="fa-solid fa-envelope"></i>
          </div>
        </div>

        <div className={styles.mBody}>
          <div className={styles.chatHeader}>
            <i
              className="fa-solid fa-arrow-left"
              onClick={() => navigate(-1)}
            ></i>
            <h4>Match Chat</h4>
          </div>

          {matchData && (
            <>
              {matchData.item1?.status === "traded" &&
              matchData.item2?.status === "traded" ? (
                <div className={styles.completeTradeStatus}>
                  🎉 Trade Completed!

                  {!ratingSubmitted && (
                    <Rating
                      matchId={matchId}
                      ratedUserId={
                        matchData.user1.id === currentUser.id
                          ? matchData.user2.id
                          : matchData.user1.id
                      }
                      inline={true}
                      onClose={() => {
                        setRatingSubmitted(true);
                        localStorage.setItem(`rated_${matchId}`, "true");
                      }}
                    />
                  )}
                </div>
              ) : hasConfirmed ? (
                <div className={styles.completeTradeStatus}>
                  🕒 Waiting for the other user to confirm trade...
                </div>
              ) : (
                <div className={styles.completeTradeCont}>
                  <button
                    onClick={handleMarkComplete}
                    className={styles.completeTradeBtn}
                  >
                    ✅ Mark Trade as Completed
                  </button>
                </div>
              )}
            </>
          )}

          <div className={styles.chatBody}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageBubble} ${
                  msg.is_mine ? styles.outgoing : styles.incoming
                }`}
              >
                {!msg.is_mine && (
                  <div className={styles.senderInfo}>
                    <img
                      src={msg.sender.profile_picture || "/placeholder.jpg"}
                      alt="Sender"
                      className={styles.senderAvatar}
                    />
                    <span className={styles.senderName}>{msg.sender.name}</span>
                  </div>
                )}
                <div className={styles.messageContent}>{msg.content}</div>
              </div>
            ))}
          </div>

          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Type your message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
