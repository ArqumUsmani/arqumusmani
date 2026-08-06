"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/cn";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { contactSchema, ENGAGEMENT_TYPES, type ContactFormValues } from "@/lib/contact-schema";

// No outline-none: the global :focus-visible ring must never be suppressed.
// The border-ink shift is additive feedback, not a replacement for it.
const inputClassName =
  "w-full border border-mist bg-paper px-4 py-3 text-body text-ink transition-colors duration-300 focus:border-ink";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", type: undefined, message: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <div>
        <label htmlFor="name">
          <MonoLabel as="span" className="mb-2 block">
            Name
          </MonoLabel>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={inputClassName}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-body-s text-signal">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">
          <MonoLabel as="span" className="mb-2 block">
            Email
          </MonoLabel>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClassName}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-body-s text-signal">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <MonoLabel as="span" className="mb-3 block">
          Engagement type
        </MonoLabel>
        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Engagement type">
          {ENGAGEMENT_TYPES.map((type) => (
            <label
              key={type}
              className={cn(
                "cursor-pointer border px-4 py-2 font-mono text-mono-label uppercase transition-colors duration-300",
                "border-mist text-graphite has-[:checked]:border-ink has-[:checked]:text-ink",
              )}
            >
              <input type="radio" value={type} className="sr-only" {...register("type")} />
              {type}
            </label>
          ))}
        </div>
        {errors.type && (
          <p className="mt-2 text-body-s text-signal">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message">
          <MonoLabel as="span" className="mb-2 block">
            Message
          </MonoLabel>
        </label>
        <textarea
          id="message"
          rows={5}
          className={inputClassName}
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-body-s text-signal">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center bg-ink px-6 py-4 font-mono text-mono-label uppercase text-paper transition-colors duration-300 hover:bg-graphite disabled:opacity-50"
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </button>
        {status === "success" && (
          <p className="text-body-s text-graphite">Sent. I&rsquo;ll reply within two business days.</p>
        )}
        {status === "error" && (
          <p className="text-body-s text-signal">Something went wrong. Email me directly instead.</p>
        )}
      </div>
    </form>
  );
}
