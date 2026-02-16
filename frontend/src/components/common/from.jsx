import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const [focusedField, setFocusedField] = useState(null);
  const [touched, setTouched] = useState({});

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Updated class definitions using theme variables
  const getInputWrapperClasses = (isFieldActive) =>
    cn("relative transition-all duration-200", isFieldActive && "scale-[1.02]");

  const getLabelClasses = (isFieldActive) =>
    cn(
      "mb-2 text-lg font-medium transition-colors duration-200",
      isFieldActive ? "text-primary" : "text-form-label"
    );

  const getInputClasses = (isFieldActive) =>
    cn(
      "h-[45px] rounded-[13px]",
      "text-lg",
      "border-none",
      "bg-form-input-bg text-form-input-text placeholder:text-form-input-placeholder",
      "focus:ring-2 focus:ring-primary",
      "transition-all duration-200"
    );

  // Update the button classes to use theme variables
  const buttonClasses = cn(
    "w-[207px] h-[45px]",
    "bg-primary hover:bg-primary/90",
    "text-primary-foreground",
    "rounded-[30px]",
    "font-medium text-xl",
    "transition-colors",
    "disabled:opacity-50"
  );

  // Update checkbox classes
  const checkboxClasses = cn(
    "h-5 w-5",
    "border-primary",
    "text-primary",
    "focus:ring-primary/20"
  );

  // Update select classes
  const selectClasses = {
    trigger: cn(getInputClasses(false), "flex items-center"),
    content: cn(
      "bg-popover",
      "border border-border",
      "rounded-md",
      "shadow-md"
    ),
    item: cn(
      "text-popover-foreground",
      "focus:bg-accent focus:text-accent-foreground",
      "rounded-sm",
      "cursor-pointer"
    ),
  };

  function renderInputsByComponentType(getControlItem) {
    const value = formData[getControlItem.name] || "";
    const [showPassword, setShowPassword] = useState(false);
    const isFieldActive = focusedField === getControlItem.name;

    const inputWrapperClasses = getInputWrapperClasses(isFieldActive);
    const inputClasses = getInputClasses(isFieldActive);

    switch (getControlItem.componentType) {
      case "singlebox":
        return (
          <motion.div
            className="flex items-center space-x-3 p-2"
            whileHover={{ scale: 1.01 }}
          >
            <Checkbox
              id={getControlItem.name}
              checked={value === true}
              onCheckedChange={(checked) => {
                setFormData({
                  ...formData,
                  [getControlItem.name]: checked,
                });
              }}
              className={checkboxClasses}
            />
            <Label
              htmlFor={getControlItem.name}
              className="text-base text-gray-700 leading-relaxed cursor-pointer"
            >
              {getControlItem.label}{" "}
              {getControlItem.linkUrl && (
                <a
                  href={getControlItem.linkUrl}
                  target="_blank"
                  className="text-primary hover:text-primary/80 underline underline-offset-4"
                >
                  {getControlItem.linkText}
                </a>
              )}
            </Label>
          </motion.div>
        );

      case "password":
      case "passwordnew":
        return (
          <motion.div className={inputWrapperClasses}>
            <div className="relative">
              <Input
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: event.target.value,
                  })
                }
                onFocus={() => handleFocus(getControlItem.name)}
                onBlur={() => setFocusedField(null)}
                className={inputClasses}
                aria-label={getControlItem.label}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </div>
            {getControlItem.componentType === "password" && (
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
          </motion.div>
        );

      case "input":
        return (
          <motion.div className={inputWrapperClasses}>
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              onFocus={() => handleFocus(getControlItem.name)}
              onBlur={() => setFocusedField(null)}
              className={inputClasses}
              aria-label={getControlItem.label}
            />
          </motion.div>
        );

      case "select":
        return (
          <motion.div className={inputWrapperClasses}>
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
                })
              }
              value={value}
            >
              <SelectTrigger className={selectClasses.trigger}>
                <SelectValue placeholder={getControlItem.label} />
              </SelectTrigger>
              <SelectContent className={selectClasses.content}>
                <AnimatePresence>
                  {getControlItem.options?.map((optionItem) => (
                    <motion.div
                      key={optionItem.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <SelectItem
                        value={optionItem.id}
                        className={selectClasses.item}
                      >
                        {optionItem.label}
                      </SelectItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SelectContent>
            </Select>
          </motion.div>
        );

      case "textarea":
        return (
          <motion.div className={inputWrapperClasses}>
            <Textarea
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.id}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
              onFocus={() => handleFocus(getControlItem.name)}
              onBlur={() => setFocusedField(null)}
              className={cn(inputClasses, "min-h-[100px] py-2")}
              aria-label={getControlItem.label}
            />
          </motion.div>
        );

      default:
        return null;
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="space-y-4">
        {formControls.map((controlItem) => (
          <motion.div
            key={controlItem.name}
            className="grid w-full gap-1.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {controlItem.componentType !== "singlebox" && (
              <Label
                className={getLabelClasses(focusedField === controlItem.name)}
              >
                {controlItem.label}
                {controlItem.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
            )}
            {renderInputsByComponentType(controlItem)}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-6 flex justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          disabled={isBtnDisabled}
          type="submit"
          className={buttonClasses}
        >
          {buttonText || "Submit"}
        </Button>
      </motion.div>
    </motion.form>
  );
}

export default CommonForm;