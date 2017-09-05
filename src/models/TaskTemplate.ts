import mongoose = require('mongoose');


let taskTemplateSchema = new mongoose.Schema({
    title: String,
    videoUrl: String,
    images: [String],
    createDt: { type: Date, default: Date.now }
});
export interface ITaskTemplate extends mongoose.Document {
    title: string;
    videoUrl: string;
    images: [string];
    createDt: Date;
}
export var taskTemplateModel = mongoose.model<ITaskTemplate>('TaskTemplate', taskTemplateSchema);