import "../styles.css";
import { RemoveButton } from "./Button";

const User = ({ user, handleRemove, RemoveButtonText, winner, rankClass }) => {
  let isWinner = winner && user.id === winner.id;
  return (
    <div>
      <div
        className={`user-card ${rankClass} ${isWinner && "firstplace"}`}
        key={user.id}
      >
        <img className="image" src={user.avatar_url} alt={user.name} />
        <div className="user-info">
          <h2>{user.name}</h2>
          <p>
            Public Repos:{" "}
            <span className="user-number">{user.public_repos}</span>
          </p>
          <p>
            Public Gists:{" "}
            <span className="user-number">{user.public_gists}</span>
          </p>
          <p>
            Followers: <span className="user-number">{user.followers}</span>
          </p>
          <p>
            Score: <span className="user-number">{user.score}</span>
          </p>
        </div>
        <div>
          {isWinner && <h3 className="winner-badge">Winner</h3>}
          <RemoveButton
            text={RemoveButtonText}
            handleRemove={() => handleRemove(user.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default User;
