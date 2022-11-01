//Some import feature for most or all React JS files apparent, pulls from node_modules folder
import * as React from 'react';

//APP COMPONENT / FUNCTION//////////////////////////////////////////////////////

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

  // Manages the search feature's state
  const [searchTerm, setSearchTerm] = React.useState('React');

  // A ("callback function gets introduced" here says in textbook; seems A, B, & C together are the "callback handler," though could just be the same as the "callback function")
  const handleSearch = (event) => {
    //C (" 'calls back' to the place [the callback function] was introduced" says in textbook)
    setSearchTerm(event.target.value);
  };

  // To "filter the stories with the stateful searchTerm before passing them as list to the List component"
  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Temp console.log to show doesn't re-render since no .useState hook in this function
  console.log('App renders');
  console.log(searchTerm);

  return (
    <div>
      <h1>My Hacker Stories</h1>

      {/* // B (callback function "is used elsewhere" says in textbook--note this comment previously repeated below in Search component, no longer) */}
      <Search search={searchTerm} onSearch={handleSearch} />

      <hr />

      {/* Draws from above filter so only shows stories that are searched */}
      <List list={searchedStories} />
    </div>
  );
};

//SEARCH COMPONENT / FUNCTION//////////////////////////////////////////////////////

//Adding "search" & "onSearch" below destructures props object (basically defines 2 properties of props object)
const Search = ({ search, onSearch }) => (
  <div>
    <label htmlFor="search">Search: </label>
    {/* This "passes up the event to the App component via a callback handler after the text is entered into the HTML input field" */}
    <input
      id="search"
      type="text"
      //Because we destructured props object above (in "function signature" for Search component), we can just use "search" & "onSearch" below, otherwise would've needed "props.search" & "props.onSearch" below
      value={search}
      onChange={onSearch}
    />
  </div>
);

//LIST COMPONENT / FUNCTION//////////////////////////////////////////////////////
//Function pulls from Item function below to automatically populate aspects of each <li> item in <ul> below

// NOTE: "Variation 2" commented versions below used Spread & Rest operators, jsut to learn them, but returned to less refactored version to make easier to understand & to avoid features "which are not familiar to everyone" (p. 67).

const List = ({ list }) => (
  // //Temp console.log to show doesn't re-render since no .useState hook in this function
  // console.log('List renders');

  <ul>
    {/* Props can apparently be used here because the props parameter was passed above to the List function, AND as a way to access the "prop[ertie]s" of the parent App component (which I believe became a parent to List when List was instantiated within App); however, removed "props" before "list.map..." b/c did destructured version of props in the "function signature" for the List component above, thereby defining "list" as a property of the "props" object */}

    {list.map((item) => (
      <Item key={item.objectID} item={item} />
    ))}
  </ul>
);

// Variation 2: Spread and Rest Operators
// Step 3 (Final step)

// const List = ({ list }) => (
//   // //Temp console.log to show doesn't re-render since no .useState hook in this function
//   // console.log('List renders');

//   <ul>
//     {/* Props can apparently be used here because the props parameter was passed above to the List function, AND as a way to access the "prop[ertie]s" of the parent App component (which I believe became a parent to List when List was instantiated within App); however, removed "props" before "list.map..." b/c did destructured version of props in the "function signature" for the List component above, thereby defining "list" as a property of the "props" object */}

//     {/* Note: "...item" below is a "rest operator", meaning when you call "item" later, it will include the rest of the item object attribute/value pairs EXCEPT the "objectID," because it's listed below right before it */}
//     {list.map(({ objectID, ...item }) => (
//       // Spread operator below ("...item") pulls in object from Item component below
//       <Item key={objectID} {...item} />
//     ))}
//   </ul>
// );

// Variation 2: Spread and Rest Operators
// Step 2

// const List = ({ list }) => (
//   // //Temp console.log to show doesn't re-render since no .useState hook in this function
//   // console.log('List renders');

//   <ul>
//     {/* Props can apparently be used here because the props parameter was passed above to the List function, AND as a way to access the "prop[ertie]s" of the parent App component (which I believe became a parent to List when List was instantiated within App); however, removed "props" before "list.map..." b/c did destructured version of props in the "function signature" for the List component above, thereby defining "list" as a propery of "props" */}
//     {list.map((item) => (
//       // Spread operator below ("...item") pulls in object from Item component below
//       <Item key={item.objectID} {...item} />
//     ))}
//   </ul>
// );

// Variation 2: Spread and Rest Operators
// Step 1 (Step 2 above)

// const List = ({ list }) => (
//   // //Temp console.log to show doesn't re-render since no .useState hook in this function
//   // console.log('List renders');

//   <ul>
//     {/* Props can apparently be used here because the props parameter was passed above to the List function, AND as a way to access the "prop[ertie]s" of the parent App component (which I believe became a parent to List when List was instantiated within App); however, removed "props" before "list.map..." b/c did destructured version of props in the "function signature" for the List component above, thereby defining "list" as a propery of "props" */}
//     {list.map((item) => (
//       <Item
//         key={item.objectID}
//         title={item.title}
//         url={item.url}
//         author={item.author}
//         num_comments={item.num_comments}
//         points={items.points}
//       />
//     ))}
//   </ul>
// );
// };

//ITEM COMPONENT / FUNCTION//////////////////////////////////////////////////////

// NOTE: "Variation 1" commented version below used Nested Destructuring, just to learn it, but returned to less refactored version to make easier to understand & to avoid features "which are not familiar to everyone" (p. 67).

// // Variation 1: Nested Destructuring (a way to eliminate use of "props" & supposedly make easier to use)
const Item = ({ item }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </li>
);

// // Variation 1: Nested Destructuring (a way to eliminate use of "props" & supposedly make easier to use)
// const Item = ({ title, url, author, num_comments, points }) => (
//   <li>
//     <span>
//       <a href={url}>{title}</a>
//     </span>
//     <span>{author}</span>
//     <span>{num_comments}</span>
//     <span>{points}</span>
//   </li>
// );

//Some necessary part of React JS file apparent
export default App;
