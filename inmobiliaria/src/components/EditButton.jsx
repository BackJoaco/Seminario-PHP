function MyButton(props) {
    return (
      <button onClick={props.onClick}>
        Clicked {props.count} times
      </button>
    );
  }
  