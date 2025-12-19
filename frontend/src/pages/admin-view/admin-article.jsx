import React, { Fragment, useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux"; // BACKEND: Redux disabled
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CommonForm from "@/components/Common/form";
import ProductImageUpload from "@/components/AdminView/ImageUpload";
// import { addProductFormElements } from "@/config"; // BACKEND: Original config
// BACKEND: Redux actions disabled
// import { addNewProducts, editProducts, fetchAllProducts, deleteProducts } from "@/features/admin/productSlice";
import { useToast } from "@/hooks/use-toast";
import AdminProductsTile from "../../components/AdminView/ProductTile";

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
  
  const { toast } = useToast();

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
                updatedDate: new Date().toISOString()
              }
            : article
        )
      );
      
      toast({
        title: "Article updated successfully",
        description: "Your article changes have been saved.",
      });
      
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
      
      toast({
        title: "Article published successfully",
        description: "Your article is now live on the news channel.",
      });
      
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
    
    toast({
      title: "Article deleted",
      description: "The article has been removed from the news channel.",
    });

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
    const requiredFields = ['title', 'summary', 'content', 'category', 'author'];
    return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
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
        {articleList && articleList.length > 0 ? 
          articleList.map(articleItem => (
            <AdminProductsTile 
              key={articleItem._id} 
              setFormData={setFormData} 
              setOpenCreateProductsDialog={setOpenCreateArticleDialog} 
              setCurrentEditedId={setCurrentEditedId} 
              product={articleItem} // Component still uses 'product' prop name
              handleDelete={handleDelete}
            />
          )) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No articles yet. Click "Write New Article" to get started.</p>
            </div>
          )
        }
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
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
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