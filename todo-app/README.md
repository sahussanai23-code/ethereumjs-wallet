# 📝 To-Do List Application

A modern, feature-rich to-do list application with local storage functionality. Built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

### Core Functionality
- ✅ **Add Tasks** - Easily add new tasks with the input field
- ✅ **Mark Complete** - Check off tasks as you complete them
- ✅ **Delete Tasks** - Remove individual tasks or clear all completed tasks
- ✅ **Local Storage** - All tasks are automatically saved to your browser's local storage
- ✅ **Persistent Data** - Your tasks remain even after closing and reopening the browser

### Advanced Features
- 🎯 **Filter Tasks** - View all tasks, only active tasks, or only completed tasks
- 📊 **Task Statistics** - See total tasks and completed task counts
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- ⌨️ **Keyboard Shortcuts** - Press Enter to add tasks, Ctrl+E to export data
- 💾 **Export/Import** - Save your tasks as JSON and restore them later

## 🚀 Quick Start

### Opening the App
1. Open `index.html` in your web browser
2. The app will automatically load your previously saved tasks

### Basic Usage

**Adding a Task:**
```
1. Type your task in the input field
2. Click "Add Task" or press Enter
3. Task is automatically saved
```

**Completing a Task:**
```
1. Click the checkbox next to a task
2. The task will appear with strikethrough
3. Change is automatically saved
```

**Deleting a Task:**
```
1. Click "Delete" button on the task
2. Confirm the deletion
3. Task is removed and changes are saved
```

**Filtering Tasks:**
- Click "All" to view all tasks
- Click "Active" to view incomplete tasks only
- Click "Completed" to view finished tasks only

**Clearing Tasks:**
- "Clear Completed" - Remove all finished tasks
- "Clear All" - Remove all tasks (with confirmation)

## 📁 File Structure

```
todo-app/
├── index.html      # HTML structure and layout
├── styles.css      # Styling and responsive design
├── app.js          # JavaScript logic and local storage
└── README.md       # This file
```

## 🔧 Technical Details

### Local Storage
The application uses the browser's `localStorage` API to persist data:
- **Storage Key:** `todoList`
- **Data Format:** JSON string
- **Storage Limit:** Typically 5-10MB per domain

Each todo object contains:
```javascript
{
  id: timestamp,
  text: "Task description",
  completed: boolean,
  createdAt: "Date/Time string"
}
```

### JavaScript Class Structure

The app uses a single `TodoApp` class that manages:
- **Data Management** - Add, delete, toggle, filter todos
- **Storage Operations** - Save/load from localStorage
- **UI Rendering** - Dynamic DOM updates
- **Event Handling** - User interactions

### Key Methods
- `addTodo()` - Add new task
- `deleteTodo(id)` - Remove task
- `toggleTodo(id)` - Mark complete/incomplete
- `clearCompleted()` - Remove finished tasks
- `clearAll()` - Remove all tasks
- `saveToStorage()` - Persist data to localStorage
- `loadFromStorage()` - Load data from localStorage
- `render()` - Update the UI
- `exportData()` - Export todos as JSON file
- `importData(jsonString)` - Import todos from JSON

## 🎯 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Enter | Add new task (when input focused) |
| Ctrl+E | Export tasks as JSON file |

## 🎨 Customization

### Changing Colors
Edit the gradient colors in `styles.css`:
```css
/* Primary gradient (header, buttons) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change these hex codes to your preferred colors */
```

### Modifying Storage Key
Change the `STORAGE_KEY` in `app.js`:
```javascript
this.STORAGE_KEY = 'todoList'; // Change this to a different name
```

### Adjusting Layout
Modify the `max-width` in `styles.css` for `.container`:
```css
.container {
    max-width: 600px; /* Increase or decrease this value */
}
```

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| IE 11   | ⚠️ Limited (no modern features) |

## 📝 Data Management

### Exporting Your Tasks
```javascript
// Programmatically export
app.exportData();

// Or use keyboard shortcut: Ctrl+E
```

This creates a JSON file named `todos-YYYY-MM-DD.json` with all your tasks.

### Importing Tasks
```javascript
// Load from file
const jsonString = `[{"id":..., "text":"...", ...}]`;
app.importData(jsonString);
```

### Clearing Local Storage
To completely clear stored data in the browser console:
```javascript
localStorage.removeItem('todoList');
// Then reload the page
```

## 🔒 Privacy

- ✅ All data is stored locally in your browser
- ✅ No data is sent to any server
- ✅ No tracking or analytics
- ✅ Your tasks are completely private

## 🐛 Troubleshooting

### Tasks not saving?
- Check if localStorage is enabled in your browser
- Ensure you have enough storage space (5-10MB usually available)
- Check browser console for errors (F12)

### App not loading?
- Make sure all three files (HTML, CSS, JS) are in the same directory
- Clear browser cache and reload
- Try a different browser

### Tasks disappeared?
- They may have been cleared using "Clear All" button
- Check if you're in private/incognito mode (data not persisted)
- LocalStorage might have been cleared by browser settings

## 📚 API Reference

### TodoApp Constructor
```javascript
const app = new TodoApp();
```

### Add Todo
```javascript
app.addTodo(); // Reads from input field
```

### Toggle Completion Status
```javascript
app.toggleTodo(id);
```

### Delete Todo
```javascript
app.deleteTodo(id);
```

### Filter Tasks
```javascript
app.getFilteredTodos(); // Returns filtered array
```

### Export/Import
```javascript
app.exportData(); // Download as JSON
app.importData(jsonString); // Import from JSON
```

## 🚀 Performance

- **Lightweight** - Under 15KB total (all files combined)
- **Fast** - Instant task operations
- **Efficient** - Minimal DOM updates
- **Smooth** - CSS animations at 60 FPS

## 📱 Mobile Features

- Touch-friendly buttons and checkboxes
- Optimized layout for small screens
- Full-screen responsive design
- Works in portrait and landscape modes

## 🎓 Learning Resources

This project demonstrates:
- Vanilla JavaScript (ES6+ classes)
- DOM manipulation
- LocalStorage API
- Event handling
- CSS Grid and Flexbox
- Responsive design
- Object-oriented programming

## 📄 License

Free to use for personal and educational purposes.

## 💡 Future Enhancement Ideas

- Dark mode toggle
- Task priority levels
- Due dates and reminders
- Task categories/tags
- Search functionality
- Cloud sync option
- Recurring tasks
- Drag-and-drop reordering

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

---

**Enjoy staying organized with your To-Do List! 🎉**
