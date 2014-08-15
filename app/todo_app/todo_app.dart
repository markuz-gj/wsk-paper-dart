import 'package:polymer/polymer.dart';
import 'dart:html';


@CustomTag('todo-app')
class TodoApp extends PolymerElement {
  TodoApp.created(): super.created() {
    toDoInput = $['to-do-input'];
    toDoList = $['to-do-list'];
    toDoInput.onChange.listen(addToDoItem);
  }
}

InputElement toDoInput;
UListElement toDoList;

void addToDoItem(Event e) {
  var newToDo = new LIElement();
  newToDo.text = toDoInput.value;
  toDoInput.value = '';
  toDoList.children.add(newToDo);
}


