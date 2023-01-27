// Some import feature for most or all React JS files apparently, pulls from node_modules folder
import React, { useState } from 'react';

// ************************************************************************************************************************ //
// ARRAY OF STORY OBJECTS (used to be local variable w/in App component, moved out; also used to be a "list" & a global variable)
// ************************************************************************************************************************ //
// Lesson 1.6 (1/26/23): "initialStories" created to allow manipulation of list.

const initialStories = [
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
// ************************************************************************************************************************ //
// CUSTOM HOOK///////////////////////////////////////////////////////////////
// ************************************************************************************************************************ //
// Needed to provide an initial state for this custom hook. Re-factored later to change terms to be more generic (like changing 'search' to 'value'). Also had to add an "inflexible key" so the value isn't overwritten in local storage.
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  // Instructions: "use React’s useEffect Hook to trigger the side-effect each time the searchTerm changes." Re-factored later here too, like above.
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

// ************************************************************************************************************************ //
// APP COMPONENT / FUNCTION//////////////////////////////////////////////////////
// ************************************************************************************************************************ //
const App = () => {
  // Managed the search feature's state
  // PREVIOUS version (without custom hook):

  // const [searchTerm, setSearchTerm] = React.useState(
  //   // Sets default value to the value defined for the 'search' key in "localStorage.setItem" a few lines down (which is the most recent value typed into the search box); if there is no recent value, reads 'React'
  //   localStorage.getItem('search') || 'React'
  // );

  // NEW version of search feature's state (with custom hook, "useSemiPersistentState") (also sets default value to "React" if no recent value in search box)
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  // Lesson 1.6 (1/26/23): "...returned values from the array are the current state (stories) and the state updater function (setStories)" (p. 88 in book)
  const [stories, setStories] = React.useState(initialStories);

  // Lesson 1.6 (1/26/23): Remove an item from the story list
  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );

    setStories(newStories);
  };

  // A ("callback function gets introduced" here says in textbook; seems A, B, & C together are the "callback handler," though could just be the same as the "callback function")
  const handleSearch = (event) => {
    // C (" 'calls back' to the place [the callback function] was introduced," says in textbook)
    setSearchTerm(event.target.value);

    //Instructions: "...use the local storage to store the searchTerm accompanied by an identifier whenever a user types into the HTML input field"
    localStorage.setItem('search', event.target.value);
  };

  // To "filter the stories with the stateful searchTerm before passing them as list to the List component"
  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Temp console.log to show doesn't re-render since no .useState hook in this function
  console.log('App renders');
  console.log('searchTerm:', searchTerm);

  return (
    <div>
      <h1>My Hacker Stories</h1>

      {/* // B (Below callback function "is used elsewhere" says in textbook--note this comment was previously repeated below in Search component, no longer) */}
      {/* ************************************************************************************************************************ */}
      {/*  Instantiation of <InputWithLabel/> Component */}
      {/* Lesson 1.6 (1/11/23) update: Below was previously instantiating a component called "Search," but to make component reusable, changed to "InputWithLabel" & defined the id & label attributes within it (they were previously defined within the Search component instead of in the instantiation); also changed "search" to "value" & "onSearch" to "onInputChange"--again, to make more broadly usable for different input situations. */}
      <InputWithLabel
        id="search"
        label="Search"
        value={searchTerm}
        // 1/24/24: Added isFocused as prop to pass below
        isFocused
        // Think what we did here is make this into a prop that pulls down the handleSearch function above
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />

      {/* ************************************************************************************************************************ */}
      {/* Instantiation of <List/> Component - Draws from above filter so only shows stories that are searched */}
      {/* Lesson 1.6 (1/26/23): Added onRemoveItem below */}
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
};

// ************************************************************************************************************************ //
// INPUTWITHLABEL COMPONENT / FUNCTION//////////////////////////////////////////////////////
// ************************************************************************************************************************ //

