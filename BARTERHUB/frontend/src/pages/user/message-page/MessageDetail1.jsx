import styles from "./message-detail.module.css";
import UserLayout from "../../../layouts/user-layout/UserLayour";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// utils
import { fetchWithTokenRefresh } from "../../../utils/fetchWithTokenRefresh";

const API_MESSAGES = import.meta.env.VITE_MESSAGES_API;

export default function MessageDetail() {
  const navigate = useNavigate();
  const { matchId } = useParams();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    axios
      .get(API_MESSAGES, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        const filtered = res.data
          .filter((msg) => msg.match === matchId)
          .map((msg) => ({
            ...msg,
            is_mine: msg.sender.id === loggedInUser.id,
          }));
        setMessages(filtered);
      })
      .catch((err) => console.error("FETCH MESSAGE ERROR:", err));
  }, [matchId]);

  const sendMessage = () => {
    if (!content.trim()) return;

    const accessToken = localStorage.getItem("access_token");
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

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
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        setMessages((prev) => [
          ...prev,
          {
            ...res.data,
            is_mine: res.data.sender.id === loggedInUser.id,
          },
        ]);
        setContent("");
      })
      .catch((err) => console.error("SEND MESSAGE ERROR:", err));
  };

  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const loggedInUser = JSON.parse(localStorage.getItem("user"));

        // FETCH MATCH DATA - note the endpoint does NOT include /confirm-trade/
        const res = await axios.get(
          `${import.meta.env.VITE_MATCHES_API}${matchId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMatchData(res.data);
        setHasConfirmed(
          Array.isArray(res.data.confirmed_by) &&
            res.data.confirmed_by.includes(loggedInUser.id)
        );
      } catch (err) {
        console.error("Fetch match error:", err);
      }
    };

    fetchMatch();
  }, [matchId]);

  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("access_token");

      // PATCH to /confirm-trade/ to mark the trade as confirmed
      const res = await axios.patch(
        `${import.meta.env.VITE_MATCHES_API}${matchId}/confirm-trade/`,
        {}, // empty body or any required data by backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMatchData(res.data);
      setHasConfirmed(true);
      alert("Trade confirmation sent!");
    } catch (err) {
      console.error("Complete trade error:", err);
      alert("Failed to confirm trade.");
    }
  };

  // Check matchId and user info
  console.log("Match ID:", matchId);
  console.log("Current User:", JSON.parse(localStorage.getItem("user")));

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
