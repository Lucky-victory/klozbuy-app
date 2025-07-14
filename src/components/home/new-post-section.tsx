import React, { useState, useCallback, useMemo } from "react";
import {
  Camera,
  MapPin,
  Tag,
  Users,
  Image,
  Video,
  Calendar,
  Smile,
  ArrowLeft,
  X,
  Upload,
  Check,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";

// Custom hook for screen size
const useResize = (fps = 60) => {
  const [dimensions, setDimensions] = useState(() =>
    typeof window !== "undefined"
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 0, height: 0 }
  );

  React.useEffect(() => {
    let frameId: number | null = null;
    let lastTimestamp = 0;
    const throttleInterval = 1000 / fps;

    const onResize = () => {
      const now = Date.now();
      if (now - lastTimestamp >= throttleInterval) {
        lastTimestamp = now;
        frameId = window.requestAnimationFrame(() => {
          setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        });
      }
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [fps]);

  return dimensions;
};

// UserAvatar component
const UserAvatar = ({
  name,
  src,
  size = 40,
}: {
  name: string;
  src: string;
  size?: number;
}) => (
  <div
    className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold"
    style={{ width: size, height: size }}
  >
    {src ? (
      <img
        src={src}
        alt={name}
        className="w-full h-full rounded-full object-cover"
      />
    ) : (
      <span className="text-sm">
        {name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()}
      </span>
    )}
  </div>
);

// Post type categories
const POST_CATEGORIES = [
  { id: "general", label: "General", icon: Smile, color: "bg-purple-500" },
  { id: "product", label: "Product", icon: Tag, color: "bg-green-500" },
  { id: "service", label: "Service", icon: Users, color: "bg-orange-500" },
  { id: "event", label: "Event", icon: Calendar, color: "bg-blue-500" },
];

// Form field configurations
const FORM_FIELDS = {
  product: [
    { name: "sku", label: "SKU", type: "text", placeholder: "Enter SKU" },
    {
      name: "price",
      label: "Price",
      type: "number",
      required: true,
      placeholder: "0.00",
    },
    {
      name: "compareAtPrice",
      label: "Compare at Price",
      type: "number",
      placeholder: "0.00",
    },
    {
      name: "currency",
      label: "Currency",
      type: "select",
      options: [
        { value: "NGN", label: "NGN (₦)" },
        { value: "USD", label: "USD ($)" },
        { value: "EUR", label: "EUR (€)" },
      ],
      defaultValue: "NGN",
    },
    {
      name: "condition",
      label: "Condition",
      type: "select",
      options: [
        { value: "new", label: "New" },
        { value: "used", label: "Used" },
        { value: "refurbished", label: "Refurbished" },
      ],
      defaultValue: "new",
    },
    {
      name: "availability",
      label: "Availability",
      type: "select",
      options: [
        { value: "in_stock", label: "In Stock" },
        { value: "out_of_stock", label: "Out of Stock" },
        { value: "pre_order", label: "Pre-order" },
        { value: "discontinued", label: "Discontinued" },
      ],
      defaultValue: "in_stock",
    },
    {
      name: "stockQuantity",
      label: "Stock Quantity",
      type: "number",
      placeholder: "0",
    },
    {
      name: "minOrderQuantity",
      label: "Min Order Quantity",
      type: "number",
      defaultValue: 1,
    },
    {
      name: "maxOrderQuantity",
      label: "Max Order Quantity",
      type: "number",
      placeholder: "0",
    },
    {
      name: "weight",
      label: "Weight (kg)",
      type: "number",
      step: "0.001",
      placeholder: "0.000",
    },
    { name: "brand", label: "Brand", type: "text", placeholder: "Enter brand" },
    { name: "model", label: "Model", type: "text", placeholder: "Enter model" },
    {
      name: "warranty",
      label: "Warranty",
      type: "text",
      placeholder: "e.g., 1 year manufacturer warranty",
    },
    { name: "isNegotiable", label: "Price is negotiable", type: "checkbox" },
  ],
  service: [
    {
      name: "serviceType",
      label: "Service Type",
      type: "text",
      required: true,
      placeholder: "e.g., Web Development",
    },
    {
      name: "priceType",
      label: "Price Type",
      type: "select",
      required: true,
      options: [
        { value: "fixed", label: "Fixed Price" },
        { value: "hourly", label: "Hourly Rate" },
        { value: "per_project", label: "Per Project" },
        { value: "negotiable", label: "Negotiable" },
      ],
    },
    { name: "price", label: "Price", type: "number", placeholder: "0.00" },
    {
      name: "currency",
      label: "Currency",
      type: "select",
      options: [
        { value: "NGN", label: "NGN (₦)" },
        { value: "USD", label: "USD ($)" },
        { value: "EUR", label: "EUR (€)" },
      ],
      defaultValue: "NGN",
    },
    {
      name: "duration",
      label: "Duration",
      type: "text",
      placeholder: "e.g., 2 weeks, 3 days",
    },
    { name: "isRemote", label: "Remote service available", type: "checkbox" },
    {
      name: "isOnsite",
      label: "On-site service available",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "serviceRadius",
      label: "Service Radius (km)",
      type: "number",
      placeholder: "0",
    },
    {
      name: "experienceYears",
      label: "Experience (years)",
      type: "number",
      placeholder: "0",
    },
    {
      name: "certifications",
      label: "Certifications",
      type: "textarea",
      placeholder: "List your certifications",
    },
  ],
  event: [
    {
      name: "eventType",
      label: "Event Type",
      type: "text",
      required: true,
      placeholder: "e.g., Workshop, Conference",
    },
    { name: "startDate", label: "Start Date", type: "date", required: true },
    { name: "endDate", label: "End Date", type: "date" },
    { name: "startTime", label: "Start Time", type: "time" },
    { name: "endTime", label: "End Time", type: "time" },
    { name: "isAllDay", label: "All day event", type: "checkbox" },
    {
      name: "timezone",
      label: "Timezone",
      type: "select",
      options: [
        { value: "Africa/Lagos", label: "Lagos Time (WAT)" },
        { value: "UTC", label: "UTC" },
        { value: "Europe/London", label: "London Time (GMT)" },
      ],
      defaultValue: "Africa/Lagos",
    },
    {
      name: "venue",
      label: "Venue",
      type: "text",
      placeholder: "Event venue name",
    },
    { name: "isOnline", label: "Online event", type: "checkbox" },
    {
      name: "meetingUrl",
      label: "Meeting URL",
      type: "text",
      placeholder: "https://...",
    },
    {
      name: "capacity",
      label: "Capacity",
      type: "number",
      placeholder: "Maximum attendees",
    },
    {
      name: "ticketPrice",
      label: "Ticket Price",
      type: "number",
      placeholder: "0.00",
    },
    { name: "isTicketRequired", label: "Ticket required", type: "checkbox" },
    {
      name: "registrationDeadline",
      label: "Registration Deadline",
      type: "date",
    },
    {
      name: "contactInfo",
      label: "Contact Info",
      type: "textarea",
      placeholder: "Contact details for attendees",
    },
  ],
};

// Media upload constants
const MAX_MEDIA = 5;
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/webm",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
type MediaFile = File;
// Media Preview Component
const MediaPreview = ({
  files,
  onRemove,
  onSetPrimary,
  primaryIndex,
}: {
  files: MediaFile[];
  onRemove: (index: number) => void;
  onSetPrimary: (index: number) => void;
  primaryIndex: number;
}) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Media Preview</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {files.map((file, index) => {
          const url = URL.createObjectURL(file);
          const isImage = file.type.startsWith("image");
          const isPrimary = index === primaryIndex;

          return (
            <div key={index} className="relative group">
              <Card className="overflow-hidden">
                <CardContent className="p-0 aspect-square">
                  {isImage ? (
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-500">Video</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                {files.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant={isPrimary ? "default" : "secondary"}
                    onClick={() => onSetPrimary(index)}
                    className="text-xs"
                  >
                    {isPrimary ? "Primary" : "Set Primary"}
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => onRemove(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {isPrimary && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Form Field Component
const FormFieldComponent = ({
  field,
  control,
  errors,
}: {
  field: any;
  control: any;
  errors: any;
}) => {
  const renderField = (fieldProps: any) => {
    switch (field.type) {
      case "text":
      case "number":
      case "email":
      case "url":
      case "date":
      case "time":
        return (
          <Input
            {...fieldProps}
            type={field.type}
            placeholder={field.placeholder}
            step={field.step}
          />
        );
      case "textarea":
        return (
          <Textarea {...fieldProps} placeholder={field.placeholder} rows={3} />
        );
      case "select":
        return (
          <Select
            value={fieldProps.value || field.defaultValue || ""}
            onValueChange={fieldProps.onChange}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={field.placeholder || `Select ${field.label}`}
              />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!fieldProps.value}
              onCheckedChange={fieldProps.onChange}
            />
            <Label>{field.label}</Label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FormField
      control={control}
      name={field.name}
      rules={{ required: field.required }}
      render={({ field: fieldProps }) => (
        <FormItem>
          {field.type !== "checkbox" && (
            <FormLabel>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>{renderField(fieldProps)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Post Type Selection Component
const PostTypeSelection = ({
  selectedType,
  onSelect,
}: {
  selectedType: string;
  onSelect: (type: string) => void;
}) => (
  <div className="grid grid-cols-2 gap-3">
    {POST_CATEGORIES.map((category) => {
      const IconComponent = category.icon;
      return (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 hover:shadow-md ${
            selectedType === category.id
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {category.label}
          </span>
        </button>
      );
    })}
  </div>
);

// Main New Post Component
const NewPostSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [postContent, setPostContent] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [primaryMediaIndex, setPrimaryMediaIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { width } = useResize();
  const isMobile = width < 768;

  const form = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const steps = useMemo(() => {
    const baseSteps = ["compose", "type"];
    if (selectedType && selectedType !== "general") {
      baseSteps.push("details");
    }
    baseSteps.push("media", "review");
    return baseSteps;
  }, [selectedType]);

  const currentStepIndex = step;
  const currentStep = steps[currentStepIndex];

  const nextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const resetForm = useCallback(() => {
    setStep(0);
    setPostContent("");
    setSelectedType("");
    setMediaFiles([]);
    setPrimaryMediaIndex(0);
    setUploadProgress(null);
    setErrors({});
    setIsSubmitting(false);
    form.reset();
  }, [form]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    resetForm();
  }, [resetForm]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    resetForm();
  }, [resetForm]);

  const handleMediaUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setErrors({});

      // Validate file count
      if (files.length + mediaFiles.length > MAX_MEDIA) {
        setErrors({ media: `Maximum ${MAX_MEDIA} files allowed` });
        return;
      }

      // Validate files
      const validFiles: MediaFile[] = [];
      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          setErrors({
            media: "Only JPG, PNG, GIF, MP4, and WEBM files are allowed",
          });
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          setErrors({ media: `File "${file.name}" exceeds 10MB limit` });
          return;
        }
        validFiles.push(file);
      }

      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev && prev >= 100) {
            clearInterval(interval);
            setUploadProgress(null);
            setMediaFiles((current) => [...current, ...validFiles]);
            return 100;
          }
          return prev || 0 + 20;
        });
      }, 200);

      // Clear file input
      event.target.value = "";
    },
    [mediaFiles.length]
  );

  const handleRemoveMedia = useCallback((index: number) => {
    setMediaFiles((current) => current.filter((_, i) => i !== index));
    setPrimaryMediaIndex((current) =>
      current >= index ? Math.max(0, current - 1) : current
    );
  }, []);

  const handleSetPrimaryMedia = useCallback((index: number) => {
    setPrimaryMediaIndex(index);
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would normally send the data to your API
      console.log("Post data:", {
        content: postContent,
        type: selectedType,
        details: form.getValues(),
        media: mediaFiles,
        primaryMediaIndex,
      });

      handleClose();
    } catch (error) {
      setErrors({ submit: "Failed to create post. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    postContent,
    selectedType,
    form,
    mediaFiles,
    primaryMediaIndex,
    handleClose,
  ]);

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case "compose":
        return postContent.trim().length > 0;
      case "type":
        return selectedType !== "";
      case "details":
        return form.formState.isValid;
      default:
        return true;
    }
  }, [currentStep, postContent, selectedType, form.formState.isValid]);

  const renderStepContent = () => {
    switch (currentStep) {
      case "compose":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <UserAvatar name="John Doe" src="" />
              <div>
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-sm text-gray-500">Lagos, Nigeria</p>
              </div>
            </div>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind? Share a product, service, or update..."
              className="min-h-[120px] resize-none border-none bg-gray-50 text-lg"
              maxLength={2000}
            />
            <div className="text-right text-sm text-gray-400">
              {postContent.length}/2000
            </div>
          </div>
        );

      case "type":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Choose post type</h3>
              <p className="text-sm text-gray-500 mb-4">
                Select the type of post you want to create
              </p>
            </div>
            <PostTypeSelection
              selectedType={selectedType}
              onSelect={setSelectedType}
            />
          </div>
        );

      case "details":
        const fields =
          FORM_FIELDS[selectedType as keyof typeof FORM_FIELDS] || [];
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}{" "}
                Details
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Fill in the details for your {selectedType}
              </p>
            </div>
            <Form {...form}>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {fields.map((field: any) => (
                  <FormFieldComponent
                    key={field.name}
                    field={field}
                    control={form.control}
                    errors={errors}
                  />
                ))}
              </div>
            </Form>
          </div>
        );

      case "media":
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Add Media</h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload images or videos to showcase your {selectedType}
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="mb-4">
                <Label htmlFor="media-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Choose files
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                </Label>
                <Input
                  id="media-upload"
                  type="file"
                  multiple
                  accept={ACCEPTED_TYPES.join(",")}
                  onChange={handleMediaUpload}
                  className="hidden"
                  disabled={mediaFiles.length >= MAX_MEDIA}
                />
              </div>
              <p className="text-sm text-gray-400">
                JPG, PNG, GIF, MP4, WEBM up to 10MB each. Max {MAX_MEDIA} files.
              </p>
            </div>

            {uploadProgress !== null && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {errors.media && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Upload Error</AlertTitle>
                <AlertDescription>{errors.media}</AlertDescription>
              </Alert>
            )}

            <MediaPreview
              files={mediaFiles}
              onRemove={handleRemoveMedia}
              onSetPrimary={handleSetPrimaryMedia}
              primaryIndex={primaryMediaIndex}
            />
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Review Your Post</h3>
              <p className="text-sm text-gray-500 mb-4">
                Review your post before publishing
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Content
                </Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm">{postContent}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Type
                </Label>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedType.charAt(0).toUpperCase() +
                      selectedType.slice(1)}
                  </span>
                </div>
              </div>

              {selectedType !== "general" &&
                Object.keys(form.getValues()).length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Details
                    </Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <dl className="grid grid-cols-1 gap-2 text-sm">
                        {Object.entries(form.getValues()).map(
                          ([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <dt className="font-medium text-gray-500 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </dt>
                              <dd className="text-gray-900">
                                {typeof value === "boolean"
                                  ? value
                                    ? "Yes"
                                    : "No"
                                  : String(value)}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>
                    </div>
                  </div>
                )}

              {mediaFiles.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Media ({mediaFiles.length})
                  </Label>
                  <MediaPreview
                    files={mediaFiles}
                    onRemove={handleRemoveMedia}
                    onSetPrimary={handleSetPrimaryMedia}
                    primaryIndex={primaryMediaIndex}
                  />
                </div>
              )}
            </div>

            {errors.submit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-3">
        {currentStepIndex > 0 && (
          <Button variant="ghost" size="sm" onClick={prevStep}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h2 className="text-lg font-semibold">
            {currentStepIndex === 0
              ? "Create Post"
              : currentStep === "type"
              ? "Choose Type"
              : currentStep === "details"
              ? "Add Details"
              : currentStep === "media"
              ? "Add Media"
              : "Review"}
          </h2>
          <p className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={handleClose}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderFooter = () => (
    <div className="flex justify-between items-center p-4 border-t bg-gray-50">
      <div className="flex space-x-2">
        {currentStepIndex < steps.length - 1 && (
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStepIndex ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        {currentStepIndex < steps.length - 1 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed}
            className="min-w-[80px]"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[80px]"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        )}
      </div>
    </div>
  );

  const modalContent = (
    <div className="flex flex-col h-full">
      {renderHeader()}
      {renderStepContent()}
      {renderFooter()}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">{modalContent}</DialogContent>
    </Dialog>
  );
};

export default NewPostSection;
