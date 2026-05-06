import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const taskHistorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuid(),
    },
    action: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      required: true,
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    changedBy: {
      type: String,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const taskCommentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuid(),
    },
    author: {
      type: String,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const attachmentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuid(),
    },
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const taskSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuid(),
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['backlog', 'todo', 'in_progress', 'review', 'testing', 'done'],
      default: 'backlog',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    assignedTo: {
      type: String,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: String,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    comments: [taskCommentSchema],
    history: [taskHistorySchema],
    attachments: [attachmentSchema],
  },
  {
    timestamps: true,
    _id: false,
  },
);

taskSchema.index({ title: 'text', description: 'text', tags: 'text' });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ createdBy: 1, updatedAt: -1 });
taskSchema.index({ assignedTo: 1, updatedAt: -1 });
taskSchema.index({ status: 1, priority: 1, updatedAt: -1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ updatedAt: -1 });

export default mongoose.model('Task', taskSchema);
