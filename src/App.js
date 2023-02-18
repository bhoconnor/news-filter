// Some import feature for most or all React JS files apparently, pulls from node_modules folder
import React, { useState, useEffect, useReducer } from 'react';

// ************************************************************************************************************************ //
// ARRAY OF STORY OBJECTS (used to be local variable w/in App component, moved out; also used to be a "list" & a global variable)
// ************************************************************************************************************************ //
// "initialStories" created to allow manipulation of list. (Lesson 1.6, 1/26/23)

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
// ASYNC DATA FETCHING ///////////////////////////////////////////////////////////////
// ************************************************************************************************************************ //
// Simulation of asynchronous data, will replace later w/real data from an API; "setTimeout" slightly delays the rendering of the list to simulate the real delay that would come w/a network request to a remote API (Lesson 1.7).

const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );

// ************************************************************************************************************************ //
// CUSTOM HOOK (useSemiPersistentState) ///////////////////////////////////////////////////////////////
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
// USE REDUCER HOOK ///////////////////////////////////////////////////////////////
// ************************************************************************************************************************ //
// Variables for Reducer
const loadingStories = 'STORIES_FETCH_INIT';
const storiesSuccess = 'STORIES_FETCH_SUCCESS';
const storiesFailure = 'STORIES_FETCH_FAILURE';
const removeStory = 'REMOVE_STORY';

// Allows for more sophisticated State management; reducer functions always use state & action. (Lesson 1.7) REMOVE_STORY works by removing a story item ("story") with a given objectID from the story list if "Dismiss" button is clicked for a state ("action.payload") with that same objectID (using button in Item component); changed to Switch statement in 1.7 too, & then to a Switch that includes loading, errors, success, & removal.
const storiesReducer = (state, action) => {
  switch (action.type) {
    case loadingStories:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case storiesSuccess:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case storiesFailure:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case removeStory:
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

// ************************************************************************************************************************ //
// APP COMPONENT / FUNCTION //////////////////////////////////////////////////////
// ************************************************************************************************************************ //
const App = () => {
  // ************************************************************************************************************************ //
  // STATE: Various situations dealing with State below (also in "Custom Hook" above, near top)

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
  // Returned values from  array are the current state (stories) and the state updater function (setStories).  (Lesson 1.6, 1/26/23, p. 88 in book); removed "initialStories" as initial state, replaced w/empty array (Lesson 1.7, p. 94); later in 1.7, turned to a useReducer hook, changing "setStories" to "dispatchStories," & passing it storiesReducer function from above; then merged others for loading & errors into useReducer hook.
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  // // For dealing w/State when data is loading
  // const [isLoading, setIsLoading] = useState(false);
  // // For dealing w/State when errors
  // const [isError, setIsError] = useState(false);

  // useEffect hook to call getAsyncStories & resolve returned promise as a side-effect; and b/c has an empty dependency array, will only run after component runs for 1st time (Lesson 1.7); later in 1.7 changed setStories to dispatchStories & added type & payload.
  useEffect(() => {
    // This type is for loading
    dispatchStories({ type: loadingStories });

    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: storiesSuccess,
          payload: result.data.stories,
        });
      })
      // .catch is what happens if an error/exception is thrown from above code
      .catch(() => dispatchStories({ type: storiesFailure }));
  }, []);

  // Remove a story item ("story") with a given objectID from the story list if "Dismiss" button is clicked for an item ("item") with that same objectID (using button in Item component below) (Lesson 1.6, 1/26/23); in 1.7 changes setStories to dispatchStories for useReducer hook; also in 1.7 moved filter for this function into reducer function above.
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: removeStory,
      payload: item,
    });
  };

  // A ("callback function gets introduced" here says in textbook; seems A, B, & C together are the "callback handler," though could just be the same as the "callback function")
  const handleSearch = (event) => {
    // C (" 'calls back' to the place [the callback function] was introduced," says in textbook)
    setSearchTerm(event.target.value);

    //Instructions: "...use the local storage to store the searchTerm accompanied by an identifier whenever a user types into the HTML input field"
    localStorage.setItem('search', event.target.value);
  };

  // To "filter the stories with the stateful searchTerm before passing them as list to the List component"
  const searchedStories = stories.data.filter((story) =>
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
      {/*  INPUT WITH LABEL: Instantiation of <InputWithLabel/> Component */}
      {/* Below was previously instantiating a component called "Search," but to make component reusable, changed to "InputWithLabel" & defined the id & label attributes within it (they were previously defined within the Search component instead of in the instantiation); also changed "search" to "value" & "onSearch" to "onInputChange"--again, to make more broadly usable for different input situations. (Lesson 1.6, 1/11/23 update) */}
      <InputWithLabel
        id="search"
        label="Search"
        value={searchTerm}
        // Added isFocused as prop to pass below (1/24/23 update
        isFocused
        // Think what we did here is make this into a prop that pulls down the handleSearch function above
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />

      {/* ************************************************************************************************************************ */}
      {/* LIST: Instantiation of <List/> Component - Draws from above filter so only shows stories that are searched */}
      {/* Added onRemoveItem below (Lesson 1.6), & isError & isLoading (Lesson 1.7) */}
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List
          list={searchedStories}
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  );
};

