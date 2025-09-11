import mongoose from "mongoose";

export const connectDB = (uri: string) =>
  mongoose
    .connect(uri, { dbName: "math-discussion" })
    .then((c) => console.log(`Connected DB to ${c.connection.host}`))
    .catch((e) => console.log(e));
