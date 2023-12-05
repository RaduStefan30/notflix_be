import mongoose from "mongoose";
import { IMedia } from "./IMedia";

const Media = new mongoose.Schema<IMedia>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    required: true,
  },
  isOnMainPage: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model("Media", Media);
