import { Grid2 as Grid, Typography, Box, IconButton } from "@mui/material";
import CalendarPage from "./calendarPage";
import { useReducer, useState } from "react";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";


const months = [
    " January", " February", " March", " April", " May", " June",
    " July", " August", " September", " October", " November", " December"
];


const initialState = () => {
    const d = new Date();
    let m = [];
    let _m = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    m[d.getMonth()] = [...Array(_m.getDate())].map(v => { return { todos: [] } });

    return [{
        year: d.getFullYear(),
        months: m
    }];
}


const reducer = (state, action) => {
    switch (action.type) {
        case 'addYear':
            let newState = [...state];
            newState.push({ year: action.newYear, months: [] });
            return newState;

        case 'addMonth':
            return state.map(e => {
                if (action.year === e.year) {
                    let newMonths = [...e.months];
                    newMonths[action.newMonth] = [...Array(action.newDay)].map(v => { return { todos: [] } });
                    return { ...e, months: newMonths };
                }
                return e;
            });

        case 'addTodo':
            return state.map(e => {
                if (action.year == e.year) {
                    let newMonths = [...e.months];
                    let newDays = [...newMonths[action.month]];
                    let newTodos = [...newDays[action.date - 1].todos, { task: action.newTodo, isCompleted: false }];

                    newDays[action.date - 1] = { todos: newTodos };
                    newMonths[action.month] = newDays;
                    return { ...e, months: newMonths };
                }
                return e;
            })
        case 'updateTodo':
            return state.map(e => {
                if (action.year == e.year) {
                    let newMonths = [...e.months];
                    let newDays = [...newMonths[action.month]];
                    let newTodos = [...newDays[action.date - 1].todos];
                    newTodos[action.todoId].task = action.newTodo;
                    newDays[action.date - 1] = { todos: newTodos };
                    newMonths[action.month] = newDays;
                    return { ...e, months: newMonths };
                }
                return e;
            })

        case 'deleteTodo':
            return state.map(e => {
                if (action.year === e.year) {
                    let newMonths = [...e.months];
                    let newDays = [...newMonths[action.month]];
                    let newTodos = [...newDays[action.date - 1].todos];

                    newTodos = newTodos.filter((v, i) => i != action.todoId);
                    newDays[action.date - 1] = { todos: newTodos };
                    newMonths[action.month] = newDays;
                    return { ...e, months: newMonths };

                }
                return e;
            });

        case 'updateComplete':
            return state.map(e => {
                if (action.year === e.year) {
                    let newMonths = [...e.months];
                    let newDays = [...newMonths[action.month]];
                    let newTodos = [...newDays[action.date - 1].todos];

                    newTodos[action.todoId].isCompleted = action.newCompleted;
                    newDays[action.date - 1] = { todos: newTodos };
                    newMonths[action.month] = newDays;
                    return { ...e, months: newMonths };

                }
                return e;
            });


    }
}



const Calendar = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    const handleCalendarPageMapping = () => {

        for (let e of state) {
            if (e.year == currentYear) {
                return e.months[currentMonth].map((v, i) => {
                    return (
                        <Grid size={12 / 7}>
                            <CalendarPage date={i + 1} day={new Date(currentYear, currentMonth, i + 1).getDay()} month={currentMonth} year={currentYear} todos={v.todos} dispatch={dispatch}></CalendarPage>
                        </Grid>
                    )
                })
            }
        }
    }

    const handleDateBack = () => {
        if (currentMonth === 0) {
            for (let y of state) {
                if (y.year === (currentYear - 1)) {
                    if (y.months[11] === undefined) {
                        dispatch({ type: 'addMonth', year: currentYear - 1, newMonth: 11, newDay: 31 });
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                        return;
                    }
                    else {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                        return;
                    }
                }
            }

            dispatch({ type: 'addYear', newYear: currentYear - 1 });
            dispatch({ type: 'addMonth', year: currentYear - 1, newMonth: 11, newDay: 31 });
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
            return;
        }

        else {
            for (let y of state) {
                if (y.year === currentYear) {
                    if (y.months[currentMonth - 1] === undefined) {
                        dispatch({ type: 'addMonth', year: currentYear, newMonth: currentMonth - 1, newDay: new Date(currentYear, currentMonth, 0).getDate() });
                        setCurrentMonth(currentMonth - 1);
                        return;
                    }
                    else {
                        setCurrentMonth(currentMonth - 1);
                        return;
                    }
                }
            }
        }
    }

    const handleDateForward = () => {
        if (currentMonth === 11) {
            for (let y of state) {
                if (y.year === (currentYear + 1)) {
                    if (y.months[0] === undefined) {
                        dispatch({ type: 'addMonth', year: currentYear + 1, newMonth: 0, newDay: 31 });
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                        return;
                    }
                    else {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                        return;
                    }
                }
            }

            dispatch({ type: 'addYear', newYear: currentYear + 1 });
            dispatch({ type: 'addMonth', year: currentYear + 1, newMonth: 0, newDay: 31 });
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
            return;
        }
        else {
            for (let y of state) {
                if (y.year === currentYear) {
                    if (y.months[currentMonth + 1] === undefined) {
                        dispatch({ type: 'addMonth', year: currentYear, newMonth: currentMonth + 1, newDay: new Date(currentYear, currentMonth + 2, 0).getDate() });
                        setCurrentMonth(currentMonth + 1);
                        return;
                    }
                    else {
                        setCurrentMonth(currentMonth + 1);
                        return;
                    }
                }
            }
        }
    }

    return (
        <Box>
            <Box marginBottom={4}>
                <IconButton onClick={handleDateBack}>
                    <ArrowBackIosNew></ArrowBackIosNew>
                </IconButton>
                <span>{currentYear}</span>
                <span>{months[currentMonth]}</span>
                <IconButton onClick={handleDateForward}>
                    <ArrowForwardIos></ArrowForwardIos>
                </IconButton>
            </Box>

            <Grid container spacing={2}>
                <Grid size={12 / 7} sx={{ display: 'flex', justifyContent: 'center' }}><Typography>Sunday</Typography></Grid>
                <Grid size={12 / 7} sx={{ display: 'flex', justifyContent: 'center' }}><Typography>Monday</Typography></Grid>
                <Grid size={12 / 7} sx={{ display: 'flex', justifyContent: 'center' }}><Typography>Tuesday</Typography></Grid>
                <Grid size={12 / 7} sx={{ display: 'flex', justifyContent: 'center' }}><Typography>Wednesday</Typography></Grid>
                <Grid size={12 / 7} sx={{ display: 'flex', justifyContent: 'center' }}><Typography>Thursday</Typography></Grid>
                <Grid size={12 / 7} sx={{ display: 'flex', justifyContent: 'center' }}><Typography>Friday</Typography></Grid>
                <Grid size={12 / 7} sx={{ display: 'flex', justifyContent: 'center' }}><Typography>Saturday</Typography></Grid>
                {[...Array(new Date(currentYear, currentMonth, 1).getDay())].map(e => <Grid size={12 / 7}></Grid>)}
                {handleCalendarPageMapping()}
            </Grid>
        </Box>
    );
}

export default Calendar;