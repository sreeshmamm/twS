document.addEventListener("DOMContentLoaded", () => {
    const createGroupForm = document.getElementById("createGroupForm")
    const scheduleForm = document.getElementById("scheduleForm")
    const noteForm = document.getElementById("noteForm")
    const groupList = document.getElementById("groupList")
    const sessionList = document.getElementById("sessionList")
    const noteList = document.getElementById("noteList")
    const groupSelect = document.getElementById("groupSelect")
    const noteGroupSelect = document.getElementById("noteGroupSelect")

    const groups = JSON.parse(localStorage.getItem("groups")) || []
    let sessions = JSON.parse(localStorage.getItem("sessions")) || []
    let notes = JSON.parse(localStorage.getItem("notes")) || []

    function saveData() {
        localStorage.setItem("groups", JSON.stringify(groups))
        localStorage.setItem("sessions", JSON.stringify(sessions))
        localStorage.setItem("notes", JSON.stringify(notes))
    }

    function displayGroups() {
        groupList.innerHTML = ""
        groupSelect.innerHTML = '<option value="">Select a group</option>'
        noteGroupSelect.innerHTML = '<option value="">Select a group</option>'
        groups.forEach((group, index) => {
            const groupElement = document.createElement("div")
            groupElement.classList.add("group-item")
            groupElement.innerHTML = `
                  <h3>${group.name}</h3>
                  <p>Subject: ${group.subject}</p>
                  <button onclick="deleteGroup(${index})">Delete</button>
              `
            groupList.appendChild(groupElement)

            const option = document.createElement("option")
            option.value = index
            option.textContent = group.name
            groupSelect.appendChild(option)
            noteGroupSelect.appendChild(option.cloneNode(true))
        })
    }

    function displaySessions() {
        sessionList.innerHTML = ""
        sessions.forEach((session, index) => {
            const sessionElement = document.createElement("div")
            sessionElement.classList.add("session-item")
            sessionElement.innerHTML = `
                  <h3>${groups[session.groupIndex].name}</h3>
                  <p>Date: ${new Date(session.dateTime).toLocaleString()}</p>
                  <p>Location: ${session.location}</p>
                  <button onclick="deleteSession(${index})">Delete</button>
              `
            sessionList.appendChild(sessionElement)
        })
    }

    function displayNotes() {
        noteList.innerHTML = ""
        notes.forEach((note, index) => {
            const noteElement = document.createElement("div")
            noteElement.classList.add("note-item")
            noteElement.innerHTML = `
                  <h3>${note.title}</h3>
                  <p>Group: ${groups[note.groupIndex].name}</p>
                  <p>${note.content}</p>
                  <button onclick="deleteNote(${index})">Delete</button>
              `
            noteList.appendChild(noteElement)
        })
    }

    createGroupForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const name = document.getElementById("groupName").value
        const subject = document.getElementById("subject").value
        groups.push({ name, subject })
        saveData()
        displayGroups()
        createGroupForm.reset()
    })

    scheduleForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const groupIndex = document.getElementById("groupSelect").value
        const dateTime = document.getElementById("sessionDateTime").value
        const location = document.getElementById("location").value
        sessions.push({ groupIndex, dateTime, location })
        saveData()
        displaySessions()
        scheduleForm.reset()
    })

    noteForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const groupIndex = document.getElementById("noteGroupSelect").value
        const title = document.getElementById("noteTitle").value
        const content = document.getElementById("noteContent").value
        notes.push({ groupIndex, title, content })
        saveData()
        displayNotes()
        noteForm.reset()
    })

    window.deleteGroup = (index) => {
        groups.splice(index, 1)
        sessions = sessions.filter((session) => session.groupIndex !== index)
        notes = notes.filter((note) => note.groupIndex !== index)
        saveData()
        displayGroups()
        displaySessions()
        displayNotes()
    }

    window.deleteSession = (index) => {
        sessions.splice(index, 1)
        saveData()
        displaySessions()
    }

    window.deleteNote = (index) => {
        notes.splice(index, 1)
        saveData()
        displayNotes()
    }

    displayGroups()
    displaySessions()
    displayNotes()

    // Check for upcoming sessions and show reminders
    setInterval(() => {
        const now = new Date()
        sessions.forEach((session) => {
            const sessionDate = new Date(session.dateTime)
            if (sessionDate > now && sessionDate - now <= 30 * 60 * 1000) {
                // 30 minutes before
                alert(`Reminder: ${groups[session.groupIndex].name} study session in 30 minutes at ${session.location}`)
            }
        })
    }, 60 * 1000) // Check every minute
})

