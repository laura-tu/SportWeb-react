import { Request, Response } from 'express'
import Todo from '../models/todoModel'

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find()
    res.json(todos)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving todos' })
  }
}

export const createTodo = async (req: Request, res: Response) => {
  try {
    const newTodo = new Todo(req.body)
    await newTodo.save()
    res.status(201).json(newTodo)
  } catch (error) {
    res.status(400).json({ message: 'Error creating todo' })
  }
}

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' })
    res.json(updatedTodo)
  } catch (error) {
    res.status(400).json({ message: 'Error updating todo' })
  }
}

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const result = await Todo.findByIdAndRemove(req.params.id)
    if (!result) return res.status(404).json({ message: 'Todo not found' })
    res.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    res.status(400).json({ message: 'Error deleting todo' })
  }
}
