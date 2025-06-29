// components/ItemForm.jsx
import styles from "./item-form.module.css";
import { useEffect, useState } from "react";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export default function ItemForm({ item = null, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    tags: item?.tags?.join(", ") || "",
    categoryIds: item?.category_ids || item?.categories?.map((c) => c.id) || [],
  });

  const [images, setImages] = useState(
    item?.images?.map((img, idx) => ({
      id: idx,
      file: null,
      url: img,
    })) || []
  );

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(import.meta.env.VITE_CATEGORIES_API, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

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

  const toggleCategory = (id) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { title, description, tags, categoryIds } = formData;

    if (!title.trim() || !description.trim() || categoryIds.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) return alert("You must be logged in.");

    const base64Images = await Promise.all(
      images.map((img) => (img.file ? toBase64(img.file) : img.url))
    );

    const payload = {
      title,
      description,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      category_ids: categoryIds,
      images: base64Images,
    };

    try {
      const url = item
        ? `${import.meta.env.VITE_ITEMS_API}${item.id}/`
        : import.meta.env.VITE_ITEMS_API;

      const method = item ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit item.");
      const result = await res.json();
      alert(item ? "Item updated!" : "Item added!");
      onSuccess?.(result);
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.formContainer}>
        <h2>{item ? "Edit Item" : "Add New Item"}</h2>

        {/* Image Upload */}
        <div className={styles.imageUploadSection}>
          <label htmlFor="upload" className={styles.uploadLabel}>
            + Add Images
          </label>
          <input
            id="upload"
            type="file"
            multiple
            hidden
            onChange={handleImageUpload}
          />
          <div className={styles.imagePreviewGrid}>
            {images.map((img) => (
              <div key={img.id} className={styles.imageThumb}>
                <img src={img.url} alt="preview" />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeImage(img.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Title Input */}
        <label htmlFor="title" className={styles.inputLabel}>Title *</label>
        <input
          id="title"
          className={styles.input}
          value={formData.title}
          onChange={handleChange("title")}
          placeholder="Enter Title"
        />

        {/* Description Textarea */}
        <label htmlFor="description" className={styles.inputLabel}>Description *</label>
        <textarea
          id="description"
          className={styles.textarea}
          value={formData.description}
          onChange={handleChange("description")}
          placeholder="Enter Description"
        />

        {/* Tags Input */}
        <label htmlFor="tags" className={styles.inputLabel}>Tags (comma separated)</label>
        <input
          id="tags"
          className={styles.input}
          value={formData.tags}
          onChange={handleChange("tags")}
          placeholder="Enter Tags"
        />

        {/* Categories Section */}
        <label className={styles.inputLabel}>Categories</label>
        <div className={styles.categoriesGrid}>
          {categories.map((cat) => (
            <label key={cat.id} className={styles.categoryOption}>
              <input
                type="checkbox"
                checked={formData.categoryIds.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            {item ? "Update Item" : "Post Item"}
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
