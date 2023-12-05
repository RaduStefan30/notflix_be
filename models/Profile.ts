import mongoose from "mongoose";
import { IProfile } from "./IProfile";

const Profile = new mongoose.Schema<IProfile>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Profile", Profile);
