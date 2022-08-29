//Some import feature for most or all React JS files apparent, pulls from node_modules folder
import * as React from 'react';

//APP FUNCTION//////////////////////////////////////////////////////

const App = () => {
  //ARRAY OF STORY OBJECTS (used to be "list" & a global variable, now moved to local variable in App)
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      topic: 'Reactionaries',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      topic: 'Sentaries',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
    {
      title: 'Flummoxed',
      url: 'https://life.js.org/',
      author: "Brendan O'Connor",
      topic: 'Life decisionaries',
      num_comments: 17,
      points: 5,
      objectID: 2,
    },
  ];

  // A ("callback function gets introduced" says in textbook)
  const handleSearch = (event) => {
    //C (" 'calls back' to the place it was introduced" says in textbook)
    console.log(event.target.value);
  };

  //Temp console.log to show doesn't re-render since no .useState hook in this function
  console.log('App renders');

  return (
    <div>
      <h1>My Hacker Stories</h1>

      {/* // B ("is used elsewhere" says in textbook--note this comment repeats below in Search component) */}
      <Search onSearch={handleSearch} />

      <hr />

      <List list={stories} />
    </div>
  );
};

//SEARCH FUNCTION//////////////////////////////////////////////////////

const Search = (props) => {
  //Example of React's "useState" function to tell it to re-render something
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);

    // B ("is used elsewhere" says in textbook--note this comment repeats above in App component)
    props.onSearch(event);
  };

  console.log('Search renders');

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />
    </div>
  );
};

//LIST FUNCTION//////////////////////////////////////////////////////
//Function pulls from Item function below to automatically populate aspects of each <li> item in <ul> below

const List = (props) => {
  //Temp console.log to show doesn't re-render since no .useState hook in this function
  console.log('List renders');

  return (
    <ul>
      {/* Props can apparently be used here because the props parameter was passed above to the List function, AND as a way to access the "prop[ertie]s" of the parent App component (which I believe became a parent to List when List was instantiated within App) */}
      {props.list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  );
};

//ITEM FUNCTION//////////////////////////////////////////////////////

const Item = (props) => (
  <li>
    <span>
      <a href={props.item.url}>{props.item.title}</a>
    </span>
    <span>{props.item.author}</span>
    <span>{props.item.topic}</span>
    <span>{props.item.num_comments}</span>
    <span>{props.item.points}</span>
  </li>
);

//Some necessary part of React JS file apparent
export default App;
