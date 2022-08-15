import { Component } from "react";

import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      monsters: [],
      searchField: "",
    };
  }

  componentDidMount() {
    this.simpleApiCall({
      apiAddress: "https://jsonplaceholder.typicode.com/users",
      timeoutDuration: 30000,
    });
  }

  /**
   *
   * @param {apiAddress} param0
   * @param {timeoutDuration} param1
   *
   * Pass in an API address for a GET call, and a timeoutDuration value to measure success of the API call against
   * returns Promise.race() and throws error if timeout is met prior to API response
   */
  simpleApiCall({ apiAddress, timeoutDuration }) {
    let nameCall = fetch(apiAddress)
      .catch((error) => {
        throw new Error("API call failed");
      })
      .then((response) => response.json())
      .then((users) =>
        this.setState(() => {
          return { monsters: users };
        })
      );
    Promise.race([nameCall, this.getTimeout({ duration: timeoutDuration })]);
  }

  /**
   *
   * @param {duration} param0
   *
   * Duration paramater pass in milliseconds, simple timeout function with error throw if timeout passed in is fulfilled
   */
  getTimeout({ duration }) {
    return async (duration) => {
      return new Promise((res) =>
        setTimeout(() => res("Timeout"), duration)
      ).catch(() => {
        throw new Error("Timed out");
      });
    };
  }

  filterBySearchField() {
    return this.state.monsters.filter((monster) => {
      return monster.name.toLowerCase().includes(this.state.searchField);
    });
  }

  onSearchChange({ event }) {
    let searchField = event.target.value.toLowerCase();
    this.setState(() => {
      return { searchField };
    });
  }

  render() {
    return (
      <div className="App">
        <input
          className="search-box"
          type="search"
          placeholder="Search Monsters"
          onChange={(event) => {
            this.onSearchChange({
              event,
            });
          }}
        />
        {this.filterBySearchField().map((monster) => {
          return (
            <div key={monster.id}>
              <h1>{monster.name}</h1>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
