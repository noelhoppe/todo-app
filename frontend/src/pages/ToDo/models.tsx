import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { ToDoItem } from '../../types/todo';
import { Title } from '@mui/icons-material';


export const sampleTodos: ToDoItem[] = [
  { id: 1, title: "Einkaufen gehen", dueTo: new Date("2025-05-20"), isDone: false },
  { id: 2, title: "Hausarbeit Informatik beenden", dueTo: new Date("2025-05-18"), isDone: true },
  { id: 3, title: "Rechnung bezahlen", dueTo: new Date("2025-05-19"), isDone: false },
  { id: 4, title: "Geburtstagsgeschenk besorgen", dueTo: new Date("2025-06-01"), isDone: false },
  { id: 5, title: "Mit Lolo schreiben", dueTo: new Date("2025-05-17"), isDone: true },
  { id: 6, title: "Portfolioprojekt überarbeiten", dueTo: new Date("2025-05-22"), isDone: false },
  { id: 7, title: "Sport machen", dueTo: new Date("2025-05-17"), isDone: true },
  { id: 8, title: "Bewerbung abschicken", dueTo: new Date("2025-05-25"), isDone: false },
  { id: 9, title: "Zimmer aufräumen", dueTo: new Date("2025-05-21"), isDone: true },
  { id: 10, title: "Call mit Commerzbank vorbereiten", dueTo: new Date("2025-05-23"), isDone: false },
  { id: 11, title: "Tic-Tac-Toe fertigstellen", dueTo: new Date("2025-05-19"), isDone: false },
  { id: 12, title: "Kaffee mit Studienfreund", dueTo: new Date("2025-05-18"), isDone: true },
  { id: 13, title: "React Basics wiederholen", dueTo: new Date("2025-05-24"), isDone: false },
  { id: 14, title: "Python Tutorial Kapitel 2", dueTo: new Date("2025-05-20"), isDone: true },
  { id: 15, title: "Klausurfragen DV-BWL lernen", dueTo: new Date("2025-05-26"), isDone: false },
  { id: 16, title: "VS Code Shortcuts lernen", dueTo: new Date("2025-05-27"), isDone: false },
  { id: 17, title: "Studienbescheinigung einreichen", dueTo: new Date("2025-05-22"), isDone: false },
  { id: 18, title: "Meetup in Frankfurt planen", dueTo: new Date("2025-06-02"), isDone: false },
  { id: 19, title: "Thermounterwäsche waschen", dueTo: new Date("2025-05-18"), isDone: true },
  { id: 20, title: "Nach Gießen fahren", dueTo: new Date("2025-05-20"), isDone: false },
  { id: 21, title: "Einkaufen gehen", dueTo: new Date("2025-05-20"), isDone: false },
  { id: 22, title: "Hausarbeit Informatik beenden", dueTo: new Date("2025-05-18"), isDone: true },
  { id: 23, title: "Rechnung bezahlen", dueTo: new Date("2025-05-19"), isDone: false },
  { id: 24, title: "Geburtstagsgeschenk besorgen", dueTo: new Date("2025-06-01"), isDone: false },
  { id: 25, title: "Mit Lolo schreiben", dueTo: new Date("2025-05-17"), isDone: true },
  { id: 26, title: "Portfolioprojekt überarbeiten", dueTo: new Date("2025-05-22"), isDone: false },
  { id: 27, title: "Sport machen", dueTo: new Date("2025-05-17"), isDone: true },
  { id: 28, title: "Bewerbung abschicken", dueTo: new Date("2025-05-25"), isDone: false },
  { id: 29, title: "Zimmer aufräumen", dueTo: new Date("2025-05-21"), isDone: true },
  { id: 30, title: "Call mit Commerzbank vorbereiten", dueTo: new Date("2025-05-23"), isDone: false },
  { id: 31, title: "Tic-Tac-Toe fertigstellen", dueTo: new Date("2025-05-19"), isDone: false },
  { id: 32, title: "Kaffee mit Studienfreund", dueTo: new Date("2025-05-18"), isDone: true },
  { id: 33, title: "React Basics wiederholen", dueTo: new Date("2025-05-24"), isDone: false },
  { id: 34, title: "Python Tutorial Kapitel 2", dueTo: new Date("2025-05-20"), isDone: true },
  { id: 35, title: "Klausurfragen DV-BWL lernen", dueTo: new Date("2025-05-26"), isDone: false },
  { id: 36, title: "VS Code Shortcuts lernen", dueTo: new Date("2025-05-27"), isDone: false },
  { id: 37, title: "Studienbescheinigung einreichen", dueTo: new Date("2025-05-22"), isDone: false },
  { id: 38, title: "Meetup in Frankfurt planen", dueTo: new Date("2025-06-02"), isDone: false },
  { id: 39, title: "Thermounterwäsche waschen", dueTo: new Date("2025-05-18"), isDone: true },
  { id: 40, title: "Nach Gießen fahren", dueTo: new Date("2025-05-20"), isDone: false },
]

export const columns: GridColDef[] = [
  { 
    field: "title", 
    headerName: "Title",
    disableReorder: true,
    editable: true,
    filterable: false,
    flex: 1,
    hideable: false,
    sortable: false
  },
  { 
    field: "dueTo", 
    headerName: "Due to",
    disableReorder: true,
    editable: true,
    filterable: false,
    flex: 1,
    hideable: false,
    sortComparator: (a, b) => {
      if (!(a instanceof Date) || !(b instanceof Date)) {
        throw new Error(`Column Due to contains invalid data that is not instance of Date`)
      }
      return a.getTime() - b.getTime();
    },
    renderCell: (params) => {
      const date: Date = params.value;
      const isOverdue = date < new Date();

      const dayOfMonth = date.getDate().toString().padStart(2, "0");
      const month = date.getMonth().toString().padStart(2, "0");
      return (
        <span
          style={{
            color: isOverdue ? "red" : "inherit"
          }}
        >
          {`${dayOfMonth}.${month}.${date.getFullYear()}`}
        </span>
      )
    }
  },
  {
    field: "isDone",
    headerName: "Status",
    hideable: false,
    disableReorder: true,
    flex: 1,
    sortable: false,
    renderCell: (params) => {
      const isDone: boolean = params.value;


      return (
        <span style={{
          color: isDone ? "green" : "inherit"
        }}>
          {isDone ? "Done" : "Open" }
        </span>
      )
    }
  },
  { 
    field: "actions", 
    headerName: "Actions",
    disableReorder: true,
    filterable: false,
    flex: 1,
    hideable: false,
    sortable: false
  }
]