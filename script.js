document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentTab = 'work';
    let tasks = {
        work: JSON.parse(localStorage.getItem('work_tasks')) || [],
        private: JSON.parse(localStorage.getItem('private_tasks')) || []
    };

    // Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const workList = document.getElementById('work-list');
    const privateList = document.getElementById('private-list');

    // Initialize
    renderTasks();

    // Event Listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            currentTab = btn.getAttribute('data-tab');
            document.getElementById(`${currentTab}-tab`).classList.add('active');
        });
    });

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Functions
    function saveTasks() {
        localStorage.setItem('work_tasks', JSON.stringify(tasks.work));
        localStorage.setItem('private_tasks', JSON.stringify(tasks.private));
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };

        tasks[currentTab].push(newTask);
        saveTasks();
        taskInput.value = '';
        renderTasks();
    }

    function toggleTask(id, tab) {
        const task = tasks[tab].find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(id, tab) {
        tasks[tab] = tasks[tab].filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }

    function editTask(id, tab, newText) {
        const task = tasks[tab].find(t => t.id === id);
        if (task && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }

    function startEdit(id, tab, textElement, task) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'task-input-edit';
        
        textElement.replaceWith(input);
        input.focus();

        const finishEdit = () => {
            editTask(id, tab, input.value);
        };

        input.addEventListener('blur', finishEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                input.removeEventListener('blur', finishEdit);
                finishEdit();
            }
        });
    }

    function createTaskElement(task, tab) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        // Checkbox
        const checkbox = document.createElement('div');
        checkbox.className = 'custom-checkbox';
        checkbox.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        checkbox.addEventListener('click', () => toggleTask(task.id, tab));

        // Text
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;

        // Actions
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'action-btns';

        const editBtn = document.createElement('button');
        editBtn.className = 'icon-btn edit-btn';
        editBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
        editBtn.addEventListener('click', () => startEdit(task.id, tab, textSpan, task));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-btn delete-btn';
        deleteBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
        deleteBtn.addEventListener('click', () => deleteTask(task.id, tab));

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(actionsDiv);

        return li;
    }

    function renderTasks() {
        workList.innerHTML = '';
        privateList.innerHTML = '';

        tasks.work.forEach(task => {
            workList.appendChild(createTaskElement(task, 'work'));
        });

        tasks.private.forEach(task => {
            privateList.appendChild(createTaskElement(task, 'private'));
        });
    }
});
