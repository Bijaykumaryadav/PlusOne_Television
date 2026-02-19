import React, { Fragment, useState } from "react";
// import { useSelector, useDispatch } from "react-redux"; // BACKEND: Redux disabled
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CommonForm from "@/components/Common/form";
// import ProductImageUpload from "@/components/AdminView/ImageUpload"; // BACKEND: Image upload disabled
// import { addProductFormElements } from "@/config"; // BACKEND: Original config
// BACKEND: Redux actions disabled
// import { addNewProducts, editProducts, fetchAllProducts, deleteProducts } from "@/features/admin/productSlice";
// import { useToast } from "@/hooks/use-toast";
// import AdminProductsTile from "../../components/AdminView/ProductTile"; // STATIC: Defined inline below

// STATIC: Inline AdminProductsTile component (replaces imported AdminProductsTile)
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

// STATIC: Article form configuration for news channel
const articleFormElements = [
  {
    label: "Article Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter article headline",
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
    summary: "",
    content: "",
    category: "",
    author: "",
    tags: "",
    featured: "no",
  };

  // STATIC: Mock article data stored in state
  const [articleList, setArticleList] = useState([
    {
      _id: "1",
      image: "https://via.placeholder.com/800x450",
      title: "Breaking: Major Economic Policy Announced",
      summary: "Government unveils new economic reforms aimed at boosting growth and creating jobs in the manufacturing sector.",
      content: "In a press conference today, officials announced comprehensive economic reforms...",
      category: "business",
      author: "John Smith",
      tags: "economy, policy, government",
      featured: "yes",
      publishedDate: new Date().toISOString(),
    },
    {
      _id: "2",
      image: "https://via.placeholder.com/800x450",
      title: "Tech Giants Unveil AI Innovation",
      summary: "Leading technology companies showcase groundbreaking artificial intelligence developments at annual summit.",
      content: "The tech industry gathered today to present the latest advancements in AI technology...",
      category: "technology",
      author: "Sarah Johnson",
      tags: "AI, technology, innovation",
      featured: "no",
      publishedDate: new Date().toISOString(),
    },
    {
      _id: "3",
      image: "https://via.placeholder.com/800x450",
      title: "International Climate Summit Concludes",
      summary: "World leaders agree on new climate action framework with ambitious emission reduction targets.",
      content: "After days of intense negotiations, representatives from over 190 countries reached consensus...",
      category: "world",
      author: "Michael Chen",
      tags: "climate, environment, international",
      featured: "yes",
      publishedDate: new Date().toISOString(),
    },
  ]);

  const [openCreateArticleDialog, setOpenCreateArticleDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  // BACKEND: Redux state disabled - using local state instead
  // const { productList, isLoading } = useSelector((state) => state.adminProducts);
  // const dispatch = useDispatch();
  const isLoading = false; // STATIC: No loading state needed

  // const { toast } = useToast(); // BACKEND: Toast notifications disabled

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId !== null) {
      // STATIC: Edit article locally
      setArticleList(prevList =>
        prevList.map(article =>
          article._id === currentEditedId
            ? {
                ...article,
                ...formData,
                image: uploadedImageUrl || article.image,
                updatedDate: new Date().toISOString(),
              }
            : article
        )
      );

      // BACKEND: Toast disabled
      // toast({
      //   title: "Article updated successfully",
      //   description: "Your article changes have been saved.",
      // });

      setFormData(initialFormData);
      setOpenCreateArticleDialog(false);
      setCurrentEditedId(null);
      setUploadedImageUrl("");
      setImageFile(null);

      /* BACKEND: Original Redux edit dispatch
      dispatch(
        editProducts({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        console.log(data, "edit");
        if (data?.payload) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateArticleDialog(false);
          setCurrentEditedId(null);
        }
      });
      */
    } else {
      // STATIC: Add new article locally
      const newArticle = {
        _id: Date.now().toString(), // Simple ID generation
        ...formData,
        image: uploadedImageUrl || "https://via.placeholder.com/800x450",
        publishedDate: new Date().toISOString(),
      };

      setArticleList(prevList => [newArticle, ...prevList]); // Add to beginning for latest first

      // BACKEND: Toast disabled
      // toast({
      //   title: "Article published successfully",
      //   description: "Your article is now live on the news channel.",
      // });

      setOpenCreateArticleDialog(false);
      setImageFile(null);
      setFormData(initialFormData);
      setUploadedImageUrl("");

      /* BACKEND: Original Redux add dispatch
      dispatch(
        addNewProducts({
          ...formData,
          image: uploadedImageUrl,
        })
      ).unwrap()
      .then((data) => {
        console.log("data", data);
        if (data) {
          dispatch(fetchAllProducts());
          setOpenCreateArticleDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          toast({
            title: "Product add successfully",
          });
        }
      });
      */
    }
  }

  function handleDelete(getCurrentArticleId) {
    console.log(getCurrentArticleId);

    // STATIC: Delete article locally
    setArticleList(prevList =>
      prevList.filter(article => article._id !== getCurrentArticleId)
    );

    // BACKEND: Toast disabled
    // toast({
    //   title: "Article deleted",
    //   description: "The article has been removed from the news channel.",
    // });

    /* BACKEND: Original Redux delete dispatch
    dispatch(deleteProducts({ id: getCurrentArticleId })).then(data => {
      console.log("payload is", data);
      if (data?.payload) {
        dispatch(fetchAllProducts());
      }
    });
    */
  }

  function isFormValid() {
    // For articles, we need at least title, summary, content, category, and author
    const requiredFields = ["title", "summary", "content", "category", "author"];
    return requiredFields.every(field => formData[field] && formData[field].trim() !== "");
  }

  // BACKEND: Original fetch on mount disabled
  // useEffect(() => {
  //   dispatch(fetchAllProducts());
  // }, [dispatch]);

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
              product={articleItem} // Component still uses 'product' prop name
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
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Article" : "Write New Article"}
            </SheetTitle>
          </SheetHeader>

          {/* BACKEND: ProductImageUpload disabled - image upload not functional in static mode */}
          {/* <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          /> */}

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update Article" : "Publish Article"}
              formControls={articleFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminArticles;