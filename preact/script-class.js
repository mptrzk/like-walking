import 'https://cdn.skypack.dev/preact/debug';
import {render, h, Component} from 'https://cdn.skypack.dev/preact';
import {useState, useReducer} from 'https://cdn.skypack.dev/preact/hooks'; //braces?
import htm from 'https://cdn.skypack.dev/htm';

const ht = htm.bind(h);

const Tree = props => {
  const [collapse, setState] = useState(props.collapse); //hacky falsity
  return ht`
  <div class='tree'> 
    <div class='tree-header' onclick=${() => setState(!collapse)}>
      <b>${`${collapse ? '+' : '-'} ${props.title}`}</b>
    <//>
    <div class='tree-content' style=${collapse ? 'display: none' : ''}>
      ${props.children}
    <//>
  <//>
  `;
}


//update
const Foo = props => {
  const [state, setState] = useState(0);
  //first just wrap passed event
  const f = e => {
    props.onkeydown(e);
    const len = e.target.innerText.length;
    setState(len + ((e.key.length  == 1 && e.key != ' ') ? 1 : 0)); //same condition as below, but hackier
  }
  return ht`
    <span class='foo'>
      <span class='bar'>${'\u00a0'.repeat(5)}<//>
      <span class='baz'>${'\u00a0'.repeat(state)}<//>
      <span class='ans' onkeydown=${f} contenteditable spellcheck=${false}>
      <//>
    <//>
  `;
}

class Game extends Component {
  constructor(props, taskGen) {
    this.taskGen = taskGen;
    alert('boo');
    super(props);
    this.state = {streak: 0};
  }
  keydown(e) {
    if (!(e.key == ' ' || e.key == 'Enter' || e.key == 'Backspace')) return; //abstract away?
    e.preventDefault();
    const ans = e.target.innerText;
    e.target.innerText = '';
    //const {task, streak} = this.state;
    const passed = this.state.task.validate(ans); //TODO WTF???
    this.setState({
      streak: passed ? this.state.streak + 1 : 0,
      task: passed ? this.props.taskGen() : this.state.task
    });
  }
  //TODO floating underline
  render() {
    return ht`
      <${Tree} title=${this.props.title}>
        Q: ${this.state.task.question}
        <div>
          ${'A: '} 
          <${Foo} onkeydown=${e => this.keydown(e)}/>
        <//>
        streak: ${this.state.streak}

      <//>
    `;
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

class Add1 extends Game {
  constructor(props) {
    super(props, this.taskGen); //TODO
  }
  taskGen() {
    const a = getRandomIntInclusive(0, 9);
    const b = getRandomIntInclusive(0, 9);
    return { //macro candidate - object with scoped properties
      question: `${a} + ${b} = ???`,
      validate: ans => parseInt(ans) === a + b,
    }
  }
}

//memoize game?
const App = props => {
  return ht`
    <${Tree} title=foobar>
      <div>foo<//>
      <${Tree} title='walbro'>
        bar
        <div>boom<//>
        <u>hello uriel<//>
        <${Add1}
         title='Walprawn'
         />
      <//>
      <div>baz<//>
    <//>
  `;
}

render(ht`<${App}/>`, document.body);
