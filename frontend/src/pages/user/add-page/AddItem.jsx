import styles from "./add-item.module.css";
import UserLayout from "../../../layouts/user-layout/UserLayour";
import { useState, useEffect } from "react";

// utils
import { fetchWithTokenRefresh } from "../../../utils/fetchWithTokenRefresh";

// Helper function
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default function AddItem() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    categoryIds: [],
  });

  const [images, setImages] = useState([]); // [{ id, file, url }]
  const [categories, setCategories] = useState([]);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await fetchWithTokenRefresh(
          import.meta.env.VITE_CATEGORIES_API
        );

        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid category data");
        setCategories(data);
      } catch (err) {
        console.error(err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Image upload logic
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Toggle category
  const toggleCategory = (id) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const handleSubmit = async () => {
    const { title, description, tags, categoryIds } = formData;

    if (!title || !description || categoryIds.length === 0) {
      alert("Please fill all required fields including at least one category.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return alert("You must be logged in.");

    const base64Images = await Promise.all(
      images.map((img) => toBase64(img.file))
    );

    const body = {
      title,
      description,
      tags: tags.split(",").map((t) => t.trim()),
      category_ids: categoryIds,
      images: base64Images,
    };

    try {
      const res = await fetch(import.meta.env.VITE_ITEMS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to post item.");
      const data = await res.json();
      alert("Item posted!");
      console.log(data);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <UserLayout>
      <div className={styles.addItemPage}>
        <div className={styles.aiHeader}>
          <h3>Add New Item</h3>
          <div className={styles.aiIcon}>
            <i className="fa-solid fa-plus"></i>
          </div>
        </div>

        <div className={styles.aiBody}>
          {/* Image Upload */}
          <div className={styles.aiItem}>
            <div className={styles.aiTitle}>Photo*</div>
            <div
              className={styles.aiImage}
              onClick={() => document.getElementById("imageUpload").click()}
            >
              {images.length ? (
                <div className={styles.previewContainer}>
                  {images.map((img) => (
                    <div className={styles.previewWrapper} key={img.id}>
                      <img
                        src={img.url}
                        alt="Preview"
                        className={styles.previewImage}
                      />
                      <button
                        className={styles.removeButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <i className="fa-solid fa-camera"></i>
                  <span>Add an image</span>
                </>
              )}
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Title */}
          <div className={styles.aiItem}>
            <div className={styles.aiTitle}>Title*</div>
            <input
              type="text"
              placeholder="What are you offering?"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className={styles.aiItem}>
            <div className={styles.aiTitle}>Description*</div>
            <textarea
              placeholder="Describe the condition, features..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>

          {/* Categories */}
          <div className={styles.checkboxList}>
            {categories.map((cat) => (
              <label key={cat.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.categoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                />
                <span className={styles.aiCategoryName}> {cat.name}</span>
              </label>
            ))}
          </div>

          {/* Selected Categories */}
          <div className={styles.selectedCategories}>
            {formData.categoryIds.length === 0 ? (
              <span>No categories selected</span>
            ) : (
              categories
                .filter((cat) => formData.categoryIds.includes(cat.id))
                .map((cat) => (
                  <span key={cat.id} className={styles.selectedCategory}>
                    {cat.name}
                    <button
                      type="button"
                      className={styles.removeCategoryButton}
                      onClick={() => toggleCategory(cat.id)}
                    >
                      &times;
                    </button>
                  </span>
                ))
            )}
          </div>

          {/* Tags */}
          <div className={styles.aiItem}>
            <div className={styles.aiTitle}>Tags*</div>
            <input
              type="text"
              placeholder="e.g. vintage, second-hand"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
          </div>

          {/* Submit */}
          <div className={styles.aiItem}>
            <button className={styles.aiButton} onClick={handleSubmit}>
              Post Item
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
