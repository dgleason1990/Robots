import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state={
    input:'',
    students:[],
    toggle:[],
    tag:''
  }

  async componentWillMount(){
    await fetch('https://www.hatchways.io/api/assessment/students')
    .then(res=>res.json())
    .then(data => {this.setState({
        students: data.students,
        toggle:[{
          className: data.students.map(()=>{ return 'isClosed' })
        }]
      });
    })
    await this.setState({ 
      students: [...this.state.students.map( (student) => { return {tag:[], ...student} })]
    })
  }

  handleTag = (id) => {
    if(this.state.students[id-1].tag === undefined){
      this.state.students[id-1].tag = [];
      this.state.students[id-1].tag.push(this.state.tag.split(''));
      let displayTag = document.getElementById(`tag${id-1}`)
      let tagArr = this.state.students[id-1].tag.map(x => x.join(''))
      let newDiv = document.createElement('div');
      let textNode = document.createTextNode(tagArr[tagArr.length-1]);
      newDiv.appendChild(textNode)
      displayTag.appendChild(newDiv)
    } 
    else {
      this.state.students[id-1].tag.push(this.state.tag.split(''));
      let displayTag = document.getElementById(`tag${id-1}`)
      let tagArr = this.state.students[id-1].tag.map(x => x.join(''))
      let newDiv = document.createElement('div');
      let textNode = document.createTextNode(tagArr[tagArr.length-1]);
      newDiv.appendChild(textNode)
      displayTag.appendChild(newDiv)
    }
  }

  handleInputDisplay = (data)=>{
    if(document.querySelector(`#tag${data.id-1}`) === null){
    }
    else if(document.querySelector(`#tag${data.id-1} div`) === null){
      let displayTag = document.getElementById(`tag${data.id-1}`)
      let tagArr = this.state.students[data.id-1].tag.map(x => x.join(''))
      tagArr.forEach( x => {
        let newDiv = document.createElement('div');
        let textNode = document.createTextNode(x);
        newDiv.appendChild(textNode)
        displayTag.appendChild(newDiv)
      })
    }
  }

  handleChange = (e)=>{
    this.setState({ input: e.target.value });
  }

  render() {
    let tag = [];
    let tagArr=[];
    let filterInput = (data)=>{
      let firstName = data.firstName.toUpperCase().split('');
      let input = this.state.input.toUpperCase().split('');
      let lastName = data.lastName.toUpperCase().split('');
      if (data.tag === undefined || data.tag.length === 0){} 
      else {
          for(let i=0; i<data.tag.length;i++){
            tag.push(data.tag[i])
          }
      }
      if(this.state.input === ''){
        return true
      }
      else {
        let isTrue;
        let isTrueArr =[];
        if(data.tag.length > 0){
          for(let x=0; x<data.tag.length ; x++){
            tagArr.push(data.tag[x].map( (z)=>{ return z.toUpperCase()} ))
            for(let i=0 ; i<input.length ; i++){
              if(input[i] !== firstName[i] && input[i] !== lastName[i] && input[i] !== tagArr[x][i]){
                isTrueArr.push(false)
                break;
              } 
              else if(input[i] === firstName[i] || input[i] === lastName[i] || input[i] === tagArr[x][i]){
                isTrueArr.push(true)
              }
            } 
            if(isTrueArr[isTrueArr.length-1] === true){
              isTrue = true
              break;
            } else {
              isTrue =false
            }
          }
          this.handleInputDisplay(data);
          return isTrue;
      }
      else{
        for(let i=0 ; i<input.length ; i++){
          if(input[i] !== firstName[i] && input[i] !== lastName[i]){
            isTrue = false
            break;
          } 
          else if( input[i] === firstName[i] || input[i] === lastName[i] ){
            isTrue = true
          }
      }
      return isTrue
      }
    }
  }

    let displayInformation = (data) => {
      let add = (total, num)=>{
        return (total + num)
      }

    let handleOpen = (e)=>{ 
        if(e.target.innerHTML === '➕'){
          e.target.innerHTML = '➖'
        } else {
          e.target.innerHTML = '➕'
        }
        const className = [...this.state.toggle[0].className]
        if(className[data.id-1]==='isClosed'){
          className[data.id-1] = 'isOpen'
        } 
        else {
          className[data.id-1] = 'isClosed'
        }
        this.setState({
          toggle:[{
            className: className
          }]
      })
    }
      return <div>
              <div className='studentCard'> 
                <img src={data.pic}/>
                <div className='studentDetails'>
                  <h1 className='button' onClick={handleOpen}>➕</h1>
                  <h1 className='studentName'> {data.firstName} {data.lastName}</h1>
                  <p> Email: {data.email}</p>
                  <p> Company: {data.company} </p>
                  <p> Skill: {data.skill} </p>
                  <p> Average: {data.grades.map( data => Number(data)).reduce(add)/8}% </p>
                  <div className='grades'> 
                    {data.grades.map(grade => {
                      let index = data.grades.indexOf(grade)+1
                        return <p className={this.state.toggle[0].className[data.id-1]}> Test {index}: {grade}% </p>})}
                    <div id={`tag${data.id-1}`}></div>
                    <form onSubmit={(e)=>{e.preventDefault(); this.handleTag(data.id)}}>
                      <input className={this.state.toggle[0].className[data.id-1]}  onChange={(e)=>{this.setState({tag: e.target.value})}}/>
                    </form>
                  </div>
                </div>
              </div>
              <hr/>
      </div>
    }
    return (
      <div>
        <input className='search' onChange={(e)=>{this.setState({ input: e.target.value })}} placeholder='Search by Name'/>
        <input className='search' onChange={(e)=>{this.setState({ input: e.target.value })}} placeholder='Search by Tag'/>
        <div className="App">
          {this.state.students.filter(filterInput).map(data=>displayInformation(data))}
        </div>
      </div>
    );
  }
}

export default App;
