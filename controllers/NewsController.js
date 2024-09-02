import News from "../models/NewsModel.js";

const createNews = async (req, res) => {
  const { url, title, category, subCategories, description, imageUrl } =
    req.body;

  try {
    let imageBuffer;
    if (req.file) {
      imageBuffer = req.file.buffer;
    }

    const news = await News.create({
      url,
      title,
      category,
      subCategories,
      description,
      imageUrl,
      image: imageBuffer,
    });

    res.status(201).json({ success: true, news });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllNews = async (req, res) => {
  try {
    const news = await News.find({})
      .populate("category")
      .populate("subCategories");
    res.status(200).json({ success: true, news, count: news.length });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getOneNews = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findById(id)
      .populate("category")
      .populate("subCategories");
    if (!news) {
      return res.status(404).json({
        success: false,
        message: `No news with id: ${id}`,
      });
    }
    res.status(200).json({ success: true, news });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateNews = async (req, res) => {
  const { id } = req.params;
  const { url, title, category, subCategories, description, imageUrl } =
    req.body;

  try {
    let imageBuffer;
    if (req.file) {
      imageBuffer = req.file.buffer;
    }

    const news = await News.findByIdAndUpdate(
      id,
      {
        url,
        title,
        category,
        subCategories,
        description,
        imageUrl,
        image: imageBuffer,
      },
      { new: true, runValidators: true }
    );

    if (!news) {
      return res.status(404).json({
        success: false,
        message: `No news with id: ${id}`,
      });
    }
    res.status(200).json({ success: true, news });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findByIdAndDelete(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: `No news with id: ${id}`,
      });
    }
    res.status(200).json({ success: true, message: "News deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { createNews, deleteNews, getAllNews, getOneNews, updateNews };
