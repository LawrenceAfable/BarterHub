// style
import styles from "./match-item.module.css";

// components
import TradeSuggestion from "./TradeSuggestions";

// react
import { useNavigate } from "react-router-dom";

export default function MatchItem({ offers }) {
  if (!offers.length) return <p>No offers found.</p>;

  return (
    <div className={styles.matchItemCont}>
      {offers.map((offer) => (
        <MatchItemCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}

function MatchItemHeader() {
  return (
    <div className={styles.filterTabs}>
      <div className={styles.tab}>Offered You</div>
      <div className={styles.tab}>Matches</div>
      <div className={styles.tab}>Completed</div>
    </div>
  );
}

function MatchItemCard({ offer }) {
  const navigate = useNavigate();

  // Get current logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const isOfferToYou = currentUser.id === offer.wanted_item?.user?.id;
  const isOfferByYou = currentUser.id === offer.offered_by?.id;
  let buttonText = "View Details";
  let mode = "view";
  let itemToView = offer.wanted_item;

  if (isOfferToYou) {
    buttonText = "See Offer";
    mode = "accept";
    itemToView = offer.wanted_item; // <- your item, so buttons work
  } else if (isOfferByYou) {
    buttonText = "See Your Offer";
    mode = "view";
    itemToView = offer.offered_item;
  }

  const handleClick = () => {
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    const isOfferToYou = currentUser.id === offer.wanted_item?.user?.id;

    navigate("/item-detail", {
      state: {
        item: offer.offered_item, 
        wanted_item: offer.wanted_item,
        mode: isOfferToYou ? "accept" : "accepted",
        offerId: offer.id,
        offeredBy: offer.offered_by,
      },
    });
  };

  // debug
  // console.log("User clicked view:", {
  //   currentUser: currentUser.id,
  //   isOwner: isOfferToYou,
  //   isOfferByYou,
  //   mode,
  // });

  return (
    <div className={styles.itemCard}>
      <div className={styles.icHeader}>
        <div className={styles.icUserWrapper}>
          <div className={styles.icUserProfile}>
            <img
              src={offer.offered_by.profile_picture || "/default-profile.png"}
              alt={offer.offered_by.name}
            />
          </div>
          <div className={styles.icUserInfo}>
            <h3>{offer.offered_by.name}</h3>
            {/* <div className={styles.icRating}>4.9</div> */}
          </div>
        </div>
        <div className={styles.icStatus}>
          {offer.status === "pending" ? "Offered You" : offer.status}
        </div>
      </div>
      <div className={styles.icBody}>
        <div className={styles.icItemCont}>
          <TradeSuggestion
            item={offer.offered_item}
            currentUserId={currentUser.id}
          />
        </div>
        <div className={styles.icIcon}>
          <i className="fa-regular fa-heart"></i>
        </div>
        <div className={styles.icItemCont}>
          <TradeSuggestion
            item={offer.wanted_item}
            currentUserId={currentUser.id}
          />
        </div>
      </div>
      <div className={styles.icFooter}>
        <div className={styles.icDate}>
          <i className="fa-regular fa-clock"></i>
          <span>{new Date(offer.created_at).toLocaleDateString()}</span>
        </div>
        <button onClick={handleClick}>{buttonText}</button>
      </div>
    </div>
  );
}

function MatchItemCard1({ offer }) {
  const navigate = useNavigate();

  // Get current logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  const isOfferToYou = currentUser.id === offer.wanted_item?.user?.id;
  const isOfferByYou = currentUser.id === offer.offered_by?.id;

  // Determine button text and which item to show
  let buttonText = "View Details";
  let itemToView = offer.offered_item;
  let mode = "accept";

  if (isOfferToYou) {
    buttonText = "See Offer";
    itemToView = offer.offered_item;
    mode = "accept";
  } else if (isOfferByYou) {
    buttonText = "See Your Offer";
    itemToView = offer.wanted_item;
    mode = "accepted"; // You might want a different mode here if needed
  }

  const handleClick = () => {
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    const isOfferToYou = currentUser.id === offer.wanted_item?.user?.id;
    const isOfferByYou = currentUser.id === offer.offered_by?.id;

    // Determine mode
    let mode = "view"; // default fallback
    if (isOfferToYou) {
      mode = "accept"; // you can accept or reject
    } else if (isOfferByYou) {
      mode = "matched"; // you offered, and maybe it's accepted
    }

    const itemToView = isOfferToYou ? offer.offered_item : offer.wanted_item;

    navigate("/item-detail", {
      state: {
        item: offer.wanted_item, // <- your item, the one that was offered *to* you
        mode: "accept",
        offerId: offer.id,
        offeredBy: offer.offered_by,
      },
    });
  };

  // debug
  console.log("User clicked view:", {
    currentUser: currentUser.id,
    isOwner: isOfferToYou,
    isOfferByYou,
    mode,
  });

  return (
    <div className={styles.itemCard}>
      <div className={styles.icHeader}>
        <div className={styles.icUserWrapper}>
          <div className={styles.icUserProfile}>
            <img
              src={offer.offered_by.profile_picture || "/default-profile.png"}
              alt={offer.offered_by.name}
            />
          </div>
          <div className={styles.icUserInfo}>
            <h3>{offer.offered_by.name}</h3>
            <div className={styles.icRating}>4.9</div>
          </div>
        </div>
        <div className={styles.icStatus}>
          {offer.status === "pending" ? "Offered You" : offer.status}
        </div>
      </div>
      <div className={styles.icBody}>
        <div className={styles.icItemCont}>
          <TradeSuggestion
            item={offer.offered_item}
            currentUserId={currentUser.id}
          />
        </div>
        <div className={styles.icIcon}>
          <i className="fa-regular fa-heart"></i>
        </div>
        <div className={styles.icItemCont}>
          <TradeSuggestion
            item={offer.wanted_item}
            currentUserId={currentUser.id}
          />
        </div>
      </div>
      <div className={styles.icFooter}>
        <div className={styles.icDate}>
          <i className="fa-regular fa-clock"></i>
          <span>{new Date(offer.created_at).toLocaleDateString()}</span>
        </div>
        <button onClick={handleClick}>{buttonText}</button>
      </div>
    </div>
  );
}
