import React, { Fragment, useState, useEffect } from "react";
import { toast } from "sonner";
import privateClient from '@/services/axiosInstance';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import CommonForm from "@/components/common/form";
import { Badge } from "@/components/ui/badge";

// Ad tile component
function AdminAdTile({ ad, setFormData, setOpenCreateAdDialog, setCurrentEditedId, handleDelete }) {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden shadow-md">
      <div className="relative">
        {ad?.imageUrl ? (
          <img
            src={ad.imageUrl}
            alt={ad?.title}
            className="w-full h-44 object-cover"
          />
        ) : (
          <div className="flex h-44 w-full items-center justify-center bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 text-center text-sm font-semibold text-slate-700">
            {ad?.bannerText || ad?.title || 'Text Ad'}
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-2">
          {ad?.isActive && (
            <Badge className="bg-green-500">Active</Badge>
          )}
          {!ad?.isActive && (
            <Badge className="bg-gray-400">Inactive</Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h2 className="text-base font-bold leading-snug line-clamp-2 mb-1">{ad?.title}</h2>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{ad?.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>Position: {ad?.position}</span>
          <span>Priority: {ad?.priority}</span>
        </div>
        {ad?.endDate && (
          <div className="text-xs text-gray-400">
            Expires: {new Date(ad.endDate).toLocaleDateString()}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => {
            setCurrentEditedId(ad._id);
            setFormData({
              title: ad.title || "",
              description: ad.description || "",
              imageUrl: ad.imageUrl || "",
              linkUrl: ad.linkUrl || "",
              bannerText: ad.bannerText || "",
              position: ad.position || "sidebar",
              isActive: ad.isActive || true,
              endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : "",
              priority: ad.priority || 1,
            });
            setOpenCreateAdDialog(true);
          }}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => handleDelete(ad._id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

const adFormElements = [
  {
    label: "Ad Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter ad title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Brief description of the ad",
  },
  {
    label: "Banner Text (Optional)",
    name: "bannerText",
    componentType: "input",
    type: "text",
    placeholder: "Text to display on banner",
  },
  {
    label: "Link URL",
    name: "linkUrl",
    componentType: "input",
    type: "url",
    placeholder: "https://example.com",
  },
  {
    label: "Position",
    name: "position",
    componentType: "select",
    options: [
      { id: "top", label: "Header Carousel / Top" },
      { id: "text", label: "Text Ticker / Breaking Ad" },
      { id: "sidebar", label: "Sidebar" },
      { id: "bottom", label: "Bottom" },
    ],
  },
  {
    label: "Priority (1=highest)",
    name: "priority",
    componentType: "input",
    type: "number",
    placeholder: "1",
  },
  {
    label: "End Date",
    name: "endDate",
    componentType: "input",
    type: "date",
  },
  {
    label: "Active",
    name: "isActive",
    componentType: "select",
    options: [
      { id: "true", label: "Yes" },
      { id: "false", label: "No" },
    ],
  },
];

function AdminAds() {
  const initialFormData = {
    title: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    bannerText: "",
    position: "sidebar",
    isActive: true,
    endDate: "",
    priority: 1,
  };

  const [adList, setAdList] = useState([]);
  const [openCreateAdDialog, setOpenCreateAdDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (!imageFile) return;

    const upload = async () => {
      try {
        setImageLoadingState(true);
        const fd = new FormData();
        fd.append('image', imageFile);
        const { data } = await privateClient.post('/admin/ads/upload', fd, {
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

  async function fetchAds() {
    try {
      const { data } = await privateClient.get('/admin/ads');
      const items = data?.data ?? data ?? [];
      setAdList(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error(err);
      setAdList([]);
    }
  }

  function isFormValid() {
    return formData.title && formData.title.toString().trim() !== "";
  }

  async function onSubmit(event) {
    event.preventDefault();

    try {
      const payload = {
        ...formData,
        imageUrl: uploadedImageUrl || formData.imageUrl,
        isActive: formData.isActive === "true" || formData.isActive === true,
        priority: parseInt(formData.priority) || 1,
      };

      let response;
      if (currentEditedId !== null) {
        response = await privateClient.put(`/admin/ads/${currentEditedId}`, payload);
      } else {
        response = await privateClient.post('/admin/ads', payload);
      }

      const savedAd = response?.data?.data ?? response?.data ?? null;

      setAdList((prev) => {
        if (!savedAd) return prev;

        if (currentEditedId !== null) {
          return prev.map(item => (item._id === savedAd._id ? savedAd : item));
        }

        return [savedAd, ...prev.filter(item => item._id !== savedAd._id)];
      });

      setFormData(initialFormData);
      setOpenCreateAdDialog(false);
      setImageFile(null);
      setUploadedImageUrl("");
      setCurrentEditedId(null);
      await fetchAds();
      toast.success(currentEditedId !== null ? "Ad updated successfully" : "Ad created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save ad");
    }
  }

  async function handleDelete(adId) {
    try {
      await privateClient.delete(`/admin/ads/${adId}`);
      setAdList((prev) => prev.filter(ad => ad._id !== adId));
      await fetchAds();
      toast.success("Ad deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete ad");
    }
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Ad Management</h1>
          <p className="text-gray-600 mt-1">Create and manage advertisements</p>
        </div>
        <Button onClick={() => setOpenCreateAdDialog(true)}>
          Create New Ad
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adList && adList.length > 0 ? (
          adList.map(ad => (
            <AdminAdTile
              key={ad._id}
              setFormData={setFormData}
              setOpenCreateAdDialog={setOpenCreateAdDialog}
              setCurrentEditedId={setCurrentEditedId}
              ad={ad}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No ads yet. Click "Create New Ad" to get started.</p>
          </div>
        )}
      </div>

      <Sheet
        open={openCreateAdDialog}
        onOpenChange={() => {
          setOpenCreateAdDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrl("");
          setImageFile(null);
        }}
      >
        <SheetContent side="right" className="overflow-auto px-6 sm:max-w-xl w-[92vw]">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Ad" : "Create New Ad"}
            </SheetTitle>
          </SheetHeader>

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Update Ad" : "Create Ad"}
              formControls={adFormElements}
              isBtnDisabled={!isFormValid()}
            />

            {/* Image upload control */}
            {formData.position !== "text" && (
              <div className="p-4 border rounded-md mt-4">
                <label className="block text-sm font-medium text-gray-700">Ad Image (Optional)</label>
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
                    <span className="text-sm text-gray-500">Optional for image-based ads. Leave empty for text-only ads.</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminAds;