// ************************************************************************************************************************ //
// INPUTWITHLABEL COMPONENT / FUNCTION //////////////////////////////////////////////////////
// ************************************************************************************************************************ //

// Previously added "search" & "onSearch" below to destructure props object (basically defines 2 properties of props object).
// Changed "Search" to "InputWithLabel" to make more broadly usable as a component; also changed some other terms, like the destructured props, while also adding "id" & "label." (1/11/2023 update)
const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
  // Changed to a more complicated formula to practice "Imperative React"/imperative programming, w/letters A-D below explaining (1/24/23 update).
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
      {/* This "passes up the event to the App component via a callback handler after the text is entered into the HTML input field" */}
      {/* B: Pass React useRef hook ("inputRef") to JSX-reserved ref attribute */}
      <input
        ref={inputRef}
        id={id}
        // Type also pulls from destructured props at top of this function
        type={type}
        // Because we destructured props object above (in "function signature" for Search component), we can just use "search" & "onSearch" below, otherwise would've needed "props.search" & "props.onSearch" below; later changed to "value" & "onInputChange" to make more reusable.
        value={value}
        // Set autofocus for input label using "imperative programming in React" (1/23/2023 update)
        // Changed to isFocused to use as prop from above (1/24/2023 update)
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  );
};

// ************************************************************************************************************************ //
// LIST COMPONENT / FUNCTION //////////////////////////////////////////////////////
// ************************************************************************************************************************ //
// Function pulls from Item function below to automatically populate aspects of each <li> item in <ul> below

// NOTE: "Variation 2" commented versions below used Spread & Rest operators, just to learn them, but returned to less refactored version to make easier to understand & to avoid features which aren't familiar to everyone (see p. 67 for more).
// Added onRemoveItem as prop below, to then pass to Item component (Lession 1.6, 1/26/23).

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
// ITEM COMPONENT / FUNCTION //////////////////////////////////////////////////////
// ************************************************************************************************************************ //

// NOTE: "Variation 1" commented version below used Nested Destructuring, just to learn it, but returned to less refactored version to make easier to understand & to avoid features which aren't familiar to everyone (see p. 67 for more).

// Variation 1: Nested Destructuring (a way to eliminate use of "props" & supposedly make easier to use)
// Added onRemoveItem prop (Lesson 1.6, 1/26/23)
const Item = ({ item, onRemoveItem }) => {
  // Added this callback handler to execute the incoming onRemoveItem callback handler, then refactored by adding into button below (Lesson 1.6, 1/26/23).
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
      {/*  Added button to remove item, then added onRemoveItem function in "inline handler" in button for more elegant fix than separate callback handler commented out above (Lesson 1.6, 1/26/23). */}
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
