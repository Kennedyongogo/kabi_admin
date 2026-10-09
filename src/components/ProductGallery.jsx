import { useEffect, useRef, useState } from "react";
import { mediaUrl } from "../auth.js";
import { ImageIcon, MAX_IMAGE_BYTES, PlusIcon, TrashIcon, UploadIcon } from "./FormParts.jsx";
import "./ProductGallery.css";

export const MAX_PRODUCT_IMAGES = 10;

let nextKey = 0;
const newKey = () => `img-${(nextKey += 1)}`;

export const productImages = (product) => {
  if (!product) return [];
  if (product.images?.length) return product.images;
  return product.image_url ? [product.image_url] : [];
};

// Gallery items are either saved photos ({ path }) or new picks ({ file, url }) waiting to upload.
export const imagesToItems = (product) => productImages(product).map((path) => ({ key: newKey(), path }));

export const itemSrc = (item) => item.url ?? item.path;

/** Builds the `images` order and the files for a product save, matching the API's "new:N" references. */
export const itemsToUpload = (items) => {
  const files = [];
  const order = items.map((item) => {
    if (!item.file) return item.path;
    files.push(item.file);
    return `new:${files.length - 1}`;
  });
  return { order, files };
};

const move = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

export default function ProductGallery({ items, onChange }) {
  const inputRef = useRef(null);
  const itemsRef = useRef(items);
  const [error, setError] = useState("");
  const [dragKey, setDragKey] = useState(null);
  const [dropping, setDropping] = useState(false);
  const room = MAX_PRODUCT_IMAGES - items.length;

  itemsRef.current = items;
  useEffect(
    () => () => {
      for (const item of itemsRef.current) if (item.url) URL.revokeObjectURL(item.url);
    },
    []
  );

  const addFiles = (fileList) => {
    const files = Array.from(fileList ?? []);
    if (!files.length) return;
    const images = files.filter((file) => file.type.startsWith("image/"));
    const fitting = images.filter((file) => file.size <= MAX_IMAGE_BYTES);
    const accepted = fitting.slice(0, Math.max(0, room));

    const problems = [];
    if (images.length < files.length) problems.push("Only image files can be added.");
    if (fitting.length < images.length) problems.push("Photos over 10 MB were skipped.");
    if (fitting.length > accepted.length) problems.push(`A product can have up to ${MAX_PRODUCT_IMAGES} photos.`);
    setError(problems.join(" "));

    if (accepted.length) {
      onChange([...items, ...accepted.map((file) => ({ key: newKey(), file, url: URL.createObjectURL(file) }))]);
    }
  };

  const remove = (key) => {
    const item = items.find((i) => i.key === key);
    if (item?.url) URL.revokeObjectURL(item.url);
    setError("");
    onChange(items.filter((i) => i.key !== key));
  };

  const shift = (index, to) => {
    if (to < 0 || to >= items.length) return;
    onChange(move(items, index, to));
  };

  const onTileDrop = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    setDropping(false);
    if (event.dataTransfer.files?.length) return addFiles(event.dataTransfer.files);
    const from = items.findIndex((i) => i.key === dragKey);
    setDragKey(null);
    if (from !== -1 && from !== index) onChange(move(items, from, index));
  };

  const draggingFiles = (event) => Array.from(event.dataTransfer.types ?? []).includes("Files");

  return (
    <div className="gallery">
      <div className="gallery__head">
        <div>
          <strong>Product photos</strong>
          <span className={error ? "picker__error" : "picker__hint"}>
            {error || "The first photo is the cover. Drag to reorder. JPG, PNG or WEBP, max 10 MB each."}
          </span>
        </div>
        <span className={`gallery__count${room === 0 ? " is-full" : ""}`}>
          {items.length}/{MAX_PRODUCT_IMAGES}
        </span>
      </div>

      <div
        className={`gallery__grid${dropping ? " is-dropping" : ""}${items.length ? "" : " is-empty"}`}
        onDragOver={(event) => {
          if (!draggingFiles(event)) return;
          event.preventDefault();
          setDropping(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setDropping(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDropping(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        {items.map((item, index) => (
          <figure
            key={item.key}
            className={`gallery__tile${index === 0 ? " is-cover" : ""}${dragKey === item.key ? " is-dragging" : ""}`}
            draggable
            onDragStart={(event) => {
              setDragKey(item.key);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", item.key);
            }}
            onDragEnd={() => setDragKey(null)}
            onDragOver={(event) => {
              if (dragKey || draggingFiles(event)) event.preventDefault();
            }}
            onDrop={(event) => onTileDrop(event, index)}
          >
            <img src={mediaUrl(itemSrc(item))} alt={`Photo ${index + 1}`} draggable={false} />
            {index === 0 ? (
              <span className="gallery__badge">Cover</span>
            ) : (
              <span className="gallery__badge gallery__badge--index">{index + 1}</span>
            )}
            {item.file && <span className="gallery__new">New</span>}
            <figcaption className="gallery__tools">
              {index !== 0 && (
                <button type="button" className="gallery__tool gallery__tool--cover" onClick={() => shift(index, 0)} title="Make cover photo">
                  <StarIcon />
                  <span>Cover</span>
                </button>
              )}
              <span className="gallery__tools-spacer" />
              <button
                type="button"
                className="gallery__tool"
                onClick={() => shift(index, index - 1)}
                disabled={index === 0}
                aria-label={`Move photo ${index + 1} earlier`}
                title="Move earlier"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                type="button"
                className="gallery__tool"
                onClick={() => shift(index, index + 1)}
                disabled={index === items.length - 1}
                aria-label={`Move photo ${index + 1} later`}
                title="Move later"
              >
                <ChevronIcon dir="right" />
              </button>
              <button
                type="button"
                className="gallery__tool gallery__tool--danger"
                onClick={() => remove(item.key)}
                aria-label={`Remove photo ${index + 1}`}
                title="Remove"
              >
                <TrashIcon />
              </button>
            </figcaption>
          </figure>
        ))}

        {room > 0 && (
          <button type="button" className="gallery__add" onClick={() => inputRef.current?.click()}>
            {items.length ? <PlusIcon /> : <ImageIcon />}
            <strong>{items.length ? "Add more" : "Add photos"}</strong>
            <span>
              {items.length ? `${room} more allowed` : (
                <>
                  <UploadIcon /> Click or drop images here
                </>
              )}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z" />
    </svg>
  );
}

export function ChevronIcon({ dir = "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "left" ? "m14.5 6-6 6 6 6" : "m9.5 6 6 6-6 6"} />
    </svg>
  );
}
