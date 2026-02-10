"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
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
  paymentMethod: z.enum(["cod", "bacs", "cheque"]),
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
  const { user, isAuthenticated, token } = useAuthStore();

  const [currentStep, setCurrentStep] = useState<Step>("information");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
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
          <div className="h-12 w-64 bg-neutral-100 rounded-full mb-12" />
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="h-64 bg-neutral-50 rounded-3xl" />
              <div className="h-64 bg-neutral-50 rounded-3xl" />
            </div>
            <div className="lg:col-span-5">
              <div className="h-96 bg-neutral-50 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show a premium loader when submitting or redirecting after success
  if (isSubmitting || isOrderCompleted) {
    return (
      <div className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center p-8 text-center overflow-hidden">
        {/* Abstract animated backgrounds */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-20%] w-[60%] h-[140%] border-r border-black rotate-12"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[140%] border-l border-black -rotate-12"
          />
        </div>

        <div className="relative z-10 space-y-12">
          {/* Logo / Icon Loader */}
          <div className="relative flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-24 w-24 rounded-full border-2 border-black/5 flex items-center justify-center outline outline-offset-8 outline-black/5 animate-pulse"
            >
              <ShoppingBag className="h-8 w-8 text-black" strokeWidth={1.5} />
            </motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter uppercase">
              {isOrderCompleted ? "Archiving Details" : "Processing Order"}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400 italic">
              Please do not refresh – Secure connection active
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isOrderCompleted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 max-w-lg"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-neutral-50 rounded-full scale-[2.5] -z-10" />
            <ShoppingBag
              className="mx-auto h-16 w-16 text-neutral-200"
              strokeWidth={1}
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.9]">
              Your cart is <br />
              <span className="italic text-neutral-300">Quietly Empty</span>
            </h1>
            <p className="text-sm text-neutral-500 max-w-[300px] mx-auto leading-relaxed">
              Meticulously designed pieces are waiting in our collections.
              Discover your next essential.
            </p>
          </div>

          <Link href="/shop" className="block">
            <Button className="h-16 px-12 rounded-full bg-black hover:bg-neutral-800 text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-xl">
              Start Exploring
            </Button>
          </Link>
        </motion.div>
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
          ...(isAuthenticated && token
            ? { Authorization: `Bearer ${token}` }
            : {}),
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

      setIsOrderCompleted(true);
      clearCart();
      router.push(`/order-confirmation/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
        <h1 className="text-4xl font-black tracking-tighter uppercase">
          Checkout
        </h1>
        <nav className="mt-8">
          <ol className="flex items-center gap-4">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.id;
              const isPast = steps.findIndex((s) => s.id === currentStep) > idx;

              return (
                <li key={step.id} className="flex flex-1 items-center gap-2">
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      isActive || isPast ? "bg-black" : "bg-neutral-100"
                    }`}
                  />
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                      isActive ? "text-black" : "text-neutral-400"
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
                  <h2 className="text-sm font-black uppercase tracking-widest mb-6 underline underline-offset-8 decoration-neutral-100">
                    Contact Information
                  </h2>
                  {!isAuthenticated && (
                    <p className="mt-1 text-xs text-neutral-500 mb-4">
                      Already have an account?{" "}
                      <Link
                        href="/account/login?redirect=/checkout"
                        className="text-black font-black underline underline-offset-4"
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
                      className="h-14 rounded-2xl bg-neutral-50 border-none focus:ring-black"
                    />
                  </div>
                </section>

                <section className="mt-12">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-6 underline underline-offset-8 decoration-neutral-100">
                    Billing Address
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Input
                      placeholder="First name"
                      {...register("firstName")}
                      error={errors.firstName?.message}
                      className="h-14 rounded-2xl bg-neutral-50 border-none"
                    />
                    <Input
                      placeholder="Last name"
                      {...register("lastName")}
                      error={errors.lastName?.message}
                      className="h-14 rounded-2xl bg-neutral-50 border-none"
                    />
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Phone number"
                        {...register("phone")}
                        error={errors.phone?.message}
                        className="h-14 rounded-2xl bg-neutral-50 border-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Address"
                        {...register("address1")}
                        error={errors.address1?.message}
                        className="h-14 rounded-2xl bg-neutral-50 border-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        placeholder="Apartment, suite, etc. (optional)"
                        {...register("address2")}
                        className="h-14 rounded-2xl bg-neutral-50 border-none"
                      />
                    </div>
                    <Input
                      placeholder="City"
                      {...register("city")}
                      error={errors.city?.message}
                      className="h-14 rounded-2xl bg-neutral-50 border-none"
                    />
                    <Input
                      placeholder="State / Province"
                      {...register("state")}
                      error={errors.state?.message}
                      className="h-14 rounded-2xl bg-neutral-50 border-none"
                    />
                    <Input
                      placeholder="Postal code"
                      {...register("postcode")}
                      error={errors.postcode?.message}
                      className="h-14 rounded-2xl bg-neutral-50 border-none"
                    />
                    <div className="flex flex-col">
                      <select
                        {...register("country")}
                        className="w-full h-14 bg-neutral-50 border-none rounded-2xl px-4 py-2 text-sm focus:ring-black appearance-none font-bold uppercase tracking-tight"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                      </select>
                      {errors.country && (
                        <p className="mt-1.5 text-xs text-red-500 font-bold">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="mt-8 p-6 bg-neutral-50 rounded-3xl border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="shippingSameAsBilling"
                      {...register("shippingSameAsBilling")}
                      className="h-5 w-5 rounded-lg border-neutral-300 text-black focus:ring-black"
                    />
                    <label
                      htmlFor="shippingSameAsBilling"
                      className="text-xs font-black uppercase tracking-widest text-neutral-600 cursor-pointer"
                    >
                      Shipping address same as billing
                    </label>
                  </div>

                  {!shippingSameAsBilling && (
                    <div className="mt-8 animate-fadeIn space-y-4">
                      <h2 className="text-sm font-black uppercase tracking-widest">
                        Shipping Address
                      </h2>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input
                          placeholder="First name"
                          {...register("shippingFirstName")}
                          error={errors.shippingFirstName?.message}
                          className="h-14 rounded-2xl bg-white border-neutral-200"
                        />
                        <Input
                          placeholder="Last name"
                          {...register("shippingLastName")}
                          error={errors.shippingLastName?.message}
                          className="h-14 rounded-2xl bg-white border-neutral-200"
                        />
                        <div className="sm:col-span-2">
                          <Input
                            placeholder="Address"
                            {...register("shippingAddress1")}
                            error={errors.shippingAddress1?.message}
                            className="h-14 rounded-2xl bg-white border-neutral-200"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Input
                            placeholder="Apartment, suite, etc. (optional)"
                            {...register("shippingAddress2")}
                            className="h-14 rounded-2xl bg-white border-neutral-200"
                          />
                        </div>
                        <Input
                          placeholder="City"
                          {...register("shippingCity")}
                          className="h-14 rounded-2xl bg-white border-neutral-200"
                        />
                        <Input
                          placeholder="State / Province"
                          {...register("shippingState")}
                          className="h-14 rounded-2xl bg-white border-neutral-200"
                        />
                        <Input
                          placeholder="Postal code"
                          {...register("shippingPostcode")}
                          className="h-14 rounded-2xl bg-white border-neutral-200"
                        />
                        <select
                          {...register("shippingCountry")}
                          className="w-full h-14 bg-white border-neutral-200 rounded-2xl px-4 py-2 text-sm focus:ring-black appearance-none font-bold uppercase tracking-tight"
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

                <div className="mt-12 flex justify-end">
                  <Button
                    type="button"
                    onClick={validateInformation}
                    className="h-16 px-12 rounded-full bg-black text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all"
                  >
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
                  <h2 className="text-sm font-black uppercase tracking-widest mb-2 underline underline-offset-8 decoration-neutral-100">
                    Payment Method
                  </h2>
                  <p className="mb-8 text-xs text-neutral-400 font-bold uppercase tracking-widest italic">
                    All transactions are secure and encrypted.
                  </p>

                  <div className="space-y-4">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`group flex cursor-pointer rounded-3xl border-2 p-6 transition-all duration-500 ${
                          paymentMethod === method.id
                            ? "border-black bg-neutral-50 shadow-xl"
                            : "border-neutral-100 hover:border-neutral-200 bg-white"
                        }`}
                      >
                        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-neutral-200 group-hover:border-black transition-colors">
                          <input
                            type="radio"
                            {...register("paymentMethod")}
                            value={method.id}
                            className="peer sr-only"
                          />
                          <div
                            className={`h-3 w-3 rounded-full bg-black transition-transform duration-300 ${paymentMethod === method.id ? "scale-100" : "scale-0"}`}
                          />
                        </div>
                        <div className="ml-6">
                          <span className="block text-[11px] font-black uppercase tracking-[0.2em]">
                            {method.label}
                          </span>
                          <span className="mt-2 block text-[10px] text-neutral-400 font-bold leading-relaxed max-w-sm">
                            {method.description}
                          </span>
                        </div>
                      </label>
                    ))}

                    <div className="opacity-40 grayscale pointer-events-none">
                      <div className="flex rounded-3xl border-2 border-neutral-50 p-6 bg-neutral-50/50">
                        <div className="h-6 w-6 rounded-full border-2 border-neutral-100" />
                        <div className="ml-6">
                          <span className="block text-[11px] font-black uppercase text-neutral-300 tracking-[0.2em]">
                            Credit Card (Coming Soon)
                          </span>
                          <span className="mt-2 block text-[10px] text-neutral-300 font-bold">
                            Secure payment via Stripe.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mt-12">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-6 underline underline-offset-8 decoration-neutral-100">
                    Order Notes
                  </h2>
                  <textarea
                    {...register("orderNotes")}
                    rows={4}
                    className="w-full bg-neutral-50 border-none rounded-3xl px-6 py-5 text-sm focus:ring-black placeholder:text-neutral-300 outline-none"
                    placeholder="Enter any special instructions for your delivery..."
                  />
                </section>

                <div className="mt-12 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={backStep}
                    className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 hover:text-black transition-colors"
                  >
                    ← Information
                  </button>
                  <Button
                    type="button"
                    onClick={nextToReview}
                    className="h-16 px-12 rounded-full bg-black text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all"
                  >
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
                  <div className="rounded-4xl bg-neutral-50 p-8 space-y-8">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">
                      Destination Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                      <div className="space-y-2">
                        <p className="text-neutral-300 font-black">
                          Contact Detail
                        </p>
                        <p className="text-black">{formData.email}</p>
                        <p className="text-black">{formData.phone}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-neutral-300 font-black">
                          Shipping Route
                        </p>
                        <p className="text-black">
                          {formData.shippingSameAsBilling
                            ? `${formData.address1}, ${formData.city} ${formData.postcode}`
                            : `${formData.shippingAddress1}, ${formData.shippingCity} ${formData.shippingPostcode}`}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-neutral-300 font-black">
                          Method of Acquisition
                        </p>
                        <p className="text-black font-black bg-white px-3 py-1 rounded-full border border-neutral-100 inline-block">
                          {
                            PAYMENT_METHODS.find(
                              (m) => m.id === formData.paymentMethod,
                            )?.title
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border border-neutral-100 rounded-4xl bg-white space-y-4">
                    <h2 className="text-sm font-black uppercase tracking-widest">
                      Final Ledger
                    </h2>
                    <p className="text-[11px] font-bold text-neutral-400 leading-6 tracking-widest uppercase">
                      By placing this order, you authorize the acquisition of
                      these curated items and agree to the
                      <span className="text-black underline underline-offset-4 ml-1">
                        Archive Protocols
                      </span>
                      . Total investment:{" "}
                      <span className="text-black font-black">
                        {formatPrice(total)}
                      </span>
                      .
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-2xl bg-red-50 p-6 text-[10px] font-black uppercase tracking-widest text-red-600 border border-red-100">
                      Error: {error}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-12">
                    <button
                      type="button"
                      onClick={backStep}
                      className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 hover:text-black transition-colors"
                    >
                      ← Payment
                    </button>
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmit(onSubmit as any)}
                      className="h-16 px-12 rounded-full bg-black text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-50"
                    >
                      {isSubmitting ? "Finalizing..." : "Place Order"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="mt-12 lg:col-span-5 lg:mt-0">
          <div className="sticky top-24 rounded-4xl border border-neutral-100 bg-neutral-50 p-8 shadow-sm">
            <h2 className="text-xl font-black tracking-tighter uppercase mb-8">
              Your Selection
            </h2>

            <div className="space-y-6 divide-y divide-neutral-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 py-6 first:pt-0">
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-white rounded-2xl border border-neutral-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        sizes="100px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-200">
                        <ShoppingBag strokeWidth={1} />
                      </div>
                    )}
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] font-black text-white shadow-lg">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center space-y-2">
                    <span className="text-xs font-black uppercase tracking-widest leading-tight">
                      {item.name}
                    </span>
                    {item.attributes &&
                      Object.keys(item.attributes).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(item.attributes).map(
                            ([key, value]) => (
                              <span
                                key={key}
                                className="text-[9px] font-black uppercase tracking-widest text-neutral-400 bg-white px-2 py-0.5 rounded-full border border-neutral-100"
                              >
                                {value}
                              </span>
                            ),
                          )}
                        </div>
                      )}
                    <span className="text-[10px] font-black tracking-widest text-neutral-300 italic uppercase">
                      Archived Item
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-black tracking-tight">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-8 space-y-4 border-t-2 border-dashed border-neutral-200 pt-8">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                <span className="text-neutral-400">Sub-investment</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                <span className="text-neutral-400">Shipping</span>
                <span className="text-green-500 font-black italic underline underline-offset-4 decoration-2">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest border-t border-neutral-100 pt-6">
                <span className="text-black text-lg">Total</span>
                <span className="text-black text-2xl tracking-tighter">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex items-center justify-between px-2">
              <div className="flex flex-col items-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-500">
                <div className="h-10 w-10 rounded-full border border-neutral-300 flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                  Secure
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-500">
                <div className="h-10 w-10 rounded-full border border-neutral-300 flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                  Verified
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-500">
                <div className="h-10 w-10 rounded-full border border-neutral-300 flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                  Authentic
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
