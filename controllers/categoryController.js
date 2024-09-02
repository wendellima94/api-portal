import Category from "../models/CategoryModel.js";

const createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res
      .status(200)
      .json({ success: true, categories, count: categories.length });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getOneCategory = async (req, res) => {
  const { id: categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category with id: ${categoryId}`,
      });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category with id: ${categoryId}`,
      });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id: categoryId } = req.params;

  try {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category with id: ${categoryId}`,
      });
    }
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const addSubCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category with id: ${categoryId}`,
      });
    }

    const newSubCategory = { name, description };
    category.subCategories.push(newSubCategory);
    await category.save();

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getSubCategories = async (req, res) => {
  const { id: categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category with id: ${categoryId}`,
      });
    }

    res
      .status(200)
      .json({ success: true, subCategories: category.subCategories });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getOneSubCategory = async (req, res) => {
  const { id: categoryId, subCategoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category with id: ${categoryId}`,
      });
    }

    const subCategory = category.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: `No subcategory with id: ${subCategoryId}`,
      });
    }

    res
      .status(200)
      .json({ success: true, msg: "Categoria", category, subCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateSubCategory = async (req, res) => {
  const { id: categoryId, subCategoryId } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category with id: ${categoryId}`,
      });
    }

    const subCategory = category.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: `No subcategory with id: ${subCategoryId}`,
      });
    }

    subCategory.name = name || subCategory.name;
    subCategory.description = description || subCategory.description;
    await category.save();

    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteSubCategory = async (req, res) => {
  const { id: categoryId, subCategoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: `No category with id: ${categoryId}`,
      });
    }

    const subCategory = category.subCategories.id(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: `No subcategory with id: ${subCategoryId}`,
      });
    }

    await subCategory.deleteOne();
    await category.save();

    res
      .status(200)
      .json({ success: true, message: "Subcategory deleted", category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  getOneSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
};
