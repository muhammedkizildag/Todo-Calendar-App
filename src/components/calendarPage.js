import { CheckBox } from "@mui/icons-material";
import { Box, Checkbox, Input, List, ListItem, Paper, Typography } from "@mui/material";
import { memo, useState } from "react";



const CalendarPage = (props) => {
    const [open, setOpen] = useState(false);

    const handleClose = (e) => {
        if (e.target != e.currentTarget) return;
        setOpen(false);
    }

    const handleClick = (e) => setOpen(true);

    const handleBlur = (e) => {
        if (e.target.value != '') {
            props.dispatch(
                {
                    type: 'addTodo',
                    year: props.year,
                    month: props.month,
                    date: props.date,
                    newTodo: e.target.value,
                })
                e.target.value = '';
        }

    }

    

    const handleOpenMenu = () => {
        if (open) {
            return (
                <List sx={{ width: '100%', height: 250 }}>
                    {props.todos.map((todo, i) => {
                        return (
                            <ListItem sx={{padding: 0}}>
                                <Checkbox edge='start' disableRipple checked={todo.isCompleted} onChange={e => props.dispatch({type: 'updateComplete', year: props.year, month: props.month, date: props.date, todoId: i, newCompleted: e.target.checked})}></Checkbox>
                                <Input disableUnderline value={todo.task} onBlur={(e) => e.target.value === '' ? props.dispatch({ type: 'deleteTodo', year: props.year, month: props.month, date: props.date, todoId: i}):null} onChange={(e) => props.dispatch({ type: 'updateTodo', year: props.year, month: props.month, date: props.date, todoId: i, newTodo: e.target.value })}></Input>
                            </ListItem>
                        )
                    })}
                    <ListItem sx={{padding: 0}}>
                        <Input placeholder="Add New Task" disableUnderline onBlur={handleBlur}></Input>
                    </ListItem>
                </List>
            )
        }

        return (
            <List sx={{ width: 1}}>
                {props.todos.map((todo, i) => {
                    if (i < 2) {
                        return (
                            <ListItem sx={{padding: 0}}>
                                <Typography sx={{fontWeight: 400, fontSize: 16}} >{todo.task}</Typography>
                            </ListItem>
                        )
                    }
                })}
            </List>
        )
    }

    const style = {
        position: 'relative',
        padding: 2,
        overflow: 'hidden',
        height: open ? 336 : 80,
        width: open ? 'calc(200% - 16px)' : 'calc(100% - 32px)',
        transform: props.day == 6 && open ? 'translate(calc(-50% - 8px))' : null,
        zIndex: open ? 10000 : 100,
        transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out, box-shadow 0.3s ease-in-out, z-index 0.3s ease-in-out, transform 0.3s ease-in-out'
    }



    return (
        <Box sx={{ position: 'relative', height: 112 }}>
            <Box sx={{ display: open ? 'block' : 'none', position: 'fixed', left: 0, top: 0, height: '100vh', width: '100vw', zIndex: open ? 1000 : 0, transition: 'z-index 0.3s ease-in-out' }} onClick={handleClose}></Box>
            <Paper sx={style} elevation={open ? 16 : 4} onClick={handleClick}>
                <Typography>{props.date}</Typography>
                {handleOpenMenu()}

            </Paper>
        </Box>
    );
}

export default memo(CalendarPage);