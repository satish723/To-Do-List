document.addEventListener('DOMContentLoaded',()=>
{
    const taskInput =document.querySelector('.task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.querySelector('.task-list');
    const emptyImage =document.querySelector('#empty-image');
    const todoContainer=document.querySelector('.todo-container');
    const progressBar= document.querySelector('.progress');
    const progressnumbers =document.getElementById('numbers');
    const heade =document.querySelector('h3');
    const toggleState = ()=>
    {
        emptyImage.style.display = taskList.children.length === 0 ? 'block'  : 'none';
        todoContainer.style.width=  '100%';
    };
    const showConfetti=()=>
    {
        const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

        function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio),
            })
        );
        }

        fire(0.25, {
        spread: 26,
        startVelocity: 55,
        });

        fire(0.2, {
        spread: 60,
        });

        fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        });

        fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        });

        fire(0.1, {
        spread: 120,
        startVelocity: 45,
        });
    };
    const updateprogress =(check=true) =>
    {
        const totalTasks=taskList.children.length;
        const comtasks= taskList.querySelectorAll('.checkbox:checked').length;
        progressBar.style.width= totalTasks? `${(comtasks/totalTasks)*100}% ` : '0%' ;
        progressnumbers.textContent=`${comtasks} / ${totalTasks}`;
        heade.innerHTML=totalTasks>0 && totalTasks===comtasks ? "challenge completed" : "keep it up";
        if ( check && totalTasks>0 && totalTasks===comtasks)
        {   heade.innerHTML="challenge completed"
            showConfetti();
        }
    };
        const saveTasks = () => {
            const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
                text: li.querySelector('span').textContent,
                completed: li.querySelector('.checkbox').checked
            }));
            localStorage.setItem('tasks', JSON.stringify(tasks));
        };  
    const localstoragedata =()=>
    {
        const savedTasks=JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach( ({text,completed})=>addTask(text,completed,false));
        toggleState();
        updateprogress();
    };
    const addTask = (text,completed=false,check=true)=>
    {
        
        const taskText = text || taskInput.value.trim();
        if(!taskText)
        {
            return;
        }
        const lia =document.createElement('li');
        lia.innerHTML=`<input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}><span>${taskText}</span>
        <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>`;
        const checkBox =lia.querySelector('.checkbox');
        const editbtn =lia.querySelector('.edit-btn');
        const deletebtn =lia.querySelector('.delete-btn');
        if (completed) {
            lia.classList.add('completed');
            editbtn.disabled = true;
            editbtn.style.opacity = '0.5';
            editbtn.style.pointerEvents = 'none';
            
        }
        checkBox.addEventListener('change',()=>
        {
            const ischecked=  checkBox.checked;
            lia.classList.toggle('completed',ischecked);
            editbtn.disabled=ischecked;
            editbtn.style.opacity = ischecked ? '0.5':'1';
            editbtn.style.pointerEvents = ischecked ? 'none' : 'auto';
            updateprogress(ischecked);
            saveTasks();
        });
        editbtn.addEventListener('click',() =>
            {
                if(!checkBox.checked)
                    {
                        taskInput.value=lia.querySelector('span').textContent;
                        lia.remove();
                        toggleState();
                        updateprogress(false);
                        saveTasks();
                    }
            });
        deletebtn.addEventListener('click',()=>
        {
            lia.remove();
            toggleState();
            updateprogress();
            saveTasks();
        });
        taskList.appendChild(lia);
        taskInput.value='';
        toggleState();
        updateprogress(check);
        saveTasks();
    };
    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault(); // STOP form from submitting
        addTask();
    });
    taskInput.addEventListener("keypress",(e)=>
    {
        if(e.key==='Enter')
        {
            e.preventDefault();
            addTask();
        }
    });
    localstoragedata();
});
    