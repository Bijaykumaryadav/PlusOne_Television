import React, { Fragment, useState, useEffect } from "react";
import { toast } from "sonner";
import privateClient, { publicClient } from '@/services/axiosInstance';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CommonForm from "@/components/common/form";

// Small tile component used to render article cards in the admin grid
function AdminProductsTile({ product, setFormData, setOpenCreateProductsDialog, setCurrentEditedId, handleDelete }) {
  const categoryColors = {
    breaking: "bg-red-100 text-red-700",
    politics: "bg-blue-100 text-blue-700",
    business: "bg-green-100 text-green-700",
    technology: "bg-purple-100 text-purple-700",
    sports: "bg-orange-100 text-orange-700",
    entertainment: "bg-pink-100 text-pink-700",
    health: "bg-teal-100 text-teal-700",
    world: "bg-yellow-100 text-yellow-700",
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden shadow-md">
      <div className="relative">
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-44 object-cover"
        />
        {product?.featured === "yes" && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded">
            Featured
          </span>
        )}
        {product?.category && (
          <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded ${categoryColors[product.category] || "bg-gray-100 text-gray-700"}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
        )}
      </div>
      <CardContent className="p-4">
        <h2 className="text-base font-bold leading-snug line-clamp-2 mb-1">{product?.title}</h2>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{product?.summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>By {product?.author}</span>
          <span>{product?.publishedDate ? new Date(product.publishedDate).toLocaleDateString() : ""}</span>
        </div>
        {product?.tags && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.tags.split(",").map((tag, i) => (
              <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            setCurrentEditedId(product._id);
            setFormData({
              image: product.image || null,
              title: product.title || "",
              routeTitleNe: product.routeTitleNe || "",
              routeTitleEn: product.routeTitleEn || "",
              summary: product.summary || "",
              content: product.content || "",
              category: product.category || "",
              author: product.author || "",
              tags: product.tags || "",
              featured: product.featured || "no",
            });
            setOpenCreateProductsDialog(true);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => handleDelete(product._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

const articleFormElements = [
  {
    label: "Article Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter article headline",
  },
  {
    label: "SEO Route Title (Nepali)",
    name: "routeTitleNe",
    componentType: "input",
    type: "text",
    placeholder: "Optional Nepali route keyword. If blank, article title is used.",
  },
  {
    label: "SEO Route Title (English)",
    name: "routeTitleEn",
    componentType: "input",
    type: "text",
    placeholder: "Optional English route keyword. If blank, article title is used.",
  },
  {
    label: "Summary",
    name: "summary",
    componentType: "textarea",
    placeholder: "Brief summary of the article (appears in preview)",
  },
  {
    label: "Article Content",
    name: "content",
    componentType: "textarea",
    placeholder: "Write your full article content here...",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "breaking", label: "Breaking News" },
      { id: "politics", label: "Politics" },
      { id: "business", label: "Business" },
      { id: "technology", label: "Technology" },
      { id: "sports", label: "Sports" },
      { id: "entertainment", label: "Entertainment" },
      { id: "health", label: "Health" },
      { id: "world", label: "World News" },
    ],
  },
  {
    label: "Author",
    name: "author",
    componentType: "input",
    type: "text",
    placeholder: "Author name",
  },
  {
    label: "Tags",
    name: "tags",
    componentType: "input",
    type: "text",
    placeholder: "Comma separated tags (e.g., politics, election, 2024)",
  },
  {
    label: "Featured Article",
    name: "featured",
    componentType: "select",
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
    ],
  },
];

function AdminArticles() {
  const initialFormData = {
    image: null,
    title: "",
    routeTitleNe: "",
    routeTitleEn: "",
    summary: "",
    content: "",
    category: "",
    author: "",
    tags: "",
    featured: "no",
  };

  const [articleList, setArticleList] = useState([]);
  const [openCreateArticleDialog, setOpenCreateArticleDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const isLoading = false;

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    // when imageFile is set, upload to backend
    if (!imageFile) return;

    const upload = async () => {
      try {
        setImageLoadingState(true);
  const fd = new FormData();
  fd.append('image', imageFile);
        const { data } = await privateClient.post('/admin/articles/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (data && data.data && data.data.url) {
          setUploadedImageUrl(data.data.url);
        } else if (data && data.url) {
          setUploadedImageUrl(data.url);
        }
      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        setImageLoadingState(false);
      }
    };

    upload();
  }, [imageFile]);

  async function fetchArticles() {
    try {
      const { data } = await privateClient.get('/admin/articles');
      setArticleList(data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function isFormValid() {
    const requiredFields = ["title", "summary", "content", "category", "author"];
    return requiredFields.every(field => formData[field] && formData[field].toString().trim() !== "");
  }

  async function onSubmit(event) {
    event.preventDefault();

    try {
      if (currentEditedId !== null) {
        const payload = { ...formData, image: uploadedImageUrl || formData.image };
        await privateClient.put(`/admin/articles/${currentEditedId}`, payload);
      } else {
        const payload = { ...formData, image: uploadedImageUrl };
        await privateClient.post('/admin/articles', payload);
      }

      // Reset and refresh
      setFormData(initialFormData);
      setOpenCreateArticleDialog(false);
      setImageFile(null);
      setUploadedImageUrl("");
      setCurrentEditedId(null);
      fetchArticles();
      toast.success(currentEditedId !== null ? "Article updated successfully" : "Article published successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save article");
    }
  }

  function handleDelete(getCurrentArticleId) {
    (async () => {
      try {
        await privateClient.delete(`/admin/articles/${getCurrentArticleId}`);
        fetchArticles();
        toast.success("Article deleted successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete article");
      }
    })();
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Article Management</h1>
          <p className="text-gray-600 mt-1">Create and manage news articles for your channel</p>
        </div>
        <Button onClick={() => setOpenCreateArticleDialog(true)}>
          Write New Article
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articleList && articleList.length > 0 ? (
          articleList.map(articleItem => (
            <AdminProductsTile
              key={articleItem._id}
              setFormData={setFormData}
              setOpenCreateProductsDialog={setOpenCreateArticleDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={articleItem}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No articles yet. Click "Write New Article" to get started.</p>
          </div>
        )}
      </div>

      <Sheet
        open={openCreateArticleDialog}
        onOpenChange={() => {
          setOpenCreateArticleDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrl("");
          setImageFile(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto px-6 sm:max-w-2xl w-[92vw]">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Article" : "Write New Article"}
            </SheetTitle>
          </SheetHeader>

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update Article" : "Publish Article"}
              formControls={articleFormElements}
              isBtnDisabled={!isFormValid()}
            />

            {/* Image upload control placed below the form */}
            <div className="p-4 border rounded-md mt-4">
              <label className="block text-sm font-medium text-gray-700">Feature Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setImageFile(f);
                }}
                className="mt-1"
              />

              <div className="mt-2">
                {imageLoadingState ? (
                  <span className="text-sm text-gray-600">Uploading image...</span>
                ) : uploadedImageUrl ? (
                  <div className="flex items-center gap-2">
                    <img src={uploadedImageUrl} alt="uploaded" className="w-24 h-16 object-cover rounded" />
                    <span className="text-sm text-green-600">Image uploaded</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No image uploaded yet. Select a file to upload.</span>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminArticles;