class app{
  constructor()
  {
    // data section
    this.notes=[];
    this.text="";
    this.title="";
    this.id="";
    // element section
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalCloseButton = document.querySelector('.modal-close-button');
    this.$placeHolder = document.querySelector('#placeholder');
    this.$notes = document.querySelector('#notes');
    this.$form = document.querySelector('#form');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
    this.$formButtons = document.querySelector("#form-buttons");
    this.$modalCloseButton = document.querySelector('.modal-close-button');
    this.$formCloseButton = document.querySelector("#form-close-button");
    this.$colorToolTip = document.querySelector('#color-tooltip');
    this.addEventListeners();
  }

  addEventListeners()
  {
    if(document.body.addEventListener('click',(event)=>{
      this.handleEventListener(event);
      this.selectNote(event);
      this.openModal(event);      
      this.deleteNotes(event);
        }));

    if(this.$modalCloseButton.addEventListener('click',(event)=>{
      this.closeModal();
    }));

    if(this.$formCloseButton.addEventListener('click',(event)=>{
      event.stopPropagation();
      this.closeForm();
        }));

    document.body.addEventListener('mouseover',(event) => {
      this.openToolTip(event);
    });

    document.body.addEventListener('mouseout',(event)=>
    {
      this.closeToolTip(event);
    });

    this.$colorToolTip.addEventListener('mouseover', function(){
      this.style.display = 'flex';
    });

    this.$colorToolTip.addEventListener('mouseout',function(){
      this.style.display = 'none';
    });

    this.$colorToolTip.addEventListener('click',(event) => {
      const color = event.target.dataset.color;
      if(color)
      this.editNoteColor(color);
    })

    
  }

  handleEventListener(event)
  {
    if(event.target.closest('#form-container')){  
      this.openForm();
    }
    else{
      this.closeForm();
    }

    if(document.body.addEventListener('submit' , event =>{
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;

      const hasNote = title || text;

      if(hasNote)
      {
        this.addNote({title,text});
      }
  }));
    
  }
  openForm()
  {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';

  }

  addNote({title,text})
  {
    const newNote = {
      title,text,
      color: 'white',
      id: this.notes.length > 0? this.notes[this.notes.length-1].id+1:1
    };
    this.notes = [...this.notes,newNote];
    this.closeForm();
    this.displayNotes();
  }

  editNotes()
  {
    const title = this.$modalTitle.value;
    
    const text = this.$modalText.value;
    
    this.notes = this.notes.map(note =>
      note.id === Number(this.id) ? {...note , title, text} :note);
    this.displayNotes();
  }

  editNoteColor(color)
  {
    this.notes = this.notes.map( note => 
      note.id === Number(this.id) ? {...note, color } : note); 
    this.displayNotes();
  }
  selectNote(event)
  {
    const $selectedNotes = event.target.closest('.note');
    if(!$selectedNotes) return;
    const [$noteTitle , $noteText] = $selectedNotes.children;
    this.text = $noteText.innerText;
    this.title = $noteTitle.innerText;
    this.id = $selectedNotes.dataset.id;
  }

  closeForm()
  {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteText.value="";
    this.$noteTitle.value="";
  }

  openModal(event)
  {
    if(event.target.matches('.toolbar-delete')) return;
    if(event.target.closest('.note'))
    {
      this.$modal.classList.toggle('open-modal');
      this.$modalTitle.value=this.title;
      this.$modalText.value=this.text;
    }
    
  }

  closeModal()
  {
    this.editNotes();
    this.$modal.classList.remove('open-modal');
  }

  openToolTip(event)
  {
    if(!event.target.matches('.toolbar-color')) return;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left ;
    const vertical = window.scrollY-20;
    this.$colorToolTip.style.transform =  `translate(${Math.round(horizontal)}px,${Math.round(vertical)}px)`;
    this.$colorToolTip.style.display = `flex`;
  }

  closeToolTip(event)
  {
    if(!event.target.matches('.toolbar-color')) return;
    this.$colorToolTip.style.display = 'none';
  }

  deleteNotes(event)
  {
    if(!event.target.matches('.toolbar-delete')) return;
    event.stopPropagation();
    const id = event.target.parentNode.parentNode.parentNode.dataset.id;
    this.notes = this.notes.filter(note=>
      {
        console.log(typeof note.id+" "+ Number(id)+" "+note.id !== Number(id));
        return note.id !== Number(id); 
      });
      this.displayNotes();
  }

  displayNotes()
  {
    
    const hasLength = this.notes.length;
    this.$placeHolder.style.display = hasLength ? 'none' : 'flex' ;

    this.$notes.innerHTML = this.notes.map( note =>
          `<div class="note" style="background: ${note.color};" data-id = "${note.id}">
          <div class="${note.title && "note-title"}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class = "toolbar" >
            <img class= "toolbar-color" data-id=${note.id} src="https://icon.now.sh/palette">
            <img class= "toolbar-delete" src="https://icon.now.sh/delete">
            </div>
          </div>
          </div>`
      ).join("");
  }
}
new app();