"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, useCartItems, useCartTotal } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postcode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  shippingSameAsBilling: z.boolean(),
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingAddress1: z.string().optional(),
  shippingAddress2: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingPostcode: z.string().optional(),
  shippingCountry: z.string().optional(),
  orderNotes: z.string().optional(),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
  paymentMethod: z.enum(["cod", "bacs", "cheque"]).default("cod"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

type Step = "information" | "payment" | "review";

const PAYMENT_METHODS = [
  {
    id: "cod" as const,
    label: "Cash on Delivery (COD)",
    description: "Pay with cash when your package is delivered.",
    title: "Cash on Delivery",
  },
  {
    id: "bacs" as const,
    label: "Direct Bank Transfer",
    description:
      "Make your payment directly into our bank account. Please use your Order ID as the payment reference.",
    title: "Direct Bank Transfer",
  },
  {
    id: "cheque" as const,
    label: "Check Payments",
    description:
      "Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.",
    title: "Check Payments",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartItems();
  const total = useCartTotal();
  const { clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<Step>("information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      postcode: "",
      country: "US",
      shippingSameAsBilling: true,
      shippingFirstName: "",
      shippingLastName: "",
      shippingAddress1: "",
      shippingAddress2: "",
      shippingCity: "",
      shippingState: "",
      shippingPostcode: "",
      shippingCountry: "US",
      orderNotes: "",
      createAccount: false,
      password: "",
      paymentMethod: "cod",
    },
  });

  const shippingSameAsBilling = watch("shippingSameAsBilling");
  const createAccount = watch("createAccount");
  const paymentMethod = watch("paymentMethod");
  const formData = watch();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("email", user.email);
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
    }
  }, [isAuthenticated, user, setValue]);

  const validateInformation = async () => {
    const fieldsToValidate: (keyof CheckoutFormData)[] = [
      "email",
      "firstName",
      "lastName",
      "phone",
      "address1",
      "city",
      "state",
      "postcode",
      "country",
    ];

    if (!shippingSameAsBilling) {
      fieldsToValidate.push(
        "shippingFirstName",
        "shippingLastName",
        "shippingAddress1",
        "shippingCity",
        "shippingState",
        "shippingPostcode",
        "shippingCountry",
      );
    }

    if (createAccount) {
      fieldsToValidate.push("password");
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep("payment");
      window.scrollTo(0, 0);
    }
  };

  const nextToReview = () => {
    setCurrentStep("review");
    window.scrollTo(0, 0);
  };

  const backStep = () => {
    if (currentStep === "payment") setCurrentStep("information");
    if (currentStep === "review") setCurrentStep("payment");
    window.scrollTo(0, 0);
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-light">Your cart is empty</h1>
          <p className="mt-2 text-gray-500">
            Add some items to your cart before checkout.
          </p>
          <Link href="/shop">
            <Button className="mt-8">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const billingAddress = {
        first_name: data.firstName,
        last_name: data.lastName,
        address_1: data.address1,
        address_2: data.address2 || "",
        city: data.city,
        state: data.state,
        postcode: data.postcode,
        country: data.country,
        email: data.email,
        phone: data.phone,
        company: "",
      };

      const shippingAddress = data.shippingSameAsBilling
        ? { ...billingAddress }
        : {
            first_name: data.shippingFirstName || data.firstName,
            last_name: data.shippingLastName || data.lastName,
            address_1: data.shippingAddress1 || data.address1,
            address_2: data.shippingAddress2 || "",
            city: data.shippingCity || data.city,
            state: data.shippingState || data.state,
            postcode: data.shippingPostcode || data.postcode,
            country: data.shippingCountry || data.country,
            company: "",
          };

      const lineItems = items.map((item) => ({
        product_id: item.productId,
        variation_id: item.variationId || 0,
        quantity: item.quantity,
      }));

      const selectedMethod = PAYMENT_METHODS.find(
        (m) => m.id === data.paymentMethod,
      );

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billing: billingAddress,
          shipping: shippingAddress,
          line_items: lineItems,
          customer_note: data.orderNotes || "",
          create_account: data.createAccount,
          password: data.password,
          payment_method: data.paymentMethod,
          payment_method_title: selectedMethod?.title || "Cash on Delivery",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create order");
      }

      clearCart();
      router.push(`/order-confirmation/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: "information", label: "Information" },
    { id: "payment", label: "Payment" },
    { id: "review", label: "Review" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-light">Checkout</h1>
        {/* Step Progress Bar */}
        <nav className="mt-8">
          <ol className="flex items-center gap-4">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isPast = steps.findIndex((s) => s.id === currentStep) > idx;

              return (
                <li key={step.id} className="flex flex-1 items-center gap-2">
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      isActive || isPast ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${
                      isActive ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Form Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {currentStep === "information" && (
              <motion.div
                key="information"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <section>
                  <h2 className="text-lg font-medium">Contact Information</h2>
                  {!isAuthenticated && (
                    <p className="mt-1 text-sm text-gray-500">
                      Already have an account?{" "}
                      <Link
                        href="/account/login?redirect=/checkout"
                        className="text-black underline"
                      >
                        Log in
                      </Link>
                    </p>
                  )}
                  <div className="mt-4">
                    <Input
                      type="email"
                      placeholder="Email address"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-lg font-medium">Billing Address</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Input
                      placeholder="First name"
                      {...register("firstName")}
                      error={errors.firstName?.message}
                    />
                    <Input
                      placeholder="Last name"
                      {...register("lastName")}
                      error={errors.lastName?.message}
                    />
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Phone number"
                        {...register("phone")}
                        error={errors.phone?.message}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Address"
                        {...register("address1")}
                        error={errors.address1?.message}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Apartment, suite, etc. (optional)"
                        {...register("address2")}
                      />
                    </div>
                    <Input
                      placeholder="City"
                      {...register("city")}
                      error={errors.city?.message}
                    />
                    <Input
                      placeholder="State / Province"
                      {...register("state")}
                      error={errors.state?.message}
                    />
                    <Input
                      placeholder="Postal code"
                      {...register("postcode")}
                      error={errors.postcode?.message}
                    />
                    <div className="flex flex-col">
                      <select
                        {...register("country")}
                        className="w-full h-11 border border-gray-300 px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                      </select>
                      {errors.country && (
                        <p className="mt-1.5 text-sm text-red-500">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="mt-8">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="shippingSameAsBilling"
                      {...register("shippingSameAsBilling")}
                      className="h-4 w-4 rounded-none border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="shippingSameAsBilling" className="text-sm">
                      Shipping address same as billing
                    </label>
                  </div>

                  {!shippingSameAsBilling && (
                    <div className="mt-6 animate-fadeIn">
                      <h2 className="text-lg font-medium">Shipping Address</h2>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <Input
                          placeholder="First name"
                          {...register("shippingFirstName")}
                          error={errors.shippingFirstName?.message}
                        />
                        <Input
                          placeholder="Last name"
                          {...register("shippingLastName")}
                          error={errors.shippingLastName?.message}
                        />
                        <div className="sm:col-span-2">
                          <Input
                            placeholder="Address"
                            {...register("shippingAddress1")}
                            error={errors.shippingAddress1?.message}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Input
                            placeholder="Apartment, suite, etc. (optional)"
                            {...register("shippingAddress2")}
                          />
                        </div>
                        <Input
                          placeholder="City"
                          {...register("shippingCity")}
                        />
                        <Input
                          placeholder="State / Province"
                          {...register("shippingState")}
                        />
                        <Input
                          placeholder="Postal code"
                          {...register("shippingPostcode")}
                        />
                        <select
                          {...register("shippingCountry")}
                          className="w-full h-11 border border-gray-300 px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>
                  )}
                </section>

                {!isAuthenticated && (
                  <section className="mt-8">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="createAccount"
                        {...register("createAccount")}
                        className="h-4 w-4 rounded-none border-gray-300 text-black focus:ring-black"
                      />
                      <label htmlFor="createAccount" className="text-sm">
                        Create an account for faster checkout
                      </label>
                    </div>

                    {createAccount && (
                      <div className="mt-4">
                        <Input
                          type="password"
                          placeholder="Create password"
                          {...register("password")}
                          error={errors.password?.message}
                        />
                      </div>
                    )}
                  </section>
                )}

                <div className="mt-8 flex justify-end">
                  <Button type="button" onClick={validateInformation} size="lg">
                    Continue to Payment
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <section>
                  <h2 className="text-lg font-medium">Payment Method</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    All transactions are secure and encrypted.
                  </p>

                  <div className="mt-6 space-y-4">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer border p-4 transition-all duration-200 ${
                          paymentMethod === method.id
                            ? "border-black bg-gray-50 ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          {...register("paymentMethod")}
                          value={method.id}
                          className="mt-1 h-4 w-4 border-gray-300 text-black focus:ring-black"
                        />
                        <div className="ml-4">
                          <span className="block text-sm font-bold uppercase tracking-tight">
                            {method.label}
                          </span>
                          <span className="mt-1 block text-xs text-gray-500 leading-relaxed">
                            {method.description}
                          </span>
                        </div>
                      </label>
                    ))}

                    <div className="opacity-40 grayscale pointer-events-none">
                      <div className="flex border border-gray-100 p-4">
                        <div className="mt-1 h-4 w-4 rounded-full border border-gray-200" />
                        <div className="ml-4">
                          <span className="block text-sm font-medium text-gray-400">
                            Credit Card (Coming Soon)
                          </span>
                          <span className="mt-1 block text-xs text-gray-400">
                            Secure payment via Stripe.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-lg font-medium">
                    Order Notes (Optional)
                  </h2>
                  <textarea
                    {...register("orderNotes")}
                    rows={4}
                    className="mt-4 w-full border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Enter any special instructions for your delivery..."
                  />
                </section>

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={backStep}
                    className="text-sm font-medium text-gray-500 hover:text-black hover:underline"
                  >
                    Back to Information
                  </button>
                  <Button type="button" onClick={nextToReview} size="lg">
                    Continue to Review
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-8">
                  {/* Summary of info */}
                  <div className="rounded border bg-gray-50 p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Estimated for Delivery
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-8 text-sm">
                      <div>
                        <p className="font-medium">Contact</p>
                        <p className="text-gray-600">{formData.email}</p>
                        <p className="text-gray-600">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="font-medium">Ship to</p>
                        <p className="text-gray-600">
                          {formData.shippingSameAsBilling
                            ? `${formData.address1}, ${formData.city} ${formData.postcode}`
                            : `${formData.shippingAddress1}, ${formData.shippingCity} ${formData.shippingPostcode}`}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Payment Method</p>
                        <p className="text-gray-600 font-bold">
                          {
                            PAYMENT_METHODS.find(
                              (m) => m.id === formData.paymentMethod,
                            )?.title
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">Order Review</h2>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      By clicking "Place Order", you agree to our terms of
                      service and acknowledge that your payment method is
                      <span className="font-bold text-black">
                        {" "}
                        {
                          PAYMENT_METHODS.find(
                            (m) => m.id === formData.paymentMethod,
                          )?.title
                        }
                      </span>
                      . Total amount due:{" "}
                      <span className="font-bold text-black">
                        {formatPrice(total)}
                      </span>
                      .
                    </p>
                  </div>

                  {error && (
                    <div className="rounded bg-red-50 p-4 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={backStep}
                      className="text-sm font-medium text-gray-500 hover:text-black hover:underline"
                    >
                      Back to Payment
                    </button>
                    <Button
                      type="button"
                      size="lg"
                      disabled={isSubmitting}
                      onClick={handleSubmit(onSubmit as any)}
                      className="px-12"
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="mt-12 lg:col-span-5 lg:mt-0">
          <div className="sticky top-24 rounded border border-gray-100 bg-gray-50 p-6 shadow-sm">
            <h2 className="text-lg font-medium">Order Summary</h2>

            {/* Items */}
            <div className="mt-6 divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4">
                  <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <span className="text-sm font-medium">{item.name}</span>
                    {item.attributes &&
                      Object.keys(item.attributes).length > 0 && (
                        <span className="text-xs text-gray-500">
                          {Object.entries(item.attributes)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" / ")}
                        </span>
                      )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="mt-2 text-right text-xs text-gray-400 italic">
                Including taxes
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-gray-400">
              <div className="flex flex-col items-center gap-1">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-tight">
                  Verified
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-tight">
                  Secure
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-tight">
                  Payments
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
