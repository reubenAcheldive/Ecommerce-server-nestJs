import * as mongoose from "mongoose";
import { ICategories } from "src/dtos/categories/categories.dto";

export const CategorySchema = new mongoose.Schema<ICategories>({
  nameCategory: String,
  icon: String,
});