// Previously added "search" & "onSearch" below to destructure props object (basically defines 2 properties of props object).
// 1/11/2023 update: Changed "Search" to "InputWithLabel" to make more broadly usable as a component; also changed some other terms, like the destructured props, while also adding "id" & "label."
const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
  // 1/24/23: Changed to a more complicated formula to practice "Imperative React"/imperative programming, w/letters A-D below explaining.
}) => {
  // A: Create a ref with React’s useRef Hook
  const inputRef = React.useRef();

  // C: "...opt into React’s lifecycle with React’s useEffect Hook, performing the focus on the input field when the component renders (or its dependencies change)"--re: the latter, see dependency array below in brackets, [isFocused].
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      // D: "... since the ref is passed to the input field’s ref attribute, its current property gives access to the element. Execute its focus programmatically as a side-effect, but only if isFocused is set AND the current property is existent"
      inputRef.current.focus();
    }
    // Dependency array--I believe if isFocused updates, then the effect will run again (more here: https://www.w3schools.com/react/react_useeffect.asp)
  }, [isFocused]);

  return (
    // Was able to use "React fragments," the <> and </> to wrap the elements below, instead of something like <div> tags had before; not exactly clear why this is that useful...
    // Changed from "{label}" below to "{children}" after placing "Search" in between <InputWithLabel> and a new closing </InputWithLabel> tag.
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      {/* B Pass React useRef hook ("inputRef") to JSX-reserved ref attribute */}
      {/* This "passes up the event to the App component via a callback handler after the text is entered into the HTML input field" */}
      <input
        ref={inputRef}
        id={id}
        // Type also pulls from destructured props at top of this function
        type={type}
        // Because we destructured props object above (in "function signature" for Search component), we can just use "search" & "onSearch" below, otherwise would've needed "props.search" & "props.onSearch" below; later changed to "value" & "onInputChange" to make more reusable.
        value={value}
        // 1/23/2023: Set autofocus for input label using "imperative programming in React"
        // 1/24/2023: Changed to isFocused to use as prop from above
        autofocus={isFocused}
        onChange={onInputChange}
      />
    </>
  );
};

// ************************************************************************************************************************ //
// LIST COMPONENT / FUNCTION//////////////////////////////////////////////////////
// ************************************************************************************************************************ //
// Function pulls from Item function below to automatically populate aspects of each <li> item in <ul> below

// NOTE: "Variation 2" commented versions below used Spread & Rest operators, just to learn them, but returned to less refactored version to make easier to understand & to avoid features "which are not familiar to everyone" (p. 67).
// Lession 1.6 (1/26/23): Added onRemoveItem as prop below, to then pass to Item component

const List = ({ list, onRemoveItem }) => (
  // //Temp console.log to show doesn't re-render since no .useState hook in this function
  // console.log('List renders');

  <ul>
    {/* Props can apparently be used here because the props parameter was passed above to the List function, AND as a way to access the "prop[ertie]s" (or props) of the parent App component (which I believe became a parent to List when List was instantiated within App); however, removed "props" before "list.map..." b/c did destructured version of props in the "function signature" for the List component above, thereby defining "list" as a property of the "props" object, ie, the List component (I believe) */}

    {/* ************************************************************************************************************************ */}
    {/* Instantiation of <Item/> Component - for Lesson 1.6 (1/26/23), added onRemoveItem part below */}
    {list.map((item) => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
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

// ************************************************************************************************************************ //
// ITEM COMPONENT / FUNCTION//////////////////////////////////////////////////////
// ************************************************************************************************************************ //

// NOTE: "Variation 1" commented version below used Nested Destructuring, just to learn it, but returned to less refactored version to make easier to understand & to avoid features "which are not familiar to everyone" (p. 67).

// Variation 1: Nested Destructuring (a way to eliminate use of "props" & supposedly make easier to use)
// Lesson 1.6 (1/26/23): Added onRemoveItem prop
const Item = ({ item, onRemoveItem }) => {
  // Lesson 1.6 (1/26/23): Added this callback handler to execute the incoming onRemoveItem callback handler, then refactored by adding into button below.
  // const handleRemoveItem = () => {
  //   onRemoveItem(item);
  // };

  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      {/*  Lesson 1.6 (1/26/23): Added button to remove item, then added onRemoveItem function in "inline handler" in button for more elegant fix than separate callback handler commented out above  */}
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  );
};

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

//Some necessary part of React JS file apparently
export default App;
