// Some import feature for most or all React JS files apparently, pulls from node_modules folder
import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
// CSS Modules stylesheet
import styles from './App.module.css';
// CSS Styled Components
import styled from 'styled-components';
// For getting around template literals for assigning multiple styles
import cs from 'classnames';
// For SVG
import { ReactComponent as Check } from './check.svg';

// Variables for CSS Styled Components
const StyledItem = styled.li`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

const StyledColumn = styled.span`
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  a {
    color: inherit;
  }
  width: ${(props) => props.width};
`;

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

// Allows for more sophisticated State management; reducer functions always use state & action. (Lesson 1-7) REMOVE_STORY works by removing a story item ("story") with a given objectID from the story list if "Dismiss" button is clicked for a state ("action.payload") with that same objectID (using button in Item component); changed to Switch statement in 1-7 too, & then to a Switch that includes loading, errors, success, & removal.
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
// API ENDPOINT

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// ************************************************************************************************************************ //
// APP COMPONENT / FUNCTION //////////////////////////////////////////////////////
// ************************************************************************************************************************ //
const App = () => {
  // ************************************************************************************************************************ //
  // STATE (useState & useReducer): Various situations dealing with State below (also in "Custom Hook" above, near top)

  // NEW version of search feature's state (with custom hook, "useSemiPersistentState") (also sets default value to "React" if no recent value in search box)
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  // State updater, setUrl is updated when search button is clicked
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  // Returned values from  array are the current state (stories) and the state updater function (setStories).  (Lesson 1-6, 1/26/23, p. 88 in book); removed "initialStories" as initial state, replaced w/empty array (Lesson 1-7, p. 94); later in 1-7, turned to a useReducer hook, changing "setStories" to "dispatchStories," & passing it storiesReducer function from above; then merged others for loading & errors into useReducer hook.
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  // ************************************************************************************************************************ //
  // FETCH-RELATED

  // Memoized handler for data fetching (1-8); changed from traditional promise to async in 1-9, including adding a try/catch block for errors.
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: loadingStories });

    // try/catch block for errors
    try {
      const result = await axios.get(url);

      dispatchStories({
        type: storiesSuccess,
        payload: result.data.hits, // C - Result to send to state reducer, following way data is structured in API
      });
    } catch {
      dispatchStories({ type: storiesFailure });
    }
  }, [url]);

  // useEffect hook to call getAsyncStories & resolve returned promise as a side-effect; and b/c has an empty dependency array, will only run after component runs for 1st time (Lesson 1-7), but changed that to searchTerm dependency in 1-8; later in 1-7 changed setStories to dispatchStories & added type & payload. In. 1-8, added steps to search based on searchTerm, then changed to point to handleFetchStories above.
  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  // ************************************************************************************************************************ //
  // DISMISS FUNCTION

  // Remove a story item ("story") with a given objectID from the story list if "Dismiss" button is clicked for an item ("item") with that same objectID (using button in Item component below) (Lesson 1-6, 1/26/23); in 1-7 changes setStories to dispatchStories for useReducer hook; also in 1-7 moved filter for this function into reducer function above.
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: removeStory,
      payload: item,
    });
  };

  // ************************************************************************************************************************ //
  // SETTING & SUBMITTING SEARCH TERM

  // Callback function that sets search term based on input
  const handleSearchInput = (event) => {
    // Updates setSearchTerm in searchTerm state function above (useSemiPersistentState function spec.)
    setSearchTerm(event.target.value);
  };

  // Handler for button submission, sets State above via setUrl; added preventDefault in 1-9 to avoid auto-refresh after submission.
  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>
        NewsFilt: <em>A Hacker News Stories Filter</em>
      </h1>

      {/* ************************************************************************************************************************ */}
      {/* SEARCH FORM: Instantiation of <SearchForm/> Component */}

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* ************************************************************************************************************************ */}
      {/* LIST: Instantiation of <List/> Component - Draws from above filter so only shows stories that are searched */}
      {/* Added onRemoveItem below (Lesson 1-6), & isError & isLoading (Lesson 1-7), then stories.data (Lesson 1-8) */}
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

// ************************************************************************************************************************ //
// SEARCH FORM COMPONENT / FUNCTION //////////////////////////////////////////////////////
// ************************************************************************************************************************ //

// Below was previously instantiating a component called "Search," but to make component reusable, changed to "InputWithLabel" & defined the id & label attributes within it (they were previously defined within the Search component instead of in the instantiation); also changed "search" to "value" & "onSearch" to "onInputChange"--again, to make more broadly usable for different input situations. (Lesson 1-6, 1/11/23 update); added <form> element in 1-9, moving submit into that instead of button

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit} className={styles.searchForm}>
    {/* ************************************************************************************************************************ 
    INPUT WITH LABEL: Instantiation of <InputWithLabel/> Component  */}
    <InputWithLabel
      id="search"
      label="Search"
      value={searchTerm}
      // Added isFocused as prop to pass below (1/24/23 update
      isFocused
      // Prop to be used in search button
      onInputChange={onSearchInput}
    >
      <strong>Search: </strong>
    </InputWithLabel>

    {/* Search button */}
    <button
      type="submit"
      disabled={!searchTerm}
      // Uses classnames library imported above for easier multi-style assignment to a single element
      className={cs(styles.button, styles.buttonLarge)}
    >
      Submit
    </button>
  </form>
);
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

  // C: "...opt into React’s lifecycle with React’s useEffect Hook," focusing on the input field when the component renders, or its dependencies change--ie, when it's focused, as is shown in the dependency array below, [isFocused].
  useEffect(() => {
    if (isFocused && inputRef.current) {
      // D: "... since the ref is passed to the input field’s ref attribute, its current property gives access to the element. Execute its focus programmatically as a side-effect, but only if isFocused is set AND the current property is existent"
      inputRef.current.focus();
    }
    // Dependency array--if isFocused updates, effect will run again (more here: https://www.w3schools.com/react/react_useeffect.asp)
  }, [isFocused]);

  return (
    // Changed from "{label}" below to "{children}" after placing "Search" in between <InputWithLabel> and a new closing </InputWithLabel> tag.
    <>
      <label htmlFor={id} className={styles.label}>
        {children}
      </label>
      &nbsp;
      {/* B: Pass React useRef hook ("inputRef") to JSX-reserved ref attribute */}
      <input
        ref={inputRef}
        id={id}
        // Type also pulls from destructured props at top of this function
        type={type}
        // Because we destructured props object above (in "function signature" for Search component), we can just use "search" & "onSearch" below, otherwise would've needed "props.search" & "props.onSearch" below; later changed to "value" & "onInputChange" to make more reusable.
        value={value}
        // Changed to isFocused to use as prop from above (1/24/2023 update)
        autoFocus={isFocused}
        onChange={onInputChange}
        className={styles.input}
      />
    </>
  );
};

// ************************************************************************************************************************ //
// LIST COMPONENT / FUNCTION //////////////////////////////////////////////////////
// ************************************************************************************************************************ //
// Function pulls from Item function below to automatically populate aspects of each <li> item in <ul> below

// Added onRemoveItem as prop below, to then pass to Item component (Lession 1-6, 1/26/23).

const List = ({ list, onRemoveItem }) => (
  <ul>
    {/* ************************************************************************************************************************ */}
    {/* Instantiation of <Item/> Component - for Lesson 1-6 (1/26/23), added onRemoveItem part below */}
    {list.map((item) => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ))}
  </ul>
);

// ************************************************************************************************************************ //
// ITEM COMPONENT / FUNCTION //////////////////////////////////////////////////////
// ************************************************************************************************************************ //

// Added onRemoveItem prop (Lesson 1-6, 1/26/23)
const Item = ({ item, onRemoveItem }) => (
  // Replaced regular element tags with variables for styled components, StyledItem  (for <li>) & Styled Column (for <span>) (Lesson 3.1)
  <StyledItem>
    <StyledColumn width="40%">
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className={styles.appLink}
      >
        {item.title}
      </a>
    </StyledColumn>
    <StyledColumn width="30%">{item.author}</StyledColumn>
    <StyledColumn width="10%">{item.num_comments}</StyledColumn>
    <StyledColumn width="10%">{item.points}</StyledColumn>
    {/*  Button to remove item via inline handler in button */}
    <StyledColumn width="10%">
      <button
        type="button"
        onClick={() => onRemoveItem(item)}
        // Uses template literal syntax to add multiple CSS classes (can also use classnames library imported above, but leaving to show both)
        className={`${styles.button} ${styles.button_small}`}
      >
        {/* Used SVG import for checkbox in place of text for button (Lesson 3.1) */}
        <Check height="18px" width="18px" />
      </button>
    </StyledColumn>
  </StyledItem>
);

// Necessary part of React JS files
export default App;
