import * as types from './actionTypes';
import firebase, {firebaseRef} from '../firebase';
import { Actions, ActionConst } from 'react-native-router-flux';


export function addTodo(payload) {
  return {
    type: types.ADD_TODO,
    payload
  };
}

export function fetchTodos() {
  return (dispatch, getState) => {
    const todosRef = firebaseRef.child('todos');

    return todosRef.once('value').then(snapshot => {
      const todos = snapshot.val() || {};

      Object.keys(todos).map(todoId => {
        const parsedTodos = {
          id: todoId,
          ...todos[todoId]
        };

        dispatch(addTodo(parsedTodos));
      });
    });
  };
}

export function startAddTodo(text) {
  return (dispatch, getState) => {
    const todo = {
      text,
      isDone: false,
      isStarred: false
    };
    const todoRef = firebaseRef.child('todos').push(todo);

    return todoRef.then(() => {
      dispatch(addTodo({
        id: todoRef.key,
        ...todo
      }));
    });
  };
}

export function updateTodo(id, payload) {
  return {
    type: types.UPDATE_TODO,
    id,
    payload
  };
}

export function startUpdateTodo(id, key, value) {
  return (dispatch, getState) => {
    const todoRef = firebaseRef.child(`todos/${id}`);
    let updates = {};
    updates[key] = value;

    return todoRef.update(updates).then(() => {
      dispatch(updateTodo(id, updates));
    });
  };
}

export function startRemoveTodo(id) {
  return (dispatch, getState) => {
    const todosRef = firebaseRef.child(`todos/${id}`);

    return todosRef.remove().then(() => {
      dispatch(removeTodo(id));
    });
  };
}

export function startSignup(email, password) {
  return (dispatch, getState) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
      console.log('Signup worked', result);
    }, error => {
      console.log('Unable to auth', error);
    });
  };
}

export function startLogin(email, password) {
  return (dispatch, getState) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };
}

export function startLogout() {
  return (dispatch, getState) => {
    return firebase.auth().signOut().then(() => {
      Actions.loginScreen({type: ActionConst.RESET});
    });
  };
}

export function toggleStarTodo(id) {
  return {
    type: types.TOGGLE_STAR_TODO,
    id
  };
}

export function toggleEditTodo(id) {
  return {
    type: types.TOGGLE_EDIT_TODO,
    id
  }
}

export function editTodo(id, text) {
  return {
    type: types.EDIT_TODO,
    id,
    text
  };
}

export function removeTodo(id) {
  return {
    type: types.REMOVE_TODO,
    id
  };
}

export function setVisibilityFilter(filter) {
  return {
    type: types.SET_VISIBILITY_FILTER,
    filter
  };
}
