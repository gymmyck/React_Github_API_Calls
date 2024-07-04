import React from "react";
import axios from "axios";
import Button from "./components/Button";
import User from "./components/User";
import "./styles.css";

const List = ({ users, handleRemove, winner }) => {
  const sortedList = [...users].sort((a, b) => {
    return b.score - a.score;
  });
  let topThree = [];
  let rest = [];
  if (sortedList.length >= 3) {
    topThree = sortedList.slice(0, 3);
    rest = sortedList.slice(3);

    return (
      <div className="list-container">
        <div className="podium">
          {topThree.length > 1 && (
            <div>
              <div className="podium-spot second-place">
                <User
                  key={topThree[1].id}
                  user={topThree[1]}
                  handleRemove={handleRemove}
                  RemoveButtonText="Remove"
                  rankClass="secondplace"
                  winner={winner}
                />
              </div>
              <div className="podium-spot first-place">
                <User
                  key={topThree[0].id}
                  user={topThree[0]}
                  handleRemove={handleRemove}
                  RemoveButtonText="Remove"
                  rankClass="firstplace"
                  winner={winner}
                />
              </div>
              {topThree.length > 2 && (
                <div className="podium-spot third-place">
                  <User
                    key={topThree[2].id}
                    user={topThree[2]}
                    handleRemove={handleRemove}
                    RemoveButtonText="Remove"
                    rankClass="thirdplace"
                    winner={winner}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <ul className="rest-users">
          {rest.map((user) => (
            <User
              key={user.id}
              user={user}
              handleRemove={handleRemove}
              RemoveButtonText="Remove"
              winner={winner}
            />
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <ul>
        {sortedList.map((user) => (
          <User
            key={user.id}
            user={user}
            handleRemove={handleRemove}
            RemoveButtonText="Remove"
          />
        ))}
      </ul>
    );
  }
};

class App extends React.Component {
  state = {
    searchTerm: "",
    user: null,
    users: [],
    isLoading: false,
    hasError: false,
    existentUser: false,
    winner: null,
  };

  getUser = async (user) => {
    const userExists = this.state.users.some((el) => el.login === user);
    if (userExists) {
      this.setState({
        isLoading: false,
        existentUser: true,
      });
      setTimeout(() => {
        this.setState({ existentUser: false });
      }, 1000);
      return;
    }
    try {
      this.setState({ hasError: false, isLoading: true });
      const { data } = await axios(`https://api.github.com/users/${user}`);
      const score = data.public_repos + data.public_gists + data.followers;
      const newUsers = [...this.state.users, { ...data, score }];
      this.setState({ users: newUsers, isLoading: false });
      this.updateStorage(newUsers);
    } catch (error) {
      this.setState({ hasError: true, isLoading: false });
    }
  };

  handleChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.getUser(this.state.searchTerm);
    this.setState({ searchTerm: "" });
  };

  handleClear = () => {
    this.setState({ users: [], hasError: false });
    this.updateStorage([]);
  };

  handleRemove = (id) => {
    const newUsers = this.state.users.filter((el) => el.id !== id);
    this.setState({ users: newUsers });
    this.updateStorage(newUsers);
  };

  findWinner = (users) => {
    if (users.length > 1) {
      const winner = users.reduce((max, current) => {
        return current.score > max.score ? current : max;
      });
      return winner;
    }
  };

  updateStorage = (list) => {
    window.localStorage.setItem("users", JSON.stringify(list));
  };

  componentDidMount() {
    this.setState({
      users: JSON.parse(window.localStorage.getItem("users")) || [],
    });
  }

  render() {
    const { users, isLoading, hasError, existentUser } = this.state;
    const { handleRemove } = this;
    const winner = this.findWinner(users);

    console.log(winner);

    return (
      <div className="App">
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            value={this.state.searchTerm}
            placeholder="Search GitHub user"
          />
        </form>
        {isLoading && <div>loading...</div>}
        {hasError && <div>There was an error</div>}
        {existentUser && <div className="text-red">User already exists</div>}
        <List users={users} handleRemove={handleRemove} winner={winner} />
        <Button text="Clear" handleClear={this.handleClear} />
      </div>
    );
  }
}

export default App;
